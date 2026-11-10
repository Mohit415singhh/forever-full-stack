const reviewTemplates = [
  { name: 'Aarav S.', rating: 5, text: 'Looks just like the photos and feels comfortable to wear.' },
  { name: 'Priya M.', rating: 4, text: 'Nice quality for the price. The sizing guide was helpful.' },
  { name: 'Rohan K.', rating: 5, text: 'Good overall experience. The product matched the description.' },
  { name: 'Ananya R.', rating: 4, text: 'Really like the fit and finish. Delivery updates were useful.' },
  { name: 'Kabir D.', rating: 5, text: 'Easy to order and a great addition to my wardrobe.' },
  { name: 'Meera P.', rating: 4, text: 'The fabric and color look great. Happy with my purchase.' }
]

export const getProductReviews = (productId) => {
  const startIndex = Array.from(productId).reduce((total, character) => total + character.charCodeAt(0), 0) % reviewTemplates.length
  return Array.from({ length: 3 }, (_, index) => reviewTemplates[(startIndex + index) % reviewTemplates.length])
}
