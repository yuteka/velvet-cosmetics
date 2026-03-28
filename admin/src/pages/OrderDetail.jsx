import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiTruck, FiMapPin, FiCreditCard,
  FiCalendar, FiPackage, FiUser, FiCheck, FiX, FiTrash2
} from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const STATUS_OPTIONS = ['Pending', 'Confirmed', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

const STATUS_COLORS = {
  Pending:    { bg: 'rgba(251,191,36,0.1)',   color: '#fbbf24', border: 'rgba(251,191,36,0.3)' },
  Confirmed:  { bg: 'rgba(201,169,110,0.1)',  color: '#c9a96e', border: 'rgba(201,169,110,0.3)' },
  Processing: { bg: 'rgba(139,92,246,0.1)',   color: '#a78bfa', border: 'rgba(139,92,246,0.3)' },
  Shipped:    { bg: 'rgba(59,130,246,0.1)',   color: '#60a5fa', border: 'rgba(59,130,246,0.3)' },
  Delivered:  { bg: 'rgba(74,222,128,0.1)',   color: '#4ade80', border: 'rgba(74,222,128,0.3)' },
  Cancelled:  { bg: 'rgba(232,160,154,0.1)',  color: '#e8a09a', border: 'rgba(232,160,154,0.3)' },
};

function getExpectedDelivery(createdAt) {
  const date = new Date(createdAt);
  date.setDate(date.getDate() + 5);
  return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' });
}

export default function OrderDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    const { data: orderData } = await supabase.from('orders').select('*').eq('id', id).single();
    if (!orderData) { setLoading(false); return; }

    const { data: profile } = await supabase.from('profiles').select('*').eq('id', orderData.user_id).single();

    const merged = {
      ...orderData,
      profiles: profile || null,
      status: orderData.status || 'Confirmed',
      payment_method: orderData.payment_method || 'Credit Card',
      expected_delivery: getExpectedDelivery(orderData.created_at),
    };

    setOrder(merged);
    setEditStatus(merged.status);
    setLoading(false);
  };

  const handleStatusSave = async (newStatus) => {
    setSaving(true);
    await supabase.from('orders').update({ status: newStatus }).eq('id', id);
    setOrder(prev => ({ ...prev, status: newStatus }));
    setEditStatus(newStatus);
    setSaving(false);
  };

  const handleDelete = async () => {
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', id);
    navigate('/orders');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Order not found</p>
      <button onClick={() => navigate('/orders')}
        className="text-xs tracking-widest uppercase px-4 py-2"
        style={{ border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
        Back to Orders
      </button>
    </div>
  );

  const col = STATUS_COLORS[order.status] || STATUS_COLORS.Confirmed;

  return (
    <>
      <style>{`
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .status-btn { transition: all 0.2s ease; }
        .status-btn:hover { opacity: 0.85; }
        .tracking-bar { background: linear-gradient(90deg, #111009 0%, rgba(201,169,110,0.15) 100%); }
      `}</style>

      <div className="fade-in space-y-6 w-full">

        {/* Back + Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/orders')}
              className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all hover:opacity-70"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              <FiArrowLeft size={13} /> Orders
            </button>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Order Details</p>
              <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                #{order.order_id}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <span className="px-3 py-1.5 text-xs tracking-wider"
              style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}`, fontFamily: 'Montserrat, sans-serif' }}>
              {order.status}
            </span>
            <button onClick={handleDelete}
              className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all hover:opacity-80"
              style={{ background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.2)', color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
              <FiTrash2 size={12} /> Delete
            </button>
          </div>
        </div>

        {/* Top Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5 w-full">

          {/* Customer */}
          <div className="p-5" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FiUser size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Customer</p>
            </div>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-light flex-shrink-0"
                style={{ background: 'linear-gradient(135deg, #1a1208, #2a1e0e)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                {order.profiles?.first_name?.[0]}{order.profiles?.last_name?.[0]}
              </div>
              <div>
                <p className="text-base font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                  {order.profiles?.first_name} {order.profiles?.last_name}
                </p>
                <p className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  {order.profiles?.email}
                </p>
              </div>
            </div>
          </div>

          {/* Payment */}
          <div className="p-5" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FiCreditCard size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Payment</p>
            </div>
            <p className="text-2xl font-light mb-2" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>${order.total}</p>
            <p className="text-xs tracking-wider mb-2" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{order.payment_method}</p>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full" style={{ background: '#4ade80' }} />
              <p className="text-xs tracking-wider" style={{ color: '#4ade80', fontFamily: 'Montserrat, sans-serif' }}>Paid</p>
            </div>
          </div>

          {/* Delivery */}
          <div className="p-5" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="flex items-center gap-2 mb-4">
              <FiCalendar size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Delivery</p>
            </div>
            <p className="text-sm font-light mb-1" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
              {order.expected_delivery}
            </p>
            <p className="text-xs tracking-wider mb-2" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              Ordered: {order.date}
            </p>
          </div>
        </div>

        {/* Status Update */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="px-5 py-4" style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
            <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Update Status</p>
          </div>
          <div className="p-5">
            <div className="flex flex-wrap gap-2">
              {STATUS_OPTIONS.map(s => {
                const sc = STATUS_COLORS[s];
                const isActive = editStatus === s;
                return (
                  <button key={s}
                    onClick={() => { setEditStatus(s); handleStatusSave(s); }}
                    disabled={saving}
                    className="status-btn flex items-center gap-2 px-4 py-2.5 text-xs tracking-widest uppercase"
                    style={{
                      background: isActive ? sc.bg : 'transparent',
                      color: isActive ? sc.color : '#7a6e5f',
                      border: `1px solid ${isActive ? sc.border : 'rgba(201,169,110,0.15)'}`,
                      fontFamily: 'Montserrat, sans-serif',
                      fontWeight: isActive ? 600 : 400,
                    }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: sc.color }} />
                    {s}
                    {isActive && <FiCheck size={10} />}
                  </button>
                );
              })}
            </div>
            {saving && <p className="text-xs mt-3 tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Saving...</p>}
          </div>
        </div>

        {/* Tracking Progress */}
        <div className="p-5 tracking-bar w-full" style={{ border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="flex items-center gap-2 mb-6">
            <FiTruck size={14} style={{ color: '#c9a96e' }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Tracking</p>
            <span className="ml-auto text-xs px-3 py-1"
              style={{ background: 'rgba(201,169,110,0.08)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
              {order.tracking || 'VLT' + order.id?.substr(0, 9).toUpperCase()}
            </span>
          </div>
          <div className="flex items-center justify-between relative w-full">
            <div className="absolute left-0 right-0 h-px top-4" style={{ background: 'rgba(201,169,110,0.15)' }} />
            {['Confirmed', 'Processing', 'Shipped', 'Delivered'].map((step, i) => {
              const statusIndex = ['Confirmed', 'Processing', 'Shipped', 'Delivered'].indexOf(order.status);
              const isComplete = i <= statusIndex;
              return (
                <div key={step} className="flex flex-col items-center gap-2 relative z-10">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center"
                    style={{ background: isComplete ? '#c9a96e' : '#111009', border: `2px solid ${isComplete ? '#c9a96e' : 'rgba(201,169,110,0.2)'}` }}>
                    {isComplete
                      ? <FiCheck size={12} style={{ color: '#0a0806' }} />
                      : <span style={{ color: '#4a3f30', fontSize: '10px' }}>{i + 1}</span>}
                  </div>
                  <p style={{ color: isComplete ? '#c9a96e' : '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {step}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Shipping + Items Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">

          {/* Shipping */}
          <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              <FiMapPin size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Shipping Details</p>
            </div>
            <div className="p-5 space-y-3">
              {[
                { label: 'Name', value: order.shipping_name || `${order.profiles?.first_name} ${order.profiles?.last_name}` },
                { label: 'Address', value: order.shipping_address },
                { label: 'City', value: `${order.shipping_city || ''}${order.shipping_state ? ', ' + order.shipping_state : ''}${order.shipping_zip ? ' - ' + order.shipping_zip : ''}` },
                { label: 'Country', value: order.shipping_country },
                { label: 'Email', value: order.shipping_email || order.profiles?.email },
                { label: 'Phone', value: order.shipping_phone },
              ].filter(r => r.value).map(({ label, value }) => (
                <div key={label} className="flex justify-between items-start gap-4">
                  <span className="text-xs tracking-wider uppercase flex-shrink-0" style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', width: '70px' }}>{label}</span>
                  <span className="text-xs tracking-wider text-right" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>{value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              <FiPackage size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                Items ({order.items?.length || 0})
              </p>
            </div>
            <div>
              {order.items?.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between w-full"
                  style={{ borderBottom: i < order.items.length - 1 ? '1px solid rgba(201,169,110,0.06)' : 'none' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center text-xs"
                      style={{ background: 'rgba(201,169,110,0.08)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                      {item.qty}
                    </div>
                    <span className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>{item.name}</span>
                  </div>
                  <span className="text-sm font-light flex-shrink-0" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="px-5 py-3 flex justify-between w-full"
                style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.04)' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Total</span>
                <span className="text-xl font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>${order.total}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}