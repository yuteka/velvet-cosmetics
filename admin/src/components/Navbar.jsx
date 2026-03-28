import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { FiBell, FiLogOut } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

const pageTitles = {
  '/dashboard': 'Dashboard',
  '/products': 'Products',
  '/orders': 'Orders',
  '/payments': 'Payments',
  '/coupons': 'Coupons',
  '/customers': 'Customers',
  '/images': 'Image Library',
  '/settings': 'Settings',
};

export default function Navbar() {
  const location = useLocation();
  const { user, signOut } = useAuth();
  const [time, setTime] = useState(new Date());
  const [showNotif, setShowNotif] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const pageTitle = pageTitles[location.pathname] || 'Dashboard';

  const notifications = [
    { text: 'New order placed', sub: '#VLT4ZQBAH5AQ', time: '2m ago' },
    { text: 'New user registered', sub: 'hello@example.com', time: '15m ago' },
    { text: 'Payment received', sub: '$74.99', time: '1h ago' },
  ];

  return (
    <>
      <style>{`
        .navbar-wrapper {
          background: linear-gradient(90deg, #0d0a07, #0a0806);
          border-bottom: 1px solid rgba(201,169,110,0.12);
          position: relative;
          overflow: visible;
        }
        .navbar-shimmer {
          position: absolute; bottom: 0; left: 0; right: 0; height: 1px;
          background: linear-gradient(90deg, transparent, rgba(201,169,110,0.4), transparent);
          animation: navShimmer 3s ease-in-out infinite;
          pointer-events: none;
        }
        @keyframes navShimmer {
          0% { opacity: 0.3; transform: scaleX(0.5); }
          50% { opacity: 1; transform: scaleX(1); }
          100% { opacity: 0.3; transform: scaleX(0.5); }
        }
        .page-title { animation: slideInLeft 0.4s ease; }
        @keyframes slideInLeft { from { opacity: 0; transform: translateX(-10px); } to { opacity: 1; transform: translateX(0); } }
        .notif-btn { position: relative; transition: all 0.3s ease; }
        .notif-btn:hover { transform: scale(1.1); }
        .notif-badge { animation: badgePulse 1.5s ease-in-out infinite; }
        @keyframes badgePulse {
          0%, 100% { transform: scale(1); box-shadow: 0 0 0 0 rgba(201,169,110,0.4); }
          50% { transform: scale(1.1); box-shadow: 0 0 0 4px rgba(201,169,110,0); }
        }
        .notif-dropdown { animation: dropDown 0.3s ease; transform-origin: top right; }
        @keyframes dropDown { from { opacity: 0; transform: scale(0.95) translateY(-10px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        .notif-item { transition: all 0.2s ease; }
        .notif-item:hover { background: rgba(201,169,110,0.08); padding-left: 20px; }
        .logout-btn { transition: all 0.2s ease; }
        .logout-btn:hover { background: rgba(232,160,154,0.1) !important; border-color: rgba(232,160,154,0.3) !important; color: #e8a09a !important; }
      `}</style>

      <div className="navbar-wrapper px-6 py-4 flex items-center justify-between z-20">
        <div className="navbar-shimmer" />

        {/* Left — Page Title */}
        <div className="page-title" key={location.pathname}>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: '#c9a96e', display: 'inline-block' }} />
            <p className="text-xs tracking-[0.4em] uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Velvet Cosmetics</p>
          </div>
          <h2 className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', lineHeight: 1 }}>
            {pageTitle}
          </h2>
        </div>

        {/* Right */}
        <div className="flex items-center gap-5">

          {/* Live Clock */}
          <div className="hidden md:flex flex-col items-end">
            <p className="text-xs font-medium tracking-wider"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif', fontVariantNumeric: 'tabular-nums' }}>
              {time.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
            </p>
            <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>
              {time.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })}
            </p>
          </div>

          <div className="hidden md:block w-px h-8" style={{ background: 'rgba(201,169,110,0.15)' }} />

          {/* Notification Bell */}
          <div className="relative" style={{ zIndex: 9999 }}>
            <button
              className="notif-btn w-9 h-9 flex items-center justify-center rounded-sm"
              style={{ background: showNotif ? 'rgba(201,169,110,0.15)' : 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.2)', color: '#c9a96e' }}
              onClick={() => setShowNotif(!showNotif)}>
              <FiBell size={16} />
              <span className="notif-badge absolute -top-1 -right-1 w-4 h-4 rounded-full flex items-center justify-center"
                style={{ background: '#c9a96e', color: '#0a0806', fontSize: '9px', fontWeight: 700 }}>
                3
              </span>
            </button>

            {showNotif && (
              <>
                <div className="fixed inset-0" style={{ zIndex: 9998 }} onClick={() => setShowNotif(false)} />
                <div className="notif-dropdown absolute right-0 mt-2 w-72"
                  style={{ zIndex: 9999, background: '#111009', border: '1px solid rgba(201,169,110,0.2)', boxShadow: '0 20px 40px rgba(0,0,0,0.6)' }}>
                  <div className="px-4 py-3 flex items-center justify-between" style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
                    <p className="text-xs tracking-widest uppercase" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Notifications</p>
                    <span className="text-xs px-2 py-0.5" style={{ background: 'rgba(201,169,110,0.15)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>3 New</span>
                  </div>
                  {notifications.map((n, i) => (
                    <div key={i} className="notif-item px-4 py-3 cursor-pointer" style={{ borderBottom: '1px solid rgba(201,169,110,0.06)' }}>
                      <div className="flex items-start gap-3">
                        <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0" style={{ background: '#c9a96e', boxShadow: '0 0 6px rgba(201,169,110,0.5)' }} />
                        <div className="flex-1">
                          <p className="text-xs mb-0.5" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>{n.text}</p>
                          <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '11px' }}>{n.sub}</p>
                        </div>
                        <span style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>{n.time}</span>
                      </div>
                    </div>
                  ))}
                  <div className="px-4 py-3 text-center">
                    <button onClick={() => setShowNotif(false)} className="text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-70" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                      View All
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>

          {/* Admin Profile + Logout */}
          <div className="flex items-center gap-3 px-3 py-2 rounded-sm"
            style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm font-light"
              style={{ background: 'linear-gradient(135deg, #c9a96e, #8b6914)', color: '#0a0806', fontFamily: 'Cormorant Garamond, serif' }}>
              A
            </div>
            <div className="hidden md:block">
              <p className="text-xs font-medium" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>Admin</p>
              <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>
                {user?.email?.split('@')[0] || 'Super Admin'}
              </p>
            </div>
            <div className="w-2 h-2 rounded-full" style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          </div>

          {/* Logout Button */}
          <button
            onClick={signOut}
            className="logout-btn w-9 h-9 flex items-center justify-center rounded-sm"
            style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.15)', color: '#7a6e5f' }}
            title="Sign Out">
            <FiLogOut size={15} />
          </button>

        </div>
      </div>
    </>
  );
}