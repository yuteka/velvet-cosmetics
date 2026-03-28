import { supabase } from '../lib/supabase';
import { useState, useRef, useEffect } from 'react';
import { FiMessageCircle, FiX, FiSend, FiShoppingBag } from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';

// ─── Static keyword responses ────────────────────────────────────────────────
const getStaticResponse = (msg, user) => {
  const m = msg.toLowerCase();

  if (m.match(/^(hi|hello|hey|vanakkam)/))
    return user
      ? `✨ Hello ${user.firstName}! Welcome back to Velvet. How can I help you?`
      : `✨ Welcome to Velvet Luxury Cosmetics! How can I help you today?`;

  if (m.includes('discount') || m.includes('coupon') || m.includes('offer') || m.includes('promo'))
    return `🎁 Use code VELVET20 for 20% off!\n\nFree shipping on orders over $100 🚚`;

  if (m.includes('shipping') || m.includes('delivery'))
    return `🚚 Shipping options:\n\n• Standard: 5–7 days (FREE over $100)\n• Express: 2–3 days ($19.99)\n• Overnight: 1 day ($39.99)`;

  if (m.includes('return') || m.includes('refund'))
    return `↩️ 30-day hassle-free returns.\nFull refund for damaged products.\nContact: hello@velvetcosmetics.com`;

  if (m.includes('payment') || m.includes('pay'))
    return `💳 We accept:\nVisa, Mastercard, Amex, PayPal, Apple Pay\n\nAll payments 100% secure 🔒`;

  if (m.includes('contact') || m.includes('support'))
    return `📞 hello@velvetcosmetics.com\nMon–Fri: 9am – 6pm`;

  if (m.includes('vegan') || m.includes('cruelty'))
    return `🌿 Velvet is 100% cruelty-free, vegan & ethically sourced!`;

  if (m.includes('thank') || m.includes('bye'))
    return `✨ Thank you for choosing Velvet! Have a beautiful day 💄`;

  return null;
};

