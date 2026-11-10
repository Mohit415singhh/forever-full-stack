import axios from 'axios'
import { useEffect, useState } from 'react'
import PropTypes from 'prop-types'
import { toast } from 'react-toastify'
import { backendUrl } from '../config'

const Subscribers = ({ token }) => {
  const [subscribers, setSubscribers] = useState([])

  useEffect(() => {
    const fetchSubscribers = async () => {
      try {
        const response = await axios.get(`${backendUrl}/api/newsletter/subscribers`, { headers: { token } })
        if (response.data.success) {
          setSubscribers(response.data.subscribers)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      }
    }

    fetchSubscribers()
  }, [token])

  const exportCsv = () => {
    const escapeCsvValue = (value) => {
      const safeValue = /^[=+\-@\t\r]/.test(value) ? `'${value}` : value
      return `"${safeValue.replace(/"/g, '""')}"`
    }
    const rows = [
      ['Email', 'Subscribed At'],
      ...subscribers.map(({ email, subscribedAt }) => [
        escapeCsvValue(email),
        escapeCsvValue(new Date(subscribedAt).toISOString())
      ])
    ]
    const csv = rows.map((row) => row.join(',')).join('\r\n')
    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv;charset=utf-8;' }))
    const link = document.createElement('a')
    link.href = url
    link.download = 'newsletter-subscribers.csv'
    link.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className='flex flex-wrap items-center justify-between gap-3 mb-4'>
        <p>Newsletter Subscribers ({subscribers.length})</p>
        <button
          type='button'
          onClick={exportCsv}
          disabled={subscribers.length === 0}
          className='border px-4 py-2 disabled:opacity-50'
        >
          Export CSV
        </button>
      </div>
      <div className='flex flex-col'>
        <div className='grid grid-cols-[2fr_1fr] gap-2 py-2 px-3 border bg-gray-100 text-sm font-medium'>
          <span>Email</span>
          <span>Subscribed</span>
        </div>
        {subscribers.map((subscriber) => (
          <div key={subscriber._id} className='grid grid-cols-[2fr_1fr] gap-2 py-2 px-3 border border-t-0 text-sm'>
            <span className='break-all'>{subscriber.email}</span>
            <span>{new Date(subscriber.subscribedAt).toLocaleDateString()}</span>
          </div>
        ))}
        {subscribers.length === 0 && (
          <p className='border border-t-0 py-4 px-3 text-sm text-gray-500'>No subscribers yet.</p>
        )}
      </div>
    </div>
  )
}

Subscribers.propTypes = {
  token: PropTypes.string.isRequired
}

export default Subscribers
