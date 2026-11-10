import orderModel from "../models/orderModel.js";
import productModel from "../models/productModel.js";
import userModel from "../models/userModel.js";
import mongoose from 'mongoose'
import razorpay from 'razorpay'
import sendOrderConfirmation, { sendOrderCancellationEmail } from '../services/orderConfirmationService.js'

// global variables
const currency = 'inr'
const deliveryCharge = 10
const razorpayInstance = new razorpay({
    key_id : process.env.RAZORPAY_KEY_ID,
    key_secret : process.env.RAZORPAY_KEY_SECRET,
})

const getPricedOrderItems = async (requestedItems) => {
    if (!Array.isArray(requestedItems) || requestedItems.length === 0) {
        const error = new Error('Your cart is empty. Add a product before checkout.')
        error.status = 400
        throw error
    }

    const invalidItem = requestedItems.some((item) =>
        !item
        || !mongoose.Types.ObjectId.isValid(item.productId)
        || typeof item.size !== 'string'
        || !Number.isSafeInteger(item.quantity)
        || item.quantity <= 0
    )
    if (invalidItem) {
        const error = new Error('One or more cart items are invalid.')
        error.status = 400
        throw error
    }

    const productIds = [...new Set(requestedItems.map((item) => item.productId))]
    const products = await productModel.find({ _id: { $in: productIds } })
    const productsById = new Map(products.map((product) => [String(product._id), product]))
    let subtotalPaise = 0

    const items = requestedItems.map(({ productId, size, quantity }) => {
        const product = productsById.get(productId)
        if (!product || !product.sizes.includes(size)) {
            const error = new Error('A product or selected size is no longer available.')
            error.status = 400
            throw error
        }

        const pricePaise = Math.round(product.price * 100)
        if (!Number.isSafeInteger(pricePaise) || pricePaise < 0) {
            const error = new Error('A product has an invalid price.')
            error.status = 400
            throw error
        }

        subtotalPaise += pricePaise * quantity
        return {
            _id: String(product._id),
            name: product.name,
            image: product.image,
            price: pricePaise / 100,
            size,
            quantity
        }
    })

    const amountPaise = subtotalPaise + deliveryCharge * 100
    if (!Number.isSafeInteger(amountPaise)) {
        const error = new Error('Order total is invalid.')
        error.status = 400
        throw error
    }

    return { items, amount: amountPaise / 100, amountPaise }
}

// Placing orders using COD Method
const placeOrder = async (req,res) => {
    
    try {
        
        const { userId, items: requestedItems, address} = req.body
        const { items, amount } = await getPricedOrderItems(requestedItems)

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"COD",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        await userModel.findByIdAndUpdate(userId,{cartData:{}})
        await sendOrderConfirmation(newOrder._id)

        res.json({success:true,message:"Order Placed"})


    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({success:false,message:error.message})
    }

}

// Placing orders using Razorpay Method
const placeOrderRazorpay = async (req,res) => {
    try {
        
        const { userId, items: requestedItems, address} = req.body
        const { items, amount, amountPaise } = await getPricedOrderItems(requestedItems)

        const orderData = {
            userId,
            items,
            address,
            amount,
            paymentMethod:"Razorpay",
            payment:false,
            date: Date.now()
        }

        const newOrder = new orderModel(orderData)
        await newOrder.save()

        const options = {
            amount: amountPaise,
            currency: currency.toUpperCase(),
            receipt : newOrder._id.toString()
        }

        const order = await razorpayInstance.orders.create(options)
        res.json({success:true,order})

    } catch (error) {
        console.log(error)
        res.status(error.status || 500).json({success:false,message:error.message})
    }
}

