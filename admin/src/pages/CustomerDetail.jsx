import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  FiArrowLeft, FiUser, FiMail, FiPackage,
  FiTrash2, FiShoppingBag, FiCalendar
} from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function CustomerDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [customer, setCustomer] = useState(null);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchCustomer(); }, [id]);

  const fetchCustomer = async () => {
    setLoading(true);
    const { data: profile } = await supabase.from('profiles').select('*').eq('id', id).single();
    const { data: ordersData } = await supabase.from('orders').select('*').eq('user_id', id).order('created_at', { ascending: false });
    setCustomer(profile);
    setOrders(ordersData || []);
    setLoading(false);
  };

  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);

  const handleDelete = async () => {
    if (!confirm('Delete this customer?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    navigate('/customers');
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  if (!customer) return (
    <div className="flex flex-col items-center justify-center h-64 gap-4">
      <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Customer not found</p>
      <button onClick={() => navigate('/customers')}
        className="text-xs tracking-widest uppercase px-4 py-2"
        style={{ border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
        Back to Customers
      </button>
    </div>
  );

  return (
    <>
      <style>{`
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .order-row { transition: all 0.2s ease; cursor: pointer; }
        .order-row:hover { background: rgba(201,169,110,0.04) !important; }
      `}</style>

      <div className="fade-in space-y-6 w-full">

        {/* Header */}
        <div className="flex items-center justify-between w-full">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/customers')}
              className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all hover:opacity-70"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              <FiArrowLeft size={13} /> Customers
            </button>
            <div>
              <p className="text-xs tracking-[0.4em] uppercase mb-1"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Customer Profile</p>
              <h1 className="text-4xl font-light"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                {customer.first_name} {customer.last_name}
              </h1>
            </div>
          </div>
          <button onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase transition-all hover:opacity-80 flex-shrink-0"
            style={{ background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.2)', color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
            <FiTrash2 size={12} /> Delete
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 w-full">
          {[
            { label: 'Total Orders',  value: orders.length,                    icon: FiShoppingBag },
            { label: 'Total Spent',   value: `$${totalRevenue.toFixed(2)}`,    icon: FiPackage },
            { label: 'Member Since',  value: customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { month: 'short', year: 'numeric' }) : '—', icon: FiCalendar },
          ].map(({ label, value, icon: Icon }) => (
            <div key={label} className="p-5 text-center"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <div className="w-9 h-9 flex items-center justify-center mx-auto mb-3"
                style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
                <Icon size={15} style={{ color: '#c9a96e' }} />
              </div>
              <p className="text-xs tracking-widest uppercase mb-1"
                style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
              <p className="text-2xl font-light"
                style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>{value}</p>
            </div>
          ))}
        </div>

        {/* Customer Info */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="px-5 py-4 flex items-center gap-3"
            style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
            <div className="w-12 h-12 rounded-full flex items-center justify-center text-xl font-light flex-shrink-0"
              style={{ background: 'linear-gradient(135deg, #1a1208, #2a1e0e)', border: '2px solid rgba(201,169,110,0.4)', color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
              {customer.first_name?.[0]}{customer.last_name?.[0]}
            </div>
            <div>
              <h3 className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                {customer.first_name} {customer.last_name}
              </h3>
              <p className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                {customer.email}
              </p>
            </div>
          </div>
          <div className="p-5 space-y-2">
            {[
              { icon: FiMail, label: 'Email',       value: customer.email },
              { icon: FiUser, label: 'Customer ID', value: customer.id },
              { icon: FiCalendar, label: 'Joined',  value: customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }) : '—' },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex items-center gap-4 px-4 py-3"
                style={{ background: 'rgba(201,169,110,0.03)', border: '1px solid rgba(201,169,110,0.08)' }}>
                <div className="w-8 h-8 flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <Icon size={13} style={{ color: '#c9a96e' }} />
                </div>
                <div>
                  <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{label}</p>
                  <p className="text-xs tracking-wider mt-0.5" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>{value || '—'}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Order History */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="px-5 py-4 flex items-center justify-between"
            style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
            <div className="flex items-center gap-2">
              <FiPackage size={13} style={{ color: '#c9a96e' }} />
              <p className="text-xs tracking-widest uppercase"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Order History</p>
            </div>
            <span className="text-xs px-2 py-0.5"
              style={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
              {orders.length} orders
            </span>
          </div>

          {orders.length === 0 ? (
            <div className="p-10 text-center">
              <FiShoppingBag size={28} style={{ color: 'rgba(201,169,110,0.2)', margin: '0 auto 0.75rem' }} />
              <p className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No orders yet</p>
            </div>
          ) : (
            <div className="w-full">
              <div className="grid px-5 py-3 text-xs tracking-widest uppercase gap-4"
                style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: '1px solid rgba(201,169,110,0.08)', color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>
                <span>Order ID</span><span>Date</span><span>Items</span><span className="text-right">Total</span>
              </div>
              {orders.map((order, i) => (
                <div key={i} className="order-row grid px-5 py-3 gap-4"
                  style={{ gridTemplateColumns: '1fr 1fr 1fr 1fr', borderBottom: i < orders.length - 1 ? '1px solid rgba(201,169,110,0.06)' : 'none' }}
                  onClick={() => navigate(`/orders/${order.id}`)}>
                  <span className="text-xs tracking-wider" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    #{order.order_id}
                  </span>
                  <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    {order.date || new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}
                  </span>
                  <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    {order.items?.length || 0} items
                  </span>
                  <span className="text-sm font-light text-right" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                    ${order.total}
                  </span>
                </div>
              ))}
              <div className="px-5 py-3 flex justify-between w-full"
                style={{ borderTop: '1px solid rgba(201,169,110,0.1)', background: 'rgba(201,169,110,0.04)' }}>
                <span className="text-xs tracking-widest uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Total Spent</span>
                <span className="text-xl font-light" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>${totalRevenue.toFixed(2)}</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}