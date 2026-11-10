import Title from '../components/Title'

const PrivacyPolicy = () => {
  return (
    <main className='border-t pt-10 pb-16 text-gray-700'>
      <div className='text-center text-2xl'>
        <Title text1='PRIVACY' text2='POLICY' />
      </div>

      <div className='mx-auto mt-10 max-w-4xl space-y-7 text-sm leading-7'>
        <p>
          This Privacy Policy explains how Clothes For You collects, uses, and shares
          information when you visit our website, create an account, place an order, or
          subscribe to updates. Please do not use the website if you do not agree with this
          policy.
        </p>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>1. Information we collect</h2>
          <p>Depending on how you use the website, we may collect:</p>
          <ul className='mt-2 list-disc space-y-1 pl-6'>
            <li>Account details such as your name, email address, and password (stored in hashed form).</li>
            <li>Order and delivery details such as products ordered, delivery address, phone number, payment method, and order status.</li>
            <li>Your cart contents and newsletter subscription email address.</li>
            <li>Information you send us when you contact customer support.</li>
            <li>Basic technical information needed to operate, secure, and troubleshoot the website, which may be recorded by our hosting or service providers.</li>
          </ul>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>2. How we use information</h2>
          <p>
            We use information to create and manage accounts, maintain carts, process and
            deliver orders, provide order updates, respond to support requests, send requested
            password-reset emails, manage newsletter subscriptions, prevent misuse, and
            maintain and improve the website.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>3. Payments and service providers</h2>
          <p>
            Payments are handled by the payment provider selected at checkout. We receive
            payment and transaction status information needed to manage an order; we do not
            intend to store your full card or banking credentials. We also use service
            providers to operate the website, database, email, and related services. They may
            process information on our behalf under their own privacy and security terms.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>4. Newsletter and email</h2>
          <p>
            If you subscribe, we use your email address to manage your subscription and send
            updates or offers. You can unsubscribe using an option in the email, if provided,
            or contact us to request removal. Account and order-related messages, including
            password-reset emails, are separate from marketing emails.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>5. Cookies and local storage</h2>
          <p>
            The website may use browser storage or similar technologies to keep you signed in
            and remember cart or site state. You can manage or clear these through your
            browser, but some website features may then stop working properly.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>6. Sharing and retention</h2>
          <p>
            We do not sell personal information. We share it with service providers when
            needed to operate the website, fulfill orders, process payments, or send emails;
            when required by law; or to protect users, the business, and the website. We keep
            information for as long as reasonably needed for these purposes, including
            fulfilling orders, resolving disputes, and meeting legal or accounting
            obligations, then delete or de-identify it where appropriate.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>7. Security and your choices</h2>
          <p>
            We use reasonable measures to protect information, but no online service can
            guarantee absolute security. You may contact us to request access to, correction
            of, or deletion of your information, subject to applicable law and records we are
            required to retain. We may need to verify your identity before acting on a request.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>8. Children and policy updates</h2>
          <p>
            This website is not intended for children to use without the involvement of a
            parent or guardian. We may update this policy by publishing a revised version on
            this page.
          </p>
        </section>

        <section>
          <h2 className='mb-2 text-lg font-medium text-gray-900'>9. Contact us</h2>
          <p>
            For privacy questions or requests, contact Clothes For You at{' '}
            <a className='underline' href='mailto:support@clothesforyou.shop'>
              support@clothesforyou.shop
            </a>{' '}
            or +91 9155552711.
          </p>
        </section>
      </div>
    </main>
  )
}

export default PrivacyPolicy
