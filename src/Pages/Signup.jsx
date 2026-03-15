import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff, FiUser, FiPhone } from 'react-icons/fi';
import { FcGoogle } from 'react-icons/fc';

export default function Signup() {
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agree: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const handleChange = e => {
    const { name, value, type, checked } = e.target;
    setForm({ ...form, [name]: type === 'checkbox' ? checked : value });
    setErrors({ ...errors, [name]: '' });
  };

  const validate = () => {
    const newErrors = {};
    if (!form.firstName) newErrors.firstName = 'First name is required';
    if (!form.lastName) newErrors.lastName = 'Last name is required';
    if (!form.email) newErrors.email = 'Email is required';
    else if (!/\S+@\S+\.\S+/.test(form.email)) newErrors.email = 'Invalid email address';
    if (!form.password) newErrors.password = 'Password is required';
    else if (form.password.length < 8) newErrors.password = 'Password must be at least 8 characters';
    if (!form.confirmPassword) newErrors.confirmPassword = 'Please confirm your password';
    else if (form.password !== form.confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    if (!form.agree) newErrors.agree = 'You must agree to the terms';
    return newErrors;
  };

  const handleSubmit = e => {
    e.preventDefault();
    const newErrors = validate();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      navigate('/');
    }, 1500);
  };

  const InputField = ({ label, name, type = 'text', placeholder, icon: Icon, extra }) => (
    <div>
      <label className="block text-xs tracking-widest uppercase mb-2"
        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
        {label}
      </label>
      <div className="relative">
        {Icon && (
          <Icon size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
            style={{ color: '#7a6e5f' }} />
        )}
        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          className="w-full bg-transparent border py-3 text-sm outline-none tracking-wider transition-all duration-300"
          style={{
            borderColor: errors[name] ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)',
            color: '#faf8f4',
            fontFamily: 'Montserrat, sans-serif',
            paddingLeft: Icon ? '2.5rem' : '1rem',
            paddingRight: extra ? '3rem' : '1rem',
          }}
          onFocus={e => e.target.style.borderColor = errors[name] ? 'rgba(180,60,60,0.8)' : '#c9a96e'}
          onBlur={e => e.target.style.borderColor = errors[name] ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'}
        />
        {extra}
      </div>
      {errors[name] && (
        <p className="text-xs mt-1" style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
          {errors[name]}
        </p>
      )}
    </div>
  );

  return (
    <div className="min-h-screen flex" style={{ background: '#0a0806', paddingTop: '80px' }}>

      {/* Left — Image */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1570194065650-d99fb4b38796?w=900&q=80"
          alt="luxury cosmetics"
          className="w-full h-full object-cover"
          style={{ opacity: 0.6 }}
        />
        <div className="absolute inset-0"
          style={{ background: 'linear-gradient(to right, rgba(10,8,6,0) 0%, rgba(10,8,6,0.8) 100%)' }} />
        <div className="absolute bottom-16 left-12 right-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a96e' }}>
            Join Velvet
          </p>
          <h2 className="text-5xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', lineHeight: 1.2 }}>
            Begin Your
            <br />
            <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Luxury Journey</span>
          </h2>
          <p className="text-sm leading-relaxed"
            style={{ color: '#e8d5b0', fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            Create an account to unlock exclusive offers, early access to new collections and personalised beauty tips.
          </p>
          {/* Benefits */}
          <div className="mt-8 space-y-3">
            {[
              'Exclusive member discounts',
              'Early access to new launches',
              'Free birthday gift',
              'Priority customer support',
            ].map(b => (
              <div key={b} className="flex items-center gap-3">
                <div className="w-1 h-1 rounded-full" style={{ background: '#c9a96e' }} />
                <span className="text-xs tracking-wider"
                  style={{ color: '#e8d5b0', fontFamily: 'Montserrat, sans-serif' }}>
                  {b}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right — Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center px-6 py-12">
        <div className="w-full max-w-md">

          {/* Logo */}
          <div className="text-center mb-8">
            <Link to="/">
              <h1 className="text-4xl font-light tracking-[0.3em]"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e' }}>
                VELVET
              </h1>
              <p className="text-xs tracking-[0.5em] mt-1"
                style={{ color: '#e8d5b0', fontSize: '9px' }}>
                LUXURY COSMETICS
              </p>
            </Link>
            <div className="w-16 h-px mx-auto mt-6" style={{ background: '#c9a96e', opacity: 0.4 }} />
          </div>

          <h2 className="text-2xl font-light text-center mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Create Account
          </h2>
          <p className="text-xs text-center tracking-wider mb-8"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Join the Velvet Circle today
          </p>

          {/* Google */}
          <button
            className="w-full py-3 flex items-center justify-center gap-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80 border mb-6"
            style={{
              borderColor: 'rgba(201,169,110,0.3)',
              color: '#faf8f4',
              fontFamily: 'Montserrat, sans-serif',
            }}>
            <FcGoogle size={16} />
            Continue with Google
          </button>

          {/* Divider */}
          <div className="flex items-center gap-4 mb-6">
            <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.2)' }} />
            <span className="text-xs tracking-widest" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>OR</span>
            <div className="flex-1 h-px" style={{ background: 'rgba(201,169,110,0.2)' }} />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">

            {/* Name Row */}
            <div className="grid grid-cols-2 gap-4">
              <InputField label="First Name" name="firstName" placeholder="Jane" icon={FiUser} />
              <InputField label="Last Name" name="lastName" placeholder="Doe" />
            </div>

            {/* Email */}
            <InputField label="Email Address" name="email" type="email" placeholder="hello@example.com" icon={FiMail} />

            {/* Phone */}
            <InputField label="Phone (Optional)" name="phone" type="tel" placeholder="+1 234 567 8900" icon={FiPhone} />

            {/* Password */}
            <InputField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="Min. 8 characters"
              icon={FiLock}
              extra={
                <button type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#7a6e5f' }}>
                  {showPassword ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              }
            />

            {/* Confirm Password */}
            <InputField
              label="Confirm Password"
              name="confirmPassword"
              type={showConfirm ? 'text' : 'password'}
              placeholder="Repeat your password"
              icon={FiLock}
              extra={
                <button type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2"
                  style={{ color: '#7a6e5f' }}>
                  {showConfirm ? <FiEyeOff size={14} /> : <FiEye size={14} />}
                </button>
              }
            />

            {/* Terms */}
            <div>
              <label className="flex items-start gap-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="agree"
                  checked={form.agree}
                  onChange={handleChange}
                  className="mt-0.5 accent-yellow-600"
                />
                <span className="text-xs tracking-wider leading-relaxed"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  I agree to the{' '}
                  <a href="#" style={{ color: '#c9a96e' }}>Terms of Service</a>
                  {' '}and{' '}
                  <a href="#" style={{ color: '#c9a96e' }}>Privacy Policy</a>
                </span>
              </label>
              {errors.agree && (
                <p className="text-xs mt-1" style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
                  {errors.agree}
                </p>
              )}
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{
                background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                color: '#0a0806',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
              }}>
              {loading ? 'Creating Account...' : 'Create Account'}
            </button>
          </form>

          {/* Login Link */}
          <p className="text-center mt-6 text-xs tracking-wider"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Already have an account?{' '}
            <Link to="/login"
              style={{ color: '#c9a96e' }}
              onMouseEnter={e => e.currentTarget.style.color = '#e8d5b0'}
              onMouseLeave={e => e.currentTarget.style.color = '#c9a96e'}>
              Sign In
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}