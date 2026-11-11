import { useEffect } from 'react'
import { Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Collection from './pages/Collection'
import About from './pages/About'
import Contact from './pages/Contact'
import Product from './pages/Product'
import Cart from './pages/Cart'
import Login from './pages/Login'
import PlaceOrder from './pages/PlaceOrder'
import Orders from './pages/Orders'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import SearchBar from './components/SearchBar'
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Profile from './pages/Profile'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'
import TermsAndConditions from './pages/TermsAndConditions'
import PrivacyPolicy from './pages/DataPolicy'
import ShippingPolicy from './pages/ShippingPolicy'
import CancellationRefunds from './pages/CancellationRefunds'

const App = () => {
  useEffect(() => {
    if (document.querySelector('script[src="https://elfsightcdn.com/platform.js"]')) return

    const script = document.createElement('script')
    script.src = 'https://elfsightcdn.com/platform.js'
    script.async = true
    document.body.appendChild(script)
  }, [])

  return (
    <>
      <div className='app-shell min-h-screen'>
        <div className='relative z-10 px-4 sm:px-[5vw] md:px-[7vw] lg:px-[9vw]'>
          <ToastContainer />
          <Navbar />
          <SearchBar />
          <Routes>
            <Route path='/' element={<Home />} />
            <Route path='/collection' element={<Collection />} />
            <Route path='/about' element={<About />} />
            <Route path='/contact' element={<Contact />} />
            <Route path='/terms-and-conditions' element={<TermsAndConditions />} />
            <Route path='/privacy-policy' element={<PrivacyPolicy />} />
            <Route path='/shipping-policy' element={<ShippingPolicy />} />
            <Route path='/cancellation-refunds' element={<CancellationRefunds />} />
            <Route path='/product/:productId' element={<Product />} />
            <Route path='/cart' element={<Cart />} />
            <Route path='/login' element={<Login />} />
            <Route path='/forgot-password' element={<ForgotPassword />} />
            <Route path='/reset-password' element={<ResetPassword />} />
            <Route path='/place-order' element={<PlaceOrder />} />
            <Route path='/orders' element={<Orders />} />
            <Route path='/profile' element={<Profile />} />
          </Routes>
          <Footer />
        </div>
      </div>
      <div
        className='elfsight-app-734148f5-7f2e-413c-b74d-ba1e0ced579a'
        data-elfsight-app-lazy
      />
    </>
  )
}

export default App
