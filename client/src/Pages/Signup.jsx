import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import { getImageUrl } from '../lib/supabase';
export default function Signup() {
  const [form, setForm] = useState({
    firstName: '', lastName: '', email: '',
    password: '', confirmPassword: '', agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const e = {};
    if (!form.firstName) e.firstName = 'Required';
    if (!form.lastName) e.lastName = 'Required';
    if (!form.email) e.email = 'Required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Invalid email';
    if (!form.password) e.password = 'Required';
    else if (form.password.length < 8) e.password = 'Min 8 characters';
    if (form.password !== form.confirmPassword) e.confirmPassword = 'Passwords do not match';
    if (!form.agree) e.agree = 'You must agree to the terms';
    return e;
  };

  const handleSubmit = async e => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    const result = await signup(form.firstName, form.lastName, form.email, form.password);
    setLoading(false);
    if (result.error) { setErrors({ email: result.error }); return; }
    navigate('/');
  };

  const inputStyle = (name) => ({
    borderColor: errors[name] ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)',
    color: '#faf8f4',
    fontFamily: 'Montserrat, sans-serif',
  });

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0806', paddingTop: '80px', overflow: 'hidden' }}>

      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden" style={{ height: 'calc(100vh - 80px)', position: 'sticky', top: '80px' }}>
        <img src={getImageUrl('auth/signup-bg.jpg')}
          alt="luxury cosmetics" className="w-full h-full object-cover" style={{ opacity: 0.6,objectPosition: 'center top' }} />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(10,8,6,0) 0%, rgba(10,8,6,0.8) 100%)' }} />
        <div className="absolute bottom-16 left-12 right-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a96e' }}>Join Velvet</p>
          <h2 className="text-5xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', lineHeight: 1.2 }}>
            Begin Your<br />
            <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Luxury Journey</span>
          </h2>
          <div className="mt-8 space-y-3">
            {['Exclusive member discounts', 'Early access to new launches', 'Free birthday gift', 'Priority customer support'].map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full" style={{ background: '#c9a96e' }} />
                <span className="text-xs tracking-wider"
                  style={{ color: '#e8d5b0', fontFamily: 'Montserrat, sans-serif' }}>{b}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-4xl font-light tracking-[0.3em]"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e' }}>VELVET</h1>
              <p className="text-xs tracking-[0.5em] mt-1"
                style={{ color: '#e8d5b0', fontSize: '9px' }}>LUXURY COSMETICS</p>
            </Link>
            <div className="w-16 h-px mx-auto mt-6" style={{ background: '#c9a96e', opacity: 0.4 }} />
          </div>

          <h2 className="text-2xl font-light text-center mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>Create Account</h2>
          <p className="text-xs text-center tracking-wider mb-8"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Join the Velvet Circle today</p>

          <form onSubmit={handleSubmit} className="space-y-4">

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>First Name</label>
                <div className="relative">
                  <FiUser size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                    style={{ color: '#7a6e5f' }} />
                  <input type="text" name="firstName" value={form.firstName} onChange={handleChange}
                    placeholder="Jane"
                    className="w-full bg-transparent border pl-10 pr-4 py-3 text-sm outline-none"
                    style={inputStyle('firstName')}
                    onFocus={e => e.target.style.borderColor = '#c9a96e'}
                    onBlur={e => e.target.style.borderColor = errors.firstName ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'} />
                </div>
                {errors.firstName && <p className="text-xs mt-1" style={{ color: '#e8a09a' }}>{errors.firstName}</p>}
              </div>
              <div>
                <label className="block text-xs tracking-widest uppercase mb-2"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Last Name</label>
                <input type="text" name="lastName" value={form.lastName} onChange={handleChange}
                  placeholder="Doe"
                  className="w-full bg-transparent border px-4 py-3 text-sm outline-none"
                  style={inputStyle('lastName')}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.lastName ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'} />
                {errors.lastName && <p className="text-xs mt-1" style={{ color: '#e8a09a' }}>{errors.lastName}</p>}
              </div>
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Email Address</label>
              <div className="relative">
                <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#7a6e5f' }} />
                <input type="email" name="email" value={form.email} onChange={handleChange}
                  placeholder="hello@example.com"
                  className="w-full bg-transparent border pl-10 pr-4 py-3 text-sm outline-none"
                  style={inputStyle('email')}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.email ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'} />
              </div>
              {errors.email && <p className="text-xs mt-1" style={{ color: '#e8a09a' }}>{errors.email}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#7a6e5f' }} />
                <input type={showPassword ? 'text' : 'password'} name="password"
                  value={form.password} onChange={handleChange} placeholder="Min. 8 characters"
                  className="w-full bg-transparent border pl-10 pr-12 py-3 text-sm outline-none"
                  style={inputStyle('password')}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.password ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'} />
                <button type="button" onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }}>
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.password && <p className="text-xs mt-1" style={{ color: '#e8a09a' }}>{errors.password}</p>}
            </div>

            <div>
              <label className="block text-xs tracking-widest uppercase mb-2"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Confirm Password</label>
              <div className="relative">
                <FiLock size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#7a6e5f' }} />
                <input type={showConfirm ? 'text' : 'password'} name="confirmPassword"
                  value={form.confirmPassword} onChange={handleChange} placeholder="Repeat your password"
                  className="w-full bg-transparent border pl-10 pr-12 py-3 text-sm outline-none"
                  style={inputStyle('confirmPassword')}
                  onFocus={e => e.target.style.borderColor = '#c9a96e'}
                  onBlur={e => e.target.style.borderColor = errors.confirmPassword ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'} />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2" style={{ color: '#7a6e5f' }}>
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-xs mt-1" style={{ color: '#e8a09a' }}>{errors.confirmPassword}</p>}
            </div>

            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" name="agree" checked={form.agree} onChange={handleChange}
                  className="mt-0.5 accent-yellow-600" />
                <span className="text-xs tracking-wider leading-relaxed"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  I agree to the <a href="#" style={{ color: '#c9a96e' }}>Terms of Service</a> and{' '}
                  <a href="#" style={{ color: '#c9a96e' }}>Privacy Policy</a>
                </span>
              </label>
              {errors.agree && <p className="text-xs mt-1" style={{ color: '#e8a09a' }}>{errors.agree}</p>}
            </div>

            <button type="submit" disabled={loading}
              className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{
                background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
              }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          <p className="text-center mt-6 text-xs tracking-wider"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#c9a96e' }}>Sign In</Link>
          </p>
        </div>
      </div>
    </div>
  );
}