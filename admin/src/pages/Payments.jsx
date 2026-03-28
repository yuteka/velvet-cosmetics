import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiDollarSign, FiTrendingUp, FiCalendar } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function Payments() {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchPayments(); }, []);

  const fetchPayments = async () => {
    const { data: ordersData } = await supabase
      .from('orders').select('*').order('created_at', { ascending: false });
    if (!ordersData) { setLoading(false); return; }

    const userIds = [...new Set(ordersData.map(o => o.user_id))];
    const { data: profilesData } = await supabase
      .from('profiles').select('*').in('id', userIds);

    const merged = ordersData.map(order => ({
      ...order,
      profiles: profilesData?.find(p => p.id === order.user_id) || null,
    }));
    setOrders(merged);
    setLoading(false);
  };

  // ✅ This month calculation
  const now = new Date();
  const thisMonthOrders = orders.filter(o => {
    const d = new Date(o.created_at);
    return d.getMonth() === now.getMonth() && d.getFullYear() === now.getFullYear();
  });
  const thisMonthRevenue = thisMonthOrders.reduce((s, o) => s + parseFloat(o.total || 0), 0);
  const totalRevenue = orders.reduce((s, o) => s + parseFloat(o.total || 0), 0);

  const filtered = orders.filter(o =>
    o.order_id?.toLowerCase().includes(search.toLowerCase()) ||
    o.profiles?.email?.toLowerCase().includes(search.toLowerCase()) ||
    `${o.profiles?.first_name} ${o.profiles?.last_name}`.toLowerCase().includes(search.toLowerCase())
  );

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-2 rounded-full animate-spin"
        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
    </div>
  );

  return (
    <>
      <style>{`
        .pay-row { transition: all 0.2s ease; cursor: pointer; }
        .pay-row:hover { background: rgba(201,169,110,0.05) !important; }
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .stat-card { transition: all 0.3s ease; }
        .stat-card:hover { transform: translateY(-2px); border-color: rgba(201,169,110,0.3) !important; }
      `}</style>

      <div className="fade-in space-y-6">

        {/* Header */}
        <div>
          <p className="text-xs tracking-[0.4em] uppercase mb-1"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Manage</p>
          <h1 className="text-4xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Payments</h1>
        </div>

        {/* Stats — 4 cards including This Month */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Revenue',     value: `$${totalRevenue.toFixed(2)}`,                                          icon: FiDollarSign,  dot: '#c9a96e' },
            { label: 'This Month',        value: `$${thisMonthRevenue.toFixed(2)}`,                                      icon: FiCalendar,    dot: '#4ade80' },
            { label: 'Transactions',      value: orders.length,                                                           icon: FiTrendingUp,  dot: '#c9a96e' },
            { label: 'Avg Order Value',   value: orders.length > 0 ? `$${(totalRevenue / orders.length).toFixed(2)}` : '$0', icon: FiDollarSign, dot: '#c9a96e' },
          ].map(({ label, value, icon: Icon, dot }) => (
            <div key={label} className="stat-card p-5"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.12)' }}>
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: dot, boxShadow: `0 0 6px ${dot}` }} />
                <p className="text-xs tracking-widest uppercase"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>{label}</p>
              </div>
              <div className="flex items-center justify-between">
                <p className="text-2xl font-light"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>{value}</p>
                <div className="w-9 h-9 flex items-center justify-center"
                  style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <Icon size={16} style={{ color: '#c9a96e' }} />
                </div>
              </div>
              {label === 'This Month' && (
                <p className="text-xs mt-2 tracking-wider"
                  style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>
                  {thisMonthOrders.length} orders •{' '}
                  {now.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}
                </p>
              )}
            </div>
          ))}
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <FiSearch size={13} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by order ID, name, email..."
            className="w-full bg-transparent border pl-9 pr-4 py-2.5 text-sm outline-none tracking-wider"
            style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }} />
        </div>

        {/* Table */}
        <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <p className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No payments found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                    {['Order ID', 'Customer', 'Email', 'Date', 'Amount', 'Status'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs tracking-widest uppercase"
                        style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order, i) => (
                    <tr key={i} className="pay-row"
                      style={{ borderBottom: '1px solid rgba(201,169,110,0.06)' }}
                      onClick={() => navigate(`/payments/${order.id}`)}>
                      <td className="px-5 py-4">
                        <span className="text-xs tracking-wider font-medium"
                          style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                          #{order.order_id}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                          {order.profiles?.first_name} {order.profiles?.last_name}
                        </p>
                      </td>
                      <td className="px-5 py-4 text-xs tracking-wider"
                        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        {order.profiles?.email}
                      </td>
                      <td className="px-5 py-4 text-xs tracking-wider"
                        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        {order.date || (order.created_at ? new Date(order.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—')}
                      </td>
                      <td className="px-5 py-4">
                        <span className="text-base font-light"
                          style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                          ${order.total}
                        </span>
                      </td>
                      <td className="px-5 py-4">
                        <span className="px-3 py-1 text-xs tracking-wider"
                          style={{ background: 'rgba(74,222,128,0.08)', color: '#4ade80', border: '1px solid rgba(74,222,128,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
                          Paid
                        </span>
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