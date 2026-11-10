import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <div className='flex flex-col sm:flex-row justify-around gap-12 sm:gap-2 text-center py-20 text-xs sm:text-sm md:text-base text-gray-700'>

      <div>
        <svg className='w-12 h-12 m-auto mb-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
          <rect x='5' y='10' width='14' height='11' rx='2' />
          <path d='M8 10V7a4 4 0 0 1 8 0v3' />
          <path d='M12 14v3' />
        </svg>
        <p className='font-semibold'>Secure Payments</p>
        <p className='text-gray-400'>Pay securely using the options at checkout</p>
      </div>

      <div>
        <svg className='w-12 h-12 m-auto mb-5' viewBox='0 0 24 24' fill='none' stroke='currentColor' strokeWidth='1.8' aria-hidden='true'>
          <rect x='3' y='6' width='18' height='13' rx='2' />
          <path d='M3 10h18M7 15h3' />
        </svg>
        <p className='font-semibold'>Cash on Delivery</p>
        <p className='text-gray-400'>Pay for your order when it arrives</p>
      </div>

      <div>
        <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
        <p className=' font-semibold'>Best customer support</p>
        <p className=' text-gray-400'>we provide 24/7 customer support</p>
      </div>

    </div>
  )
}

export default OurPolicy
