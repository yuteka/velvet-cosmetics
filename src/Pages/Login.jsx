import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../lib/supabase';
export default function Login() {
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = e => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.email || !form.password) { setError('Please fill in all fields.'); return; }
    setLoading(true);
    const result = await login(form.email, form.password);
    setLoading(false);
    if (result.error) { setError(result.error); return; }
    navigate('/');
  };

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0806', paddingTop: '80px' }}>

      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ height: 'calc(100vh - 80px)' }}>
        <img src={getImageUrl('auth/login-bg.jpg')}
          alt="luxury cosmetics" className="w-full h-full object-cover" style={{ opacity: 0.6 }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(10,8,6,0) 0%, rgba(10,8,6,0.8) 100%)' }} />
        <div className="absolute bottom-16 left-12 right-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a96e' }}>Welcome Back</p>
          <h2 className="text-5xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', lineHeight: 1.2 }}>
            Your Beauty<br />
            <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Awaits You</span>
          </h2>
          <p className="text-sm leading-relaxed"
            style={{ color: '#e8d5b0', fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            Sign in to access your wishlist, orders and exclusive member benefits.
          </p>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-10">
            <Link to="/">
              <h1 className="text-4xl font-light tracking-[0.3em]"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e' }}>VELVET</h1>
              <p className="text-xs tracking-[0.5em] mt-1" style={{ color: '#e8d5b0', fontSize: '9px' }}>
                LUXURY COSMETICS
              </p>
            </Link>
            <div className="w-16 h-px mx-auto mt-6" style={{ background: '#c9a96e', opacity: 0.4 }} />
          </div>

          <h2 className="text-2xl font-light text-center mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Sign In</h2>
          <p className="text-xs text-center tracking-wider mb-8"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Welcome back to Velvet</p>

          {error && (
            <div className="mb-6 px-4 py-3 text-xs tracking-wider text-center"
              style={{ background: 'rgba(139,26,20,0.2)', border: '1px solid rgba(139,26,20,0.4)', color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Email Address</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }} />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full bg-transparent border pl-10 pr-4 py-3 text-sm outline-none tracking-wider"
                  style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }} />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="••••••••"
                  className="w-full bg-transparent border pl-10 pr-12 py-3 text-sm outline-none tracking-wider"
                  style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }}>
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="accent-yellow-600" />
                <span className="text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Remember me</span>
              </label>
              <Link to="/forgot-password" className="text-xs tracking-wider"
                style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{
                background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
              }}>
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <p className="text-center mt-8 text-xs tracking-wider"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Don't have an account?{' '}
            <Link to="/signup" style={{ color: '#c9a96e' }}>Create Account</Link>
          </p>
        </div>
      </div>
    </div>
  );
}