const verifyRazorpay = async (req,res) => {
    try {
        
        const { userId, razorpay_order_id  } = req.body

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        if (orderInfo.status === 'paid') {
            const order = await orderModel.findOne({
                _id: orderInfo.receipt,
                userId,
                paymentMethod: 'Razorpay'
            })
            if (!order) {
                return res.status(404).json({ success: false, message: 'Order not found.' })
            }

            if (Math.round(order.amount * 100) !== orderInfo.amount || orderInfo.currency !== currency.toUpperCase()) {
                return res.status(400).json({ success: false, message: 'Payment amount does not match the order.' })
            }

            if (order.status === 'Cancelled') {
                return res.status(409).json({ success: false, message: 'This order has been cancelled.' })
            }

            if (!order.payment) {
                const paidOrder = await orderModel.findOneAndUpdate(
                    { _id: order._id, userId, payment: false, status: { $in: ['Order Placed', 'Payment Failed'] } },
                    { $set: { payment: true, status: 'Order Placed' } },
                    { new: true }
                )
                if (!paidOrder) {
                    return res.status(409).json({ success: false, message: 'Unable to confirm payment for this order.' })
                }
            }

            await userModel.findByIdAndUpdate(userId,{cartData:{}})
            await sendOrderConfirmation(order._id)
            res.json({ success: true, message: "Payment Successful" })
        } else {
             res.status(400).json({ success: false, message: 'Payment Failed' });
        }

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const failRazorpayPayment = async (req, res) => {
    try {
        const { userId, razorpay_order_id, razorpay_payment_id } = req.body
        if (typeof razorpay_order_id !== 'string' || typeof razorpay_payment_id !== 'string') {
            return res.status(400).json({ success: false, message: 'Payment details are invalid.' })
        }

        const paymentInfo = await razorpayInstance.payments.fetch(razorpay_payment_id)
        if (paymentInfo.order_id !== razorpay_order_id || paymentInfo.status !== 'failed') {
            return res.status(400).json({ success: false, message: 'Payment is not confirmed as failed.' })
        }

        const orderInfo = await razorpayInstance.orders.fetch(razorpay_order_id)
        const order = await orderModel.findOneAndUpdate(
            {
                _id: orderInfo.receipt,
                userId,
                paymentMethod: 'Razorpay',
                payment: false,
                status: { $in: ['Order Placed', 'Payment Failed'] }
            },
            { $set: { status: 'Payment Failed' } },
            { new: true }
        )

        if (!order) {
            return res.status(404).json({ success: false, message: 'Pending order not found.' })
        }

        return res.json({ success: true, message: 'Payment failed. Your order was not placed.' })
    } catch (error) {
        console.error('Unable to verify Razorpay payment failure', error)
        return res.status(500).json({ success: false, message: 'Unable to update the order after payment failure.' })
    }
}


// All Orders data for Admin Panel
const allOrders = async (req,res) => {

    try {
        
        const orders = await orderModel.find({})
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }

}

// User Order Data For Forntend
const userOrders = async (req,res) => {
    try {
        
        const { userId } = req.body

        const orders = await orderModel.find({ userId })
        res.json({success:true,orders})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

const cancelUserOrder = async (req,res) => {
    try {
        const { userId, orderId } = req.body

        if (!mongoose.Types.ObjectId.isValid(orderId)) {
            return res.status(400).json({ success: false, message: 'Invalid order.' })
        }

        const order = await orderModel.findOneAndUpdate(
            { _id: orderId, userId, status: { $in: ['Order Placed', 'Packing'] } },
            { $set: { status: 'Cancelled' } },
            { new: true }
        )

        if (order) {
            await sendOrderCancellationEmail(order)
            return res.json({ success: true, message: 'Order cancelled successfully.' })
        }

        const existingOrder = await orderModel.findOne({ _id: orderId, userId })
        if (!existingOrder) {
            return res.status(404).json({ success: false, message: 'Order not found.' })
        }

        if (['Shipped', 'Out for delivery', 'Delivered'].includes(existingOrder.status)) {
            return res.status(409).json({
                success: false,
                message: 'Your order has been shipped and cannot be cancelled. Please cancel it at the time of delivery.'
            })
        }

        if (existingOrder.status === 'Cancelled') {
            return res.status(409).json({ success: false, message: 'This order has already been cancelled.' })
        }

        return res.status(409).json({ success: false, message: 'This order can no longer be cancelled.' })
    } catch (error) {
        console.log(error)
        res.status(500).json({ success: false, message: 'Unable to cancel the order right now.' })
    }
}

// update order status from Admin Panel
const updateStatus = async (req,res) => {
    try {
        
        const { orderId, status } = req.body

        const order = await orderModel.findById(orderId)
        if (!order) {
            return res.status(404).json({ success: false, message: 'Order not found.' })
        }
        if (order.paymentMethod === 'Razorpay' && !order.payment && status !== 'Cancelled') {
            return res.status(409).json({ success: false, message: 'An unpaid Razorpay order cannot be processed.' })
        }

        await orderModel.findByIdAndUpdate(orderId, { status })
        res.json({success:true,message:'Status Updated'})

    } catch (error) {
        console.log(error)
        res.json({success:false,message:error.message})
    }
}

export {verifyRazorpay, failRazorpayPayment, placeOrder, placeOrderRazorpay, allOrders, userOrders, cancelUserOrder, updateStatus}