import Title from '../components/Title'

const CancellationRefunds = () => {
  return (
    <main className='border-t pt-10 pb-16 text-gray-700'>
      <div className='text-center text-2xl'>
        <Title text1='CANCELLATION &' text2='REFUNDS' />
      </div>

      <div className='mx-auto mt-10 max-w-4xl space-y-7 text-sm leading-7'>
        <p>
          This policy explains how to request an order cancellation and how refunds are
          handled by Clothes For You.
        </p>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>1. Requesting a cancellation</h2>
          <p>
            Sign in and open My Orders to select Cancel Order. You can cancel while the
            order is at Order Placed or Packing status. Once its status changes to Shipped,
            it can no longer be cancelled through the website. If it has shipped, please
            refuse the delivery when the courier attempts delivery, then contact us with
            your order details.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>2. Refunds for cancelled orders</h2>
          <p>
            For a prepaid order, contact us after cancellation so we can confirm refund
            eligibility and process any approved refund to the original payment method. The
            time it takes to appear in your account depends on the payment provider and your
            bank. If the order has not been paid, there is no payment to refund.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>3. Damaged, incorrect, or missing items</h2>
          <p>
            If your order arrives damaged, contains an incorrect item, or is missing an item,
            contact us promptly with your order number and details of the issue. We may ask
            for photos or other information to review the request and will let you know the
            available resolution. Refunds or other remedies are subject to review and
            applicable law.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>4. Refund status</h2>
          <p>
            We will notify you when an eligible refund has been initiated. Please allow
            additional time for your payment provider or bank to process and display it.
            If the expected processing period has passed, contact your payment provider
            first and then get in touch with us with your order details.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>5. Contact us</h2>
          <p>
            To request a cancellation or ask about a refund, email{' '}
            <a className='underline' href='mailto:support@clothesforyou.shop'>
              support@clothesforyou.shop
            </a>{' '}
            or call +91 9155552711. Please include your order number and use the contact
            details associated with the order.
          </p>
        </section>
      </div>
    </main>
  )
}

export default CancellationRefunds
