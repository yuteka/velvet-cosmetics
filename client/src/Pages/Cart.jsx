import { Link, useNavigate } from 'react-router-dom';
import {
  FiTrash2, FiMinus, FiPlus, FiShoppingBag,
  FiArrowLeft, FiTag, FiTruck
} from 'react-icons/fi';
import { useDispatch, useSelector } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/slices/cartSlice';
import { showNotification } from '../store/slices/notificationSlice';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Cart() {
  // ✅ Redux only — no useCart()
  const dispatch = useDispatch();
  const { items: cartItems, totalAmount: cartTotal } = useSelector(state => state.cart);
  const shipping = cartTotal >= 100 ? 0 : 9.99;
  const cartGrandTotal = cartTotal + shipping;

  const [coupon, setCoupon] = useState('');
  const [couponApplied, setCouponApplied] = useState(false);
  const [couponData, setCouponData] = useState(null);
  const [couponError, setCouponError] = useState('');
  const [couponLoading, setCouponLoading] = useState(false);
  const navigate = useNavigate();

  // ✅ Supabase coupon validation
  const handleCoupon = async () => {
    if (!coupon.trim()) return;
    setCouponLoading(true);
    setCouponError('');
    setCouponApplied(false);
    setCouponData(null);

    const { data, error } = await supabase
      .from('coupons')
      .select('*')
      .eq('code', coupon.toUpperCase().trim())
      .eq('active', true)
      .single();

    if (error || !data) {
      setCouponError('Invalid or expired coupon code.');
      dispatch(showNotification({ message: 'Invalid or expired coupon code.', type: 'error' }));
      setCouponLoading(false);
      return;
    }

    if (data.min_order > 0 && cartTotal < data.min_order) {
      setCouponError(`Minimum order $${data.min_order} required for this coupon.`);
      setCouponLoading(false);
      return;
    }

    dispatch(showNotification({ message: 'Coupon applied successfully!', type: 'success' }));
    setCouponApplied(true);
    setCouponData(data);
    setCouponLoading(false);
  };

  const discount = couponApplied && couponData
    ? couponData.type === 'percentage'
      ? cartTotal * (couponData.discount / 100)
      : Math.min(couponData.discount, cartTotal)
    : 0;

  const finalTotal = cartGrandTotal - discount;

  const removeCoupon = () => {
    setCouponApplied(false);
    setCouponData(null);
    setCoupon('');
    setCouponError('');
    dispatch(showNotification({ message: 'Coupon removed.', type: 'info' }));
  };

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6"
        style={{ background: '#0a0806', paddingTop: '80px' }}>
        <div className="text-center">
          <div className="w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6"
            style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>
            <FiShoppingBag size={32} style={{ color: '#c9a96e' }} />
          </div>
          <h2 className="text-3xl font-light mb-3"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Your Cart is Empty
          </h2>
          <p className="text-sm mb-8"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Discover our luxury collection and add your favourites.
          </p>
          <Link to="/"
            className="inline-block px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            Continue Shopping
          </Link>
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
            Your Selection
          </p>
          <h1 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Shopping Cart
          </h1>
          <p className="text-xs mt-2 tracking-wider"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            {cartItems.length} {cartItems.length === 1 ? 'item' : 'items'}
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10">

          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">

            {/* Column Headers */}
            <div className="hidden md:grid grid-cols-12 gap-4 pb-3 text-xs tracking-widest uppercase"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
              <div className="col-span-6">Product</div>
              <div className="col-span-2 text-center">Price</div>
              <div className="col-span-2 text-center">Quantity</div>
              <div className="col-span-2 text-center">Total</div>
            </div>

            {cartItems.map((item, index) => (
              <div key={`${item.id}-${index}`}
                className="grid grid-cols-12 gap-4 py-5 items-center"
                style={{ borderBottom: '1px solid rgba(201,169,110,0.1)' }}>

                {/* Product */}
                <div className="col-span-12 md:col-span-6 flex gap-4">
                  <Link to={`/product/${item.slug}`}>
                    <div className="overflow-hidden flex-shrink-0"
                      style={{ width: '90px', height: '110px', background: '#111009' }}>
                      <img src={item.image} alt={item.name}
                        className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                    </div>
                  </Link>
                  <div className="flex flex-col justify-between py-1">
                    <div>
                      <p className="text-xs tracking-widest uppercase mb-1"
                        style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                        {item.category}
                      </p>
                      <Link to={`/product/${item.slug}`}>
                        <h3 className="font-light mb-1 hover:text-yellow-300 transition-colors"
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', fontSize: '1.1rem' }}>
                          {item.name}
                        </h3>
                      </Link>
                      {item.shade && (
                        <div className="flex items-center gap-2 mt-1">
                          <div className="w-3 h-3 rounded-full"
                            style={{ background: item.shade, border: '1px solid rgba(201,169,110,0.3)' }} />
                          <span className="text-xs tracking-wider"
                            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                            {item.shade}
                          </span>
                        </div>
                      )}
                    </div>
                    {/* ✅ Redux dispatch */}
                    <button
                      onClick={() => {
                        dispatch(removeFromCart(item.id));
                        dispatch(showNotification({ message: 'Item removed from cart.', type: 'info' }));
                      }}
                      className="flex items-center gap-1 text-xs tracking-wider transition-all duration-300 w-fit"
                      style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                      onMouseEnter={e => e.currentTarget.style.color = '#e8a09a'}
                      onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                      <FiTrash2 size={11} /> Remove
                    </button>
                  </div>
                </div>

                {/* Price */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="text-sm" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    ${item.price}
                  </span>
                </div>

                {/* ✅ Quantity — Redux dispatch */}
                <div className="col-span-4 md:col-span-2 flex justify-center">
                  <div className="flex items-center border" style={{ borderColor: 'rgba(201,169,110,0.3)' }}>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity - 1 }))}
                      className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:opacity-70"
                      style={{ color: '#c9a96e' }}>
                      <FiMinus size={11} />
                    </button>
                    <span className="w-8 text-center text-xs"
                      style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => dispatch(updateQuantity({ id: item.id, quantity: item.quantity + 1 }))}
                      className="w-8 h-8 flex items-center justify-center transition-all duration-300 hover:opacity-70"
                      style={{ color: '#c9a96e' }}>
                      <FiPlus size={11} />
                    </button>
                  </div>
                </div>

                {/* ✅ Total — item.totalPrice */}
                <div className="col-span-4 md:col-span-2 text-center">
                  <span className="text-sm font-medium"
                    style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                    ${item.totalPrice?.toFixed(2)}
                  </span>
                </div>
              </div>
            ))}

            {/* Cart Actions */}
            <div className="flex items-center justify-between pt-4">
              <Link to="/"
                className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all duration-300"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                <FiArrowLeft size={12} /> Continue Shopping
              </Link>
              {/* ✅ Redux clearCart */}
              <button
                onClick={() => {
                  dispatch(clearCart());
                  dispatch(showNotification({ message: 'Shopping cart cleared.', type: 'info' }));
                }}
                className="text-xs tracking-widest uppercase transition-all duration-300"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#e8a09a'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                Clear Cart
              </button>
            </div>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="p-6 sticky top-24"
              style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
              <h2 className="text-xl font-light mb-6"
                style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                Order Summary
              </h2>

              {/* Coupon Section */}
              <div className="mb-6">
                <p className="text-xs tracking-widest uppercase mb-3"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Coupon Code
                </p>

                {couponApplied && couponData ? (
                  <div className="flex items-center justify-between px-3 py-2.5"
                    style={{ background: 'rgba(201,169,110,0.08)', border: '1px solid rgba(201,169,110,0.3)' }}>
                    <div className="flex items-center gap-2">
                      <FiTag size={12} style={{ color: '#c9a96e' }} />
                      <span className="text-xs tracking-wider font-medium"
                        style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                        {couponData.code}
                      </span>
                    </div>
                    <button onClick={removeCoupon}
                      className="text-xs tracking-wider transition-all duration-200 hover:opacity-70"
                      style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                      Remove
                    </button>
                  </div>
                ) : (
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <FiTag size={12} className="absolute left-3 top-1/2 -translate-y-1/2"
                        style={{ color: '#7a6e5f' }} />
                      <input
                        type="text"
                        value={coupon}
                        onChange={e => { setCoupon(e.target.value); setCouponError(''); }}
                        onKeyDown={e => e.key === 'Enter' && handleCoupon()}
                        placeholder="Enter coupon code"
                        className="w-full bg-transparent border pl-8 pr-3 py-2 text-xs outline-none tracking-wider uppercase"
                        style={{
                          borderColor: couponError ? 'rgba(232,160,154,0.5)' : 'rgba(201,169,110,0.3)',
                          color: '#faf8f4',
                          fontFamily: 'Montserrat, sans-serif',
                        }}
                      />
                    </div>
                    <button
                      onClick={handleCoupon}
                      disabled={couponLoading || !coupon.trim()}
                      className="px-4 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80 disabled:opacity-50"
                      style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600, minWidth: '64px' }}>
                      {couponLoading ? '...' : 'Apply'}
                    </button>
                  </div>
                )}

                {couponApplied && couponData && (
                  <p className="text-xs mt-2 tracking-wider" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    ✓ {couponData.type === 'percentage'
                      ? `${couponData.discount}% discount applied!`
                      : `$${couponData.discount} off applied!`}
                  </p>
                )}

                {couponError && (
                  <p className="text-xs mt-2 tracking-wider" style={{ color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
                    {couponError}
                  </p>
                )}
              </div>

              {/* Price Breakdown */}
              <div className="space-y-3 pb-4" style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="flex justify-between text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  <span>Subtotal</span>
                  <span>${cartTotal.toFixed(2)}</span>
                </div>

                {couponApplied && couponData && (
                  <div className="flex justify-between text-xs tracking-wider"
                    style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    <span>
                      Discount ({couponData.type === 'percentage'
                        ? `${couponData.discount}%`
                        : `$${couponData.discount} off`})
                    </span>
                    <span>-${discount.toFixed(2)}</span>
                  </div>
                )}

                <div className="flex justify-between text-xs tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  <span className="flex items-center gap-1">
                    <FiTruck size={11} /> Shipping
                  </span>
                  <span style={{ color: shipping === 0 ? '#c9a96e' : '#7a6e5f' }}>
                    {shipping === 0 ? 'FREE' : `$${shipping.toFixed(2)}`}
                  </span>
                </div>
              </div>

              {/* Total */}
              <div className="flex justify-between items-center py-4 mb-6">
                <span className="text-sm tracking-widest uppercase"
                  style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                  Total
                </span>
                <span className="text-2xl font-light"
                  style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                  ${finalTotal.toFixed(2)}
                </span>
              </div>

              {/* Checkout Button */}
              <button
                onClick={() => navigate('/payment')}
                className="w-full py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80 flex items-center justify-center gap-2"
                style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                <FiShoppingBag size={14} />
                Proceed to Checkout
              </button>

              {cartTotal < 100 && (
                <p className="text-xs text-center mt-4 tracking-wider"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                  Add ${(100 - cartTotal).toFixed(2)} more for free shipping
                </p>
              )}

              {/* Payment Icons */}
              <div className="flex items-center justify-center gap-3 mt-6">
                {['VISA', 'MC', 'AMEX', 'PayPal'].map(card => (
                  <span key={card} className="text-xs px-2 py-1 border tracking-wider"
                    style={{ borderColor: 'rgba(201,169,110,0.2)', color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                    {card}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}