import { useContext, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContextDefinition'

const NewsletterBox = () => {
    const { backendUrl } = useContext(ShopContext)
    const [email, setEmail] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault();
        setIsSubmitting(true)
        try {
            const response = await axios.post(`${backendUrl}/api/newsletter/subscribe`, { email })
            if (response.data.success) {
                if (response.data.alreadySubscribed) {
                    toast.info(response.data.message)
                } else {
                    toast.success(response.data.message)
                }
                setEmail('')
            } else {
                toast.error(response.data.message)
            }
        } catch (error) {
            toast.error(error.response?.data?.message || error.message)
        } finally {
            setIsSubmitting(false)
        }
    }

  return (
    <div className=' text-center'>
      <p className='text-gray-500'>for offers subscribe</p>
      <form onSubmit={onSubmitHandler} className='w-full sm:w-1/2 flex items-stretch gap-3 mx-auto my-6 border pl-3'>
        <input className='w-full sm:flex-1 min-h-12 pl-2 outline-none' type="email" placeholder='Enter your email' value={email} onChange={(event) => setEmail(event.target.value)} required/>
        <button type='submit' disabled={isSubmitting} className='bg-black text-white text-xs px-10 py-4 disabled:opacity-60'>{isSubmitting ? 'SUBSCRIBING...' : 'SUBSCRIBE'}</button>
      </form>
    </div>
  )
}

export default NewsletterBox
