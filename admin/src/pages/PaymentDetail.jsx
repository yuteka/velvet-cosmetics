import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiCreditCard, FiPackage,
  FiMapPin, FiMail, FiPhone, FiCalendar, FiDollarSign
} from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function PaymentDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchOrder(); }, [id]);

  const fetchOrder = async () => {
    setLoading(true);
    const { data: orderData } = await supabase.from('orders').select('*').eq('id', id).single();
    if (!orderData) { setLoading(false); return; }
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', orderData.user_id).single();
    setOrder({ ...orderData, profiles: profile || null });
    setLoading(false);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  if (!order) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Payment not found</p>
      <button onClick={() => navigate('/payments')}
        className="text-xs tracking-widest uppercase px-4 py-2"
        style={{ border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
        Back to Payments
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="fade-in space-y-6 w-full">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/payments')}
              className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all hover:opacity-70"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              <FiArrowLeft size={13} /> Payments
            </button>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase mb-1"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Payment Details</p>
              <h1 className="text-4xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                #{order.order_id}
              </h1>
            </div>
          </div>
          <span className="px-4 py-2 text-xs tracking-wider flex-shrink-0"
            style={{ background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
            ✓ Paid
          </span>
        </div>

        {/* Payment Summary */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="px-5 py-4 flex items-center gap-2"
            style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
            <FiDollarSign size={14} style={{ color: '#c9a96e' }} />
            <p className="text-xs tracking-widest uppercase"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Payment Summary</p>
          </div>
          <div className="p-5 grid grid-cols-3 gap-4 w-full">
            {[
              { label: 'Amount Paid',    value: `$${order.total}`,             big: true },
              { label: 'Payment Method', value: order.payment_method || 'Card' },
              { label: 'Payment Date',   value: order.date || new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) },
            ].map(({ label, value, big }) => (
              <div key={label} className="px-4 py-4 text-center"
                style={{ background: 'rgba(201,169,110,0.04)', border: '1px solid rgba(201,169,110,0.1)' }}>
                <p className="text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
                <p style={{ color: big ? '#c9a96e' : '#faf8f4', fontFamily: 'Cormorant Garamond, serif', fontSize: big ? '24px' : '16px' }}>
                  {value}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Customer + Order Info Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 w-full">

          {/* Customer */}
          <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              <FiUser size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Customer</p>
            </div>
            <div className="p-5 space-y-3">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-full flex items-center justify-center text-sm flex-shrink-0"
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
              {[
                { icon: FiMail,  label: 'Email',   value: order.shipping_email || order.profiles?.email },
                { icon: FiPhone, label: 'Phone',   value: order.shipping_phone },
                { icon: FiMapPin,label: 'Address', value: order.shipping_address },
                { icon: FiMapPin,label: 'City',    value: `${order.shipping_city || ''}${order.shipping_country ? ', ' + order.shipping_country : ''}` },
              ].filter(r => r.value).map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-center gap-3 px-3 py-2"
                  style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.08)' }}>
                  <Icon size={12} style={{ color: '#c9a96e', flexShrink: 0 }} />
                  <div>
                    <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '9px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
                    <p className="text-xs tracking-wider" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Items */}
          <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="px-5 py-4 flex items-center gap-2"
              style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
              <FiPackage size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                Items ({order.items?.length || 0})
              </p>
            </div>
            <div>
              {order.items?.length > 0 ? order.items.map((item, i) => (
                <div key={i} className="px-5 py-3 flex items-center justify-between w-full"
                  style={{ borderBottom: i < order.items.length - 1 ? '1px solid rgba(201,169,110,0.06)' : 'none' }}>
                  <div className="flex items-center gap-3">
                    <div className="w-6 h-6 flex items-center justify-center text-xs"
                      style={{ background: 'rgba(201,169,110,0.08)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                      {item.qty}
                    </div>
                    <span className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                      {item.name}
                    </span>
                  </div>
                  <span className="text-sm font-light flex-shrink-0" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                    ${(item.price * item.qty).toFixed(2)}
                  </span>
                </div>
              )) : (
                <div className="p-8 text-center">
                  <p className="text-xs" style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>No items</p>
                </div>
              )}
              <div className="px-5 py-3 flex justify-between w-full"
                style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.04)' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Total</span>
                <span className="text-xl font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>${order.total}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Order Status */}
        <div className="px-5 py-4 flex items-center justify-between w-full"
          style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="flex items-center gap-2">
            <FiCalendar size={13} style={{ color: '#c9a96e' }} />
            <p className="text-xs tracking-widest uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Order Status</p>
          </div>
          <span className="px-3 py-1 text-xs tracking-wider flex-shrink-0"
            style={{
              background: order.status === 'Delivered' ? 'rgba(74,222,128,0.1)' : 'rgba(201,169,110,0.1)',
              color: order.status === 'Delivered' ? '#4ade80' : '#c9a96e',
              border: `1px solid ${order.status === 'Delivered' ? 'rgba(74,222,128,0.3)' : 'rgba(201,169,110,0.3)'}`,
              fontFamily: 'Montserrat, sans-serif',
            }}>
            {order.status || 'Processing'}
          </span>
        </div>

      </div>
    </>
  );
}