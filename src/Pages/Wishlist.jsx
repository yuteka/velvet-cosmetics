import { Link } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiX, FiArrowLeft } from 'react-icons/fi';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function Wishlist() {
  const { wishlist, toggleWishlist, addToCart } = useCart();

  const wishlistProducts = products.filter(p => wishlist.includes(p.id));

  if (wishlistProducts.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#0a0806', paddingTop: '80px' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>
            <FiHeart size={32} style={{ color: '#c9a96e' }} />
          </div>
          <h2 className="text-3xl font-light mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Your Wishlist is Empty
          </h2>
          <p className="text-sm mb-8"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Save your favourite products and come back to them anytime.
          </p>
          <Link to="/"
            className="inline-block px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{
              background: '#c9a96e',
              color: '#0a0806',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
            }}>
            Discover Products
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            My Account
          </p>
          <h1 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            My Wishlist
          </h1>
          <p className="text-xs mt-2 tracking-wider"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            {wishlistProducts.length} {wishlistProducts.length === 1 ? 'item' : 'items'} saved
          </p>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {wishlistProducts.map(product => (
            <div key={product.id}
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

              {/* Remove from Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300 hover:scale-110"
                style={{
                  background: 'rgba(10,8,6,0.7)',
                  color: '#c9a96e',
                  border: '1px solid rgba(201,169,110,0.3)',
                }}>
                <FiX size={14} />
              </button>

              {/* Image */}
              <Link to={`/product/${product.slug}`}>
                <div className="overflow-hidden" style={{ height: '280px' }}>
                  <img src={product.image} alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ opacity: product.inStock ? 1 : 0.5 }} />
                </div>
              </Link>

              {/* Out of Stock Overlay */}
              {!product.inStock && (
                <div className="absolute inset-0 flex items-center justify-center"
                  style={{ pointerEvents: 'none' }}>
                  <span className="px-4 py-2 text-xs tracking-widest uppercase"
                    style={{
                      background: 'rgba(10,8,6,0.85)',
                      color: '#7a6e5f',
                      border: '1px solid rgba(201,169,110,0.2)',
                      fontFamily: 'Montserrat, sans-serif',
                    }}>
                    Out of Stock
                  </span>
                </div>
              )}

              {/* Info */}
              <div className="p-4">
                <p className="text-xs tracking-widest uppercase mb-1"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  {product.category}
                </p>
                <Link to={`/product/${product.slug}`}>
                  <h3 className="font-light mb-2 hover:text-yellow-300 transition-colors"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', fontSize: '1.1rem' }}>
                    {product.name}
                  </h3>
                </Link>

                {/* Price */}
                <div className="flex items-center gap-2 mb-4">
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

                {/* Add to Cart */}
                <button
                  onClick={() => addToCart(product)}
                  disabled={!product.inStock}
                  className="w-full flex items-center justify-center gap-2 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{
                    background: product.inStock ? '#c9a96e' : '#333',
                    color: product.inStock ? '#0a0806' : '#7a6e5f',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                    cursor: product.inStock ? 'pointer' : 'not-allowed',
                  }}>
                  <FiShoppingBag size={12} />
                  {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Back to Shop */}
        <div className="mt-12">
          <Link to="/"
            className="inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-all duration-300"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
            onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
            <FiArrowLeft size={12} /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}