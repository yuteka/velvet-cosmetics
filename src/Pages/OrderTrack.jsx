import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  FiPackage, FiTruck, FiCheck, FiMapPin,
  FiClock, FiPhone, FiMail, FiArrowLeft
} from 'react-icons/fi';

const getOrderData = (orderId) => ({
  id: orderId,
  date: '12 March 2026',
  estimatedDelivery: '17 March 2026',
  status: 'Shipped',
  carrier: 'FedEx',
  trackingNumber: 'FX' + orderId,
  address: '123 Beauty Lane, New York, NY 10001, USA',
  items: [
    {
      name: 'Velvet Noir Lipstick',
      category: 'Lips',
      price: 48,
      qty: 1,
      image: 'https://i.pinimg.com/1200x/a5/ce/9c/a5ce9cc5715983b98b59edbd74b7ece9.jpg',
      shade: '#C41E3A',
    },
    {
      name: 'Midnight Serum',
      category: 'Skincare',
      price: 95,
      qty: 1,
      image: 'https://i.pinimg.com/1200x/a7/f6/aa/a7f6aade196f73b590b7bfa4bccdfb8a.jpg',
      shade: null,
    },
  ],
  timeline: [
    {
      status: 'Order Placed',
      date: '12 March 2026',
      time: '10:24 AM',
      description: 'Your order has been confirmed and is being prepared.',
      completed: true,
    },
    {
      status: 'Processing',
      date: '13 March 2026',
      time: '09:00 AM',
      description: 'Your items are being carefully packed and quality checked.',
      completed: true,
    },
    {
      status: 'Shipped',
      date: '14 March 2026',
      time: '02:15 PM',
      description: 'Your order has been handed to FedEx. Tracking: FXVLT9X2KP1',
      completed: true,
      active: true,
    },
    {
      status: 'Out for Delivery',
      date: '17 March 2026',
      time: 'Expected',
      description: 'Your order will be delivered to your address today.',
      completed: false,
    },
    {
      status: 'Delivered',
      date: '17 March 2026',
      time: 'Expected',
      description: 'Package delivered successfully.',
      completed: false,
    },
  ],
});

