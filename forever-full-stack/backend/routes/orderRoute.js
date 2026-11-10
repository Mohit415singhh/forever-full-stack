import express from 'express'
import {placeOrder, placeOrderRazorpay, allOrders, userOrders, cancelUserOrder, updateStatus, verifyRazorpay, failRazorpayPayment} from '../controllers/orderController.js'
import adminAuth  from '../middleware/adminAuth.js'
import authUser from '../middleware/auth.js'

const orderRouter = express.Router()

// Admin Features
orderRouter.post('/list',adminAuth,allOrders)
orderRouter.post('/status',adminAuth,updateStatus)

// Payment Features
orderRouter.post('/place',authUser,placeOrder)
orderRouter.post('/razorpay',authUser,placeOrderRazorpay)

// User Feature 
orderRouter.post('/userorders',authUser,userOrders)
orderRouter.post('/cancel',authUser,cancelUserOrder)

// verify payment
orderRouter.post('/verifyRazorpay',authUser, verifyRazorpay)
orderRouter.post('/razorpay-failed',authUser, failRazorpayPayment)

export default orderRouter