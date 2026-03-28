import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiEye, FiEdit2, FiTrash2, FiX, FiCheck, FiCreditCard } from 'react-icons/fi';
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

function generateTracking() {
  return 'VLT' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

export default function Orders() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('All');
  const [editOrder, setEditOrder] = useState(null);
  const [editStatus, setEditStatus] = useState('');

  useEffect(() => { fetchOrders(); }, []);

  const fetchOrders = async () => {
    const { data: ordersData } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    if (!ordersData) { setLoading(false); return; }

    const userIds = [...new Set(ordersData.map(o => o.user_id))];
    const { data: profilesData } = await supabase.from('profiles').select('*').in('id', userIds);

    const merged = ordersData.map(order => ({
      ...order,
      profiles: profilesData?.find(p => p.id === order.user_id) || null,
      status: order.status || 'Confirmed',
      tracking: order.tracking || generateTracking(),
      payment_method: order.payment_method || 'Credit Card',
    }));

    setOrders(merged);
    setLoading(false);
  };

  const handleStatusUpdate = async () => {
    await supabase.from('orders').update({ status: editStatus }).eq('id', editOrder.id);
    setOrders(prev => prev.map(o => o.id === editOrder.id ? { ...o, status: editStatus } : o));
    setEditOrder(null);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this order?')) return;
    await supabase.from('orders').delete().eq('id', id);
    setOrders(prev => prev.filter(o => o.id !== id));
  };

  const filtered = orders.filter(o => {
    const matchSearch =
      o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
      o.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
      `${o.profiles?.first_name} ${o.profiles?.last_name}`.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'All' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  return (
    <>
      <style>{`
        .order-row { transition: all 0.2s ease; cursor: pointer; }
        .order-row:hover { background: rgba(201,169,110,0.04) !important; }
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .modal-bg { animation: fadeIn 0.3s ease; }
        @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
        .modal-card { animation: slideUp 0.3s cubic-bezier(0.175,0.885,0.32,1.275); }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) scale(0.98); } to { opacity: 1; transform: translateY(0) scale(1); } }
      `}</style>

      <div className="space-y-6">

        {/* Header */}
        <div className="fade-in flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Manage</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Orders</h1>
          </div>
          <div className="hidden lg:flex gap-2">
            {['Pending', 'Shipped', 'Delivered'].map(s => {
              const col = STATUS_COLORS[s];
              return (
                <div key={s} className="px-3 py-2 text-center" style={{ background: col.bg, border: `1px solid ${col.border}` }}>
                  <p style={{ color: col.color, fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em' }}>{s}</p>
                  <p className="text-lg font-light" style={{ color: col.color, fontFamily: 'Cormorant Garamond, serif' }}>
                    {orders.filter(o => o.status === s).length}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Filters */}
        <div className="fade-in flex flex-wrap gap-3 items-center">
          <div className="relative">
            <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }} />
            <input type="text" value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search orders..."
              className="bg-transparent border pl-9 pr-4 py-2.5 text-sm outline-none tracking-wider"
              style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif', width: '240px' }} />
          </div>
          <div className="flex gap-2 flex-wrap">
            {['All', ...STATUS_OPTIONS].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)}
                className="px-3 py-1.5 text-xs tracking-wider uppercase transition-all duration-200"
                style={{
                  fontFamily: 'Montserrat, sans-serif',
                  background: filterStatus === s ? '#c9a96e' : 'transparent',
                  color: filterStatus === s ? '#0a0806' : '#7a6e5f',
                  border: `1px solid ${filterStatus === s ? '#c9a96e' : 'rgba(201,169,110,0.2)'}`,
                  fontWeight: filterStatus === s ? 600 : 400,
                }}>
                {s}
              </button>
            ))}
          </div>
        </div>

        {/* Table */}
        <div className="fade-in" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                  {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                    <th key={h} className="px-5 py-4 text-left text-xs tracking-widest uppercase"
                      style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} className="px-6 py-12 text-center text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No orders found.</td></tr>
                ) : filtered.map(order => {
                  const col = STATUS_COLORS[order.status] || STATUS_COLORS.Confirmed;
                  return (
                    <tr key={order.id} className="order-row"
                      style={{ borderBottom: '1px solid rgba(201,169,110,0.06)' }}
                      onClick={() => navigate(`/orders/${order.id}`)}>
                      <td className="px-5 py-4">
                        <span className="text-xs tracking-wider font-medium" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                          #{order.order_id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                          {order.profiles?.first_name} {order.profiles?.last_name}
                        </p>
                        <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '11px' }}>{order.profiles?.email}</p>
                      </td>
                      <td className="px-5 py-4 text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{order.date}</td>
                      <td className="px-5 py-4">
                        <span className="text-base font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>${order.total}</span>
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-1.5">
                          <FiCreditCard size={11} style={{ color: '#7a6e5f' }} />
                          <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{order.payment_method}</span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 text-xs tracking-wider"
                          style={{ background: col.bg, color: col.color, border: `1px solid ${col.border}`, fontFamily: 'Montserrat, sans-serif' }}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center gap-2">
                          <button onClick={() => navigate(`/orders/${order.id}`)}
                            className="w-7 h-7 flex items-center justify-center transition-all hover:scale-110"
                            style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                            <FiEye size={12} />
                          </button>
                          <button onClick={() => { setEditOrder(order); setEditStatus(order.status); }}
                            className="w-7 h-7 flex items-center justify-center transition-all hover:scale-110"
                            style={{ color: '#a78bfa', background: 'rgba(167,139,250,0.08)', border: '1px solid rgba(167,139,250,0.2)' }}>
                            <FiEdit2 size={12} />
                          </button>
                          <button onClick={e => handleDelete(e, order.id)}
                            className="w-7 h-7 flex items-center justify-center transition-all hover:scale-110"
                            style={{ color: '#e8a09a', background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.2)' }}>
                            <FiTrash2 size={12} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Status Modal */}
      {editOrder && (
        <div className="modal-bg fixed inset-0 z-50 flex items-center justify-center px-4"
          style={{ background: 'rgba(0,0,0,0.85)' }}
          onClick={() => setEditOrder(null)}>
          <div className="modal-card w-full max-w-sm p-6"
            style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.25)' }}
            onClick={e => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Update Status</h3>
              <button onClick={() => setEditOrder(null)} style={{ color: '#7a6e5f' }}><FiX size={18} /></button>
            </div>
            <p className="text-xs tracking-wider mb-4" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Order #{editOrder.order_id}</p>
            <div className="space-y-2 mb-6">
              {STATUS_OPTIONS.map(s => {
                const col = STATUS_COLORS[s];
                return (
                  <button key={s} onClick={() => setEditStatus(s)}
                    className="w-full px-4 py-3 text-left text-xs tracking-widest uppercase flex items-center gap-3"
                    style={{
                      fontFamily: 'Montserrat, sans-serif',
                      background: editStatus === s ? col.bg : 'transparent',
                      color: editStatus === s ? col.color : '#7a6e5f',
                      border: `1px solid ${editStatus === s ? col.border : 'rgba(201,169,110,0.1)'}`,
                    }}>
                    <span className="w-2 h-2 rounded-full" style={{ background: col.color }} />
                    {s}
                    {editStatus === s && <FiCheck size={12} className="ml-auto" />}
                  </button>
                );
              })}
            </div>
            <div className="flex gap-3">
              <button onClick={handleStatusUpdate}
                className="flex-1 py-3 text-xs tracking-widest uppercase hover:opacity-80"
                style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                Update
              </button>
              <button onClick={() => setEditOrder(null)}
                className="flex-1 py-3 text-xs tracking-widest uppercase border hover:opacity-70"
                style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}