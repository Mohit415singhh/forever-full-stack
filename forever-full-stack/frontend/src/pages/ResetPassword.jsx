import { useContext, useState } from 'react'
import axios from 'axios'
import { useSearchParams } from 'react-router-dom'
import { ShopContext } from '../context/ShopContextDefinition'

const ResetPassword = () => {
    const { backendUrl, navigate } = useContext(ShopContext)
    const [searchParams] = useSearchParams()
    const resetToken = searchParams.get('token') || ''
    const [password, setPassword] = useState('')
    const [isSubmitting, setIsSubmitting] = useState(false)
    const [message, setMessage] = useState('')

    const onSubmitHandler = async (event) => {
        event.preventDefault()
        setIsSubmitting(true)
        setMessage('')

        try {
            const response = await axios.post(`${backendUrl}/api/user/reset-password`, {
                token: resetToken,
                password
            })
            setMessage(response.data.message)
            if (response.data.success) {
                setTimeout(() => navigate('/login'), 1500)
            }
        } catch (error) {
            setMessage(error.response?.data?.message || 'Unable to reset the password right now.')
        } finally {
            setIsSubmitting(false)
        }
    }

    return (
        <form onSubmit={onSubmitHandler} className='flex flex-col items-center w-[90%] sm:max-w-96 m-auto mt-14 gap-4 text-gray-800'>
            <div className='inline-flex items-center gap-2 mb-2 mt-10'>
                <p className='prata-regular text-3xl'>Reset password</p>
                <hr className='border-none h-[1.5px] w-8 bg-gray-800' />
            </div>
            {!resetToken ? (
                <p role='alert' className='text-sm text-red-600'>This reset link is invalid or expired.</p>
            ) : (
                <>
                    <p className='text-sm text-gray-600 text-center'>Choose a new password with at least 8 characters.</p>
                    <input
                        onChange={(event) => setPassword(event.target.value)}
                        value={password}
                        type='password'
                        className='w-full px-3 py-2 border border-gray-800'
                        placeholder='New password'
                        autoComplete='new-password'
                        minLength={8}
                        required
                    />
                    <button disabled={isSubmitting} className='bg-black text-white font-light px-8 py-2 mt-2 disabled:opacity-60'>
                        {isSubmitting ? 'Updating...' : 'Update password'}
                    </button>
                </>
            )}
            {message && <p role='status' className='text-sm text-center text-gray-600'>{message}</p>}
            <button type='button' onClick={() => navigate('/login')} className='text-sm underline'>Back to login</button>
        </form>
    )
}

export default ResetPassword
