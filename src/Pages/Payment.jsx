import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FiCreditCard, FiLock, FiCheck, FiChevronDown,
  FiChevronUp, FiTruck, FiMapPin
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

// ✅ FIXED: InputField moved OUTSIDE — prevents focus loss on every keystroke
const InputField = ({ label, name, value, onChange, placeholder, type = 'text', half = false, errors }) => (
  <div className={half ? 'col-span-1' : 'col-span-2'}>
    <label className="block text-xs tracking-widest uppercase mb-2"
      style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
      {label}
    </label>
    <input
      type={type} name={name} value={value} onChange={onChange} placeholder={placeholder}
      className="w-full bg-transparent border px-4 py-3 text-sm outline-none tracking-wider transition-all duration-300"
      style={{
        borderColor: errors?.[name] ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)',
        color: '#faf8f4', fontFamily: 'Montserrat, sans-serif',
      }}
      onFocus={e => e.target.style.borderColor = '#c9a96e'}
      onBlur={e => e.target.style.borderColor = errors?.[name] ? 'rgba(180,60,60,0.6)' : 'rgba(201,169,110,0.3)'}
    />
    {errors?.[name] && (
      <p className="text-xs mt-1" style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
        {errors[name]}
      </p>
    )}
  </div>
);

export default function Payment() {
  const { cartItems, cartTotal, shipping, cartGrandTotal, clearCart } = useCart();
  const { user, saveOrder } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [expandedOrder, setExpandedOrder] = useState(false);
  const [orderId] = useState('VLT' + Math.random().toString(36).substr(2, 9).toUpperCase());

  const defaultAddress = user?.addresses?.[0];

  const [shippingForm, setShippingForm] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
    phone: defaultAddress?.phone || '',
    address: defaultAddress?.address || '',
    city: defaultAddress?.city || '',
    state: defaultAddress?.state || '',
    zip: defaultAddress?.zip || '',
    country: defaultAddress?.country || 'United States',
  });

  const [paymentForm, setPaymentForm] = useState({
    cardName: '', cardNumber: '', expiry: '', cvv: '',
    method: 'card',
  });

  const [errors, setErrors] = useState({});

  const handleShippingChange = e => {
    setShippingForm({ ...shippingForm, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: '' });
  };

  const handlePaymentChange = e => {
    let { name, value } = e.target;
    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').slice(0, 16).replace(/(.{4})/g, '$1 ').trim();
    }
    if (name === 'expiry') {
      value = value.replace(/\D/g, '').slice(0, 4);
      if (value.length >= 2) value = value.slice(0, 2) + '/' + value.slice(2);
    }
    if (name === 'cvv') value = value.replace(/\D/g, '').slice(0, 4);
    setPaymentForm({ ...paymentForm, [name]: value });
    setErrors({ ...errors, [name]: '' });
  };

  const validateShipping = () => {
    const e = {};
    if (!shippingForm.firstName) e.firstName = 'Required';
    if (!shippingForm.lastName) e.lastName = 'Required';
    if (!shippingForm.email) e.email = 'Required';
    if (!shippingForm.address) e.address = 'Required';
    if (!shippingForm.city) e.city = 'Required';
    if (!shippingForm.zip) e.zip = 'Required';
    return e;
  };

  const validatePayment = () => {
    const e = {};
    if (paymentForm.method === 'card') {
      if (!paymentForm.cardName) e.cardName = 'Required';
      if (!paymentForm.cardNumber || paymentForm.cardNumber.replace(/\s/g, '').length < 16)
        e.cardNumber = 'Enter valid card number';
      if (!paymentForm.expiry || paymentForm.expiry.length < 5)
        e.expiry = 'Enter valid expiry';
      if (!paymentForm.cvv || paymentForm.cvv.length < 3)
        e.cvv = 'Enter valid CVV';
    }
    return e;
  };

  const handleShippingNext = e => {
    e.preventDefault();
    const errs = validateShipping();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setStep(2);
    window.scrollTo(0, 0);
  };

  const handlePlaceOrder = async e => {
    e.preventDefault();
    const errs = validatePayment();
    if (Object.keys(errs).length > 0) { setErrors(errs); return; }
    setLoading(true);
    setTimeout(async () => {
      if (user) {
        await saveOrder({
          order_id: orderId,
          date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'long', year: 'numeric' }),
          total: cartGrandTotal.toFixed(2),
          items: cartItems.map(i => ({ name: i.name, qty: i.qty, price: i.price })),
        });
      }
      setLoading(false);
      setOrderPlaced(true);
      clearCart();
    }, 2000);
  };

  // Order Success
  if (orderPlaced) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#0a0806', paddingTop: '80px' }}>
        <div className="w-full max-w-md text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(201,169,110,0.15)', border: '2px solid #c9a96e' }}>
            <FiCheck size={32} style={{ color: '#c9a96e' }} />
          </div>
          <p className="text-xs tracking-[0.4em] uppercase mb-3"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            Order Confirmed
          </p>
          <h2 className="text-4xl font-light mb-4"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Thank You!
          </h2>
          <p className="text-sm mb-2 leading-relaxed"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Your order has been placed successfully.
          </p>
          <p className="text-xs mb-8 tracking-wider"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            Order ID: {orderId}
          </p>
          <div className="p-4 mb-8"
            style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
            <div className="flex items-center gap-3 text-xs tracking-wider"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              <FiTruck size={14} style={{ color: '#c9a96e' }} />
              <span>Estimated delivery: <span style={{ color: '#c9a96e' }}>3–5 business days</span></span>
            </div>
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => navigate(`/track/${orderId}`)}
              className="flex-1 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Track Order
            </button>
            <button
              onClick={() => navigate('/')}
              className="flex-1 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-70 border"
              style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-7xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            Secure Checkout
          </p>
          <h1 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            {step === 1 ? 'Shipping Details' : 'Payment'}
          </h1>
        </div>

        {/* Steps */}
        <div className="flex items-center gap-4 mb-10">
          {[{ n: 1, label: 'Shipping' }, { n: 2, label: 'Payment' }].map(({ n, label }) => (
            <div key={n} className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs"
                  style={{
                    background: step >= n ? '#c9a96e' : 'transparent',
                    border: `1px solid ${step >= n ? '#c9a96e' : 'rgba(201,169,110,0.3)'}`,
                    color: step >= n ? '#0a0806' : '#7a6e5f',
                    fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                  }}>
                  {step > n ? <FiCheck size={12} /> : n}
                </div>
                <span className="text-xs tracking-widest uppercase"
                  style={{ color: step >= n ? '#c9a96e' : '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  {label}
                </span>
              </div>
              {n < 2 && <div className="w-12 h-px"
                style={{ background: step > n ? '#c9a96e' : 'rgba(201,169,110,0.2)' }} />}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Left — Forms */}
          <div className="lg:col-span-2">

            {/* Saved Addresses */}
            {step === 1 && user?.addresses?.length > 0 && (
              <div className="p-5 mb-6"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <p className="text-xs tracking-widest uppercase mb-4"
                  style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                  Saved Addresses
                </p>
                <div className="space-y-3">
                  {user.addresses.map(addr => (
                    <div key={addr.id}
                      className="flex items-center gap-3 p-3 cursor-pointer transition-all duration-300"
                      style={{ border: '1px solid rgba(201,169,110,0.2)' }}
                      onClick={() => setShippingForm({
                        firstName: user.firstName,
                        lastName: user.lastName,
                        email: user.email,
                        phone: addr.phone || '',
                        address: addr.address,
                        city: addr.city,
                        state: addr.state || '',
                        zip: addr.zip,
                        country: addr.country || 'United States',
                      })}>
                      <FiMapPin size={14} style={{ color: '#c9a96e' }} />
                      <div>
                        <p className="text-xs" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                          {addr.name}
                        </p>
                        <p className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {addr.address}, {addr.city}, {addr.zip}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* STEP 1 — Shipping */}
            {step === 1 && (
              <form onSubmit={handleShippingNext}>
                <div className="p-6 mb-6"
                  style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <FiMapPin size={16} style={{ color: '#c9a96e' }} />
                    <h2 className="text-lg font-light"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                      Delivery Address
                    </h2>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <InputField label="First Name" name="firstName" value={shippingForm.firstName}
                      onChange={handleShippingChange} placeholder="Jane" half errors={errors} />
                    <InputField label="Last Name" name="lastName" value={shippingForm.lastName}
                      onChange={handleShippingChange} placeholder="Doe" half errors={errors} />
                    <InputField label="Email" name="email" type="email" value={shippingForm.email}
                      onChange={handleShippingChange} placeholder="hello@example.com" errors={errors} />
                    <InputField label="Phone" name="phone" value={shippingForm.phone}
                      onChange={handleShippingChange} placeholder="+91 98765 43210" errors={errors} />
                    <InputField label="Street Address" name="address" value={shippingForm.address}
                      onChange={handleShippingChange} placeholder="123 Main Street" errors={errors} />
                    <InputField label="City" name="city" value={shippingForm.city}
                      onChange={handleShippingChange} placeholder="Chennai" half errors={errors} />
                    <InputField label="State" name="state" value={shippingForm.state}
                      onChange={handleShippingChange} placeholder="Tamil Nadu" half errors={errors} />
                    <InputField label="ZIP Code" name="zip" value={shippingForm.zip}
                      onChange={handleShippingChange} placeholder="600001" half errors={errors} />
                    <div className="col-span-1">
                      <label className="block text-xs tracking-widest uppercase mb-2"
                        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>Country</label>
                      <select name="country" value={shippingForm.country} onChange={handleShippingChange}
                        className="w-full bg-transparent border px-4 py-3 text-sm outline-none"
                        style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif', background: '#111009' }}>
                        {['India', 'United States', 'United Kingdom', 'France', 'Germany', 'Canada', 'Australia'].map(c => (
                          <option key={c} value={c} style={{ background: '#111009' }}>{c}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Shipping Method */}
                <div className="p-6 mb-6"
                  style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <FiTruck size={16} style={{ color: '#c9a96e' }} />
                    <h2 className="text-lg font-light"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                      Shipping Method
                    </h2>
                  </div>
                  <div className="space-y-3">
                    {[
                      { id: 'standard', label: 'Standard Shipping', time: '5–7 business days', price: cartTotal >= 100 ? 'FREE' : '$9.99' },
                      { id: 'express', label: 'Express Shipping', time: '2–3 business days', price: '$19.99' },
                      { id: 'overnight', label: 'Overnight Shipping', time: '1 business day', price: '$39.99' },
                    ].map(method => (
                      <label key={method.id}
                        className="flex items-center justify-between p-4 cursor-pointer"
                        style={{ border: '1px solid rgba(201,169,110,0.2)' }}>
                        <div className="flex items-center gap-3">
                          <input type="radio" name="shippingMethod" value={method.id}
                            defaultChecked={method.id === 'standard'} className="accent-yellow-600" />
                          <div>
                            <p className="text-sm" style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                              {method.label}
                            </p>
                            <p className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                              {method.time}
                            </p>
                          </div>
                        </div>
                        <span className="text-sm"
                          style={{ color: method.price === 'FREE' ? '#c9a96e' : '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                          {method.price}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>

                <button type="submit"
                  className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                  style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                  Continue to Payment
                </button>
              </form>
            )}

            {/* STEP 2 — Payment */}
            {step === 2 && (
              <form onSubmit={handlePlaceOrder}>

                {/* Shipping Summary */}
                <div className="p-4 mb-6 flex items-center justify-between"
                  style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <div className="flex items-center gap-3">
                    <FiCheck size={14} style={{ color: '#c9a96e' }} />
                    <div>
                      <p className="text-xs tracking-wider"
                        style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Shipping to</p>
                      <p className="text-sm"
                        style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                        {shippingForm.firstName} {shippingForm.lastName} — {shippingForm.city}, {shippingForm.country}
                      </p>
                    </div>
                  </div>
                  <button type="button" onClick={() => setStep(1)}
                    className="text-xs tracking-wider"
                    style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    Edit
                  </button>
                </div>

                {/* Payment Method */}
                <div className="p-6 mb-6"
                  style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                  <div className="flex items-center gap-3 mb-6">
                    <FiCreditCard size={16} style={{ color: '#c9a96e' }} />
                    <h2 className="text-lg font-light"
                      style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                      Payment Method
                    </h2>
                  </div>

                  <div className="flex gap-3 mb-6">
                    {[
                      { id: 'card', label: 'Credit Card' },
                      { id: 'paypal', label: 'PayPal' },
                      { id: 'apple', label: 'Apple Pay' },
                    ].map(m => (
                      <button key={m.id} type="button"
                        onClick={() => setPaymentForm({ ...paymentForm, method: m.id })}
                        className="flex-1 py-3 text-xs tracking-widest uppercase transition-all duration-300"
                        style={{
                          background: paymentForm.method === m.id ? '#c9a96e' : 'transparent',
                          color: paymentForm.method === m.id ? '#0a0806' : '#7a6e5f',
                          border: `1px solid ${paymentForm.method === m.id ? '#c9a96e' : 'rgba(201,169,110,0.3)'}`,
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: paymentForm.method === m.id ? 600 : 400,
                        }}>
                        {m.label}
                      </button>
                    ))}
                  </div>

                  {paymentForm.method === 'card' && (
                    <div className="grid grid-cols-2 gap-4">
                      <InputField label="Cardholder Name" name="cardName"
                        value={paymentForm.cardName} onChange={handlePaymentChange}
                        placeholder="Jane Doe" errors={errors} />
                      <InputField label="Card Number" name="cardNumber"
                        value={paymentForm.cardNumber} onChange={handlePaymentChange}
                        placeholder="1234 5678 9012 3456" errors={errors} />
                      <InputField label="Expiry Date" name="expiry"
                        value={paymentForm.expiry} onChange={handlePaymentChange}
                        placeholder="MM/YY" half errors={errors} />
                      <InputField label="CVV" name="cvv"
                        value={paymentForm.cvv} onChange={handlePaymentChange}
                        placeholder="•••" half errors={errors} />
                    </div>
                  )}

                  {paymentForm.method === 'paypal' && (
                    <div className="text-center py-8">
                      <p className="text-sm mb-4" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        You will be redirected to PayPal to complete your payment securely.
                      </p>
                      <div className="inline-block px-8 py-3 text-lg font-bold"
                        style={{ background: '#003087', color: '#fff', borderRadius: '4px' }}>
                        Pay<span style={{ color: '#009cde' }}>Pal</span>
                      </div>
                    </div>
                  )}

                  {paymentForm.method === 'apple' && (
                    <div className="text-center py-8">
                      <p className="text-sm mb-4" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        Use Touch ID or Face ID to confirm your Apple Pay payment.
                      </p>
                      <div className="inline-block px-8 py-3 text-sm tracking-wider"
                        style={{ background: '#000', color: '#fff', borderRadius: '4px' }}>
                        ⌘ Pay
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex items-center gap-2 mb-6">
                  <FiLock size={12} style={{ color: '#c9a96e' }} />
                  <p className="text-xs tracking-wider"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Your payment information is encrypted and secure.
                  </p>
                </div>

                <button type="submit" disabled={loading}
                  className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80 flex items-center justify-center gap-2"
                  style={{
                    background: loading ? 'rgba(201,169,110,0.5)' : '#c9a96e',
                    color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                  }}>
                  <FiLock size={12} />
                  {loading ? 'Processing...' : `Place Order — $${cartGrandTotal.toFixed(2)}`}
                </button>
              </form>
            )}
          </div>

          {/* Right — Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 sticky top-24"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <button onClick={() => setExpandedOrder(!expandedOrder)}
                className="w-full flex items-center justify-between mb-4">
                <h2 className="text-lg font-light"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                  Order Summary
                </h2>
                <div className="flex items-center gap-2 text-xs"
                  style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                  {cartItems.length} items
                  {expandedOrder ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                </div>
              </button>

              {expandedOrder && (
                <div className="space-y-3 mb-4 pb-4"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
                  {cartItems.map((item, i) => (
                    <div key={i} className="flex gap-3">
                      <div className="flex-shrink-0 overflow-hidden"
                        style={{ width: '50px', height: '60px', background: '#0a0806' }}>
                        <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light"
                          style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem' }}>
                          {item.name}
                        </p>
                        <p className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span className="text-xs" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                        ${(item.price * item.qty).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
              )}

              <div className="space-y-3 pb-4"
                style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="flex justify-between text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  <span className="flex items-center gap-1"><FiTruck size={11} /> Shipping</span>
                  <span style={{ color: shipping === 0 ? '#c9a96e' : '#7a6e5f' }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              <div className="flex justify-between items-center py-4">
                <span className="text-sm tracking-widest uppercase"
                  style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>Total</span>
                <span className="text-2xl font-light"
                  style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                  ${cartGrandTotal.toFixed(2)}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
