import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiX, FiCheck, FiUpload, FiPackage, FiArrowLeft, FiImage, FiTrash2 } from 'react-icons/fi';
import { supabase } from '../lib/supabase';

const BUCKET = 'product-images';

const emptyForm = {
  name: '', slug: '', category: 'Lips', price: '', original_price: '',
  description: '', image: '', images: '', badge: '', rating: 4.5,
  reviews: 0, in_stock: true, shades: '',
};

export default function Products() {
  const { slug } = useParams();
  const navigate = useNavigate();
  const isEdit = Boolean(slug);

  const [form, setForm] = useState(emptyForm);
  const [editId, setEditId] = useState(null);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [extraUploading, setExtraUploading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [dragOver, setDragOver] = useState(false);

  const mainImageRef = useRef(null);
  const extraFilesRef = useRef(null);

  useEffect(() => { if (isEdit) loadProduct(); }, [slug]);

  const loadProduct = async () => {
    const { data } = await supabase.from('products').select('*').eq('slug', slug).single();
    if (data) {
      setForm({
        ...data,
        images: Array.isArray(data.images) ? data.images.join(', ') : '',
        shades: Array.isArray(data.shades) ? data.shades.join(', ') : '',
      });
      setEditId(data.id);
    }
  };

  const generateSlug = (name) => name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const handleNameChange = (e) => {
    const name = e.target.value;
    setForm({ ...form, name, slug: generateSlug(name) });
  };

  // ✅ Upload main image — no URL input
  const handleMainImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    const fileName = `${Date.now()}-main.${file.name.split('.').pop()}`;
    const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);
    if (!error) {
      const { data: u } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
      setForm(prev => ({ ...prev, image: u.publicUrl }));
    }
    setUploading(false);
  };

  // ✅ Upload extra images
  const handleExtraImagesUpload = async (files) => {
    if (!files.length) return;
    setExtraUploading(true);
    const urls = [];
    for (const file of Array.from(files)) {
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 5)}.${file.name.split('.').pop()}`;
      const { error } = await supabase.storage.from(BUCKET).upload(fileName, file);
      if (!error) {
        const { data: u } = supabase.storage.from(BUCKET).getPublicUrl(fileName);
        urls.push(u.publicUrl);
      }
    }
    setForm(prev => ({
      ...prev,
      images: prev.images ? prev.images + ', ' + urls.join(', ') : urls.join(', '),
    }));
    setExtraUploading(false);
  };

  const removeExtraImage = (urlToRemove) => {
    const remaining = form.images.split(',').map(s => s.trim()).filter(u => u !== urlToRemove).join(', ');
    setForm(prev => ({ ...prev, images: remaining }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.image) { alert('Please upload a main image!'); return; }
    setSaving(true);
    const payload = {
      name: form.name, slug: form.slug, category: form.category,
      price: parseFloat(form.price),
      original_price: form.original_price ? parseFloat(form.original_price) : parseFloat(form.price),
      description: form.description, image: form.image,
      images: form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [],
      badge: form.badge, rating: parseFloat(form.rating), reviews: parseInt(form.reviews),
      in_stock: form.in_stock,
      shades: form.shades ? form.shades.split(',').map(s => s.trim()).filter(Boolean) : [],
    };
    if (editId) {
      await supabase.from('products').update(payload).eq('id', editId);
      setSuccessMsg('✓ Product updated — visible on Velvet shop!');
    } else {
      await supabase.from('products').insert([payload]);
      setSuccessMsg('✓ Product added — now live on Velvet shop!');
    }
    setSaving(false);
    setTimeout(() => navigate('/products'), 1500);
  };

  const inputCls = "w-full bg-transparent border px-3 py-2 text-sm outline-none tracking-wider transition-all duration-300";
  const inputStyle = { borderColor: 'rgba(201,169,110,0.25)', color: '#faf8f4', fontFamily: 'Montserrat, sans-serif' };
  const labelStyle = { color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif', fontSize: '11px', letterSpacing: '0.1em', textTransform: 'uppercase' };

  const extraImagesList = form.images ? form.images.split(',').map(s => s.trim()).filter(Boolean) : [];

  return (
    <>
      <style>{`
        .fade-in { animation: fadeInUp 0.4s ease both; }
        @keyframes fadeInUp { from { opacity: 0; transform: translateY(12px); } to { opacity: 1; transform: translateY(0); } }
        .form-input:focus { border-color: #c9a96e !important; }
        .upload-zone { transition: all 0.3s ease; cursor: pointer; }
        .upload-zone:hover, .upload-zone.drag-over {
          border-color: rgba(201,169,110,0.6) !important;
          background: rgba(201,169,110,0.06) !important;
        }
        .save-btn { transition: all 0.3s ease; }
        .save-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 6px 20px rgba(201,169,110,0.3); }
        .extra-img { position: relative; }
        .extra-img .del-btn { position: absolute; top: 4px; right: 4px; opacity: 0; transition: opacity 0.2s; }
        .extra-img:hover .del-btn { opacity: 1; }
        .main-img-overlay { position: absolute; inset: 0; opacity: 0; transition: opacity 0.3s ease; background: rgba(8,6,4,0.75); display: flex; align-items: center; justify-content: center; gap: 8px; }
        .main-img-wrap:hover .main-img-overlay { opacity: 1; }
      `}</style>

      <div className="fade-in space-y-6">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-xs tracking-widest uppercase transition-all hover:opacity-70"
            style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
            <FiArrowLeft size={13} /> Products
          </button>
          <div>
            <p className="text-xs tracking-[0.4em] uppercase mb-1"
              style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
              {isEdit ? 'Edit' : 'New'}
            </p>
            <h1 className="text-4xl font-light"
              style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
              {isEdit ? (form.name || 'Edit Product') : 'Add Product'}
            </h1>
          </div>
        </div>

        {/* Success */}
        {successMsg && (
          <div className="flex items-center gap-3 px-4 py-3"
            style={{ background: 'rgba(74,222,128,0.08)', border: '1px solid rgba(74,222,128,0.25)', color: '#4ade80' }}>
            <FiCheck size={14} />
            <span className="text-xs tracking-wider" style={{ fontFamily: 'Montserrat, sans-serif' }}>
              {successMsg}
            </span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 xl:grid-cols-5 gap-6">

            {/* LEFT — Form Fields */}
            <div className="xl:col-span-2 space-y-4">

              {/* Basic Info */}
              <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="px-5 py-3"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
                  <p className="text-xs tracking-widest uppercase"
                    style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Basic Info</p>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Product Name *</label>
                    <input type="text" value={form.name} onChange={handleNameChange}
                      placeholder="Velvet Matte Lipstick"
                      className={`${inputCls} form-input`} style={inputStyle} required />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Slug (auto)</label>
                    <input type="text" value={form.slug}
                      onChange={e => setForm({ ...form, slug: e.target.value })}
                      className={`${inputCls} form-input`}
                      style={{ ...inputStyle, opacity: 0.6 }} required />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Category</label>
                      <select value={form.category}
                        onChange={e => setForm({ ...form, category: e.target.value })}
                        className={`${inputCls} form-input`}
                        style={{ ...inputStyle, background: '#111009' }}>
                        {['Lips', 'Face', 'Eyes', 'Skincare', 'Fragrance', 'Sale'].map(c => (
                          <option key={c} value={c} style={{ background: '#111009' }}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Badge</label>
                      <select value={form.badge}
                        onChange={e => setForm({ ...form, badge: e.target.value })}
                        className={`${inputCls} form-input`}
                        style={{ ...inputStyle, background: '#111009' }}>
                        {['', 'New', 'Sale', 'Best Seller'].map(b => (
                          <option key={b} value={b} style={{ background: '#111009' }}>{b || 'None'}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Price ($) *</label>
                      <input type="number" value={form.price}
                        onChange={e => setForm({ ...form, price: e.target.value })}
                        placeholder="32"
                        className={`${inputCls} form-input`} style={inputStyle} required />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Original ($)</label>
                      <input type="number" value={form.original_price}
                        onChange={e => setForm({ ...form, original_price: e.target.value })}
                        placeholder="45"
                        className={`${inputCls} form-input`} style={inputStyle} />
                    </div>
                  </div>
                </div>
              </div>

              {/* Details */}
              <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="px-5 py-3"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
                  <p className="text-xs tracking-widest uppercase"
                    style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>Details</p>
                </div>
                <div className="p-5 space-y-3">
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Description</label>
                    <textarea value={form.description}
                      onChange={e => setForm({ ...form, description: e.target.value })}
                      placeholder="Product description..." rows={3}
                      className={`${inputCls} form-input`}
                      style={{ ...inputStyle, resize: 'none' }} />
                  </div>
                  <div>
                    <label className="block mb-1.5" style={labelStyle}>Shades (hex, comma separated)</label>
                    <input type="text" value={form.shades}
                      onChange={e => setForm({ ...form, shades: e.target.value })}
                      placeholder="#FF0000, #FF69B4"
                      className={`${inputCls} form-input`} style={inputStyle} />
                    {form.shades && (
                      <div className="flex gap-1.5 mt-2 flex-wrap">
                        {form.shades.split(',').map((s, i) => s.trim() && (
                          <div key={i} className="w-5 h-5 rounded-full"
                            style={{ background: s.trim(), border: '1px solid rgba(201,169,110,0.3)' }} />
                        ))}
                      </div>
                    )}
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Rating</label>
                      <input type="number" step="0.1" min="0" max="5" value={form.rating}
                        onChange={e => setForm({ ...form, rating: e.target.value })}
                        className={`${inputCls} form-input`} style={inputStyle} />
                    </div>
                    <div>
                      <label className="block mb-1.5" style={labelStyle}>Reviews</label>
                      <input type="number" value={form.reviews}
                        onChange={e => setForm({ ...form, reviews: e.target.value })}
                        className={`${inputCls} form-input`} style={inputStyle} />
                    </div>
                  </div>
                  <div className="flex items-center gap-3 pt-1">
                    <input type="checkbox" checked={form.in_stock}
                      onChange={e => setForm({ ...form, in_stock: e.target.checked })}
                      className="accent-yellow-600 w-4 h-4" />
                    <label className="text-xs tracking-wider"
                      style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                      In Stock
                    </label>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="flex gap-3">
                <button type="submit" disabled={saving || uploading || extraUploading}
                  className="save-btn flex-1 flex items-center justify-center gap-2 py-3 text-xs tracking-widest uppercase"
                  style={{
                    background: (saving || uploading) ? 'rgba(201,169,110,0.4)' : '#c9a96e',
                    color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600,
                  }}>
                  <FiCheck size={13} />
                  {saving ? 'Saving...' : isEdit ? 'Update Product' : 'Add Product'}
                </button>
                <button type="button" onClick={() => navigate('/products')}
                  className="px-4 py-3 text-xs tracking-widest uppercase border transition-all hover:opacity-70"
                  style={{ borderColor: 'rgba(201,169,110,0.3)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                  <FiX size={13} />
                </button>
              </div>
            </div>

            {/* RIGHT — Images */}
            <div className="xl:col-span-3 space-y-4">

              {/* ✅ Main Image — Upload Only, No URL */}
              <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="px-5 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
                  <div className="flex items-center gap-2">
                    <FiImage size={14} style={{ color: '#c9a96e' }} />
                    <p className="text-xs tracking-widest uppercase"
                      style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                      Main Image *
                    </p>
                  </div>
                  {uploading && (
                    <div className="flex items-center gap-2">
                      <div className="w-3 h-3 border rounded-full animate-spin"
                        style={{ borderColor: 'rgba(201,169,110,0.2)', borderTopColor: '#c9a96e' }} />
                      <span className="text-xs" style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                        Uploading...
                      </span>
                    </div>
                  )}
                </div>

                <div className="p-5">
                  {form.image ? (
                    /* ✅ Image Preview with hover overlay */
                    <div className="main-img-wrap relative">
                      <img src={form.image} alt="Main"
                        className="w-full object-cover"
                        style={{ height: '260px', border: '1px solid rgba(201,169,110,0.15)' }} />
                      <div className="main-img-overlay">
                        <button type="button"
                          onClick={() => mainImageRef.current?.click()}
                          className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase"
                          style={{ background: '#c9a96e', color: '#0a0806', fontFamily: 'Montserrat, sans-serif', fontWeight: 600 }}>
                          <FiUpload size={12} /> Change
                        </button>
                        <button type="button"
                          onClick={() => setForm(prev => ({ ...prev, image: '' }))}
                          className="flex items-center gap-2 px-4 py-2 text-xs tracking-widest uppercase"
                          style={{ background: 'rgba(232,160,154,0.2)', border: '1px solid rgba(232,160,154,0.4)', color: '#e8a09a', fontFamily: 'Montserrat, sans-serif' }}>
                          <FiTrash2 size={12} /> Remove
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* ✅ Upload Zone — Drag & Drop */
                    <div
                      className={`upload-zone flex flex-col items-center justify-center gap-4 ${dragOver ? 'drag-over' : ''}`}
                      style={{ height: '260px', border: '2px dashed rgba(201,169,110,0.25)', background: 'rgba(201,169,110,0.02)' }}
                      onClick={() => mainImageRef.current?.click()}
                      onDrop={e => { e.preventDefault(); setDragOver(false); handleMainImageUpload(e.dataTransfer.files[0]); }}
                      onDragOver={e => { e.preventDefault(); setDragOver(true); }}
                      onDragLeave={() => setDragOver(false)}>
                      <div className="w-16 h-16 flex items-center justify-center"
                        style={{ border: '1px dashed rgba(201,169,110,0.4)', background: 'rgba(201,169,110,0.04)' }}>
                        <FiUpload size={24} style={{ color: 'rgba(201,169,110,0.5)' }} />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-light mb-1"
                          style={{ fontFamily: 'Cormorant Garamond, serif', color: '#faf8f4' }}>
                          {uploading ? 'Uploading...' : 'Drop image here'}
                        </p>
                        <p className="text-xs tracking-wider"
                          style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                          Click to browse · PNG, JPG, WEBP
                        </p>
                      </div>
                    </div>
                  )}
                  {/* Hidden file input */}
                  <input ref={mainImageRef} type="file" accept="image/*" className="hidden"
                    onChange={e => handleMainImageUpload(e.target.files[0])} />
                </div>
              </div>

              {/* ✅ Extra Images — Grid Upload */}
              <div style={{ background: '#111009', border: '1px solid rgba(201,169,110,0.15)' }}>
                <div className="px-5 py-3 flex items-center justify-between"
                  style={{ borderBottom: '1px solid rgba(201,169,110,0.1)', background: 'linear-gradient(90deg, rgba(201,169,110,0.08), transparent)' }}>
                  <div className="flex items-center gap-2">
                    <FiImage size={14} style={{ color: '#c9a96e' }} />
                    <p className="text-xs tracking-widest uppercase"
                      style={{ color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                      Extra Images
                    </p>
                    {extraImagesList.length > 0 && (
                      <span className="text-xs px-2 py-0.5"
                        style={{ background: 'rgba(201,169,110,0.1)', color: '#c9a96e', border: '1px solid rgba(201,169,110,0.2)', fontFamily: 'Montserrat, sans-serif' }}>
                        {extraImagesList.length}
                      </span>
                    )}
                  </div>
                  <button type="button" onClick={() => extraFilesRef.current?.click()}
                    className="flex items-center gap-2 px-3 py-1.5 text-xs tracking-widest uppercase transition-all hover:opacity-80"
                    style={{ background: 'rgba(201,169,110,0.1)', border: '1px solid rgba(201,169,110,0.25)', color: '#c9a96e', fontFamily: 'Montserrat, sans-serif' }}>
                    <FiUpload size={11} />
                    {extraUploading ? 'Uploading...' : 'Add Images'}
                  </button>
                  <input ref={extraFilesRef} type="file" accept="image/*" multiple className="hidden"
                    onChange={e => handleExtraImagesUpload(e.target.files)} />
                </div>

                <div className="p-5">
                  {/* Drop zone */}
                  <div className="upload-zone flex items-center justify-center gap-3 py-5 mb-4"
                    style={{ border: '1px dashed rgba(201,169,110,0.2)' }}
                    onClick={() => extraFilesRef.current?.click()}
                    onDrop={e => { e.preventDefault(); handleExtraImagesUpload(e.dataTransfer.files); }}
                    onDragOver={e => e.preventDefault()}>
                    <FiUpload size={14} style={{ color: 'rgba(201,169,110,0.4)' }} />
                    <p className="text-xs tracking-wider"
                      style={{ color: '#7a6e5f', fontFamily: 'Montserrat, sans-serif' }}>
                      {extraUploading ? 'Uploading...' : 'Drop multiple images or click to browse'}
                    </p>
                  </div>

                  {/* ✅ Images Grid */}
                  {extraImagesList.length > 0 ? (
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {extraImagesList.map((url, i) => (
                        <div key={i} className="extra-img"
                          style={{ border: '1px solid rgba(201,169,110,0.12)', background: '#0d0a07' }}>
                          <div className="aspect-square overflow-hidden">
                            <img src={url} alt={`extra-${i}`}
                              className="w-full h-full object-cover" />
                          </div>
                          {/* Delete button on hover */}
                          <button type="button"
                            className="del-btn w-6 h-6 flex items-center justify-center"
                            style={{ background: 'rgba(232,160,154,0.9)', color: '#fff' }}
                            onClick={() => removeExtraImage(url)}>
                            <FiX size={11} />
                          </button>
                          <div className="px-1.5 py-1"
                            style={{ borderTop: '1px solid rgba(201,169,110,0.08)' }}>
                            <p className="truncate"
                              style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif', fontSize: '9px' }}>
                              Image {i + 1}
                            </p>
                          </div>
                        </div>
                      ))}

                      {/* Add more button in grid */}
                      <div className="upload-zone aspect-square flex flex-col items-center justify-center gap-1 cursor-pointer"
                        style={{ border: '1px dashed rgba(201,169,110,0.2)' }}
                        onClick={() => extraFilesRef.current?.click()}>
                        <FiUpload size={16} style={{ color: 'rgba(201,169,110,0.35)' }} />
                        <p style={{ color: 'rgba(201,169,110,0.35)', fontFamily: 'Montserrat, sans-serif', fontSize: '9px' }}>
                          Add More
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-col items-center py-8 gap-2">
                      <FiPackage size={28} style={{ color: 'rgba(201,169,110,0.15)' }} />
                      <p className="text-xs" style={{ color: '#4a3f30', fontFamily: 'Montserrat, sans-serif' }}>
                        No extra images — used for product carousel
                      </p>
                    </div>
                  )}
                </div>
              </div>

            </div>
          </div>
        </form>
      </div>
    </>
  );
}