import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) setError(error.message);
    setLoading(false);
  };

  const inputStyle = {
    borderColor: 'rgba(201,169,110,0.3)',
    color: '#faf8f4',
    fontFamily: 'Montserrat, sans-serif',
    background: 'transparent',
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@300;400&family=Montserrat:wght@300;400;500&display=swap');
        .login-input:focus { border-color: #c9a96e !important; outline: none; }
        .logo-glow { animation: logoGlow 3s ease-in-out infinite; }
        @keyframes logoGlow {
          0%, 100% { filter: drop-shadow(0 0 8px rgba(201,169,110,0.3)); }
          50% { filter: drop-shadow(0 0 20px rgba(201,169,110,0.7)); }
        }
        .gold-line {
          background: linear-gradient(90deg, transparent, #c9a96e, transparent);
          animation: shimmer 2.5s ease-in-out infinite;
        }
        @keyframes shimmer { 0% { opacity: 0.3; } 50% { opacity: 1; } 100% { opacity: 0.3; } }
        .fade-in { animation: fadeInUp 0.6s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .login-btn { transition: all 0.3s ease; }
        .login-btn:hover:not(:disabled) { opacity: 0.85; transform: translateY(-1px); box-shadow: 0 6px 20px rgba(201,169,110,0.3); }
        .bg-particle {
          position: absolute;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(201,169,110,0.06), transparent);
          animation: float 6s ease-in-out infinite;
        }
        @keyframes float {
          0%, 100% { transform: translateY(0px) scale(1); opacity: 0.4; }
          50% { transform: translateY(-20px) scale(1.05); opacity: 0.7; }
        }
      `}</style>

      <div className="min-h-screen flex items-center justify-center relative overflow-hidden"
        style={{ background: 'linear-gradient(135deg, #0d0a07 0%, #080604 50%, #0a0806 100%)' }}>

        {/* Background particles */}
        <div className="bg-particle" style={{ width: '400px', height: '400px', top: '-100px', right: '-100px', animationDelay: '0s' }} />
        <div className="bg-particle" style={{ width: '300px', height: '300px', bottom: '-80px', left: '-80px', animationDelay: '3s' }} />
        <div className="bg-particle" style={{ width: '200px', height: '200px', top: '40%', left: '10%', animationDelay: '1.5s' }} />

        {/* Login Card */}
        <div className="fade-in w-full max-w-md mx-4 relative z-10">

          {/* Logo */}
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-4 mb-4">
              <div className="w-10 h-10 flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg, #c9a96e, #8b6914)', boxShadow: '0 0 20px rgba(201,169,110,0.4)' }}>
                <span style={{ color: '#0a0806', fontSize: '16px', fontWeight: 700, fontFamily: 'Cormorant Garamond, serif' }}>V</span>
              </div>
              <h1 className="logo-glow font-light tracking-[0.4em]"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e', fontSize: '2rem', lineHeight: 1 }}>
                VELVET
              </h1>
            </div>
            <div className="h-px gold-line mb-4" />
            <p className="text-xs tracking-[0.3em] uppercase" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              Admin Panel
            </p>
          </div>

          {/* Card */}
          <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.2)', boxShadow: '0 32px 64px rgba(0,0,0,0.5)' }}>

            {/* Card Header */}
            <div className="px-8 py-6" style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.06), transparent)' }}>
              <p className="text-xs tracking-[0.3em] uppercase mb-1" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Welcome back</p>
              <h2 className="text-2xl font-light" style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Sign In</h2>
            </div>

            {/* Form */}
            <form onSubmit={handleLogin} className="px-8 py-8 space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-center gap-3 px-4 py-3"
                  style={{ background: 'rgba(232,160,154,0.08)', border: '1px solid rgba(232,160,154,0.25)' }}>
                  <div className="w-1.5 h-1.5 rounded-full flex-shrink-0" style={{ background: '#e8a09a' }} />
                  <p className="text-xs tracking-wider" style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={e => { setEmail(e.target.value); setError(''); }}
                  placeholder="admin@velvet.com"
                  required
                  className="login-input w-full border px-4 py-3 text-sm tracking-wider"
                  style={inputStyle}
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={e => { setPassword(e.target.value); setError(''); }}
                  placeholder="••••••••"
                  required
                  className="login-input w-full border px-4 py-3 text-sm tracking-wider"
                  style={inputStyle}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading}
                className="login-btn w-full py-4 text-xs tracking-widest uppercase mt-2"
                style={{
                  background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                  color: '#0a0806',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                  cursor: loading ? 'not-allowed' : 'pointer',
                }}>
                {loading ? 'Signing in...' : 'Sign In to Admin'}
              </button>

            </form>

            {/* Footer */}
            <div className="px-8 pb-6 text-center">
              <p className="text-xs tracking-wider" style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>
                © 2026 Velvet Cosmetics Admin
              </p>
            </div>
          </div>

          {/* Secure note */}
          <div className="flex items-center justify-center gap-2 mt-6">
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,169,110,0.4)' }} />
            <p className="text-xs tracking-widest" style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>
              Secure Admin Access
            </p>
            <div className="w-1 h-1 rounded-full" style={{ background: 'rgba(201,169,110,0.4)' }} />
          </div>
        </div>
      </div>
    </>
  );
}