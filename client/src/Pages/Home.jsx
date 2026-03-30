import { useState, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiStar, FiArrowRight, FiChevronLeft, FiChevronRight } from 'react-icons/fi';
import { products as staticProducts, categories } from '../data/products';
import { getImageUrl, supabase } from '../lib/supabase';
import { useDispatch, useSelector } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { toggleWishlist } from '../store/slices/wishlistSlice';
import { showNotification } from '../store/slices/notificationSlice';
import SEO from '../components/SEO';
function ProductCard({ product }) {
  const dispatch = useDispatch();
  const wishlistItems = useSelector(state => state.wishlist.items);
  const isWishlisted = (id) => wishlistItems.some(item => item.id === id);

  const [currentImg, setCurrentImg] = useState(0);
  const images = product.images?.length ? product.images : [product.image];
  const touchStartX = useRef(0);
  const intervalRef = useRef(null);

  useEffect(() => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1));
    }, 2000);
    return () => clearInterval(intervalRef.current);
  }, [images.length]);

  const handleMouseEnter = () => clearInterval(intervalRef.current);

  const handleMouseLeave = () => {
    if (images.length <= 1) return;
    intervalRef.current = setInterval(() => {
      setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1));
    }, 2000);
  };

  const prevImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg(i => (i === 0 ? images.length - 1 : i - 1));
  };

  const nextImg = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1));
  };

  const onTouchStart = (e) => {
    touchStartX.current = e.touches[0].clientX;
  };

  const onTouchEnd = (e) => {
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (diff > 40) setCurrentImg(i => (i === images.length - 1 ? 0 : i + 1));
    if (diff < -40) setCurrentImg(i => (i === 0 ? images.length - 1 : i - 1));
  };

  return (
    <div className="group relative"
      style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.1)' }}>

      {/* Badge */}
      {product.badge && (
        <div className="absolute top-3 left-3 z-10 px-3 py-1 text-xs tracking-widest"
          style={{
            background: product.badge === 'Sale' ? '#8b6914' : '#c9a96e',
            color: '#0a0806',
            fontFamily: 'Montserrat, sans-serif',
            fontWeight: 600,
          }}>
          {product.badge}
        </div>
      )}

      {/* Wishlist */}
      <button
        aria-label="Add to wishlist"
        onClick={() => {
          const currentlyWishlisted = isWishlisted(product.id);
          dispatch(toggleWishlist(product));
          dispatch(showNotification({
            message: currentlyWishlisted ? 'Removed from wishlist' : 'Added to wishlist',
            type: 'success'
          }));
        }}
        className="absolute top-3 right-3 z-10 w-8 h-8 flex items-center justify-center transition-all duration-300"
        style={{
          background: 'rgba(10,8,6,0.7)',
          color: isWishlisted(product.id) ? '#c9a96e' : '#faf8f4',
        }}>
        <FiHeart size={14} fill={isWishlisted(product.id) ? '#c9a96e' : 'none'} />
      </button>

      {/* Image Carousel */}
      <div className="relative overflow-hidden"
        style={{ height: '280px' }}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onTouchStart={onTouchStart}
        onTouchEnd={onTouchEnd}>

        <Link to={`/product/${product.slug}`}>
          <div className="flex h-full transition-transform duration-700 ease-in-out"
            style={{ transform: `translateX(-${currentImg * 100}%)` }}>
            {images.map((img, i) => (
              <div key={i} className="w-full h-full flex-shrink-0 overflow-hidden"
                style={{ minWidth: '100%' }}>
                <img src={img} alt={`${product.name} ${i + 1}`}
                  loading="lazy"
                  className="w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-105"
                  draggable="false"
                  style={{ minWidth: '100%' }} />
              </div>
            ))}
          </div>
        </Link>

        {/* Prev/Next arrows */}
        {images.length > 1 && (
          <>
            <button
              aria-label="Previous image"
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: 'rgba(10,8,6,0.7)', color: '#c9a96e', zIndex: 10 }}>
              <FiChevronLeft size={14} />
            </button>
            <button
              aria-label="Next image"
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300"
              style={{ background: 'rgba(10,8,6,0.7)', color: '#c9a96e', zIndex: 10 }}>
              <FiChevronRight size={14} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div className="absolute bottom-2 left-1/2 -translate-x-1/2 flex gap-1.5" style={{ zIndex: 10 }}>
            {images.map((_, i) => (
              <button key={i}
                onClick={(e) => { e.preventDefault(); e.stopPropagation(); setCurrentImg(i); }}
                className="rounded-full transition-all duration-300"
                style={{
                  width: currentImg === i ? '16px' : '6px',
                  height: '6px',
                  background: currentImg === i ? '#c9a96e' : 'rgba(201,169,110,0.4)',
                }} />
            ))}
          </div>
        )}
      </div>

      {/* Info */}
      <div className="p-4">
        <p className="text-xs tracking-widest uppercase mb-1"
          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
          {product.category}
        </p>
        <Link to={`/product/${product.slug}`}>
          <h3 className="text-base font-light mb-2 hover:text-yellow-300 transition-colors"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4', fontSize: '1.1rem' }}>
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-3">
          <FiStar size={10} fill="#c9a96e" style={{ color: '#c9a96e' }} />
          <span className="text-xs" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            {product.rating}
          </span>
          <span className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            ({product.reviews})
          </span>
        </div>

        {/* Price & Add to Cart */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-base font-medium"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              ${product.price}
            </span>
            {/* ✅ support both originalPrice (static) and original_price (supabase) */}
            {(product.originalPrice || product.original_price) > product.price && (
              <span className="text-xs line-through"
                style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                ${product.originalPrice || product.original_price}
              </span>
            )}
          </div>
          <button
            onClick={() => {
              dispatch(addToCart({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.image,
                slug: product.slug,
                category: product.category,
              }));
              dispatch(showNotification({ message: `${product.name} added to cart!`, type: 'success' }));
            }}
            className="flex items-center gap-2 px-3 py-2 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{
              background: '#c9a96e',
              color: '#0a0806',
              fontFamily: 'Montserrat, sans-serif',
              fontWeight: 600,
            }}>
            <FiShoppingBag size={12} />
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

