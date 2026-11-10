import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <div>
      <div className='flex flex-col sm:grid sm:grid-cols-[70px_auto_1fr] gap-8 sm:gap-10 my-10 mt-40 text-sm'>

        <div>
            <div className='mb-5 flex h-[70px] w-[70px] items-center justify-center rounded-full bg-white'>
              <img src={assets.logo} className='w-[52px] h-auto' alt="" />
            </div>
        </div>

        <div>
            <p className='text-xl font-medium mb-5'>COMPANY</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li><Link to='/' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Home</Link></li>
                <li><Link to='/about' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>About us</Link></li>
                <li><Link to='/terms-and-conditions' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Terms &amp; Conditions</Link></li>
                <li><Link to='/privacy-policy' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Privacy Policy</Link></li>
                <li><Link to='/shipping-policy' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Shipping Policy</Link></li>
                <li><Link to='/cancellation-refunds' onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>Cancellation &amp; Refunds</Link></li>
            </ul>
        </div>

        <div className='sm:justify-self-end'>
            <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-1 text-gray-600'>
                <li>+91 9155552711</li>
                <li>support@clothesforyou.shop</li>
            </ul>
        </div>

      </div>

        <div>
            <hr />
            <p className='py-5 text-sm text-center'>Copyright 2026@ clothesforyou.shop - All Right Reserved.</p>
        </div>

    </div>
  )
}

export default Footer
