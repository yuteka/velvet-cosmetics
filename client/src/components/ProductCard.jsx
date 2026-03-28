import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar } from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { showNotification } from '../store/slices/notificationSlice';

export default function ProductCard({ product }) {
  const dispatch = useDispatch();
  
  // ✅ Redux — Wishlist check
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

  return (
    <div
      className="group relative"
      style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 text-xs tracking-widest"
          style={{
            background: product.badge === 'Sale' ? '#8b6914' : '#c9a96e',
            color: '#0a0806',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
          }}>
          {product.badge}
        </div>
      )}

      {/* Wishlist Button */}
      <button
        onClick={() => {
          const currentlyWishlisted = isWishlisted(product.id);
          dispatch(toggleWishlist(product));
          dispatch(showNotification({ 
            message: currentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist', 
            type: 'success' 
          }));
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300"
        style={{
          background: 'rgba(10,8,6,0.7)',
          color: isWishlisted(product.id) ? '#c9a96e' : '#faf8f4',
          border: '1px solid rgba(201,169,110,0.2)',
        }}>
        <FiHeart size={13} fill={isWishlisted(product.id) ? '#c9a96e' : 'none'} />
      </button>

      {/* Image */}
      <Link to={`/product/${product.slug}`}>
        <div className="overflow-hidden" style={{ height: '280px' }}>
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      </Link>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs tracking-widest uppercase mb-1"
          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
          {product.category}
        </p>

        <Link to={`/product/${product.slug}`}>
          <h3 className="font-light mb-2 hover:opacity-70 transition-opacity"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              color: '#faf8f4',
              fontSize: '1.1rem',
            }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <FiStar size={10} fill="#c9a96e" style={{ color: '#c9a96e' }} />
          <span className="text-xs" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            {product.rating}
          </span>
          <span className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            ({product.reviews})
          </span>
        </div>

        {/* Shades Preview */}
        {product.shades && product.shades.length > 0 && (
          <div className="flex gap-1 mb-3">
            {product.shades.slice(0, 5).map((shade, i) => (
              <div key={i}
                className="w-4 h-4 rounded-full"
                style={{ background: shade, border: '1px solid rgba(201,169,110,0.2)' }}
              />
            ))}
          </div>
        )}

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              ${product.price}
            </span>
            {product.originalPrice > product.price && (
              <span className="text-xs line-through"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                ${product.originalPrice}
              </span>
            )}
          </div>

          <button
            onClick={() => {
              dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                slug: product.slug,
                category: product.category,
              }));
              dispatch(showNotification({ message: `${product.name} added to cart!`, type: 'success' }));
            }}
            disabled={!product.inStock}
            className="flex items-center gap-1 px-3 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{
              background: product.inStock ? '#c9a96e' : '#333',
              color: product.inStock ? '#0a0806' : '#7a6e5f',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
              cursor: product.inStock ? 'pointer' : 'not-allowed',
            }}>
            <FiShoppingBag size={11} />
            {product.inStock ? 'Add' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}