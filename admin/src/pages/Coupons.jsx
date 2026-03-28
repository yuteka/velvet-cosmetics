import { useState, useEffect } from 'react';
import { FiPlus, FiTrash2, FiX, FiCheck, FiTag, FiPercent, FiDollarSign, FiRefreshCw } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const emptyForm = {
  code: '', discount: '', type: 'percentage', min_order: '', active: true,
};

export default function Coupons() {
  const [coupons, setCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [hoveredId, setHoveredId] = useState(null);
  const [deletingId, setDeletingId] = useState(null);
  const [togglingId, setTogglingId] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => { fetchCoupons(); }, []);

  const fetchCoupons = async () => {
    setLoading(true);
    setError(null);
    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) setError(error.message);
    else setCoupons(data || []);
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    const { error } = await supabase.from('coupons').insert([{
      code: form.code.toUpperCase().trim(),
      discount: parseFloat(form.discount),
      type: form.type,
      min_order: parseFloat(form.min_order) || 0,
      active: form.active,
    }]);
    if (error) setError(error.message);
    else { setForm(emptyForm); setShowForm(false); fetchCoupons(); }
    setSaving(false);
  };

  const handleDelete = async (id) => {
    setDeletingId(id);
    setTimeout(async () => {
      const { error } = await supabase.from('coupons').delete().eq('id', id);
      if (error) setError(error.message);
      else setCoupons(prev => prev.filter(c => c.id !== id));
      setDeletingId(null);
    }, 300);
  };

  const toggleActive = async (id, currentActive) => {
    setTogglingId(id);
    const { error } = await supabase
      .from('coupons')
      .update({ active: !currentActive })
      .eq('id', id);
    if (error) setError(error.message);
    else setCoupons(prev => prev.map(c => c.id === id ? { ...c, active: !currentActive } : c));
    setTogglingId(null);
  };

  const inputCls = "w-full bg-transparent border px-4 py-2.5 text-sm outline-none tracking-wider transition-all duration-300";
  const inputStyle = { borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' };
  const labelStyle = { color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  return (
    <>
      <style>{`
        .coupon-card { transition: all 0.3s ease; position: relative; overflow: hidden; }
        .coupon-card::before {
          content: ''; position: absolute; top: 0; left: -100%;
          width: 100%; height: 100%;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.03), transparent);
          transition: left 0.5s ease;
        }
        .coupon-card:hover::before { left: 100%; }
        .coupon-card:hover { transform: translateY(-3px); box-shadow: 0 8px 24px rgba(0,0,0,0.3); }
        .coupon-card.deleting { animation: fadeOut 0.3s ease forwards; }
        @keyframes fadeOut { to { opacity: 0; transform: scale(0.95); } }
        .coupon-code {
          background: linear-gradient(135deg, #c9a96e, #f0d898, #c9a96e);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text; background-size: 200% auto;
          animation: goldText 3s linear infinite;
        }
        @keyframes goldText { to { background-position: 200% center; } }
        .toggle-btn { position: relative; overflow: hidden; transition: all 0.3s ease; }
        .toggle-btn::after {
          content: ''; position: absolute; inset: 0;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.1), transparent);
          transform: translateX(-100%); transition: transform 0.3s ease;
        }
        .toggle-btn:hover::after { transform: translateX(100%); }
        .form-slide { animation: slideDown 0.3s ease; }
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .card-enter { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(16px); } to { opacity: 1; transform: translateY(0); } }
        .dashed-border {
          background-image: repeating-linear-gradient(90deg, rgba(201,169,110,0.3) 0, rgba(201,169,110,0.3) 8px, transparent 8px, transparent 16px);
          background-size: 100% 1px; background-position: 0 50%; background-repeat: repeat-x;
        }
      `}</style>

      <div className="space-y-6">

        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-1"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Manage</p>
            <h1 className="text-4xl font-light"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Coupons</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchCoupons}
              className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:opacity-70"
              style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', color: '#7a6e5f' }}>
              <FiRefreshCw size={13} />
            </button>
            <span className="text-xs px-3 py-1.5 tracking-wider"
              style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              {coupons.filter(c => c.active).length} Active
            </span>
            <button onClick={() => setShowForm(!showForm)}
              className="flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              {showForm ? <FiX size={14} /> : <FiPlus size={14} />}
              {showForm ? 'Cancel' : 'Add Coupon'}
            </button>
          </div>
        </div>

        {/* Error */}
        {error && (
          <div className="flex items-center justify-between px-4 py-3"
            style={{ background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.25)' }}>
            <span className="text-xs tracking-wider" style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>{error}</span>
            <button onClick={() => setError(null)} style={{ color: '#e8a09a' }}><FiX size={13} /></button>
          </div>
        )}

        {/* Add Form */}
        {showForm && (
          <form onSubmit={handleSubmit} className="form-slide p-6 space-y-4"
            style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.25)', boxShadow: '0 0 24px rgba(201,169,110,0.05)' }}>
            <div className="flex items-center gap-3 mb-4">
              <div className="w-8 h-8 flex items-center justify-center"
                style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>
                <FiTag size={14} style={{ color: '#c9a96e' }} />
              </div>
              <h3 className="text-lg font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>New Coupon</h3>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Coupon Code</label>
                <input type="text" value={form.code}
                  onChange={e => setForm({ ...form, code: e.target.value.toUpperCase() })}
                  placeholder="VELVET20" className={inputCls} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
                  required />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Discount Type</label>
                <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}
                  className={inputCls} style={{ ...inputStyle, background: '#111009' }}>
                  <option value="percentage" style={{ background: '#111009' }}>Percentage (%)</option>
                  <option value="fixed" style={{ background: '#111009' }}>Fixed (₹)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Discount Value</label>
                <input type="number" value={form.discount}
                  onChange={e => setForm({ ...form, discount: e.target.value })}
                  placeholder={form.type === 'percentage' ? '20' : '150'}
                  className={inputCls} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
                  required />
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Min Order (₹)</label>
                <input type="number" value={form.min_order}
                  onChange={e => setForm({ ...form, min_order: e.target.value })}
                  placeholder="500" className={inputCls} style={inputStyle}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
              </div>
              <div className="flex items-center gap-3 pt-5">
                <input type="checkbox" checked={form.active}
                  onChange={e => setForm({ ...form, active: e.target.checked })}
                  className="accent-yellow-600 w-4 h-4" />
                <label className="text-xs tracking-wider" style={labelStyle}>Active</label>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving}
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                style={{ background: saving ? 'rgba(201,169,110,0.5)' : '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                <FiCheck size={14} /> {saving ? 'Saving...' : 'Add Coupon'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="px-6 py-3 text-xs tracking-widest uppercase border transition-all duration-300 hover:opacity-70"
                style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                Cancel
              </button>
            </div>
          </form>
        )}

        {/* Coupons Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {coupons.map((coupon, index) => (
            <div key={coupon.id}
              className={`coupon-card card-enter p-5 ${deletingId === coupon.id ? 'deleting' : ''}`}
              style={{
                background: coupon.active ? '#111009' : '#0d0b08',
                border: `1px solid ${coupon.active ? 'rgba(201,169,110,0.3)' : 'rgba(201,169,110,0.1)'}`,
                opacity: coupon.active ? 1 : 0.55,
                animationDelay: `${index * 0.08}s`,
              }}
              onMouseEnter={() => setHoveredId(coupon.id)}
              onMouseLeave={() => setHoveredId(null)}>

              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 flex items-center justify-center"
                    style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.2)' }}>
                    {coupon.type === 'percentage'
                      ? <FiPercent size={13} style={{ color: '#c9a96e' }} />
                      : <FiDollarSign size={13} style={{ color: '#c9a96e' }} />}
                  </div>
                  <span className="coupon-code text-xl font-light tracking-widest"
                    style={{ fontFamily: 'Cormorant Garamond, serif' }}>
                    {coupon.code}
                  </span>
                </div>
                <button onClick={() => handleDelete(coupon.id)}
                  className="w-7 h-7 flex items-center justify-center transition-all duration-300 hover:scale-110"
                  style={{
                    color: '#e8a09a',
                    background: hoveredId === coupon.id ? 'rgba(232,160,154,0.1)' : 'transparent',
                    border: hoveredId === coupon.id ? '1px solid rgba(232,160,154,0.2)' : '1px solid transparent',
                  }}>
                  <FiTrash2 size={13} />
                </button>
              </div>

              <div className="dashed-border h-px mb-4" />

              <div className="space-y-2 mb-5">
                <div className="flex items-center justify-between">
                  <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Discount</span>
                  <span className="text-sm font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                    {coupon.type === 'percentage' ? `${coupon.discount}% OFF` : `₹${coupon.discount} OFF`}
                  </span>
                </div>
                {coupon.min_order > 0 && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Min Order</span>
                    <span className="text-xs tracking-wider" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>₹{coupon.min_order}</span>
                  </div>
                )}
                {coupon.created_at && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Created</span>
                    <span style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>
                      {new Date(coupon.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              <button
                onClick={() => toggleActive(coupon.id, coupon.active)}
                disabled={togglingId === coupon.id}
                className="toggle-btn w-full py-2.5 text-xs tracking-widest uppercase"
                style={{
                  background: coupon.active ? 'rgba(201,169,110,0.12)' : 'transparent',
                  border: `1px solid ${coupon.active ? 'rgba(201,169,110,0.35)' : 'rgba(201,169,110,0.15)'}`,
                  color: coupon.active ? '#c9a96e' : '#7a6e5f',
                  fontFamily: 'Montserrat, sans-serif',
                  transition: 'all 0.3s ease',
                  opacity: togglingId === coupon.id ? 0.5 : 1,
                }}>
                {togglingId === coupon.id ? '...' : coupon.active ? '✓ Active' : '○ Inactive'}
              </button>
            </div>
          ))}

          {/* Empty add card */}
          <div onClick={() => setShowForm(true)}
            className="coupon-card card-enter p-5 flex flex-col items-center justify-center gap-3 cursor-pointer"
            style={{
              background: 'transparent', border: '1px dashed rgba(201,169,110,0.2)',
              minHeight: '180px', animationDelay: `${coupons.length * 0.08}s`,
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.4)'; e.currentTarget.style.background = 'rgba(201,169,110,0.03)'; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = 'rgba(201,169,110,0.2)'; e.currentTarget.style.background = 'transparent'; }}>
            <div className="w-10 h-10 flex items-center justify-center"
              style={{ border: '1px dashed rgba(201,169,110,0.3)' }}>
              <FiPlus size={18} style={{ color: 'rgba(201,169,110,0.5)' }} />
            </div>
            <p className="text-xs tracking-widest uppercase"
              style={{ color: 'rgba(201,169,110,0.4)', fontFamily: 'Montserrat, sans-serif' }}>Add Coupon</p>
          </div>
        </div>

      </div>
    </>
  );
}