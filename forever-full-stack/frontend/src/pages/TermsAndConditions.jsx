import Title from '../components/Title'

const TermsAndConditions = () => {
  return (
    <main className='border-t pt-10 pb-16 text-gray-700'>
      <div className='text-center text-2xl'>
        <Title text1='TERMS &' text2='CONDITIONS' />
      </div>
      <div className='mx-auto mt-10 max-w-4xl space-y-7 text-sm leading-7'>
        <p>
          These Terms and Conditions apply to your access to and use of the Clothes For You
          website. By using the website or placing an order, you agree to these terms. If you
          do not agree, please do not use the website.
        </p>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>1. Using our website</h2>
          <p>
            You agree to provide accurate information when creating an account or placing an
            order, keep your login details secure, and use the website only for lawful purposes.
            You are responsible for activity carried out through your account.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>2. Products and availability</h2>
          <p>
            We aim to keep product descriptions, images, sizes, and availability accurate.
            Colours may look different depending on your screen. Products are subject to
            availability, and we may correct listing errors or update product information.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>3. Orders and payment</h2>
          <p>
            Placing an order is a request to purchase. We will confirm acceptance through the
            website or an order confirmation. Prices are displayed in Indian Rupees (INR);
            applicable charges will be shown before you place your order. Payments are
            processed through the payment options shown at checkout. We may cancel or contact
            you about an order if information is unavailable, incorrect, or cannot be verified.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>4. Shipping, cancellations, and returns</h2>
          <p>
            Delivery estimates, cancellation eligibility, and return or refund conditions are
            described in the applicable Shipping Policy and Cancellation &amp; Refund Policy.
            Please review those policies before ordering. Any return or cancellation request
            must follow the conditions and process stated there.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>5. Intellectual property</h2>
          <p>
            Website content, including text, graphics, logos, and design, belongs to Clothes For
            You or its respective rights holders. You may not copy, reproduce, or commercially
            use it without permission, except where applicable law allows.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>6. Limitation and applicable law</h2>
          <p>
            To the extent permitted by applicable law, Clothes For You is not responsible for
            indirect loss arising from temporary website interruptions or events beyond our
            reasonable control. These terms are subject to the laws of India. Nothing in these
            terms limits rights that cannot be excluded under applicable law.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>7. Changes and contact</h2>
          <p>
            We may update these terms by publishing a revised version on this page. For
            questions, contact us at{' '}
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

export default TermsAndConditions
