import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiShoppingBag, FiHeart, FiUser, FiMenu, FiX, FiSearch } from 'react-icons/fi';
import { useCart } from '../context/CartContext';

export default function Navbar() {
     const [menuOpen, setMenuOpen] = useState(false);
     const [searchOpen, setSearchOpen] = useState(false);
     const [searchQuery, setSearchQuery] = useState('');
     const { cartCount } = useCart();
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

                    {/* Left — Nav Links (desktop) */}
                    <div className="hidden lg:flex items-center gap-8">
                         {navLinks.slice(0, 3).map(link => (
                              <Link key={link.name} to={link.path}
                                   className="text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-100"
                                   style={{ color: '#c9a96e', opacity: 0.7, fontFamily: 'Montserrat, sans-serif' }}>
                                   {link.name}
                              </Link>
                         ))}
                    </div>

                    {/* Center — Logo */}
                    <Link to="/" className="absolute left-1/2 transform -translate-x-1/2 hidden lg:block">
                    </Link>

                    {/* Mobile Logo */}
                    <Link to="/" className="lg:hidden">
                         <div className="text-center">
                              <h1 className="text-3xl font-light tracking-[0.3em]"
                                   style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e', lineHeight: 1 }}>
                                   VELVET
                              </h1>
                              <p className="text-xs tracking-[0.5em]"
                                   style={{ color: '#e8d5b0', fontSize: '8px', marginTop: '2px' }}>
                                   LUXURY COSMETICS
                              </p>
                         </div>
                    </Link>

                    {/* Right — Nav Links (desktop) */}
                    <div className="hidden lg:flex items-center gap-8">
                         {navLinks.slice(3).map(link => (
                              <Link key={link.name} to={link.path}
                                   className="text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-100"
                                   style={{ color: '#c9a96e', opacity: 0.7, fontFamily: 'Montserrat, sans-serif' }}>
                                   {link.name}
                              </Link>
                         ))}
                    </div>

                    {/* Icons */}
                    <div className="flex items-center gap-4 ml-auto lg:ml-0">
                         {/* Search */}
                         <button onClick={() => setSearchOpen(!searchOpen)}
                              className="transition-all duration-300 hover:scale-110"
                              style={{ color: '#c9a96e' }}>
                              <FiSearch size={18} />
                         </button>

                         {/* Wishlist */}
                         <Link to="/orders"
                              className="transition-all duration-300 hover:scale-110"
                              style={{ color: '#c9a96e' }}>
                              <FiHeart size={18} />
                         </Link>

                         {/* Account */}
                         <Link to="/login"
                              className="transition-all duration-300 hover:scale-110"
                              style={{ color: '#c9a96e' }}>
                              <FiUser size={18} />
                         </Link>

                         {/* Cart */}
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
                                   <Link to="/login" onClick={() => setMenuOpen(false)}
                                        className="text-sm tracking-widest uppercase"
                                        style={{ color: '#e8d5b0' }}>
                                        Login / Register
                                   </Link>
                              </div>
                         </div>
                    </div>
               )}
          </nav>
     );
}