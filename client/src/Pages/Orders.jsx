import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  FiPackage, FiTruck, FiCheck, FiClock,
  FiX, FiChevronDown, FiChevronUp, FiShoppingBag
} from 'react-icons/fi';

const mockOrders = [
  {
    id: 'VLT9X2KP1',
    date: '12 March 2026',
    status: 'Delivered',
    total: 143.00,
    items: [
      { name: 'Velvet Noir Lipstick', category: 'Lips', price: 48, qty: 1, image: 'https://images.unsplash.com/photo-1586495777744-4e6232bf4f3e?w=200&q=80', shade: '#C41E3A' },
      { name: 'Midnight Serum', category: 'Skincare', price: 95, qty: 1, image: 'https://images.unsplash.com/photo-1570194065650-d99fb4b38796?w=200&q=80', shade: null },
    ],
    address: '123 Beauty Lane, New York, USA',
    shipping: 'Standard Shipping',
  },
  {
    id: 'VLT4MN8Q2',
    date: '05 March 2026',
    status: 'Shipped',
    total: 72.00,
    items: [
      { name: 'Golden Hour Foundation', category: 'Face', price: 72, qty: 1, image: 'https://images.unsplash.com/photo-1631214524020-3c69f47e2b60?w=200&q=80', shade: '#E8AC84' },
    ],
    address: '456 Glamour Ave, Los Angeles, USA',
    shipping: 'Express Shipping',
  },
  {
    id: 'VLT7RS3T4',
    date: '01 March 2026',
    status: 'Processing',
    total: 107.00,
    items: [
      { name: 'Smoky Eye Palette', category: 'Eyes', price: 65, qty: 1, image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?w=200&q=80', shade: null },
      { name: 'Rose Gold Highlighter', category: 'Face', price: 42, qty: 1, image: 'https://images.unsplash.com/photo-1596462502278-27bfdc403348?w=200&q=80', shade: null },
    ],
    address: '789 Luxury Blvd, Miami, USA',
    shipping: 'Standard Shipping',
  },
  {
    id: 'VLT2WX6Y5',
    date: '20 February 2026',
    status: 'Cancelled',
    total: 88.00,
    items: [
      { name: 'Velvet Perfume Mist', category: 'Fragrance', price: 88, qty: 1, image: 'https://images.unsplash.com/photo-1541643600914-78b084683702?w=200&q=80', shade: null },
    ],
    address: '321 Elegance St, Chicago, USA',
    shipping: 'Standard Shipping',
  },
];

const statusConfig = {
  Delivered: { icon: FiCheck, color: '#c9a96e', bg: 'rgba(201,169,110,0.1)', label: 'Delivered' },
  Shipped: { icon: FiTruck, color: '#6eb5c9', bg: 'rgba(110,181,201,0.1)', label: 'Shipped' },
  Processing: { icon: FiClock, color: '#c9b96e', bg: 'rgba(201,185,110,0.1)', label: 'Processing' },
  Cancelled: { icon: FiX, color: '#c96e6e', bg: 'rgba(201,110,110,0.1)', label: 'Cancelled' },
};

export default function Orders() {
  const [expandedOrder, setExpandedOrder] = useState(null);
  const [activeFilter, setActiveFilter] = useState('All');

  const filters = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];

  const filteredOrders = activeFilter === 'All'
    ? mockOrders
    : mockOrders.filter(o => o.status === activeFilter);

  const toggleOrder = (id) => {
    setExpandedOrder(expandedOrder === id ? null : id);
  };

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh', paddingTop: '80px' }}>
      <div className="max-w-5xl mx-auto px-6 py-12">

        {/* Header */}
        <div className="mb-10">
          <p className="text-xs tracking-[0.4em] uppercase mb-2"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            My Account
          </p>
          <h1 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            My Orders
          </h1>
          <p className="text-xs mt-2 tracking-wider"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            {mockOrders.length} orders placed
          </p>
        </div>

        {/* Filter Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {filters.map(f => (
            <button key={f}
              onClick={() => setActiveFilter(f)}
              className="px-5 py-2 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                background: activeFilter === f ? '#c9a96e' : 'transparent',
                color: activeFilter === f ? '#0a0806' : '#7a6e5f',
                border: '1px solid rgba(201,169,110,0.3)',
                fontFamily: 'Montserrat, sans-serif',
                fontWeight: activeFilter === f ? 600 : 400,
              }}>
              {f}
            </button>
          ))}
        </div>

        {/* Empty State */}
        {filteredOrders.length === 0 && (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
              style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)' }}>
              <FiPackage size={24} style={{ color: '#c9a96e' }} />
            </div>
            <p className="text-sm tracking-wider"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              No {activeFilter.toLowerCase()} orders found.
            </p>
          </div>
        )}

        {/* Orders List */}
        <div className="space-y-4">
          {filteredOrders.map(order => {
            const status = statusConfig[order.status];
            const StatusIcon = status.icon;
            const isExpanded = expandedOrder === order.id;

            return (
              <div key={order.id}
                style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>

                {/* Order Header */}
                <div className="p-5">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">

                    {/* Left Info */}
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      {/* Status Badge */}
                      <div className="flex items-center gap-2 px-3 py-1.5 w-fit"
                        style={{ background: status.bg, border: `1px solid ${status.color}30` }}>
                        <StatusIcon size={12} style={{ color: status.color }} />
                        <span className="text-xs tracking-widest uppercase"
                          style={{ color: status.color, fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          {status.label}
                        </span>
                      </div>

                      <div>
                        <p className="text-xs tracking-wider mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Order #{order.id}
                        </p>
                        <p className="text-xs tracking-wider"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Placed on {order.date}
                        </p>
                      </div>
                    </div>

                    {/* Right Info */}
                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <p className="text-xs tracking-wider mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Total
                        </p>
                        <p className="text-lg font-light"
                          style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                      <button
                        onClick={() => toggleOrder(order.id)}
                        className="w-8 h-8 flex items-center justify-center border transition-all duration-300"
                        style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e' }}>
                        {isExpanded ? <FiChevronUp size={14} /> : <FiChevronDown size={14} />}
                      </button>
                    </div>
                  </div>

                  {/* Product Thumbnails Preview */}
                  {!isExpanded && (
                    <div className="flex gap-2 mt-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="overflow-hidden"
                          style={{ width: '48px', height: '56px', border: '1px solid rgba(201,169,110,0.15)' }}>
                          <img src={item.image} alt={item.name}
                            className="w-full h-full object-cover" style={{ opacity: 0.8 }} />
                        </div>
                      ))}
                      <div className="flex items-center ml-2">
                        <span className="text-xs tracking-wider"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          {order.items.length} {order.items.length === 1 ? 'item' : 'items'}
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expanded Order Details */}
                {isExpanded && (
                  <div style={{ borderTop: '1px solid rgba(201,169,110,0.1)' }}>

                    {/* Items */}
                    <div className="p-5 space-y-4">
                      {order.items.map((item, i) => (
                        <div key={i} className="flex gap-4 items-center">
                          <div className="flex-shrink-0 overflow-hidden"
                            style={{ width: '70px', height: '84px', background: '#0a0806' }}>
                            <img src={item.image} alt={item.name}
                              className="w-full h-full object-cover" />
                          </div>
                          <div className="flex-1">
                            <p className="text-xs tracking-widest uppercase mb-1"
                              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                              {item.category}
                            </p>
                            <p className="font-light mb-1"
                              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', fontSize: '1.05rem' }}>
                              {item.name}
                            </p>
                            {item.shade && (
                              <div className="flex items-center gap-2">
                                <div className="w-3 h-3 rounded-full"
                                  style={{ background: item.shade, border: '1px solid rgba(201,169,110,0.3)' }} />
                                <span className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                                  {item.shade}
                                </span>
                              </div>
                            )}
                            <p className="text-xs mt-1"
                              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                              Qty: {item.qty}
                            </p>
                          </div>
                          <span className="text-sm"
                            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                            ${(item.price * item.qty).toFixed(2)}
                          </span>
                        </div>
                      ))}
                    </div>

                    {/* Order Info */}
                    <div className="px-5 pb-5 grid grid-cols-1 sm:grid-cols-3 gap-4"
                      style={{ borderTop: '1px solid rgba(201,169,110,0.1)', paddingTop: '1.25rem' }}>
                      <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Shipping Address
                        </p>
                        <p className="text-xs leading-relaxed"
                          style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                          {order.address}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Shipping Method
                        </p>
                        <p className="text-xs"
                          style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                          {order.shipping}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs tracking-widest uppercase mb-1"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Order Total
                        </p>
                        <p className="text-lg font-light"
                          style={{ color: '#c9a96e', fontFamily: 'Cormorant Garamond, serif' }}>
                          ${order.total.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="px-5 pb-5 flex flex-wrap gap-3">
                      {order.status !== 'Cancelled' && (
                        <Link to={`/track/${order.id}`}
                          className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
                          style={{
                            background: '#c9a96e', color: '#0a0806',
                            fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                          }}>
                          <FiTruck size={12} /> Track Order
                        </Link>
                      )}
                      {order.status === 'Delivered' && (
                        <button
                          className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-70 border"
                          style={{
                            borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e',
                            fontFamily: 'Montserrat, sans-serif',
                          }}>
                          <FiShoppingBag size={12} /> Reorder
                        </button>
                      )}
                      {(order.status === 'Processing') && (
                        <button
                          className="flex items-center gap-2 px-5 py-2.5 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-70 border"
                          style={{
                            borderColor: 'rgba(201,110,110,0.3)', color: '#c96e6e',
                            fontFamily: 'Montserrat, sans-serif',
                          }}>
                          <FiX size={12} /> Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Continue Shopping */}
        <div className="text-center mt-12">
          <Link to="/"
            className="inline-flex items-center gap-2 px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{
              border: '1px solid rgba(201,169,110,0.4)',
              color: '#c9a96e',
              fontFamily: 'Montserrat, sans-serif',
            }}>
            <FiShoppingBag size={14} /> Continue Shopping
          </Link>
        </div>

      </div>
    </div>
  );
}