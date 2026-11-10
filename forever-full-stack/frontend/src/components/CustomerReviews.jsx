const reviews = [
  {
    name: 'Aarav S.',
    rating: 5,
    text: 'The ordering process was simple and my item arrived as expected.'
  },
  {
    name: 'Priya M.',
    rating: 4,
    text: 'Good overall experience. The product matched the description.'
  },
  {
    name: 'Rohan K.',
    rating: 5,
    text: 'Easy to browse, and checkout was quick and straightforward.'
  }
]

const CustomerReviews = () => {
  return (
    <section className='py-10 sm:py-14' aria-labelledby='customer-reviews-heading'>
      <div className='text-center mb-8'>
        <h2 id='customer-reviews-heading' className='text-2xl font-medium text-gray-800'>
          What Shoppers Say
        </h2>
        <p className='mt-2 text-sm text-gray-500'>
          Sample reviews for preview — not verified customer feedback.
        </p>
      </div>

      <div className='grid grid-cols-1 md:grid-cols-3 gap-5'>
        {reviews.map((review) => (
          <article key={review.name} className='rounded-lg border border-gray-200 bg-white/70 p-5'>
            <div
              className='mb-3 text-lg tracking-wide text-orange-500'
              role='img'
              aria-label={`${review.rating} out of 5 stars`}
            >
              {'★'.repeat(review.rating)}
              <span className='text-gray-300'>{'★'.repeat(5 - review.rating)}</span>
            </div>
            <p className='min-h-12 text-sm leading-6 text-gray-600'>{review.text}</p>
            <p className='mt-4 font-medium text-gray-800'>{review.name}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

export default CustomerReviews
