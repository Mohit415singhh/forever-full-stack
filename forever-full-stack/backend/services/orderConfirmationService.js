import orderModel from '../models/orderModel.js'
import { sendTransactionalEmail } from './senderService.js'

const escapeHtml = (value) => String(value ?? '').replace(/[&<>"']/g, (character) => ({
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;'
})[character])

const sendOrderConfirmation = async (orderId) => {
    let order

    try {
        order = await orderModel.findOneAndUpdate(
            { _id: orderId, confirmationEmailStatus: { $nin: ['sending', 'sent'] } },
            { $set: { confirmationEmailStatus: 'sending' } },
            { new: true }
        )

        if (!order) return

        const recipient = order.address?.email
        if (!recipient) {
            throw new Error('Order has no checkout email address')
        }

        const customerName = escapeHtml(
            [order.address.firstName, order.address.lastName].filter(Boolean).join(' ') || 'there'
        )
        const orderNumber = escapeHtml(order._id)
        const itemLines = order.items.map((item) =>
            `${item.name} — Qty: ${item.quantity}, Size: ${item.size}`
        )
        const itemListHtml = order.items.map((item) =>
            `<li>${escapeHtml(item.name)} — Qty: ${escapeHtml(item.quantity)}, Size: ${escapeHtml(item.size)}</li>`
        ).join('')
        const text = [
            `Hi ${customerName},`,
            '',
            'Thank you for choosing Clothes For You. We have received your order.',
            `Order number: ${orderNumber}`,
            ...itemLines,
            `Total: ₹${order.amount}`,
            '',
            'You can check your order status from My Orders on our website.',
            'For help, contact support@clothesforyou.shop or call +91 9155552711.'
        ].join('\n')
        const html = `
            <p>Hi ${customerName},</p>
            <p>Thank you for choosing Clothes For You. We have received your order.</p>
            <p><strong>Order number:</strong> ${orderNumber}</p>
            <ul>${itemListHtml}</ul>
            <p><strong>Total:</strong> ₹${escapeHtml(order.amount)}</p>
            <p>You can check your order status from My Orders on our website.</p>
            <p>For help, contact <a href="mailto:support@clothesforyou.shop">support@clothesforyou.shop</a> or call +91 9155552711.</p>
        `

        await sendTransactionalEmail({
            to: recipient,
            subject: `Thank you for your order — ${orderNumber}`,
            html,
            text
        })

        await orderModel.updateOne(
            { _id: orderId, confirmationEmailStatus: 'sending' },
            { $set: { confirmationEmailStatus: 'sent', confirmationEmailSentAt: new Date() } }
        )
    } catch (error) {
        if (order) {
            try {
                await orderModel.updateOne(
                    { _id: orderId, confirmationEmailStatus: 'sending' },
                    { $set: { confirmationEmailStatus: 'failed' } }
                )
            } catch (statusError) {
                console.error('Unable to record order confirmation email failure', {
                    orderId: String(orderId),
                    message: statusError.message
                })
            }
        }

        console.error('Order confirmation email failed', {
            orderId: String(orderId),
            status: error.status,
            message: error.message
        })
    }
}

const sendOrderCancellationEmail = async (order) => {
    try {
        const recipient = order.address?.email
        if (!recipient) {
            throw new Error('Order has no checkout email address')
        }

        const customerName = escapeHtml(
            [order.address.firstName, order.address.lastName].filter(Boolean).join(' ') || 'there'
        )
        const orderNumber = escapeHtml(order._id)
        const text = [
            `Hi ${customerName},`,
            '',
            `Your order ${orderNumber} has been cancelled as requested.`,
            'If you paid online, please contact us to confirm the status of any eligible refund.',
            '',
            'For help, contact support@clothesforyou.shop or call +91 9155552711.'
        ].join('\n')
        const html = `
            <p>Hi ${customerName},</p>
            <p>Your order <strong>${orderNumber}</strong> has been cancelled as requested.</p>
            <p>If you paid online, please contact us to confirm the status of any eligible refund.</p>
            <p>For help, contact <a href="mailto:support@clothesforyou.shop">support@clothesforyou.shop</a> or call +91 9155552711.</p>
        `

        await sendTransactionalEmail({
            to: recipient,
            subject: `Your order has been cancelled — ${orderNumber}`,
            html,
            text
        })
    } catch (error) {
        console.error('Order cancellation email failed', {
            orderId: String(order._id),
            status: error.status,
            message: error.message
        })
    }
}

export { sendOrderCancellationEmail }
export default sendOrderConfirmation
