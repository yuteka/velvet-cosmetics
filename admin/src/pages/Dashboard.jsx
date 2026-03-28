import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiShoppingBag, FiUsers, FiCreditCard, FiPackage,
  FiTrendingUp, FiArrowUp, FiX, FiEdit2, FiTrash2,
  FiCheck, FiMapPin, FiPhone, FiMail, FiRefreshCw
} from 'react-icons/fi';
import { supabase } from '../lib/supabase';

function useCountUp(target, duration = 1500) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!target) return;
    const isFloat = String(target).includes('.');
    const numTarget = parseFloat(target);
    let start = 0;
    const step = numTarget / (duration / 16);
    const timer = setInterval(() => {
      start += step;
      if (start >= numTarget) { setCount(numTarget); clearInterval(timer); }
      else setCount(isFloat ? parseFloat(start.toFixed(2)) : Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return count;
}

function StatCard({ label, value, icon: Icon, index, prefix = '' }) {
  const numericValue = parseFloat(String(value).replace('$', '')) || 0;
  const count = useCountUp(numericValue);
  const [hovered, setHovered] = useState(false);
  const displayValue = prefix === '$'
    ? `$${count.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
    : count.toLocaleString();

  return (
    <div className="stat-card p-6 relative overflow-hidden cursor-pointer"
      style={{
        background: hovered ? 'linear-gradient(135deg, #1a1208, #111009)' : '#111009',
        border: `1px solid ${hovered ? 'rgba(201,169,110,0.4)' : 'rgba(201,169,110,0.15)'}`,
        transition: 'all 0.3s ease',
        transform: hovered ? 'translateY(-4px)' : 'translateY(0)',
        boxShadow: hovered ? '0 12px 32px rgba(0,0,0,0.4)' : 'none',
        animationDelay: `${index * 0.1}s`,
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}>
      <div className="absolute inset-0 pointer-events-none"
        style={{ background: hovered ? 'radial-gradient(circle at top right, rgba(201,169,110,0.08), transparent 60%)' : 'transparent', transition: 'all 0.3s ease' }} />
      <div className="flex items-center justify-between mb-4 relative">
        <p className="text-xs tracking-widest uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
        <div className="w-11 h-11 flex items-center justify-center"
          style={{ background: hovered ? 'rgba(201,169,110,0.2)' : 'rgba(201,169,110,0.08)', border: `1px solid ${hovered ? 'rgba(201,169,110,0.5)' : 'rgba(201,169,110,0.2)'}`, transition: 'all 0.3s ease', transform: hovered ? 'scale(1.15)' : 'scale(1)' }}>
          <Icon size={18} style={{ color: '#c9a96e' }} />
        </div>
      </div>
      <p className="text-4xl font-light relative"
        style={{ fontFamily: 'Cormorant Garamond, serif', color: hovered ? '#c9a96e' : '#faf8f4', transition: 'color 0.3s ease' }}>
        {displayValue}
      </p>
      <div className="absolute bottom-0 left-0 h-0.5"
        style={{ width: hovered ? '100%' : '0%', background: 'linear-gradient(90deg, #c9a96e, transparent)', transition: 'width 0.4s ease' }} />
      <div className="flex items-center gap-1 mt-3">
        <FiArrowUp size={10} style={{ color: '#4ade80' }} />
        <span style={{ color: '#4ade80', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>+12% this month</span>
      </div>
    </div>
  );
}

const STATUS_OPTIONS = ['Processing', 'Confirmed', 'Shipped', 'Delivered', 'Cancelled'];
const STATUS_COLORS = {
  Processing: { bg: 'rgba(201,169,110,0.1)',  color: '#c9a96e',  border: 'rgba(201,169,110,0.3)' },
  Confirmed:  { bg: 'rgba(74,222,128,0.1)',   color: '#4ade80',  border: 'rgba(74,222,128,0.3)' },
  Shipped:    { bg: 'rgba(96,165,250,0.1)',   color: '#60a5fa',  border: 'rgba(96,165,250,0.3)' },
  Delivered:  { bg: 'rgba(74,222,128,0.15)',  color: '#4ade80',  border: 'rgba(74,222,128,0.4)' },
  Cancelled:  { bg: 'rgba(232,160,154,0.1)',  color: '#e8a09a',  border: 'rgba(232,160,154,0.3)' },
};

export default function Dashboard() {
  const navigate = useNavigate(); // ✅ added
  const [stats, setStats] = useState({ totalOrders: 0, totalRevenue: 0, totalUsers: 0, totalProducts: 0 });
  const [recentOrders, setRecentOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  useEffect(() => { fetchStats(); }, []);

  const fetchStats = async () => {
    setLoading(true);
    const { data: orders } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
    const { count: userCount } = await supabase.from('profiles').select('*', { count: 'exact', head: true });
    const { count: productCount } = await supabase.from('products').select('*', { count: 'exact', head: true });
    const totalRevenue = orders?.reduce((sum, o) => sum + parseFloat(o.total || 0), 0) || 0;
    setStats({ totalOrders: orders?.length || 0, totalRevenue: totalRevenue.toFixed(2), totalUsers: userCount || 0, totalProducts: productCount || 0 });
    setRecentOrders(orders?.slice(0, 10) || []);
    setLoading(false);
  };

  const handleStatusSave = async (id) => {
    setSaving(true);
    await supabase.from('orders').update({ status: editStatus }).eq('id', id);
    setRecentOrders(prev => prev.map(o => o.id === id ? { ...o, status: editStatus } : o));
    setEditingId(null);
    setSaving(false);
  };

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this order?')) return;
    setDeletingId(id);
    await supabase.from('orders').delete().eq('id', id);
    setRecentOrders(prev => prev.filter(o => o.id !== id));
    setDeletingId(null);
  };

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="flex flex-col items-center gap-4">
        <div className="w-10 h-10 border-2 rounded-full animate-spin"
          style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
        <p className="text-xs tracking-widest uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Loading...</p>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        .stat-card { animation: fadeInUp 0.5s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .order-row { transition: all 0.2s ease; cursor: pointer; }
        .order-row:hover { background: rgba(201,169,110,0.05) !important; }
        .section-enter { animation: fadeInUp 0.6s ease both; }
        .gold-badge { animation: goldShimmer 2s ease-in-out infinite; }
        @keyframes goldShimmer { 0%, 100% { opacity: 0.8; } 50% { opacity: 1; } }
        .revenue-bar { animation: growBar 1.5s ease both; }
        @keyframes growBar { from { width: 0%; } }
        .deleting { animation: fadeOut 0.3s ease forwards; }
        @keyframes fadeOut { to { opacity: 0; transform: scale(0.97); } }
      `}</style>

      <div className="space-y-8">

        {/* Header */}
        <div className="section-enter flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Overview</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Dashboard</h1>
          </div>
          <div className="flex items-center gap-3">
            <button onClick={fetchStats}
              className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:opacity-70"
              style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', color: '#7a6e5f' }}>
              <FiRefreshCw size={13} />
            </button>
            <div className="flex items-center gap-2 px-4 py-2"
              style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
              <div className="w-2 h-2 rounded-full gold-badge" style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
              <span className="text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Live Data</span>
            </div>
          </div>
        </div>

        {/* Stat Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <StatCard label="Total Orders" value={stats.totalOrders} icon={FiShoppingBag} index={0} />
          <StatCard label="Total Revenue" value={stats.totalRevenue} icon={FiCreditCard} index={1} prefix="$" />
          <StatCard label="Total Users" value={stats.totalUsers} icon={FiUsers} index={2} />
          <StatCard label="Total Products" value={stats.totalProducts} icon={FiPackage} index={3} />
        </div>

        {/* Revenue Breakdown */}
        <div className="section-enter p-6" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="flex items-center justify-between mb-6">
            <div>
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Revenue Breakdown</p>
              <h3 className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Order Summary</h3>
            </div>
            <FiTrendingUp size={20} style={{ color: '#c9a96e' }} />
          </div>
          <div className="space-y-4">
            {[{ label: 'Lips', percent: 35 }, { label: 'Face', percent: 28 }, { label: 'Skincare', percent: 20 }, { label: 'Eyes', percent: 12 }, { label: 'Fragrance', percent: 5 }].map((item, i) => (
              <div key={item.label} className="flex items-center gap-4">
                <span className="text-xs tracking-wider w-20 text-right" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{item.label}</span>
                <div className="flex-1 h-1.5 rounded-full" style={{ background: 'rgba(201,169,110,0.1)' }}>
                  <div className="revenue-bar h-full rounded-full" style={{ width: `${item.percent}%`, background: 'linear-gradient(90deg, #8b6914, #c9a96e)', animationDelay: `${i * 0.1}s` }} />
                </div>
                <span className="text-xs w-8" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>{item.percent}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Orders */}
        <div className="section-enter" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <div className="px-6 py-4 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
            <h2 className="text-xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Recent Orders</h2>
            <span className="text-xs px-3 py-1 tracking-wider"
              style={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
              {recentOrders.length} orders
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="p-12 text-center">
              <FiShoppingBag size={32} style={{ color: 'rgba(201,169,110,0.2)', margin: '0 auto 1rem' }} />
              <p className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No orders yet.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.08)' }}>
                    {['Order ID', 'Customer', 'Date', 'Total', 'Payment', 'Status', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs tracking-widest uppercase"
                        style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {recentOrders.map((order) => {
                    const sc = STATUS_COLORS[order.status] || STATUS_COLORS.Processing;
                    return (
                      <tr key={order.id}
                        className={`order-row ${deletingId === order.id ? 'deleting' : ''}`}
                        style={{ borderBottom: '1px solid rgba(201,169,110,0.06)' }}
                        onClick={() => navigate(`/orders/${order.id}`)}>  {/* ✅ navigate to detail page */}

                        <td className="px-5 py-4">
                          <span className="text-xs tracking-wider font-medium" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                            #{order.order_id}
                          </span>
                        </td>

                        <td className="px-5 py-4">
                          <div>
                            <p className="text-xs tracking-wider" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>{order.shipping_name || '—'}</p>
                            <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>{order.shipping_city}{order.shipping_country ? `, ${order.shipping_country}` : ''}</p>
                          </div>
                        </td>

                        <td className="px-5 py-4 text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')}
                        </td>

                        <td className="px-5 py-4">
                          <span className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>${order.total}</span>
                        </td>

                        <td className="px-5 py-4 text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {order.payment_method || '—'}
                        </td>

                        {/* Status inline edit */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          {editingId === order.id ? (
                            <div className="flex items-center gap-2">
                              <select value={editStatus} onChange={e => setEditStatus(e.target.value)}
                                className="text-xs px-2 py-1 outline-none"
                                style={{ background: '#0d0a07', border: '1px solid rgba(201,169,110,0.4)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                                {STATUS_OPTIONS.map(s => <option key={s} value={s} style={{ background: '#0d0a07' }}>{s}</option>)}
                              </select>
                              <button onClick={() => handleStatusSave(order.id)} disabled={saving}
                                className="w-6 h-6 flex items-center justify-center"
                                style={{ background: 'rgba(74,222,128,0.15)', border: '1px solid rgba(74,222,128,0.3)', color: '#4ade80' }}>
                                <FiCheck size={10} />
                              </button>
                              <button onClick={() => setEditingId(null)}
                                className="w-6 h-6 flex items-center justify-center"
                                style={{ background: 'rgba(232,160,154,0.1)', border: '1px solid rgba(232,160,154,0.2)', color: '#e8a09a' }}>
                                <FiX size={10} />
                              </button>
                            </div>
                          ) : (
                            <span className="px-2 py-1 text-xs tracking-wider cursor-pointer"
                              style={{ background: sc.bg, color: sc.color, border: `1px solid ${sc.border}`, fontFamily: 'Montserrat, sans-serif' }}
                              onClick={() => { setEditingId(order.id); setEditStatus(order.status || 'Processing'); }}>
                              {order.status || 'Processing'}
                            </span>
                          )}
                        </td>

                        {/* Actions */}
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/orders/${order.id}`)}
                              className="w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                              style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                              <FiEdit2 size={11} />
                            </button>
                            <button onClick={e => handleDelete(e, order.id)}
                              className="w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                              style={{ color: '#e8a09a', background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.2)' }}>
                              <FiTrash2 size={11} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}