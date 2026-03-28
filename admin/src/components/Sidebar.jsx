import { Link, useLocation } from 'react-router-dom';
import {
  FiGrid, FiPackage, FiShoppingBag,
  FiCreditCard, FiTag, FiSettings, FiUsers
} from 'react-icons/fi';

const navItems = [
  { path: '/dashboard',  label: 'Dashboard',  icon: FiGrid },
  { path: '/products',   label: 'Products',   icon: FiPackage },
  { path: '/orders',     label: 'Orders',     icon: FiShoppingBag },
  { path: '/customers',  label: 'Customers',  icon: FiUsers },
  { path: '/payments',   label: 'Payments',   icon: FiCreditCard },
  { path: '/coupons',    label: 'Coupons',    icon: FiTag },
  { path: '/settings',   label: 'Settings',   icon: FiSettings },
];

export default function Sidebar() {
  const location = useLocation();

  return (
    <>
      <style>{`
        .sidebar-link {
          position: relative; overflow: hidden; transition: all 0.3s ease;
        }
        .sidebar-link::before {
          content: ''; position: absolute; left: 0; top: 0; bottom: 0;
          width: 0;
          background: linear-gradient(90deg, rgba(201,169,110,0.2), transparent);
          transition: width 0.3s ease;
        }
        .sidebar-link:hover::before { width: 100%; }
        .sidebar-link:hover { color: #c9a96e !important; transform: translateX(4px); }
        .sidebar-link.active::before {
          width: 100%;
          background: linear-gradient(90deg, rgba(201,169,110,0.15), transparent);
        }
        .sidebar-icon { transition: transform 0.3s ease; }
        .sidebar-link:hover .sidebar-icon { transform: scale(1.2); }
        .logo-glow { animation: logoGlow 3s ease-in-out infinite; }
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(201,169,110,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(201,169,110,0.7)); }
        }
        .gold-line {
          background: linear-gradient(90deg, transparent, #c9a96e, transparent);
          animation: shimmer 2s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; }
        }
        .nav-badge { animation: pulse 2s ease-in-out infinite; }
        @keyframes pulse {
          0%, 100% { transform: scale(1); } 50% { transform: scale(1.1); }
        }
      `}</style>

      <div className="w-64 h-screen flex flex-col"
        style={{
          background: 'linear-gradient(180deg, #0d0a07 0%, #0a0806 50%, #080604 100%)',
          borderRight: '1px solid rgba(201,169,110,0.15)',
          boxShadow: '4px 0 24px rgba(0,0,0,0.4)',
        }}>

        {/* Logo */}
        <div className="p-6 pb-5" style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>
          <div className="flex items-center gap-3 mb-3">
            <div className="w-8 h-8 flex items-center justify-center"
              style={{ background: 'linear-gradient(135deg, #c9a96e, #8b6914)', boxShadow: '0 0 12px rgba(201,169,110,0.4)' }}>
              <span style={{ color: '#0a0806', fontSize: '12px', fontWeight: 700 }}>V</span>
            </div>
            <div>
              <h1 className="font-light tracking-[0.3em] logo-glow"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e', fontSize: '1.4rem', lineHeight: 1 }}>
                VELVET
              </h1>
              <p className="text-xs tracking-[0.3em]"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '8px' }}>
                ADMIN PANEL
              </p>
            </div>
          </div>
          <div className="h-px gold-line" />
        </div>

        {/* Nav Links */}
        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {navItems.map(({ path, label, icon: Icon }, index) => {
            const active = location.pathname === path;
            return (
              <Link key={path} to={path}
                className={`sidebar-link flex items-center gap-3 px-4 py-3 rounded-sm ${active ? 'active' : ''}`}
                style={{
                  color: active ? '#c9a96e' : '#7a6e5f',
                  borderLeft: active ? '2px solid #c9a96e' : '2px solid transparent',
                  fontFamily: 'Montserrat, sans-serif',
                  fontSize: '11px',
                  letterSpacing: '0.1em',
                  textTransform: 'uppercase',
                  animationDelay: `${index * 0.05}s`,
                }}>
                <span className="sidebar-icon"><Icon size={15} /></span>
                <span>{label}</span>
                {active && (
                  <span className="ml-auto w-1.5 h-1.5 rounded-full nav-badge"
                    style={{ background: '#c9a96e', boxShadow: '0 0 6px #c9a96e' }} />
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom */}
        <div className="p-4" style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>
          <div className="flex items-center gap-3 mb-3 p-3 rounded-sm"
            style={{ background: 'rgba(201,169,110,0.05)', border: '1px solid rgba(201,169,110,0.1)' }}>
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-light"
              style={{ background: 'linear-gradient(135deg, #c9a96e, #8b6914)', color: '#0a0806', fontFamily: 'Cormorant Garamond, serif' }}>
              A
            </div>
            <div>
              <p className="text-xs tracking-wider" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>Admin</p>
              <p style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '10px' }}>Super Admin</p>
            </div>
            <div className="ml-auto w-2 h-2 rounded-full"
              style={{ background: '#4ade80', boxShadow: '0 0 6px #4ade80' }} />
          </div>
          <p className="text-xs text-center tracking-wider"
            style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>
            © 2026 Velvet Admin
          </p>
        </div>
      </div>
    </>
  );
}