const QUICK_REPLIES = ['💄 Show products', '🎁 Discounts?', '🚚 Shipping', '📦 Track order'];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: 'assistant', content: "✨ Welcome to Velvet! I'm your beauty assistant. How can I help?" }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { user } = useAuth();

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addMsg = (role, content) =>
    setMessages(prev => [...prev, { role, content }]);

  // ── Fetch all products ──────────────────────────────────────────────────────
  const fetchProducts = async () => {
    const { data, error } = await supabase.from('products').select('*').order('name');
    if (error || !data?.length) return '❌ Could not load products. Try again!';
    return (
      `💄 Our luxury collection:\n\n` +
      data.map((p, i) => `${i + 1}. ${p.name} — $${p.price}${p.badge ? ` ${p.badge}` : ''}`).join('\n') +
      `\n\n🛒 Type a product name to know more!`
    );
  };

  // ── Fetch single product by keyword ────────────────────────────────────────
  const fetchProductDetail = async (keyword) => {
    const { data } = await supabase
      .from('products')
      .select('*')
      .ilike('name', `%${keyword}%`)
      .limit(1)
      .single();
    if (!data) return null;
    return (
      `💄 ${data.name} — $${data.price}\n\n` +
      `${data.description || ''}\n` +
      (data.features ? data.features.map(f => `✓ ${f}`).join('\n') : '') +
      (data.badge ? `\n\n${data.badge}` : '')
    );
  };

  // ── Fetch logged-in user profile ────────────────────────────────────────────
  const fetchUserProfile = async () => {
    const { data } = await supabase
      .from('users')
      .select('*')
      .eq('id', user.id)
      .single();
    return data;
  };

  // ── Fetch order by ID (no login needed) ────────────────────────────────────
  const fetchOrder = async (orderId) => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('order_id', orderId.toUpperCase())
      .single();
    return data;
  };

  // ── Fetch orders for logged-in user ────────────────────────────────────────
  const fetchUserOrders = async () => {
    const { data } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('date', { ascending: false })
      .limit(5);
    return data;
  };

  // ─── Main send handler ──────────────────────────────────────────────────────
  const sendMessage = async () => {
    if (!input.trim() || loading) return;
    const userMessage = input.trim();
    setInput('');
    addMsg('user', userMessage);
    setLoading(true);

    const m = userMessage.toLowerCase();

    try {
      // 1️⃣ Order ID typed (VLT...) — works WITHOUT login
      const orderIdMatch = userMessage.match(/VLT[A-Z0-9]+/i);
      if (orderIdMatch) {
        const data = await fetchOrder(orderIdMatch[0]);
        if (data) {
          addMsg('assistant',
            `📦 Order Details:\n\n` +
            `Order ID: ${data.order_id}\n` +
            `Date: ${data.date}\n` +
            `Total: $${data.total}\n` +
            `Status: ${data.status || 'Processing'}\n` +
            `Payment: ${data.payment_method || 'Card'}\n\n` +
            `📍 Shipping to:\n${data.shipping_name}\n${data.shipping_address}, ${data.shipping_city}\n${data.shipping_zip}, ${data.shipping_country}\n\n` +
            `📞 ${data.shipping_phone || 'N/A'}\n📧 ${data.shipping_email || 'N/A'}`
          );
        } else {
          addMsg('assistant', `❌ Order "${orderIdMatch[0]}" not found.\nPlease check your Order ID and try again.`);
        }
        setLoading(false);
        return;
      }

      // 2️⃣ Track order intent
      if (m.includes('track') || (m.includes('order') && (m.includes('my') || m.includes('status')))) {
        if (user) {
          const orders = await fetchUserOrders();
          if (orders?.length) {
            addMsg('assistant',
              `📦 Your recent orders:\n\n` +
              orders.map(o =>
                `• ${o.order_id} — $${o.total} — ${o.status || 'Processing'} (${o.date})`
              ).join('\n') +
              `\n\nType any Order ID for full details.`
            );
          } else {
            addMsg('assistant', `📦 You have no orders yet.\nStart shopping to place your first order! 🛒`);
          }
        } else {
          addMsg('assistant',
            `📦 To track your order, type your Order ID here.\n(Starts with VLT — e.g. VLT10023)\n\nOr login to see all your orders automatically!`
          );
        }
        setLoading(false);
        return;
      }

      // 3️⃣ Profile / account details — login required
      if (m.includes('my profile') || m.includes('my account') || m.includes('my detail') || m.includes('who am i')) {
        if (!user) {
          addMsg('assistant', `👤 Please login to view your profile and account details.`);
          setLoading(false);
          return;
        }
        const profile = await fetchUserProfile();
        addMsg('assistant',
          `👤 Your Profile:\n\n` +
          `Name: ${profile?.first_name || user.firstName} ${profile?.last_name || user.lastName}\n` +
          `Email: ${profile?.email || user.email}\n` +
          (profile?.phone ? `Phone: ${profile.phone}\n` : '') +
          (profile?.address ? `Address: ${profile.address}\n` : '') +
          (profile?.member_since ? `Member since: ${profile.member_since}\n` : '') +
          (profile?.total_orders != null ? `Total orders: ${profile.total_orders}` : '')
        );
        setLoading(false);
        return;
      }

      // 4️⃣ Show all products (no login needed)
      if (m.includes('product') || m.includes('show') || m.includes('collection') || m.includes('bestseller') || m.includes('items')) {
        const reply = await fetchProducts();
        addMsg('assistant', reply);
        setLoading(false);
        return;
      }

      // 5️⃣ Product detail by keyword — Q&A hint based on login state
      const productKeywords = ['lipstick', 'lip', 'foundation', 'serum', 'palette', 'eye shadow', 'highlighter', 'blush', 'perfume', 'fragrance', 'cream', 'mist'];
      const matched = productKeywords.find(k => m.includes(k));
      if (matched) {
        const reply = await fetchProductDetail(matched);
        if (reply) {
          addMsg('assistant',
            reply +
            (user
              ? `\n\n💬 Any questions about this product? Ask me!`
              : `\n\n💬 Login to ask questions about this product!`)
          );
          setLoading(false);
          return;
        }
      }

      // 6️⃣ Static responses (shipping, discount, returns, etc.)
      const staticReply = getStaticResponse(userMessage, user);
      if (staticReply) {
        addMsg('assistant', staticReply);
        setLoading(false);
        return;
      }

      // 7️⃣ Default fallback
      addMsg('assistant',
        `✨ I can help you with:\n\n` +
        `💄 Products & prices\n` +
        `🎁 Discounts & offers\n` +
        `🚚 Shipping & delivery\n` +
        `📦 Order tracking (type your Order ID)\n` +
        `👤 Your profile & orders${!user ? ' (login required)' : ''}\n` +
        `↩️ Returns & refunds`
      );

    } catch (err) {
      addMsg('assistant', '❌ Something went wrong. Please try again!');
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all duration-300 hover:scale-110"
        style={{ background: 'linear-gradient(135deg, #c9a96e, #f0d898)', color: '#0a0806' }}>
        {isOpen ? <FiX size={22} /> : <FiMessageCircle size={22} />}
      </button>

      {isOpen && (
        <div
          className="fixed bottom-24 right-6 z-50 w-80 md:w-96 flex flex-col shadow-2xl"
          style={{ height: '520px', background: '#0a0806', border: '1px solid rgba(201,169,110,0.3)', borderRadius: '8px' }}>

          {/* Header */}
          <div
            className="p-4 flex items-center justify-between"
            style={{ background: 'linear-gradient(135deg, #8b6914, #c9a96e)', borderRadius: '8px 8px 0 0' }}>
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full flex items-center justify-center" style={{ background: 'rgba(10,8,6,0.3)' }}>
                <FiShoppingBag size={16} style={{ color: '#faf8f4' }} />
              </div>
              <div>
                <h3 style={{ color: '#0a0806', fontFamily: 'Cormorant Garamond, serif', fontSize: '1.1rem' }}>
                  Velvet Assistant
                </h3>
                <p className="text-xs" style={{ color: 'rgba(10,8,6,0.7)', fontFamily: 'Montserrat, sans-serif' }}>
                  {user ? `● Logged in as ${user.firstName}` : '● Always here for you'}
                </p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} style={{ color: 'rgba(10,8,6,0.6)' }}>
              <FiX size={18} />
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ scrollbarWidth: 'none' }}>
            {messages.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className="max-w-[85%] px-3 py-2 text-xs leading-relaxed whitespace-pre-line"
                  style={{
                    background: msg.role === 'user' ? 'linear-gradient(135deg, #8b6914, #c9a96e)' : '#111009',
                    color: msg.role === 'user' ? '#0a0806' : '#e8d5b0',
                    border: msg.role === 'assistant' ? '1px solid rgba(201,169,110,0.2)' : 'none',
                    borderRadius: msg.role === 'user' ? '12px 12px 0 12px' : '12px 12px 12px 0',
                    fontFamily: 'Montserrat, sans-serif',
                    fontWeight: msg.role === 'user' ? 600 : 400,
                  }}>
                  {msg.content}
                </div>
              </div>
            ))}

            {loading && (
              <div className="flex justify-start">
                <div className="px-4 py-3 text-xs"
                  style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.2)', borderRadius: '12px 12px 12px 0', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                  <span className="animate-pulse">✨ Typing...</span>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Replies */}
          {messages.length <= 1 && (
            <div className="px-4 pb-2 flex flex-wrap gap-2">
              {QUICK_REPLIES.map((reply, i) => (
                <button key={i} onClick={() => setInput(reply)}
                  className="text-xs px-3 py-1.5 transition-all duration-300 hover:opacity-80"
                  style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.3)', color: '#c9a96e', borderRadius: '20px', fontFamily: 'Montserrat, sans-serif' }}>
                  {reply}
                </button>
              ))}
            </div>
          )}

          {/* Input */}
          <div className="p-3 flex gap-2" style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}>
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={user ? `Ask me anything, ${user.firstName}...` : 'Ask about products, orders...'}
              className="flex-1 bg-transparent text-xs outline-none px-3 py-2 tracking-wider"
              style={{ border: '1px solid rgba(201,169,110,0.3)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif', borderRadius: '4px' }}
            />
            <button
              onClick={sendMessage}
              disabled={loading || !input.trim()}
              className="w-9 h-9 flex items-center justify-center transition-all duration-300 hover:opacity-80"
              style={{ background: input.trim() ? '#c9a96e' : 'rgba(201,169,110,0.3)', color: '#0a0806', borderRadius: '4px' }}>
              <FiSend size={14} />
            </button>
          </div>
        </div>
      )}
    </>
  );
}