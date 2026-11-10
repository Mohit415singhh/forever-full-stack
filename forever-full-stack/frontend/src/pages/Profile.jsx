import { useContext, useEffect, useState } from 'react'
import axios from 'axios'
import { toast } from 'react-toastify'
import { ShopContext } from '../context/ShopContextDefinition'
import Title from '../components/Title'

const Profile = () => {
  const { backendUrl, token, navigate } = useContext(ShopContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    if (!token) {
      navigate('/login')
      return
    }

    const loadProfile = async () => {
      try {
        const response = await axios.post(
          `${backendUrl}/api/user/profile`,
          {},
          { headers: { token } }
        )

        if (response.data.success) {
          setUser(response.data.user)
        } else {
          toast.error(response.data.message)
        }
      } catch (error) {
        toast.error(error.response?.data?.message || error.message)
      }
    }

    loadProfile()
  }, [backendUrl, navigate, token])

  return (
    <div className='border-t pt-10 min-h-[40vh]'>
      <div className='text-2xl mb-6'>
        <Title text1='MY' text2='PROFILE' />
      </div>
      {user ? (
        <div className='max-w-md border border-gray-200 p-6 text-gray-700'>
          <p className='mb-4'><span className='font-medium'>Name:</span> {user.name}</p>
          <p><span className='font-medium'>Email:</span> {user.email}</p>
        </div>
      ) : (
        <p className='text-sm text-gray-500'>Loading profile...</p>
      )}
    </div>
  )
}

export default Profile
