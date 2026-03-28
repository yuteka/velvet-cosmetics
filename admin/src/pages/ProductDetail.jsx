import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiEdit2, FiTrash2, FiPackage, FiStar, FiTag, FiCheck, FiX } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function ProductDetail() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(null);
  const [toggling, setToggling] = useState(false);

  useEffect(() => { fetchProduct(); }, [slug]);

  const fetchProduct = async () => {
    setLoading(true);
    const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
    setProduct(data);
    setSelectedImage(data?.image || null);
    setLoading(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', product.id);
    navigate('/products');
  };

  const toggleStock = async () => {
    setToggling(true);
    await supabase.from('products').update({ in_stock: !product.in_stock }).eq('id', product.id);
    setProduct(prev => ({ ...prev, in_stock: !prev.in_stock }));
    setToggling(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  if (!product) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <FiPackage size={40} style={{ color: 'rgba(201,169,110,0.2)' }} />
      <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Product not found</p>
      <button onClick={() => navigate('/products')}
        className="text-xs tracking-widest uppercase px-4 py-2"
        style={{ border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
        Back to Products
      </button>
    </div>
  );

  const allImages = [product.image, ...(Array.isArray(product.images) ? product.images : [])].filter(Boolean);

  return (
    <>
      <style>{`
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .thumb { transition: all 0.2s ease; cursor: pointer; }
        .thumb:hover { border-color: rgba(201,169,110,0.6) !important; }
        .thumb.active { border-color: #c9a96e !important; }
      `}</style>

      <div className="fade-in space-y-6">

        {/* Back + Actions */}
        <div className="flex items-center justify-between">
          <button onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-70"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            <FiArrowLeft size={13} /> Back to Products
          </button>
          <div className="flex items-center gap-3">
            <button onClick={toggleStock} disabled={toggling}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{
                background: product.in_stock ? 'rgba(74,222,128,0.1)' : 'rgba(232,160,154,0.1)',
                border: `1px solid ${product.in_stock ? 'rgba(74,222,128,0.3)' : 'rgba(232,160,154,0.3)'}`,
                color: product.in_stock ? '#4ade80' : '#e8a09a',
                fontFamily: 'Montserrat, sans-serif',
              }}>
              {product.in_stock ? <FiCheck size={12} /> : <FiX size={12} />}
              {toggling ? '...' : product.in_stock ? 'In Stock' : 'Out of Stock'}
            </button>
            <button onClick={() => navigate(`/products/edit/${product.slug}`)}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              <FiEdit2 size={12} /> Edit
            </button>
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.2)', color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
              <FiTrash2 size={12} /> Delete
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">

          {/* LEFT — Images */}
          <div className="space-y-4">
            {/* Main Image */}
            <div className="aspect-square overflow-hidden"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              {selectedImage ? (
                <img src={selectedImage} alt={product.name} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <FiPackage size={48} style={{ color: 'rgba(201,169,110,0.2)' }} />
                </div>
              )}
            </div>
            {/* Thumbnails */}
            {allImages.length > 1 && (
              <div className="flex gap-2 flex-wrap">
                {allImages.map((img, i) => (
                  <div key={i}
                    className={`thumb w-16 h-16 overflow-hidden ${selectedImage === img ? 'active' : ''}`}
                    style={{ border: `2px solid ${selectedImage === img ? '#c9a96e' : 'rgba(201,169,110,0.15)'}` }}
                    onClick={() => setSelectedImage(img)}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT — Details */}
          <div className="space-y-5">

            {/* Name + Badge */}
            <div>
              {product.badge && (
                <span className="text-xs px-3 py-1 tracking-widest uppercase mb-3 inline-block"
                  style={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
                  {product.badge}
                </span>
              )}
              <h1 className="text-4xl font-light mt-2"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                {product.name}
              </h1>
              <p className="text-xs tracking-wider mt-1" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                #{product.slug}
              </p>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                ${product.price}
              </span>
              {product.original_price > product.price && (
                <span className="text-lg line-through" style={{ color: '#4a3f30', fontFamily: 'Cormorant Garamond, serif' }}>
                  ${product.original_price}
                </span>
              )}
              {product.original_price > product.price && (
                <span className="text-xs px-2 py-1"
                  style={{ background: 'rgba(232,160,154,0.1)', color: '#e8a09a', border: '1px solid rgba(232,160,154,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
                  {Math.round((1 - product.price / product.original_price) * 100)}% OFF
                </span>
              )}
            </div>

            {/* Rating */}
            {product.rating && (
              <div className="flex items-center gap-2">
                <div className="flex gap-0.5">
                  {[1,2,3,4,5].map(s => (
                    <FiStar key={s} size={13}
                      style={{ color: s <= Math.round(product.rating) ? '#c9a96e' : 'rgba(201,169,110,0.2)', fill: s <= Math.round(product.rating) ? '#c9a96e' : 'none' }} />
                  ))}
                </div>
                <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  {product.rating} ({product.reviews} reviews)
                </span>
              </div>
            )}

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-3">
              {[
                { label: 'Category', value: product.category },
                { label: 'Stock', value: product.in_stock ? 'In Stock' : 'Out of Stock', color: product.in_stock ? '#4ade80' : '#e8a09a' },
                { label: 'Rating', value: `${product.rating}/5` },
                { label: 'Reviews', value: product.reviews },
              ].map(({ label, value, color }) => (
                <div key={label} className="px-4 py-3"
                  style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>
                  <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</p>
                  <p className="text-sm font-light mt-1" style={{ color: color || '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>{value}</p>
                </div>
              ))}
            </div>

            {/* Description */}
            {product.description && (
              <div className="px-4 py-4" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>
                <p className="text-xs tracking-widest uppercase mb-2" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Description</p>
                <p className="text-sm leading-relaxed" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{product.description}</p>
              </div>
            )}

            {/* Shades */}
            {product.shades?.length > 0 && (
              <div className="px-4 py-4" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>
                <div className="flex items-center gap-2 mb-3">
                  <FiTag size={12} style={{ color: '#c9a96e' }} />
                  <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    Shades ({product.shades.length})
                  </p>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {product.shades.map((shade, i) => (
                    <div key={i} className="flex items-center gap-2 px-2 py-1"
                      style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)' }}>
                      <div className="w-4 h-4 rounded-full flex-shrink-0"
                        style={{ background: shade, border: '1px solid rgba(201,169,110,0.3)' }} />
                      <span style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>{shade}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}