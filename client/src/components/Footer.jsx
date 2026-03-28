import { Link } from 'react-router-dom';
import { FiInstagram, FiTwitter, FiFacebook, FiYoutube, FiMail } from 'react-icons/fi';

export default function Footer() {
  return (
    <footer style={{ background: '#050403', borderTop: '1px solid rgba(201,169,110,0.2)' }}>

      {/* Newsletter Section */}
      <div className="py-16 px-6 text-center"
        style={{ borderBottom: '1px solid rgba(201,169,110,0.15)' }}>
        <p className="text-xs tracking-[0.4em] uppercase mb-3"
          style={{ color: '#c9a96e' }}>
          Join The Velvet Circle
        </p>
        <h3 className="text-3xl md:text-4xl font-light mb-4"
          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
          Exclusive Offers & Beauty Secrets
        </h3>
        <p className="text-sm mb-8 max-w-md mx-auto"
          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
          Subscribe to receive early access to new collections, beauty tips and members-only discounts.
        </p>
        <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
          onSubmit={e => e.preventDefault()}>
          <input
            type="email"
            placeholder="Your email address"
            className="flex-1 bg-transparent border px-4 py-3 text-sm outline-none tracking-wider"
            style={{
              borderColor: 'rgba(201,169,110,0.4)',
              color: '#faf8f4',
              fontFamily: 'Montserrat, sans-serif',
            }}
          />
          <button
            type="submit"
            className="px-8 py-3 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{
              background: '#c9a96e',
              color: '#0a0806',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
            }}>
            Subscribe
          </button>
        </form>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-6 py-16 grid grid-cols-2 md:grid-cols-4 gap-10">

        {/* Brand */}
        <div className="col-span-2 md:col-span-1">
          <h2 className="text-2xl font-light tracking-[0.3em] mb-2"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#c9a96e' }}>
            VELVET
          </h2>
          <p className="text-xs tracking-[0.4em] mb-4"
            style={{ color: '#e8d5b0' }}>
            LUXURY COSMETICS
          </p>
          <p className="text-sm leading-relaxed mb-6"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            Crafted for those who believe beauty is an art. Every product is a masterpiece of elegance and sophistication.
          </p>
          {/* Social Icons */}
          <div className="flex items-center gap-4">
            {[FiInstagram, FiTwitter, FiFacebook, FiYoutube].map((Icon, i) => (
              <a key={i} href="#"
                className="transition-all duration-300 hover:scale-110"
                style={{ color: '#c9a96e', opacity: 0.7 }}
                onMouseEnter={e => e.currentTarget.style.opacity = 1}
                onMouseLeave={e => e.currentTarget.style.opacity = 0.7}>
                <Icon size={18} />
              </a>
            ))}
          </div>
        </div>

        {/* Shop */}
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            Shop
          </h4>
          <ul className="space-y-3">
            {['Face', 'Eyes', 'Lips', 'Skincare', 'Fragrance', 'New Arrivals', 'Sale'].map(item => (
              <li key={item}>
                <Link to={`/?category=${item}`}
                  className="text-sm transition-all duration-300"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                  {item}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Help */}
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            Help
          </h4>
          <ul className="space-y-3">
            {[
              { name: 'My Account', path: '/login' },
              { name: 'Track Order', path: '/track/123' },
              { name: 'My Orders', path: '/orders' },
              { name: 'Shopping Cart', path: '/cart' },
              { name: 'FAQ', path: '#' },
              { name: 'Contact Us', path: '#' },
            ].map(item => (
              <li key={item.name}>
                <Link to={item.path}
                  className="text-sm transition-all duration-300"
                  style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                  onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                  onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                  {item.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Contact */}
        <div>
          <h4 className="text-xs tracking-[0.3em] uppercase mb-6"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            Contact
          </h4>
          <ul className="space-y-3">
            <li className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              Mon–Fri: 9am – 6pm
            </li>
            <li>
              <a href="mailto:hello@velvetcosmetics.com"
                className="text-sm flex items-center gap-2 transition-all duration-300"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
                onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
                onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
                <FiMail size={14} />
                hello@velvetcosmetics.com
              </a>
            </li>
            <li className="text-sm" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
              123 Beauty Boulevard,
              <br />Paris, France 75001
            </li>
          </ul>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="px-6 py-6 flex flex-col md:flex-row items-center justify-between gap-4"
        style={{ borderTop: '1px solid rgba(201,169,110,0.15)' }}>
        <p className="text-xs tracking-wider"
          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
          © 2026 Velvet Luxury Cosmetics. All rights reserved.
        </p>
        <div className="flex items-center gap-6">
          {['Privacy Policy', 'Terms of Service', 'Cookie Policy'].map(item => (
            <a key={item} href="#"
              className="text-xs tracking-wider transition-all duration-300"
              style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}
              onMouseEnter={e => e.currentTarget.style.color = '#c9a96e'}
              onMouseLeave={e => e.currentTarget.style.color = '#7a6e5f'}>
              {item}
            </a>
          ))}
        </div>
        {/* Payment Icons */}
        <div className="flex items-center gap-3">
          {['VISA', 'MC', 'AMEX', 'PayPal'].map(card => (
            <span key={card}
              className="text-xs px-2 py-1 border tracking-wider"
              style={{
                borderColor: 'rgba(201,169,110,0.3)',
                color: '#7a6e5f',
                fontFamily: 'Montserrat, sans-serif',
              }}>
              {card}
            </span>
          ))}
        </div>
      </div>

    </footer>
  );
}
