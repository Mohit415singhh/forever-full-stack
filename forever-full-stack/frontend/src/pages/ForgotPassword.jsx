import { useContext, useState } from 'react'
import axios from 'axios'
import { ShopContext } from '../context/ShopContextDefinition'

const ForgotPassword = () => {
    const { backendUrl, navigate } = useContext(ShopContext)
    const [email, setEmail] = useState('')
    const [message, setMessage] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setMessage('')

        try {
            const response = await axios.post(`${backendUrl}/api/user/forgot-password`, { email })
            setMessage(response.data.message)
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to send a reset link right now. Please try again later.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Forgot password</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            <p className='text-sm text-gray-600 text-center'>Enter your account email and we will send a reset link if an account exists.</p>
            <input
                onChange={(event) => setEmail(event.target.value)}
                value={email}
                type='email'
                className='w-full px-3 py-2 border border-gray-800'
                placeholder='Email'
                autoComplete='email'
                required
            />
            <button disabled={isSubmitting} className='bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60'>
                {isSubmitting ? 'Sending...' : 'Send reset link'}
            </button>
            {message && <p role='status' className='text-sm text-center text-gray-600'>{message}</p>}
            <button type='button' onClick={() => navigate('/login')} className='text-sm underline'>Back to login</button>
        </form>
    )
}

export default ForgotPassword
