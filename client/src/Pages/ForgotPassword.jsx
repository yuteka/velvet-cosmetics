import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiArrowLeft, FiCheck } from 'react-icons/fi';

export default function ForgotPassword() {
  const [step, setStep] = useState(1); // 1=email, 2=otp, 3=newpassword, 4=success
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Step 1 — Send OTP
  const handleSendOtp = e => {
    e.preventDefault();
    if (!email) { setError('Please enter your email.'); return; }
    if (!/\S+@\S+\.\S+/.test(email)) { setError('Invalid email address.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(2); }, 1500);
  };

  // Step 2 — Verify OTP
  const handleOtpChange = (index, value) => {
    if (!/^\d*$/.test(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);
    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  const handleVerifyOtp = e => {
    e.preventDefault();
    const otpValue = otp.join('');
    if (otpValue.length < 6) { setError('Please enter the 6-digit OTP.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(3); }, 1500);
  };

  // Step 3 — Reset Password
  const handleResetPassword = e => {
    e.preventDefault();
    if (!newPassword) { setError('Please enter a new password.'); return; }
    if (newPassword.length < 8) { setError('Password must be at least 8 characters.'); return; }
    if (newPassword !== confirmPassword) { setError('Passwords do not match.'); return; }
    setLoading(true);
    setTimeout(() => { setLoading(false); setStep(4); }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-6"
      style={{ background: '#0a0806', paddingTop: '80px' }}>

      <div className="w-full max-w-md">

        {/* Logo */}
        <div className="text-center mb-10">
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

        {/* Card */}
        <div className="p-8" style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>

          {/* Step Indicators */}
          <div className="flex items-center justify-center gap-2 mb-8">
            {[1, 2, 3].map(s => (
              <div key={s} className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs transition-all duration-300"
                  style={{
                    background: step > s ? '#c9a96e' : step === s ? '#c9a96e' : 'transparent',
                    border: `1px solid ${step >= s ? '#c9a96e' : 'rgba(201,169,110,0.3)'}`,
                    color: step >= s ? '#0a0806' : '#7a6e5f',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                  }}>
                  {step > s ? <FiCheck size={12} /> : s}
                </div>
                {s < 3 && (
                  <div className="w-8 h-px"
                    style={{ background: step > s ? '#c9a96e' : 'rgba(201,169,110,0.2)' }} />
                )}
              </div>
            ))}
          </div>

          {/* Error */}
          {error && (
            <div className="mb-6 px-4 py-3 text-xs tracking-wider text-center"
              style={{
                background: 'rgba(139,26,20,0.2)',
                border: '1px solid rgba(139,26,20,0.4)',
                color: '#e8a09a',
                fontFamily: 'Montserrat, sans-serif',
              }}>
              {error}
            </div>
          )}

          {/* STEP 1 — Email */}
          {step === 1 && (
            <>
              <div className="text-center mb-8">
                <div className="w-14 h-14 rounded-full flex items-center justify-center mx-auto mb-4"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>
                  <FiMail size={22} style={{ color: '#c9a96e' }} />
                </div>
                <h2 className="text-2xl font-light mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                  Forgot Password?
                </h2>
                <p className="text-xs tracking-wider leading-relaxed"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Enter your email and we'll send you a verification code to reset your password.
                </p>
              </div>
              <form onSubmit={handleSendOtp} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Email Address
                  </label>
                  <div className="relative">
                    <FiMail size={14} className="absolute left-4 top-1/2 -translate-y-1/2"
                      style={{ color: '#7a6e5f' }} />
                    <input
                      type="email"
                      value={email}
                      onChange={e => { setEmail(e.target.value); setError(''); }}
                      placeholder="hello@example.com"
                      className="w-full bg-transparent border pl-10 pr-4 py-3 text-sm outline-none tracking-wider"
                      style={{
                        borderColor: 'rgba(201,169,110,0.3)',
                        color: '#faf8f4',
                        fontFamily: 'Montserrat, sans-serif',
                      }}
                      onFocus={e => e.target.style.borderColor = '#c9a96e'}
                      onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
                    />
                  </div>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{
                    background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                    color: '#0a0806',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                  }}>
                  {loading ? 'Sending...' : 'Send Verification Code'}
                </button>
              </form>
            </>
          )}

          {/* STEP 2 — OTP */}
          {step === 2 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                  Enter OTP
                </h2>
                <p className="text-xs tracking-wider leading-relaxed"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  We sent a 6-digit code to
                  <br />
                  <span style={{ color: '#c9a96e' }}>{email}</span>
                </p>
              </div>
              <form onSubmit={handleVerifyOtp} className="space-y-6">
                {/* OTP Inputs */}
                <div className="flex justify-center gap-3">
                  {otp.map((digit, index) => (
                    <input
                      key={index}
                      id={`otp-${index}`}
                      type="text"
                      maxLength={1}
                      value={digit}
                      onChange={e => { handleOtpChange(index, e.target.value); setError(''); }}
                      onKeyDown={e => handleOtpKeyDown(index, e)}
                      className="w-11 h-12 text-center bg-transparent border text-lg outline-none transition-all duration-300"
                      style={{
                        borderColor: digit ? '#c9a96e' : 'rgba(201,169,110,0.3)',
                        color: '#faf8f4',
                        fontFamily: 'Montserrat, sans-serif',
                        fontWeight: 600,
                      }}
                      onFocus={e => e.target.style.borderColor = '#c9a96e'}
                      onBlur={e => e.target.style.borderColor = digit ? '#c9a96e' : 'rgba(201,169,110,0.3)'}
                    />
                  ))}
                </div>
                <p className="text-center text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Didn't receive the code?{' '}
                  <button type="button"
                    onClick={() => setOtp(['', '', '', '', '', ''])}
                    style={{ color: '#c9a96e' }}>
                    Resend
                  </button>
                </p>
                <button type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{
                    background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                    color: '#0a0806',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                  }}>
                  {loading ? 'Verifying...' : 'Verify Code'}
                </button>
              </form>
            </>
          )}

          {/* STEP 3 — New Password */}
          {step === 3 && (
            <>
              <div className="text-center mb-8">
                <h2 className="text-2xl font-light mb-2"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                  Reset Password
                </h2>
                <p className="text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Create a new secure password for your account.
                </p>
              </div>
              <form onSubmit={handleResetPassword} className="space-y-5">
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    New Password
                  </label>
                  <input
                    type="password"
                    value={newPassword}
                    onChange={e => { setNewPassword(e.target.value); setError(''); }}
                    placeholder="Min. 8 characters"
                    className="w-full bg-transparent border px-4 py-3 text-sm outline-none tracking-wider"
                    style={{
                      borderColor: 'rgba(201,169,110,0.3)',
                      color: '#faf8f4',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = '#c9a96e'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
                  />
                </div>
                <div>
                  <label className="block text-xs tracking-widest uppercase mb-2"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={e => { setConfirmPassword(e.target.value); setError(''); }}
                    placeholder="Repeat new password"
                    className="w-full bg-transparent border px-4 py-3 text-sm outline-none tracking-wider"
                    style={{
                      borderColor: 'rgba(201,169,110,0.3)',
                      color: '#faf8f4',
                      fontFamily: 'Montserrat, sans-serif',
                    }}
                    onFocus={e => e.target.style.borderColor = '#c9a96e'}
                    onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
                  />
                </div>
                {/* Password strength */}
                <div className="space-y-1">
                  {[
                    { label: 'At least 8 characters', check: newPassword.length >= 8 },
                    { label: 'Contains a number', check: /\d/.test(newPassword) },
                    { label: 'Contains uppercase letter', check: /[A-Z]/.test(newPassword) },
                  ].map(rule => (
                    <div key={rule.label} className="flex items-center gap-2">
                      <div className="w-3 h-3 rounded-full flex items-center justify-center"
                        style={{ background: rule.check ? '#c9a96e' : 'transparent', border: `1px solid ${rule.check ? '#c9a96e' : 'rgba(201,169,110,0.3)'}` }}>
                        {rule.check && <FiCheck size={8} style={{ color: '#0a0806' }} />}
                      </div>
                      <span className="text-xs" style={{ color: rule.check ? '#c9a96e' : '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        {rule.label}
                      </span>
                    </div>
                  ))}
                </div>
                <button type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{
                    background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                    color: '#0a0806',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: 600,
                  }}>
                  {loading ? 'Resetting...' : 'Reset Password'}
                </button>
              </form>
            </>
          )}

          {/* STEP 4 — Success */}
          {step === 4 && (
            <div className="text-center py-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6"
                style={{ background: 'rgba(201,169,110,0.15)', border: '1px solid #c9a96e' }}>
                <FiCheck size={28} style={{ color: '#c9a96e' }} />
              </div>
              <h2 className="text-2xl font-light mb-3"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                Password Reset!
              </h2>
              <p className="text-xs tracking-wider mb-8 leading-relaxed"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                Your password has been successfully reset. You can now sign in with your new password.
              </p>
              <Link to="/login"
                className="block w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80 text-center"
                style={{
                  background: '#c9a96e',
                  color: '#0a0806',
                  fontFamily: 'Montserrat, sans-serif',
                  fontWeight: 600,
                }}>
                Sign In Now
              </Link>
            </div>
          )}

          {/* Back to Login */}
          {step !== 4 && (
            <div className="mt-6 text-center">
              <Link to="/login"
                className="inline-flex items-center gap-2 text-xs tracking-wider transition-colors duration-300"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                <FiArrowLeft size={12} /> Back to Sign In
              </Link>
            </div>
          )}

        </div>

      </div>
    </div>
  );
}