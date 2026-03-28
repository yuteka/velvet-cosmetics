import { useState } from 'react';
import { FiSave, FiCheck } from 'react-icons/fi';

export default function Settings() {
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    storeName: 'Velvet Luxury Cosmetics',
    storeEmail: 'hello@velvetcosmetics.com',
    storePhone: '+1 234 567 8900',
    storeAddress: '123 Beauty Boulevard, Paris, France 75001',
    currency: 'USD',
    freeShippingMin: '100',
    couponCode: 'VELVET20',
  });

  const handleSave = (e) => {
    e.preventDefault();
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full bg-transparent border px-4 py-3 text-sm outline-none tracking-wider transition-all duration-300";
  const inputStyle = { borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' };
  const labelStyle = { color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' };

  return (
    <div className="space-y-6">

      {/* Header */}
      <div>
        <p className="text-xs tracking-[0.4em] uppercase mb-1"
          style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
          Configure
        </p>
        <h1 className="text-3xl font-light"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
          Settings
        </h1>
      </div>

      <form onSubmit={handleSave} className="space-y-6">

        {/* Store Info */}
        <div className="p-6 space-y-4"
          style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <h2 className="text-xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Store Information
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Store Name
              </label>
              <input type="text" value={form.storeName}
                onChange={e => setForm({ ...form, storeName: e.target.value })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Store Email
              </label>
              <input type="email" value={form.storeEmail}
                onChange={e => setForm({ ...form, storeEmail: e.target.value })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Store Phone
              </label>
              <input type="text" value={form.storePhone}
                onChange={e => setForm({ ...form, storePhone: e.target.value })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Currency
              </label>
              <select value={form.currency}
                onChange={e => setForm({ ...form, currency: e.target.value })}
                className={inputCls} style={{ ...inputStyle, background: '#111009' }}>
                {['USD', 'EUR', 'GBP', 'INR'].map(c => (
                  <option key={c} value={c} style={{ background: '#111009' }}>{c}</option>
                ))}
              </select>
            </div>
            <div className="md:col-span-2">
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Store Address
              </label>
              <input type="text" value={form.storeAddress}
                onChange={e => setForm({ ...form, storeAddress: e.target.value })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
            </div>
          </div>
        </div>

        {/* Shipping & Offers */}
        <div className="p-6 space-y-4"
          style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <h2 className="text-xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Shipping & Offers
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Free Shipping Min Order ($)
              </label>
              <input type="number" value={form.freeShippingMin}
                onChange={e => setForm({ ...form, freeShippingMin: e.target.value })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
            </div>
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>
                Default Coupon Code
              </label>
              <input type="text" value={form.couponCode}
                onChange={e => setForm({ ...form, couponCode: e.target.value.toUpperCase() })}
                className={inputCls} style={inputStyle}
                onFocus={e => e.target.style.borderColor = '#c9a96e'}
                onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
            </div>
          </div>
        </div>

        {/* Save Button */}
        {saved && (
          <div className="px-4 py-3 text-xs tracking-wider flex items-center gap-2"
            style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            <FiCheck size={12} /> Settings saved successfully!
          </div>
        )}

        <button type="submit"
          className="flex items-center gap-2 px-8 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
          style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
          <FiSave size={14} /> Save Settings
        </button>

      </form>
    </div>
  );
}