import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiSearch, FiTrash2, FiEye, FiUser } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

export default function Customers() {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => { fetchCustomers(); }, []);

  const fetchCustomers = async () => {
    const { data: profiles } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
    const { data: ordersData } = await supabase.from('orders').select('*');
    setCustomers(profiles || []);
    setOrders(ordersData || []);
    setLoading(false);
  };

  const getCustomerOrders = (userId) => orders.filter(o => o.user_id === userId);
  const getCustomerRevenue = (userId) => getCustomerOrders(userId).reduce((sum, o) => sum + parseFloat(o.total || 0), 0).toFixed(2);

  const handleDelete = async (e, id) => {
    e.stopPropagation();
    if (!confirm('Delete this customer?')) return;
    await supabase.from('profiles').delete().eq('id', id);
    setCustomers(prev => prev.filter(c => c.id !== id));
  };

  const filtered = customers.filter(c =>
    `${c.first_name} ${c.last_name}`.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase())
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
        .customer-row { transition: all 0.2s ease; cursor: pointer; }
        .customer-row:hover { background: rgba(201,169,110,0.04) !important; }
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
      `}</style>

      <div className="space-y-6">

        {/* Header */}
        <div className="fade-in flex items-center justify-between">
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-1" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Manage</p>
            <h1 className="text-4xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Customers</h1>
          </div>
          <div className="hidden md:flex gap-4">
            {[
              { label: 'Total', value: customers.length },
              { label: 'Orders', value: orders.length },
              { label: 'Revenue', value: `$${orders.reduce((s, o) => s + parseFloat(o.total || 0), 0).toFixed(0)}` },
            ].map(s => (
              <div key={s.label} className="px-4 py-3 text-center"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '10px', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{s.label}</p>
                <p className="text-2xl font-light mt-1" style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>{s.value}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Search */}
        <div className="fade-in relative max-w-sm">
          <FiSearch size={14} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }} />
          <input type="text" value={search} onChange={e => setSearch(e.target.value)}
            placeholder="Search by name or email..."
            className="w-full bg-transparent border pl-9 pr-4 py-2.5 text-sm outline-none tracking-wider"
            style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }} />
        </div>

        {/* Table */}
        <div className="fade-in" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          {filtered.length === 0 ? (
            <div className="p-12 text-center">
              <FiUser size={32} style={{ color: 'rgba(201,169,110,0.2)', margin: '0 auto 1rem' }} />
              <p className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>No customers found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                    {['Customer', 'Email', 'Orders', 'Total Spent', 'Joined', 'Actions'].map(h => (
                      <th key={h} className="px-5 py-4 text-left text-xs tracking-widest uppercase"
                        style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((customer) => {
                    const custOrders = getCustomerOrders(customer.id);
                    const revenue = getCustomerRevenue(customer.id);
                    return (
                      <tr key={customer.id} className="customer-row"
                        style={{ borderBottom: '1px solid rgba(201,169,110,0.06)' }}
                        onClick={() => navigate(`/customers/${customer.id}`)}>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-sm font-light flex-shrink-0"
                              style={{ background: 'linear-gradient(135deg, #1a1208, #2a1e0e)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                              {customer.first_name?.[0]}{customer.last_name?.[0]}
                            </div>
                            <div>
                              <p className="text-sm font-light" style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif' }}>
                                {customer.first_name} {customer.last_name}
                              </p>
                              <p style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>
                                ID: {customer.id?.substr(0, 8)}...
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {customer.email}
                        </td>
                        <td className="px-5 py-4">
                          <span className="px-2 py-1 text-xs tracking-wider"
                            style={{ background: custOrders.length > 0 ? 'rgba(201,169,110,0.1)' : 'transparent', color: custOrders.length > 0 ? '#c9a96e' : '#4a3f30', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
                            {custOrders.length}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-base font-light" style={{ color: parseFloat(revenue) > 0 ? '#faf8f4' : '#4a3f30', fontFamily: 'Cormorant Garamond, serif' }}>
                            ${revenue}
                          </span>
                        </td>
                        <td className="px-5 py-4 text-xs tracking-wider" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {customer.created_at ? new Date(customer.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }) : '—'}
                        </td>
                        <td className="px-5 py-4" onClick={e => e.stopPropagation()}>
                          <div className="flex items-center gap-2">
                            <button onClick={() => navigate(`/customers/${customer.id}`)}
                              className="w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
                              style={{ color: '#c9a96e', background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.2)' }}>
                              <FiEye size={12} />
                            </button>
                            <button onClick={e => handleDelete(e, customer.id)}
                              className="w-7 h-7 flex items-center justify-center transition-all duration-200 hover:scale-110"
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
          )}
        </div>
      </div>
    </>
  );
}