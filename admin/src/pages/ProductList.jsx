import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiPlus, FiPackage, FiEdit2, FiTrash2, FiTrendingUp } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const navigate = useNavigate();

  useEffect(() => { fetchProducts(); }, []);

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false });
    setProducts(data || []);
    setLoading(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this product?')) return;
    await supabase.from('products').delete().eq('id', id);
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  const filtered = products.filter(p =>
    p.name?.toLowerCase().includes(search.toLowerCase()) ||
    p.category?.toLowerCase().includes(search.toLowerCase()) ||
    p.slug?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <style>{`
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .product-row { transition: all 0.2s ease; cursor: pointer; }
        .product-row:hover { background: rgba(201,169,110,0.05) !important; }
      `}</style>

      <div className="fade-in space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-1"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Manage</p>
            <h1 className="text-4xl font-light"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Products</h1>
          </div>
          <div className="flex items-center gap-3">
            {[
              { label: 'Total', value: products.length },
              { label: 'In Stock', value: products.filter(p => p.in_stock).length },
              { label: 'Out', value: products.filter(p => !p.in_stock).length },
            ].map(s => (
              <div key={s.label} className="px-3 py-2 text-center"
                style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.12)' }}>
                <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em' }}>{s.label}</p>
                <p className="text-xl font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search + Add */}
        <div className="flex items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search by name, category, slug..."
              className="w-full bg-transparent border pl-9 pr-4 py-2.5 text-sm outline-none tracking-wider"
              style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }} />
          </div>
          <span className="text-xs tracking-wider px-3 py-2"
            style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.15)', color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            {filtered.length} products
          </span>
          <button onClick={() => navigate('/products/add')}
            className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            <FiPlus size={13} /> Add Product
          </button>
        </div>

        {/* Table */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          {loading ? (
            <div className="flex items-center justify-center h-40">
              <div className="w-7 h-7 border-2 rounded-full animate-spin"
                style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
            </div>
          ) : filtered.length === 0 ? (
            <div className="p-16 text-center">
              <FiPackage size={32} style={{ color: 'rgba(201,169,110,0.2)', margin: '0 auto 1rem' }} />
              <p className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No products found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                    {['Product', 'Product ID (Slug)', 'Category', 'Price', 'Stock', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs tracking-widest uppercase"
                        style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((product, i) => (
                    <tr key={product.id}
                      className="product-row"
                      style={{ borderBottom: i < filtered.length - 1 ? '1px solid rgba(201,169,110,0.06)' : 'none' }}
                      onClick={() => navigate(`/products/${product.slug}`)}>

                      {/* Product */}
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-3">
                          {product.image ? (
                            <img src={product.image} alt={product.name}
                              className="w-11 h-11 object-cover flex-shrink-0"
                              style={{ border: '1px solid rgba(201,169,110,0.15)' }} />
                          ) : (
                            <div className="w-11 h-11 flex items-center justify-center flex-shrink-0"
                              style={{ background: 'rgba(201,169,110,0.06)', border: '1px solid rgba(201,169,110,0.1)' }}>
                              <FiPackage size={14} style={{ color: '#4a3f30' }} />
                            </div>
                          )}
                          <div>
                            <p className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                              {product.name}
                            </p>
                            {product.badge && (
                              <span className="text-xs px-1.5 py-0.5"
                                style={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', fontSize: '9px', fontFamily: 'Montserrat, sans-serif' }}>
                                {product.badge}
                              </span>
                            )}
                          </div>
                        </div>
                      </td>

                      {/* Slug */}
                      <td className="px-5 py-4">
                        <span className="text-xs tracking-wider font-mono px-2 py-1"
                          style={{ background: 'rgba(201,169,110,0.06)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.15)', fontFamily: 'Montserrat, sans-serif' }}>
                          #{product.slug}
                        </span>
                      </td>

                      {/* Category */}
                      <td className="px-5 py-4 text-xs tracking-wider"
                        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        {product.category}
                      </td>

                      {/* Price */}
                      <td className="px-5 py-4">
                        <p className="text-sm font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>${product.price}</p>
                        {product.original_price > product.price && (
                          <p className="text-xs line-through" style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>${product.original_price}</p>
                        )}
                      </td>

                      {/* Stock */}
                      <td className="px-5 py-4">
                        <span className="px-2 py-1 text-xs tracking-wider"
                          style={{
                            background: product.in_stock ? 'rgba(74,222,128,0.08)' : 'rgba(232,160,154,0.08)',
                            color: product.in_stock ? '#4ade80' : '#e8a09a',
                            border: `1px solid ${product.in_stock ? 'rgba(74,222,128,0.2)' : 'rgba(232,160,154,0.2)'}`,
                            fontFamily: 'Montserrat, sans-serif',
                          }}>
                          {product.in_stock ? 'In Stock' : 'Out'}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/products/edit/${product.slug}`)}
                            className="w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                            <FiEdit2 size={11} />
                          </button>
                          <button onClick={e => handleDelete(e, product.id)}
                            className="w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                            style={{ color: '#e8a09a', background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.2)' }}>
                            <FiTrash2 size={11} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}