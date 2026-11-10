import PropTypes from 'prop-types'
import { getProductReviews } from './productReviewData'

const ProductReviews = ({ productId }) => {
  const reviews = getProductReviews(productId)

  return (
    <section className='mt-10' aria-labelledby='product-reviews-heading'>
      <div className='mb-5'>
        <h2 id='product-reviews-heading' className='text-xl font-medium text-gray-800'>Customer Reviews</h2>
        <p className='mt-1 text-xs text-gray-500'>Sample reviews for preview — not verified customer feedback.</p>
      </div>
      <div className='grid grid-cols-1 md:grid-cols-3 gap-4'>
        {reviews.map((review) => (
          <article key={review.name} className='rounded-lg border border-gray-200 bg-white/70 p-4'>
            <div className='mb-2 text-orange-500' role='img' aria-label={`${review.rating} out of 5 stars`}>
              {'★'.repeat(review.rating)}
              <span className='text-gray-300'>{'★'.repeat(5 - review.rating)}</span>
            </div>
            <p className='text-sm leading-6 text-gray-600'>{review.text}</p>
            <p className='mt-3 text-sm font-medium text-gray-800'>{review.name}</p>
          </article>
        ))}
      </div>
    </section>
  )
}

ProductReviews.propTypes = {
  productId: PropTypes.string.isRequired
}

export default ProductReviews
