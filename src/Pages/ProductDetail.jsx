import { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import {
  FiHeart, FiShoppingBag, FiStar, FiArrowLeft,
  FiTruck, FiRefreshCw, FiShield, FiMinus, FiPlus
} from 'react-icons/fi';
import { products } from '../data/products';
import { useCart } from '../context/CartContext';

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const product = products.find(p => p.id === parseInt(id));
  const { addToCart, toggleWishlist, isWishlisted } = useCart();

  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedShade, setSelectedShade] = useState(null);
  const [qty, setQty] = useState(1);
  const [activeTab, setActiveTab] = useState('description');
  const [added, setAdded] = useState(false);

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0806', paddingTop: '80px' }}>
        <div className="text-center">
          <h2 className="text-3xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Product Not Found
          </h2>
          <Link to="/"
            className="text-xs tracking-widest uppercase"
            style={{ color: '#c9a96e' }}>
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  const handleAddToCart = () => {
    addToCart(product, selectedShade);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const relatedProducts = products.filter(
    p => p.category === product.category && p.id !== product.id
  ).slice(0, 4);

  const discount = product.originalPrice > product.price
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', paddingTop: '80px' }}>

      {/* Breadcrumb */}
      <div className="max-w-7xl mx-auto px-6 py-4">
        <div className="flex items-center gap-2 text-xs tracking-wider"
          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
          <Link to="/" style={{ color: '#7a6e5f' }}
            onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
            onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
            Home
          </Link>
          <span>›</span>
          <span style={{ color: '#7a6e5f' }}>{product.category}</span>
          <span>›</span>
          <span style={{ color: '#c9a96e' }}>{product.name}</span>
        </div>
      </div>

      {/* Main Product Section */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">

          {/* Left — Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="relative overflow-hidden group"
              style={{ height: '520px', background: '#111009' }}>
              <img
                src={product.images?.[selectedImage] || product.image}
                alt={product.name}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Badge */}
              {product.badge && (
                <div className="absolute top-4 left-4 px-3 py-1 text-xs tracking-widest"
                  style={{
                    background: product.badge === 'Sale' ? '#8b6914' : '#c9a96e',
                    color: '#0a0806',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                  }}>
                  {product.badge}
                </div>
              )}
              {/* Wishlist */}
              <button
                onClick={() => toggleWishlist(product.id)}
                className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center transition-all duration-300"
                style={{
                  background: 'rgba(10,8,6,0.7)',
                  color: isWishlisted(product.id) ? '#c9a96e' : '#faf8f4',
                  border: '1px solid rgba(201,169,110,0.3)',
                }}>
                <FiHeart size={16} fill={isWishlisted(product.id) ? '#c9a96e' : 'none'} />
              </button>
              {/* Discount Badge */}
              {discount > 0 && (
                <div className="absolute bottom-4 left-4 px-3 py-1 text-xs tracking-widest"
                  style={{
                    background: 'rgba(10,8,6,0.8)',
                    color: '#c9a96e',
                    border: '1px solid rgba(201,169,110,0.3)',
                    fontFamily: 'Montserrat, sans-serif',
                  }}>
                  -{discount}% OFF
                </div>
              )}
            </div>

            {/* Thumbnail Images */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-3">
                {product.images.map((img, i) => (
                  <button key={i}
                    onClick={() => setSelectedImage(i)}
                    className="flex-1 overflow-hidden transition-all duration-300"
                    style={{
                      height: '100px',
                      border: selectedImage === i
                        ? '2px solid #c9a96e'
                        : '1px solid rgba(201,169,110,0.2)',
                    }}>
                    <img src={img} alt={`view ${i + 1}`}
                      className="w-full h-full object-cover"
                      style={{ opacity: selectedImage === i ? 1 : 0.6 }} />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right — Product Info */}
          <div className="flex flex-col">

            {/* Category */}
            <p className="text-xs tracking-[0.4em] uppercase mb-3"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              {product.category}
            </p>

            {/* Name */}
            <h1 className="font-light mb-4"
              style={{
                fontFamily: 'Cormorant Garamond, serif',
                color: '#faf8f4',
                fontSize: 'clamp(2rem, 4vw, 3rem)',
                lineHeight: 1.2,
              }}>
              {product.name}
            </h1>

            {/* Rating */}
            <div className="flex items-center gap-3 mb-6">
              <div className="flex items-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <FiStar key={i} size={12}
                    fill={i < Math.floor(product.rating) ? '#c9a96e' : 'none'}
                    style={{ color: '#c9a96e' }} />
                ))}
              </div>
              <span className="text-sm" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                {product.rating}
              </span>
              <span className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                ({product.reviews} reviews)
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-4 mb-6 pb-6"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
              <span className="text-3xl font-light"
                style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                ${product.price}
              </span>
              {product.originalPrice > product.price && (
                <>
                  <span className="text-lg line-through"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    ${product.originalPrice}
                  </span>
                  <span className="text-xs px-2 py-1 tracking-wider"
                    style={{
                      background: 'rgba(139,105,20,0.2)',
                      color: '#c9a96e',
                      border: '1px solid rgba(201,169,110,0.3)',
                      fontFamily: 'Montserrat, sans-serif',
                    }}>
                    SAVE ${product.originalPrice - product.price}
                  </span>
                </>
              )}
            </div>

            {/* Shades */}
            {product.shades && product.shades.length > 0 && (
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase mb-3"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Shade: <span style={{ color: '#c9a96e' }}>{selectedShade || 'Select a shade'}</span>
                </p>
                <div className="flex gap-3">
                  {product.shades.map((shade, i) => (
                    <button key={i}
                      onClick={() => setSelectedShade(shade)}
                      className="w-8 h-8 rounded-full transition-all duration-300"
                      style={{
                        background: shade,
                        border: selectedShade === shade
                          ? '3px solid #c9a96e'
                          : '2px solid rgba(201,169,110,0.2)',
                        transform: selectedShade === shade ? 'scale(1.2)' : 'scale(1)',
                      }}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* Quantity */}
            <div className="mb-6">
              <p className="text-xs tracking-widest uppercase mb-3"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                Quantity
              </p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border"
                  style={{ borderColor: 'rgba(201,169,110,0.3)' }}>
                  <button
                    onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-70"
                    style={{ color: '#c9a96e' }}>
                    <FiMinus size={14} />
                  </button>
                  <span className="w-12 text-center text-sm"
                    style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                    {qty}
                  </span>
                  <button
                    onClick={() => setQty(q => q + 1)}
                    className="w-10 h-10 flex items-center justify-center transition-all duration-300 hover:opacity-70"
                    style={{ color: '#c9a96e' }}>
                    <FiPlus size={14} />
                  </button>
                </div>
                {!product.inStock && (
                  <span className="text-xs tracking-wider"
                    style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
                    Out of Stock
                  </span>
                )}
              </div>
            </div>

            {/* Buttons */}
            <div className="flex gap-3 mb-8">
              <button
                onClick={handleAddToCart}
                disabled={!product.inStock}
                className="flex-1 py-4 flex items-center justify-center gap-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                style={{
                  background: added ? '#8b6914' : product.inStock ? '#c9a96e' : '#333',
                  color: '#0a0806',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  cursor: product.inStock ? 'pointer' : 'not-allowed',
                }}>
                <FiShoppingBag size={14} />
                {added ? 'Added to Cart ✓' : product.inStock ? 'Add to Cart' : 'Out of Stock'}
              </button>
              <button
                onClick={() => toggleWishlist(product.id)}
                className="w-14 flex items-center justify-center border transition-all duration-300 hover:opacity-70"
                style={{
                  borderColor: 'rgba(201,169,110,0.4)',
                  color: isWishlisted(product.id) ? '#c9a96e' : '#faf8f4',
                }}>
                <FiHeart size={16} fill={isWishlisted(product.id) ? '#c9a96e' : 'none'} />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 mb-8 p-4"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>
              {[
                { icon: FiTruck, text: 'Free shipping on orders over $100' },
                { icon: FiRefreshCw, text: '30-day hassle-free returns' },
                { icon: FiShield, text: '100% authentic luxury products' },
              ].map(({ icon: Icon, text }) => (
                <div key={text} className="flex items-center gap-3">
                  <Icon size={14} style={{ color: '#c9a96e' }} />
                  <span className="text-xs tracking-wider"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    {text}
                  </span>
                </div>
              ))}
            </div>

            {/* Tabs */}
            <div>
              <div className="flex gap-6 mb-4"
                style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
                {['description', 'ingredients', 'how to use'].map(tab => (
                  <button key={tab}
                    onClick={() => setActiveTab(tab)}
                    className="pb-3 text-xs tracking-widest uppercase transition-all duration-300"
                    style={{
                      color: activeTab === tab ? '#c9a96e' : '#7a6e5f',
                      borderBottom: activeTab === tab ? '1px solid #c9a96e' : 'none',
                      fontFamily: 'Montserrat, sans-serif',
                      marginBottom: '-1px',
                    }}>
                    {tab}
                  </button>
                ))}
              </div>
              <div className="text-sm leading-relaxed"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                {activeTab === 'description' && <p>{product.description}</p>}
                {activeTab === 'ingredients' && (
                  <p>Aqua, Cyclopentasiloxane, Glycerin, Niacinamide, Hyaluronic Acid, Vitamin E Acetate, Jojoba Oil, Rosa Damascena Extract, 24K Gold Flakes, Retinol, Peptide Complex, Fragrance.</p>
                )}
                {activeTab === 'how to use' && (
                  <ol className="space-y-2 list-decimal list-inside">
                    <li>Start with cleansed, moisturised skin.</li>
                    <li>Apply a small amount to the back of your hand.</li>
                    <li>Use the applicator or fingertips to blend evenly.</li>
                    <li>Layer for more intensity or blend for a natural finish.</li>
                    <li>Set with our Velvet Setting Spray for long-lasting wear.</li>
                  </ol>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <div className="max-w-7xl mx-auto px-6 py-16"
          style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          <div className="text-center mb-10">
            <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a96e' }}>
              You May Also Like
            </p>
            <h2 className="text-3xl font-light"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
              Related Products
            </h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {relatedProducts.map(p => (
              <Link to={`/product/${p.id}`} key={p.id}
                className="group"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>
                <div className="overflow-hidden" style={{ height: '200px' }}>
                  <img src={p.image} alt={p.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    style={{ opacity: 0.85 }} />
                </div>
                <div className="p-3">
                  <p className="text-xs tracking-wider mb-1"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    {p.category}
                  </p>
                  <h3 className="text-sm font-light mb-1"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                    {p.name}
                  </h3>
                  <span className="text-sm" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    ${p.price}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Back Button */}
      <div className="max-w-7xl mx-auto px-6 pb-16">
        <button onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all duration-300"
          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
          onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
          onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
          <FiArrowLeft size={14} /> Back to Shop
        </button>
      </div>

    </div>
  );
}