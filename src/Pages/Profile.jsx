import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { FiUser, FiMapPin, FiPlus, FiTrash2, FiPackage, FiLogOut, FiCheck } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

export default function Profile() {
  const { user, logout, addAddress, deleteAddress } = useAuth();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [showAddForm, setShowAddForm] = useState(false);
  const [saved, setSaved] = useState(false);
  const [addressForm, setAddressForm] = useState({
    name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'United States',
  });

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center"
        style={{ background: '#0a0806', paddingTop: '80px' }}>
        <div className="text-center">
          <h2 className="text-3xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Please Sign In
          </h2>
          <Link to="/login"
            className="inline-block px-10 py-4 text-xs tracking-widest uppercase"
            style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const handleAddAddress = async (e) => {
    e.preventDefault();
    if (!addressForm.name || !addressForm.address || !addressForm.city || !addressForm.zip) return;
    await addAddress(addressForm);
    setAddressForm({ name: '', phone: '', address: '', city: '', state: '', zip: '', country: 'United States' });
    setShowAddForm(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const inputCls = "w-full bg-transparent border px-4 py-3 text-sm outline-none tracking-wider transition-all duration-300";
  const inputStyle = { borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' };
  const labelStyle = { color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' };

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10 flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-2"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>My Account</p>
            <h1 className="text-4xl md:text-5xl font-light"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
              Hello, {user.firstName}
            </h1>
          </div>
          <button onClick={handleLogout}
            className="flex items-center gap-2 px-5 py-3 text-xs tracking-widest uppercase border transition-all duration-300 hover:opacity-70"
            style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            <FiLogOut size={14} /> Logout
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-6 mb-10"
          style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
          {[
            { id: 'profile', label: 'Profile', icon: FiUser },
            { id: 'addresses', label: 'Addresses', icon: FiMapPin },
            { id: 'orders', label: 'Orders', icon: FiPackage },
          ].map(({ id, label, icon: Icon }) => (
            <button key={id} onClick={() => setActiveTab(id)}
              className="flex items-center gap-2 pb-4 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                color: activeTab === id ? '#c9a96e' : '#7a6e5f',
                borderBottom: activeTab === id ? '1px solid #c9a96e' : 'none',
                marginBottom: '-1px',
                fontFamily: 'Montserrat, sans-serif',
              }}>
              <Icon size={14} /> {label}
            </button>
          ))}
        </div>

        {/* PROFILE TAB */}
        {activeTab === 'profile' && (
          <div className="p-8"
            style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="flex items-center gap-6 mb-8">
              <div className="w-16 h-16 rounded-full flex items-center justify-center text-2xl font-light"
                style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                {user.firstName?.[0]}{user.lastName?.[0]}
              </div>
              <div>
                <h3 className="text-xl font-light"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                  {user.firstName} {user.lastName}
                </h3>
                <p className="text-xs tracking-wider mt-1"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  {user.email}
                </p>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>First Name</label>
                <div className={inputCls} style={{ ...inputStyle, borderColor: 'rgba(201,169,110,0.15)' }}>
                  {user.firstName}
                </div>
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Last Name</label>
                <div className={inputCls} style={{ ...inputStyle, borderColor: 'rgba(201,169,110,0.15)' }}>
                  {user.lastName}
                </div>
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Email Address</label>
                <div className={inputCls} style={{ ...inputStyle, borderColor: 'rgba(201,169,110,0.15)' }}>
                  {user.email}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ADDRESSES TAB */}
        {activeTab === 'addresses' && (
          <div className="space-y-4">
            {saved && (
              <div className="px-4 py-3 text-xs tracking-wider flex items-center gap-2"
                style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                <FiCheck size={12} /> Address saved successfully!
              </div>
            )}

            {user.addresses?.length === 0 && !showAddForm && (
              <div className="text-center py-16"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <FiMapPin size={32} style={{ color: '#c9a96e', margin: '0 auto 1rem' }} />
                <p className="text-sm mb-6"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  No saved addresses yet.
                </p>
              </div>
            )}

            {/* ✅ FIXED: addr.id instead of addr._id */}
            {user.addresses?.map(addr => (
              <div key={addr.id} className="p-5 flex items-start justify-between"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div>
                  <p className="text-sm font-medium mb-1"
                    style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>{addr.name}</p>
                  <p className="text-xs leading-relaxed"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    {addr.address}, {addr.city}, {addr.state} {addr.zip}<br />{addr.country}
                  </p>
                  {addr.phone && (
                    <p className="text-xs mt-1"
                      style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{addr.phone}</p>
                  )}
                </div>
                {/* ✅ FIXED: addr.id instead of addr._id */}
                <button onClick={() => deleteAddress(addr.id)}
                  className="transition-all duration-300 hover:opacity-70"
                  style={{ color: '#c96e6e' }}>
                  <FiTrash2 size={16} />
                </button>
              </div>
            ))}

            {showAddForm && (
              <form onSubmit={handleAddAddress} className="p-6 space-y-4"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <h3 className="text-lg font-light mb-4"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>New Address</h3>
                <div className="grid grid-cols-2 gap-4">
                  {[
                    { label: 'Full Name', name: 'name', placeholder: 'Jane Doe', span: 2 },
                    { label: 'Phone', name: 'phone', placeholder: '+91 98765 43210', span: 2 },
                    { label: 'Street Address', name: 'address', placeholder: '123 Main Street', span: 2 },
                    { label: 'City', name: 'city', placeholder: 'Chennai', span: 1 },
                    { label: 'State', name: 'state', placeholder: 'Tamil Nadu', span: 1 },
                    { label: 'ZIP Code', name: 'zip', placeholder: '600001', span: 1 },
                  ].map(f => (
                    <div key={f.name} className={f.span === 2 ? 'col-span-2' : 'col-span-1'}>
                      <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>{f.label}</label>
                      <input type="text" name={f.name}
                        value={addressForm[f.name]}
                        onChange={e => setAddressForm({ ...addressForm, [e.target.name]: e.target.value })}
                        placeholder={f.placeholder}
                        className={inputCls} style={inputStyle}
                        onFocus={e => e.target.style.borderColor = '#c9a96e'}
                        onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
                    </div>
                  ))}
                  <div className="col-span-1">
                    <label className="block text-xs tracking-widest uppercase mb-2" style={labelStyle}>Country</label>
                    <select name="country" value={addressForm.country}
                      onChange={e => setAddressForm({ ...addressForm, country: e.target.value })}
                      className={inputCls} style={{ ...inputStyle, background: '#111009' }}>
                      {['India', 'United States', 'United Kingdom', 'France', 'Germany', 'Canada', 'Australia'].map(c => (
                        <option key={c} value={c} style={{ background: '#111009' }}>{c}</option>
                      ))}
                    </select>
                  </div>
                </div>
                <div className="flex gap-3 pt-2">
                  <button type="submit"
                    className="px-8 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                    style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                    Save Address
                  </button>
                  <button type="button" onClick={() => setShowAddForm(false)}
                    className="px-8 py-3 text-xs tracking-widest uppercase border transition-all duration-300 hover:opacity-70"
                    style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    Cancel
                  </button>
                </div>
              </form>
            )}

            {!showAddForm && (
              <button onClick={() => setShowAddForm(true)}
                className="flex items-center gap-2 px-6 py-3 text-xs tracking-widest uppercase border transition-all duration-300 hover:opacity-80"
                style={{ borderColor: 'rgba(201,169,110,0.4)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                <FiPlus size={14} /> Add New Address
              </button>
            )}
          </div>
        )}

        {/* ORDERS TAB */}
        {activeTab === 'orders' && (
          <div>
            {user.orders?.length === 0 ? (
              <div className="text-center py-16"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <FiPackage size={32} style={{ color: '#c9a96e', margin: '0 auto 1rem' }} />
                <p className="text-sm mb-6"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No orders yet.</p>
                <Link to="/"
                  className="inline-block px-8 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {/* ✅ FIXED: order.order_id instead of order.orderId (Supabase column name) */}
                {user.orders?.map((order, i) => (
                  <div key={order.id || i} className="p-5"
                    style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                    <div className="flex items-center justify-between mb-3">
                      <div>
                        <p className="text-xs tracking-wider mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Order #{order.order_id}
                        </p>
                        <p className="text-xs"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{order.date}</p>
                      </div>
                      <span className="text-lg font-light"
                        style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                        ${order.total}
                      </span>
                    </div>
                    <Link to={`/track/${order.order_id}`}
                      className="text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-70"
                      style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                      Track Order →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
