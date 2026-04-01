import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCart } from '../../Context/CartContext';
import {
  ShoppingCart,
  Heart,
  Share2,
  Link2,
  ShieldCheck,
  Flame,
  ChevronLeft,
  Minus,
  Plus,
  ChevronDown,
  ChevronUp,
  Zap,
  Info,
} from 'lucide-react';

const FAVORITES_KEY = 'favoriteProducts';

const ProductDetails = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [openSection, setOpenSection] = useState('description');
  const [isFavorite, setIsFavorite] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        let data = null;

        // Primary lookup using slug
        const slugQuery = query(
          collection(db, 'products'),
          where('slug', '==', slug)
        );
        const slugSnapshot = await getDocs(slugQuery);

        if (!slugSnapshot.empty) {
          const first = slugSnapshot.docs[0];
          data = { id: first.id, ...first.data() };
        } else {
          // Backward compatibility for older id-based links
          const docRef = doc(db, 'products', slug);
          const docSnap = await getDoc(docRef);
          if (docSnap.exists()) {
            data = { id: docSnap.id, ...docSnap.data() };
          }
        }

        if (data) {
          setProduct(data);

          // Build a balanced suggestion list: same category first, then mix from others.
          const allProductsSnapshot = await getDocs(collection(db, 'products'));
          const allProducts = allProductsSnapshot.docs
            .map((d) => ({ id: d.id, ...d.data() }))
            .filter((p) => p.id !== data.id);

          const sameCategory = allProducts.filter(
            (p) => p.category === data.category
          );
          const otherCategory = allProducts.filter(
            (p) => p.category !== data.category
          );

          setRelatedProducts([
            ...sameCategory.slice(0, 2),
            ...otherCategory.slice(0, 2),
          ]);
        } else {
          setProduct(null);
        }
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [slug]);

  useEffect(() => {
    if (!product?.id) return;

    try {
      const savedFavorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || '[]'
      );
      setIsFavorite(savedFavorites.includes(product.id));
    } catch (error) {
      console.error(error);
      setIsFavorite(false);
    }
  }, [product]);

  const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
  const shareText = product
    ? `${product.name} - Himalaya Crackers`
    : 'Check this product';

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;
  const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`;
  const smsShareUrl = `sms:?body=${encodeURIComponent(`${shareText} ${shareUrl}`)}`;

  const openShareLink = (url) => {
    window.open(url, '_blank', 'noopener,noreferrer');
    setShowShareMenu(false);
  };

  const handleCopyUrl = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error(error);
    }
  };

  const handleToggleFavorite = () => {
    if (!product?.id) return;

    try {
      const savedFavorites = JSON.parse(
        localStorage.getItem(FAVORITES_KEY) || '[]'
      );
      const nextFavorites = isFavorite
        ? savedFavorites.filter((id) => id !== product.id)
        : [...new Set([...savedFavorites, product.id])];

      localStorage.setItem(FAVORITES_KEY, JSON.stringify(nextFavorites));
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading)
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-2 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
      </div>
    );

  if (!product)
    return <div className="p-20 text-center font-bold">Product not found.</div>;

  const isAvailable =
    Number(product.stockQty || product.stock || 0) > 0 && !product.isOutOfStock;
  const discount = Math.round(
    ((product.mrpPrice - product.ourPrice) / product.mrpPrice) * 100
  );

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      {/* MINIMAL NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button
            onClick={() => navigate('/products')}
            className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all"
          >
            <ChevronLeft size={18} /> Back to Shop
          </button>
          <div className="relative flex gap-4">
            <button
              onClick={() => setShowShareMenu((prev) => !prev)}
              className="text-slate-400 hover:text-slate-900"
              title="Share product"
            >
              <Share2 size={18} />
            </button>
            <button
              onClick={handleToggleFavorite}
              className={`${isFavorite ? 'text-rose-500' : 'text-slate-400 hover:text-rose-500'}`}
              title="Add to favorite"
            >
              <Heart size={18} className={isFavorite ? 'fill-rose-500' : ''} />
            </button>

            {showShareMenu && (
              <div className="absolute right-0 top-9 z-30 w-72 rounded-xl border border-slate-200 bg-white p-3 shadow-xl">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500 mb-2">
                  Share Product
                </p>
                <div className="grid grid-cols-3 gap-2 mb-3">
                  <button
                    type="button"
                    onClick={() => openShareLink(whatsappShareUrl)}
                    className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    WhatsApp
                  </button>
                  <button
                    type="button"
                    onClick={() => openShareLink(facebookShareUrl)}
                    className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    Facebook
                  </button>
                  <button
                    type="button"
                    onClick={() => openShareLink(smsShareUrl)}
                    className="rounded-lg border border-slate-200 px-2 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    SMS
                  </button>
                </div>
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2">
                  <p className="mb-1 text-[11px] font-semibold text-slate-500">
                    Product URL
                  </p>
                  <div className="flex items-center gap-2">
                    <div className="flex-1 truncate text-xs text-slate-700">
                      {shareUrl}
                    </div>
                    <button
                      type="button"
                      onClick={handleCopyUrl}
                      className="inline-flex items-center gap-1 rounded-md border border-slate-200 bg-white px-2 py-1 text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
                    >
                      <Link2 size={12} />
                      {copied ? 'Copied' : 'Copy URL'}
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-8 lg:py-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          {/* IMAGE GALLERY (Span 7) */}
          <div className="lg:col-span-6 space-y-4 w-full max-w-140 lg:max-w-130 mx-auto">
            <div className="aspect-square rounded-2xl overflow-hidden bg-white border border-slate-100 shadow-lg shadow-slate-200/30 relative">
              <img
                src={product.images?.[activeImage]}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                alt={product.name}
              />
              {!isAvailable && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-slate-900 text-white px-8 py-3 rounded-full font-black tracking-widest text-sm">
                    SOLD OUT
                  </span>
                </div>
              )}
            </div>

            <div className="flex gap-3 overflow-x-auto pb-2 justify-center">
              {product.images?.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setActiveImage(i)}
                  className={`w-16 h-16 rounded-xl overflow-hidden border-2 transition-all shrink-0 ${activeImage === i ? 'border-blue-600 scale-105 shadow-md' : 'border-transparent opacity-50'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO (Span 5) */}
          <div className="lg:col-span-6 flex flex-col pt-1">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.isBestSeller && (
                  <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest">
                    <Flame size={12} /> Best Seller
                  </span>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-black tracking-tight leading-tight text-slate-900">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-3 pt-1">
                <span className="text-3xl lg:text-4xl font-black text-blue-600 tracking-tight">
                  ₹{product.ourPrice}
                </span>
                <span className="text-lg text-slate-300 line-through font-bold">
                  ₹{product.mrpPrice}
                </span>
                <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">
                  {discount}% OFF
                </span>
              </div>

              <p className="text-slate-400 text-sm font-medium">
                SKU:{' '}
                {product.productCode || product.id?.slice(0, 8).toUpperCase()}
              </p>
            </div>

            {/* ACTION AREA */}
            <div className="mt-6 p-2 bg-white border border-slate-100 rounded-2xl shadow-lg shadow-slate-200/35 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center justify-between bg-slate-50 rounded-xl px-4 py-3 sm:w-36">
                <button
                  onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  className="text-slate-400 hover:text-slate-900"
                >
                  <Minus size={18} />
                </button>
                <span className="font-black text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity((q) => q + 1)}
                  className="text-slate-400 hover:text-slate-900"
                >
                  <Plus size={18} />
                </button>
              </div>
              <button
                onClick={() => addToCart(product, quantity)}
                disabled={!isAvailable}
                className="flex-1 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white rounded-xl py-3.5 font-black text-base transition-all flex items-center justify-center gap-2"
              >
                <ShoppingCart size={18} /> Add to Cart
              </button>
            </div>

            {/* QUICK SPECS */}
            <div className="grid grid-cols-1 gap-3 mt-6">
              <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
                <Zap size={20} className="text-yellow-500 mb-2" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Intensity
                </p>
                <p className="font-black text-slate-800">
                  {product.noiseLevel || 'High Impact'}
                </p>
              </div>
            </div>

            {/* MODERN DROPDOWNS */}
            <div className="mt-6 space-y-1">
              {[
                {
                  id: 'description',
                  label: 'Product Details',
                  icon: <Info size={18} />,
                  content: product.longDescription,
                },
                {
                  id: 'safety',
                  label: 'Safety Guidelines',
                  icon: <ShieldCheck size={18} />,
                  content: product.safetyInstructions,
                },
              ].map((section) => (
                <div
                  key={section.id}
                  className="border-b border-slate-100 last:border-0"
                >
                  <button
                    onClick={() =>
                      setOpenSection(
                        openSection === section.id ? null : section.id
                      )
                    }
                    className="w-full py-4 flex items-center justify-between group transition-all"
                  >
                    <span className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                      {section.icon} {section.label}
                    </span>
                    {openSection === section.id ? (
                      <ChevronUp size={18} className="text-blue-600" />
                    ) : (
                      <ChevronDown size={18} className="text-slate-300" />
                    )}
                  </button>
                  <div
                    className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === section.id ? 'max-h-80 pb-6' : 'max-h-0'}`}
                  >
                    <p className="text-slate-600 leading-relaxed text-sm font-medium">
                      {section.content ||
                        'Experience high-quality fireworks designed for safety and visual excellence.'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RELATED EFFECTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-14 border-t border-slate-100 pt-10">
            <h3 className="text-2xl font-black tracking-tight mb-6">
              Suggested Products
            </h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-5">
              {relatedProducts.map((rp) => (
                <div
                  key={rp.id}
                  onClick={() => navigate(`/product/${rp.slug || rp.id}`)}
                  className="group cursor-pointer"
                >
                  <div className="aspect-square rounded-2xl bg-white border border-slate-100 overflow-hidden mb-3 shadow-sm group-hover:shadow-lg group-hover:-translate-y-1 transition-all duration-300">
                    <img
                      src={rp.images?.[0]}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <h4 className="font-bold text-slate-900 group-hover:text-blue-600 transition-colors text-sm leading-snug line-clamp-2">
                    {rp.name}
                  </h4>
                  <div className="flex gap-2 mt-1 items-baseline">
                    <span className="font-bold text-blue-600">
                      ₹{rp.ourPrice}
                    </span>
                    <span className="text-slate-300 line-through font-bold text-sm">
                      ₹{rp.mrpPrice}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}
      </main>
    </div>
  );
};

export default ProductDetails;
