import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useSelector } from 'react-redux';
import { useAuth } from '../context/AuthContext';
import { products } from '../data/products';

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ✅ Redux — Cart & Wishlist count
  const cartCount = useSelector(state => state.cart.totalQuantity);
  const wishlistCount = useSelector(state => 
    state.wishlist.items.filter(item => products.some(p => p.id === item.id)).length
  );

  const { user } = useAuth();
  const navigate = useNavigate();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Face', path: '/?category=Face' },
    { name: 'Eyes', path: '/?category=Eyes' },
    { name: 'Lips', path: '/?category=Lips' },
    { name: 'Skincare', path: '/?category=Skincare' },
    { name: 'Fragrance', path: '/?category=Fragrance' },
  ];

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/?search=${searchQuery}`);
      setSearchOpen(false);
      setSearchQuery('');
    }
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50"
      style={{ background: 'rgba(10,8,6,0.95)', backdropFilter: 'blur(12px)', borderBottom: '1px solid rgba(201,169,110,0.2)' }}>

      {/* Top announcement bar */}
      <div className="text-center py-2 text-xs tracking-widest"
        style={{ background: 'linear-gradient(90deg, #8b6914, #c9a96e, #8b6914)', color: '#0a0806' }}>
        FREE SHIPPING ON ORDERS OVER $100 ✦ USE CODE: VELVET20
      </div>

      <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

        {/* Left — Logo + Nav Links */}
        <div className="flex items-center gap-10">
          <Link to="/">
            <div className="text-center">
              <h1 className="font-light tracking-[0.4em]"
                style={{
                  fontFamily: 'Cormorant Garamond, serif',
                  fontSize: '1.8rem',
                  background: 'linear-gradient(135deg, #c9a96e, #f0d898, #c9a96e)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                  backgroundClip: 'text',
                  lineHeight: 1,
                  filter: 'drop-shadow(0 0 8px rgba(201,169,110,0.3))',
                }}>
                VELVET
              </h1>
              <p className="tracking-[0.6em]"
                style={{ color: '#f0d898', fontSize: '7px', marginTop: '2px' }}>
                LUXURY COSMETICS
              </p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(0, 3).map(link => (
              <Link key={link.name} to={link.path}
                className="text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-100"
                style={{ color: '#c9a96e', opacity: 0.7, fontFamily: 'Montserrat, sans-serif' }}>
                {link.name}
              </Link>
            ))}
          </div>
        </div>

        {/* Right — Nav Links + Icons */}
        <div className="flex items-center gap-8">
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.slice(3).map(link => (
              <Link key={link.name} to={link.path}
                className="text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-100"
                style={{ color: '#c9a96e', opacity: 0.7, fontFamily: 'Montserrat, sans-serif' }}>
                {link.name}
              </Link>
            ))}
          </div>

          <div className="flex items-center gap-4">

            {/* Search */}
            <button onClick={() => setSearchOpen(!searchOpen)}
              className="transition-all duration-300 hover:scale-110"
              style={{ color: '#c9a96e' }}>
              <FiSearch size={18} />
            </button>

            {/* ✅ Wishlist — Redux count */}
            <Link to="/wishlist"
              className="relative transition-all duration-300 hover:scale-110"
              style={{ color: '#c9a96e' }}>
              <FiHeart size={18} />
              {wishlistCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                  style={{ background: '#c9a96e', color: '#0a0806', fontSize: '10px' }}>
                  {wishlistCount}
                </span>
              )}
            </Link>

            {/* Account */}
            <Link to={user ? '/profile' : '/login'}
              className="transition-all duration-300 hover:scale-110 relative"
              style={{ color: '#c9a96e' }}>
              <FiUser size={18} />
              {user && (
                <span className="absolute -top-2 -right-2 w-2 h-2 rounded-full"
                  style={{ background: '#c9a96e' }} />
              )}
            </Link>

            {/* ✅ Cart — Redux count */}
            <Link to="/cart" className="relative transition-all duration-300 hover:scale-110"
              style={{ color: '#c9a96e' }}>
              <FiShoppingBag size={18} />
              {cartCount > 0 && (
                <span className="absolute -top-2 -right-2 text-xs rounded-full w-4 h-4 flex items-center justify-center font-medium"
                  style={{ background: '#c9a96e', color: '#0a0806', fontSize: '10px' }}>
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Mobile menu toggle */}
            <button className="lg:hidden transition-all duration-300"
              style={{ color: '#c9a96e' }}
              onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <FiX size={22} /> : <FiMenu size={22} />}
            </button>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      {searchOpen && (
        <div className="px-6 pb-4" style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}>
          <form onSubmit={handleSearch} className="max-w-xl mx-auto flex items-center gap-3">
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search for products..."
              autoFocus
              className="flex-1 bg-transparent border-b py-2 text-sm outline-none tracking-wider"
              style={{ borderColor: '#c9a96e', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}
            />
            <button type="submit" className="text-xs tracking-widest uppercase px-4 py-2"
              style={{ color: '#c9a96e' }}>
              Search
            </button>
          </form>
        </div>
      )}

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="lg:hidden px-6 pb-6"
          style={{ borderTop: '1px solid rgba(201,169,110,0.15)', background: 'rgba(10,8,6,0.98)' }}>
          <div className="flex flex-col gap-5 pt-5">
            {navLinks.map(link => (
              <Link key={link.name} to={link.path}
                onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                {link.name}
              </Link>
            ))}
            <div style={{ borderTop: '1px solid rgba(201,169,110,0.2)', paddingTop: '1rem' }}>
              <Link to="/wishlist" onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase block mb-3"
                style={{ color: '#e8d5b0' }}>
                Wishlist {wishlistCount > 0 && `(${wishlistCount})`}
              </Link>
              <Link to={user ? '/profile' : '/login'} onClick={() => setMenuOpen(false)}
                className="text-sm tracking-widest uppercase"
                style={{ color: '#e8d5b0' }}>
                {user ? `My Profile (${user.firstName})` : 'Login / Register'}
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}