export default function OrderTrack() {
  const { orderId } = useParams();
  const [inputId, setInputId] = useState('');
  const [searchedId, setSearchedId] = useState(orderId || '');
  const order = searchedId ? getOrderData(searchedId) : null;

  const currentStep = order?.timeline.filter(t => t.completed).length || 0;
  const totalSteps = order?.timeline.length || 5;
  const progressPercent = ((currentStep - 1) / (totalSteps - 1)) * 100;

  const statusColors = {
    'Order Placed': '#c9a96e',
    'Processing': '#c9b96e',
    'Shipped': '#6eb5c9',
    'Out for Delivery': '#9e6ec9',
    'Delivered': '#6ec98e',
  };

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-4xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            My Account
          </p>
          <h1 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Track Order
          </h1>
        </div>

        {/* Search Bar */}
        <div className="p-6 mb-8"
          style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
          <p className="text-xs tracking-widest uppercase mb-4"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Enter Order ID
          </p>
          <div className="flex gap-3">
            <input
              type="text"
              value={inputId}
              onChange={e => setInputId(e.target.value)}
              placeholder="e.g. VLT9X2KP1"
              className="flex-1 bg-transparent border px-4 py-3 text-sm outline-none tracking-wider"
              style={{
                borderColor: 'rgba(201,169,110,0.3)',
                color: '#faf8f4',
                fontFamily: 'Montserrat, sans-serif',
              }}
              onFocus={e => e.target.style.borderColor = '#c9a96e'}
              onBlur={e => e.target.style.borderColor = 'rgba(201,169,110,0.3)'}
            />
            <button
              onClick={() => { if (inputId.trim()) setSearchedId(inputId.trim()); }}
              className="px-8 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{
                background: '#c9a96e',
                color: '#0a0806',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: 600,
              }}>
              Track
            </button>
          </div>
        </div>

        {/* Order Details */}
        {order && (
          <div className="space-y-6">

            {/* Order Summary Card */}
            <div className="p-6"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Order ID
                  </p>
                  <p className="text-sm font-medium"
                    style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    #{order.id}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Order Date
                  </p>
                  <p className="text-sm"
                    style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                    {order.date}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Carrier
                  </p>
                  <p className="text-sm"
                    style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                    {order.carrier}
                  </p>
                </div>
                <div>
                  <p className="text-xs tracking-widest uppercase mb-1"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    Est. Delivery
                  </p>
                  <p className="text-sm"
                    style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    {order.estimatedDelivery}
                  </p>
                </div>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="p-6"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-light"
                  style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                  Shipment Progress
                </h2>
                <div className="flex items-center gap-2 px-3 py-1"
                  style={{ background: 'rgba(110,181,201,0.1)', border: '1px solid rgba(110,181,201,0.3)' }}>
                  <FiTruck size={12} style={{ color: '#6eb5c9' }} />
                  <span className="text-xs tracking-widest uppercase"
                    style={{ color: '#6eb5c9', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                    {order.status}
                  </span>
                </div>
              </div>

              {/* Desktop Progress */}
              <div className="hidden md:block">
                {/* Step Icons */}
                <div className="relative mb-3">
                  {/* Progress Line Background */}
                  <div className="absolute top-5 left-0 right-0 h-px"
                    style={{ background: 'rgba(201,169,110,0.2)', margin: '0 2.5%' }} />
                  {/* Progress Line Fill */}
                  <div className="absolute top-5 left-0 h-px transition-all duration-1000"
                    style={{
                      background: '#c9a96e',
                      width: `${progressPercent}%`,
                      marginLeft: '2.5%',
                    }} />
                  {/* Steps */}
                  <div className="relative flex justify-between">
                    {order.timeline.map((step, i) => {
                      const color = statusColors[step.status] || '#c9a96e';
                      return (
                        <div key={i} className="flex flex-col items-center" style={{ width: '18%' }}>
                          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-2 transition-all duration-500"
                            style={{
                              background: step.completed ? color : 'transparent',
                              border: `2px solid ${step.completed ? color : 'rgba(201,169,110,0.3)'}`,
                              boxShadow: step.active ? `0 0 12px ${color}60` : 'none',
                            }}>
                            {step.completed
                              ? i === currentStep - 1 && step.active
                                ? <FiTruck size={14} style={{ color: '#0a0806' }} />
                                : <FiCheck size={14} style={{ color: '#0a0806' }} />
                              : <FiClock size={14} style={{ color: 'rgba(201,169,110,0.4)' }} />
                            }
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
                {/* Step Labels */}
                <div className="flex justify-between">
                  {order.timeline.map((step, i) => (
                    <div key={i} className="text-center" style={{ width: '18%' }}>
                      <p className="text-xs tracking-wider"
                        style={{
                          color: step.completed ? '#c9a96e' : '#7a6e5f',
                          fontFamily: 'Montserrat, sans-serif',
                          fontWeight: step.active ? 600 : 400,
                          fontSize: '10px',
                        }}>
                        {step.status}
                      </p>
                      <p className="text-xs mt-1"
                        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '9px' }}>
                        {step.date}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Mobile Timeline */}
              <div className="md:hidden space-y-0">
                {order.timeline.map((step, i) => {
                  const color = statusColors[step.status] || '#c9a96e';
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="flex flex-col items-center">
                        <div className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0"
                          style={{
                            background: step.completed ? color : 'transparent',
                            border: `2px solid ${step.completed ? color : 'rgba(201,169,110,0.2)'}`,
                          }}>
                          {step.completed
                            ? <FiCheck size={12} style={{ color: '#0a0806' }} />
                            : <FiClock size={12} style={{ color: 'rgba(201,169,110,0.3)' }} />
                          }
                        </div>
                        {i < order.timeline.length - 1 && (
                          <div className="w-px flex-1 my-1"
                            style={{ background: step.completed ? color : 'rgba(201,169,110,0.15)', minHeight: '32px' }} />
                        )}
                      </div>
                      <div className="pb-6">
                        <p className="text-xs tracking-wider font-medium mb-1"
                          style={{ color: step.completed ? color : '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {step.status}
                        </p>
                        <p className="text-xs mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {step.date} • {step.time}
                        </p>
                        <p className="text-xs leading-relaxed"
                          style={{ color: step.completed ? '#faf8f4' : '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Detailed Timeline */}
            <div className="hidden md:block p-6"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <h2 className="text-xl font-light mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                Tracking History
              </h2>
              <div className="space-y-0">
                {order.timeline.map((step, i) => {
                  const color = statusColors[step.status] || '#c9a96e';
                  return (
                    <div key={i} className="flex gap-6">
                      <div className="flex flex-col items-center">
                        <div className="w-3 h-3 rounded-full flex-shrink-0 mt-1"
                          style={{ background: step.completed ? color : 'rgba(201,169,110,0.2)' }} />
                        {i < order.timeline.length - 1 && (
                          <div className="w-px flex-1 my-1"
                            style={{ background: 'rgba(201,169,110,0.15)', minHeight: '40px' }} />
                        )}
                      </div>
                      <div className="pb-6 flex-1">
                        <div className="flex items-center justify-between mb-1">
                          <p className="text-sm font-medium"
                            style={{
                              color: step.completed ? color : '#7a6e5f',
                              fontFamily: 'Montserrat, sans-serif',
                              fontWeight: step.active ? 600 : 400,
                            }}>
                            {step.status}
                          </p>
                          <p className="text-xs"
                            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                            {step.date} • {step.time}
                          </p>
                        </div>
                        <p className="text-xs leading-relaxed"
                          style={{
                            color: step.completed ? '#e8d5b0' : '#7a6e5f',
                            fontFamily: 'Montserrat, sans-serif',
                          }}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Delivery Address & Items */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

              {/* Address */}
              <div className="p-6"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <FiMapPin size={14} style={{ color: '#c9a96e' }} />
                  <h3 className="text-lg font-light"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                    Delivery Address
                  </h3>
                </div>
                <p className="text-sm leading-relaxed mb-4"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  {order.address}
                </p>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-xs"
                    style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    <FiPackage size={11} style={{ color: '#c9a96e' }} />
                    Tracking: {order.trackingNumber}
                  </div>
                </div>
              </div>

              {/* Items */}
              <div className="p-6"
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="flex items-center gap-2 mb-4">
                  <FiPackage size={14} style={{ color: '#c9a96e' }} />
                  <h3 className="text-lg font-light"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                    Items in Order
                  </h3>
                </div>
                <div className="space-y-3">
                  {order.items.map((item, i) => (
                    <div key={i} className="flex gap-3 items-center">
                      <div className="overflow-hidden flex-shrink-0"
                        style={{ width: '48px', height: '56px', background: '#0a0806' }}>
                        <img src={item.image} alt={item.name}
                          className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1">
                        <p className="text-xs font-light"
                          style={{ color: '#faf8f4', fontFamily: 'Cormorant Garamond, serif', fontSize: '0.95rem' }}>
                          {item.name}
                        </p>
                        <p className="text-xs"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Qty: {item.qty}
                        </p>
                      </div>
                      <span className="text-xs"
                        style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                        ${item.price}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Support */}
            <div className="p-6"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <h3 className="text-lg font-light mb-4"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                Need Help?
              </h3>
              <div className="flex flex-col sm:flex-row gap-4">
                <a href="mailto:hello@velvetcosmetics.com"
                  className="flex items-center gap-3 px-5 py-3 border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e' }}>
                  <FiMail size={14} />
                  <span className="text-xs tracking-widest uppercase"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Email Support
                  </span>
                </a>
                <a href="tel:+1234567890"
                  className="flex items-center gap-3 px-5 py-3 border transition-all duration-300 hover:opacity-70"
                  style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e' }}>
                  <FiPhone size={14} />
                  <span className="text-xs tracking-widest uppercase"
                    style={{ fontFamily: 'Montserrat, sans-serif' }}>
                    Call Support
                  </span>
                </a>
              </div>
            </div>

            {/* Back to Orders */}
            <div>
              <Link to="/orders"
                className="inline-flex items-center gap-2 text-xs tracking-widest uppercase transition-all duration-300"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                <FiArrowLeft size={12} /> Back to Orders
              </Link>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}