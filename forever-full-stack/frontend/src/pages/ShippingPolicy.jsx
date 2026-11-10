import Title from '../components/Title'

const ShippingPolicy = () => {
  return (
    <main className='border-t pt-10 pb-16 text-gray-700'>
      <div className='text-center text-2xl'>
        <Title text1='SHIPPING' text2='POLICY' />
      </div>

      <div className='mx-auto mt-10 max-w-4xl space-y-7 text-sm leading-7'>
        <p>
          This Shipping Policy explains how orders placed with Clothes For You are
          processed and delivered within India.
        </p>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>1. Order processing</h2>
          <p>
            Orders are processed after payment confirmation, or after order confirmation
            for other payment methods offered at checkout. Processing and dispatch may take
            additional time during holidays, sales, or periods of high order volume.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>2. Delivery estimates and charges</h2>
          <p>
            Available delivery options, estimated delivery times, and any shipping charges
            are shown at checkout or in your order confirmation. Estimates may vary by
            delivery location, courier service, weather, and other circumstances outside our
            control. Any applicable shipping charge will be shown before you place your order.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>3. Address and delivery</h2>
          <p>
            Please check that your delivery address and contact details are complete and
            accurate before placing your order. Contact us as soon as possible if you notice
            an error; changes may not be possible once an order has been dispatched. Please
            ensure someone can receive the package at the delivery address.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>4. Tracking and delays</h2>
          <p>
            If tracking information is available, we will share it through the order or
            shipping updates. Tracking updates may take time to appear after dispatch.
            Delivery can be delayed by courier or operational issues, weather, or other
            events beyond our reasonable control. Contact us if your order has not arrived
            after the estimated delivery period shown for it.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>5. Delivery issues and contact</h2>
          <p>
            If a package appears damaged, an item is missing, or delivery is unsuccessful,
            contact us with your order details so we can review the issue. For shipping
            questions, email{' '}
            <a className='underline' href='mailto:support@clothesforyou.shop'>
              support@clothesforyou.shop
            </a>{' '}
            or call +91 9155552711.
          </p>
        </section>
      </div>
    </main>
  )
}

export default ShippingPolicy
