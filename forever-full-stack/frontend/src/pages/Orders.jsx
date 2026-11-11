import { useCallback, useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContextDefinition'
import Title from '../components/Title';
import axios from 'axios';
import { toast } from 'react-toastify'
import { Link } from 'react-router-dom'

const Orders = () => {

  const { backendUrl, token , currency} = useContext(ShopContext);

  const [orderData,setorderData] = useState([])
  const [trackedItemKey, setTrackedItemKey] = useState('')
  const [cancellingOrders, setCancellingOrders] = useState([])
  const orderStatuses = ['Order Placed', 'Packing', 'Shipped', 'Out for delivery', 'Delivered']
  const shippedStatuses = ['Shipped', 'Out for delivery', 'Delivered']
  const unavailableStatuses = ['Cancelled', 'Payment Failed', 'Payment Pending']

  const loadOrderData = useCallback(async () => {
    try {
      if (!token) {
        return null
      }

      const response = await axios.post(backendUrl + '/api/order/userorders',{},{headers:{token}})
      if (response.data.success) {
        let allOrdersItem = []
        response.data.orders.map((order)=>{
          order.items.map((item, itemIndex)=>{
            item['status'] = order.status
            item['orderId'] = order._id
            item['payment'] = order.payment
            item['paymentMethod'] = order.paymentMethod
            item['date'] = order.date
            item['trackKey'] = `${order._id}-${itemIndex}`
            allOrdersItem.push(item)
          })
        })
        setorderData(allOrdersItem.reverse())
      } else {
        toast.error(response.data.message || 'Unable to load your orders.')
      }
      
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to load your orders.')
    }
  }, [backendUrl, token])

  const cancelOrder = async (orderId, status) => {
    if (shippedStatuses.includes(status)) {
      toast.error('Your order has been shipped and cannot be cancelled. Please cancel it at the time of delivery.')
      return
    }

    if (status === 'Cancelled') {
      toast.info('This order has already been cancelled.')
      return
    }

    if (!window.confirm('Are you sure you want to cancel this order?')) return

    setCancellingOrders((current) => [...current, orderId])
    try {
      const response = await axios.post(
        backendUrl + '/api/order/cancel',
        { orderId },
        { headers: { token } }
      )

      if (response.data.success) {
        toast.success(response.data.message)
        setTrackedItemKey('')
        await loadOrderData()
      } else {
        toast.error(response.data.message || 'Unable to cancel this order.')
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Unable to cancel this order.')
      if (error.response?.status === 409) {
        await loadOrderData()
      }
    } finally {
      setCancellingOrders((current) => current.filter((id) => id !== orderId))
    }
  }

  useEffect(()=>{
    loadOrderData()
  },[loadOrderData])

  return (
    <div className='border-t pt-16'>

        <div className='text-2xl'>
            <Title text1={'MY'} text2={'ORDERS'}/>
        </div>

        <div>
            {
              orderData.map((item,index) => (
                <div key={index} className='py-4 border-t border-b text-gray-700 flex flex-col md:flex-row md:items-center md:justify-between gap-4'>
                    <div className='flex items-start gap-6 text-sm'>
                        <Link to={`/product/${item._id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} aria-label={`View ${item.name}`}>
                          <img className='w-16 sm:w-20' src={item.image[0]} alt={item.name} />
                        </Link>
                        <div>
                          <Link to={`/product/${item._id}`} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className='sm:text-base font-medium hover:underline'>
                            {item.name}
                          </Link>
                          <div className='flex items-center gap-3 mt-1 text-base text-gray-700'>
                            <p>{currency}{item.price}</p>
                            <p>Quantity: {item.quantity}</p>
                            <p>Size: {item.size}</p>
                          </div>
                          <p className='mt-1'>Date: <span className=' text-gray-400'>{new Date(item.date).toDateString()}</span></p>
                          <p className='mt-1'>Payment: <span className=' text-gray-400'>{item.paymentMethod}</span></p>
                        </div>
                    </div>
                    <div className='md:w-1/2 flex justify-between'>
                        <div className='flex items-center gap-2'>
                            <p className={`min-w-2 h-2 rounded-full ${['Cancelled', 'Payment Failed'].includes(item.status) ? 'bg-red-500' : item.status === 'Payment Pending' ? 'bg-amber-500' : 'bg-green-500'}`}></p>
                            <p className='text-sm md:text-base'>{item.status}</p>
                        </div>
                        <div className='flex flex-wrap justify-end gap-2'>
                          <button
                            onClick={() => cancelOrder(item.orderId, item.status)}
                            disabled={cancellingOrders.includes(item.orderId) || ['Cancelled', 'Payment Failed'].includes(item.status)}
                            aria-disabled={shippedStatuses.includes(item.status)}
                            className={`border px-4 py-2 text-sm font-medium rounded-sm ${shippedStatuses.includes(item.status) || item.status === 'Cancelled' ? 'cursor-not-allowed text-gray-400' : ''}`}
                          >
                            {item.status === 'Payment Failed' ? 'Payment Failed' : item.status === 'Cancelled' ? 'Cancelled' : cancellingOrders.includes(item.orderId) ? 'Cancelling...' : 'Cancel Order'}
                          </button>
                          <button
                            onClick={() => setTrackedItemKey(trackedItemKey === item.trackKey ? '' : item.trackKey)}
                            disabled={unavailableStatuses.includes(item.status)}
                            className={`border px-4 py-2 text-sm font-medium rounded-sm ${unavailableStatuses.includes(item.status) ? 'cursor-not-allowed text-gray-400' : ''}`}
                            aria-expanded={trackedItemKey === item.trackKey}
                          >
                            {unavailableStatuses.includes(item.status) ? 'Tracking unavailable' : trackedItemKey === item.trackKey ? 'Hide tracking' : 'Track Order'}
                          </button>
                        </div>
                    </div>
                    {trackedItemKey === item.trackKey && item.status !== 'Cancelled' && (
                      <div className='w-full md:ml-[calc(6rem+1.5rem)] md:w-[calc(100%-7.5rem)] rounded border border-gray-300 bg-white/50 p-4'>
                        {item.status === 'Cancelled' ? (
                          <p className='text-sm font-medium text-red-700'>This order has been cancelled.</p>
                        ) : (
                          <>
                            <p className='mb-3 text-sm font-medium'>Order progress</p>
                            <ol className='flex flex-wrap gap-x-5 gap-y-2 text-xs sm:text-sm'>
                              {orderStatuses.map((status, statusIndex) => {
                                const currentStatusIndex = orderStatuses.indexOf(item.status)
                                const isComplete = currentStatusIndex >= statusIndex

                                return (
                                  <li key={status} className={`flex items-center gap-2 ${isComplete ? 'text-green-700' : 'text-gray-400'}`}>
                                    <span className={`h-2 w-2 rounded-full ${isComplete ? 'bg-green-500' : 'bg-gray-300'}`} />
                                    {status}
                                  </li>
                                )
                              })}
                            </ol>
                            <p className='mt-3 text-xs text-gray-500'>Status updates appear here when the store updates your order. Live courier location is not available.</p>
                          </>
                        )}
                      </div>
                    )}
                </div>
              ))
            }
        </div>
    </div>
  )
}

export default Orders