export default function Home() {
  const [searchParams] = useSearchParams();
  const [activeCategory, setActiveCategory] = useState('All');
  const [allProducts, setAllProducts] = useState(staticProducts);
  const [filteredProducts, setFilteredProducts] = useState(staticProducts);

  // ✅ Fetch Supabase products and merge with static products
  useEffect(() => {
    const fetchSupabaseProducts = async () => {
      const { data } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // Normalize Supabase product fields to match static product fields
        const normalized = data.map(p => ({
          ...p,
          originalPrice: p.original_price,
          inStock: p.in_stock,
        }));
        // Merge: static products first, then Supabase products
        const merged = [...staticProducts, ...normalized];
        setAllProducts(merged);
        setFilteredProducts(merged);
      }
    };
    fetchSupabaseProducts();
  }, []);

  useEffect(() => {
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    if (category) setActiveCategory(category);
    if (search) {
      setFilteredProducts(allProducts.filter(p =>
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.category.toLowerCase().includes(search.toLowerCase())
      ));
    }
  }, [searchParams, allProducts]);

  useEffect(() => {
    if (activeCategory === 'All') {
      setFilteredProducts(allProducts);
    } else {
      setFilteredProducts(allProducts.filter(p => p.category === activeCategory));
    }
  }, [activeCategory, allProducts]);

  return (
    <div style={{ background: '#0a0806', minHeight: '100vh' }}>

      <SEO
        title="Luxury Cosmetics & Beauty Products"
        description="Shop premium luxury cosmetics, skincare, makeup & fragrance at Velvet Luxury Cosmetics. Free shipping over $100. Cruelty free & vegan formulas."
        keywords="luxury cosmetics, skincare, makeup, beauty products, vegan cosmetics, cruelty free makeup, fragrance, velvet cosmetics"
      />


      {/* HERO SECTION */}
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0">
         // Hero image
          <img
            src={getImageUrl('hero/hero.jpg')}
            alt="Velvet Luxury Cosmetics hero"
            loading="eager"   // hero image eager
            className="w-full h-full object-contain md:object-cover"
            style={{ opacity: 0.3 }}
          />
          <div className="absolute inset-0"
            style={{ background: 'linear-gradient(to bottom, rgba(10,8,6,0.5) 0%, rgba(10,8,6,0.8) 100%)' }} />
        </div>

        <div className="relative z-10 text-center px-6 max-w-4xl mx-auto">
          <p className="sm:text-xs tracking-[0.6em] uppercase mb-6"
            style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
            New Collection 2026
          </p>
          <h1 className="font-light mb-6"
            style={{
              fontFamily: 'Cormorant Garamond, serif',
              fontSize: 'clamp(3rem, 8vw, 7rem)',
              color: '#faf8f4',
              lineHeight: 1.1,
            }}>
            Beauty is an
            <br />
            <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Art Form</span>
          </h1>
          <p className="text-sm md:text-base mb-10 max-w-lg mx-auto leading-relaxed"
            style={{ color: '#e8d5b0', fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            Discover our curated collection of luxury cosmetics, crafted for those who believe every detail matters.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/?category=All"
              className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
              style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Shop Collection
            </Link>
            <Link to="/?category=Skincare"
              className="px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80 border"
              style={{ borderColor: '#c9a96e', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              Skincare Edit
            </Link>
          </div>
        </div>

        <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 flex flex-col items-center gap-2">
          <p className="text-xs tracking-widest" style={{ color: '#c9a96e' }}>SCROLL</p>
          <div className="w-px h-12" style={{ background: 'linear-gradient(to bottom, #c9a96e, transparent)' }} />
        </div>
      </section>

      {/* MARQUEE */}
      <div className="py-4 overflow-hidden" style={{ background: '#c9a96e' }}>
        <div className="flex gap-12 animate-marquee whitespace-nowrap">
          {[...Array(6)].map((_, i) => (
            <span key={i} className="text-xs tracking-widest uppercase flex items-center gap-8"
              style={{ color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
              Luxury Cosmetics ✦ Free Shipping Over $100 ✦ New Collection 2026 ✦ Cruelty Free ✦ Vegan Formulas ✦
            </span>
          ))}
        </div>
      </div>

      {/* FEATURED CATEGORIES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a96e' }}>Explore</p>
          <h2 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Shop by Category
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {[
            { name: 'Face', image: getImageUrl('categories/cat-face.jpg') },
            { name: 'Eyes', image: getImageUrl('categories/cat-eyes.jpg') },
            { name: 'Lips', image: getImageUrl('categories/cat-lips.jpg') },
            { name: 'Skincare', image: getImageUrl('categories/cat-skincare.jpg') },
            { name: 'Fragrance', image: getImageUrl('categories/cat-fragrance.jpg') },
            { name: 'Sale', image: getImageUrl('categories/cat-sale.jpg') },
          ].map(cat => (
            <div key={cat.name}
              className="relative overflow-hidden group cursor-pointer"
              style={{ height: '400px' }}
              onClick={() => setActiveCategory(cat.name)}>
              <img src={cat.image} alt={cat.name}
                loading="lazy"
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                style={{ opacity: 0.6 }} />
              <div className="absolute inset-0 flex items-center justify-center"
                style={{ background: 'rgba(10,8,6,0.3)' }}>
                <div className="text-center">
                  <h3 className="text-xl font-light tracking-widest"
                    style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                    {cat.name}
                  </h3>
                  <div className="w-8 h-px mx-auto mt-2 transition-all duration-300 group-hover:w-16"
                    style={{ background: '#c9a96e' }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* PRODUCTS SECTION */}
      <section className="max-w-7xl mx-auto px-6 py-10 pb-20">
        <div className="text-center mb-12">
          <p className="text-xs tracking-[0.4em] uppercase mb-3" style={{ color: '#c9a96e' }}>Collection</p>
          <h2 className="text-4xl md:text-5xl font-light"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            Our Products
          </h2>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map(cat => (
            <button key={cat}
              onClick={() => setActiveCategory(cat)}
              className="px-6 py-2 text-xs tracking-widest uppercase transition-all duration-300"
              style={{
                fontFamily: 'Montserrat, sans-serif',
                background: activeCategory === cat ? '#c9a96e' : 'transparent',
                color: activeCategory === cat ? '#0a0806' : '#c9a96e',
                border: '1px solid rgba(201,169,110,0.4)',
                fontWeight: activeCategory === cat ? 600 : 400,
              }}>
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
            />
          ))}
        </div>
      </section>

      {/* BANNER SECTION */}
      <section className="relative py-24 px-6 text-center overflow-hidden">
        <div className="absolute inset-0">
          <img
            src={getImageUrl('hero/banner.jpg')}
            alt="banner"
            className="w-full h-full object-cover"
            style={{ opacity: 0.2 }}
          />
          <div className="absolute inset-0" style={{ background: 'rgba(10,8,6,0.7)' }} />
        </div>
        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-xs tracking-[0.4em] uppercase mb-4" style={{ color: '#c9a96e' }}>Limited Edition</p>
          <h2 className="text-4xl md:text-6xl font-light mb-6"
            style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
            The Signature
            <br />
            <span style={{ color: '#c9a96e', fontStyle: 'italic' }}>Velvet Collection</span>
          </h2>
          <p className="text-sm mb-8 leading-relaxed"
            style={{ color: '#e8d5b0', fontFamily: 'Montserrat, sans-serif', fontWeight: 300 }}>
            Our most luxurious formulas, housed in our iconic gold packaging. A timeless gift for yourself or someone you love.
          </p>
          <Link to="/?category=All"
            className="inline-flex items-center gap-3 px-10 py-4 text-xs tracking-widest uppercase transition-all duration-300 hover:opacity-80"
            style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
            Explore Now <FiArrowRight size={14} />
          </Link>
        </div>
      </section>

      {/* FEATURES */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {[
            { icon: '✦', title: 'Free Shipping', desc: 'On all orders over $100' },
            { icon: '◈', title: 'Cruelty Free', desc: '100% vegan & ethical' },
            { icon: '❋', title: 'Luxury Packaging', desc: 'Gift-ready presentation' },
            { icon: '⟳', title: 'Easy Returns', desc: '30-day return policy' },
          ].map(f => (
            <div key={f.title} className="text-center">
              <div className="text-2xl mb-4" style={{ color: '#c9a96e' }}>{f.icon}</div>
              <h4 className="text-sm tracking-widest uppercase mb-2"
                style={{ color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' }}>
                {f.title}
              </h4>
              <p className="text-xs" style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                {f.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

    </div>
  );
}