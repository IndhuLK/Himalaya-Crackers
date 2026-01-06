import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs, limit } from 'firebase/firestore';
import { db } from '../../config/firebase'; // Adjust path if needed: ../../config/firebase
import { useCart } from '../../context/CartContext'; // Adjust path
import {
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Flame,
  Clock,
  Volume2,
  ChevronLeft,
  Minus,
  Plus,
  PlayCircle,
  Leaf,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [zoomed, setZoomed] = useState(false);

  // Fetch Product Data
  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);

          // Fetch Related Products (same category)
          if (data.category) {
            const q = query(
              collection(db, "products"),
              where("category", "==", data.category)
            );
            const querySnapshot = await getDocs(q);
            const related = querySnapshot.docs
              .map(d => ({ id: d.id, ...d.data() }))
              .filter(p => p.id !== id) // Exclude current product
              .slice(0, 4); // Keep max 4
            setRelatedProducts(related);
          }
        } else {
          console.log("No such product!");
        }
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
    window.scrollTo(0, 0); // Scroll to top on load
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600"></div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-slate-50 gap-4">
        <h2 className="text-2xl font-black text-slate-800">Product Not Found</h2>
        <button onClick={() => navigate('/products')} className="px-6 py-3 bg-blue-600 text-white rounded-2xl font-bold">Back to Products</button>
      </div>
    );
  }

  // Stock Logic
  const stock = Number(product.stockQty || product.stock || 0);
  const isAvailable = stock > 0 && !product.isOutOfStock;
  const discount = Math.round(((product.mrpPrice - product.ourPrice) / product.mrpPrice) * 100);

  const handleAddToCart = () => {
    addToCart(product, quantity);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    // Open Cart or Navigate to Checkout (Assuming Cart is a sidebar that opens on add, otherwise navigate)
    // For now, we'll just add to cart. If you have a checkout route, navigate there.
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20">
      {/* HEADER / BREADCRUMB */}
      <div className="bg-white border-b border-slate-100 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center gap-2 text-sm font-bold text-slate-400">
          <button onClick={() => navigate('/products')} className="flex items-center gap-1 hover:text-blue-600 transition-colors">
            <ChevronLeft size={16} /> All Products
          </button>
          <span>/</span>
          <span className="text-slate-800 truncate max-w-[200px]">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">

          {/* LEFT COLUMN: IMAGES */}
          <div className="space-y-6">
            <div
              className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden relative shadow-sm aspect-square group cursor-zoom-in"
              onMouseEnter={() => setZoomed(true)}
              onMouseLeave={() => setZoomed(false)}
            >
              <img
                src={product.images?.[activeImage] || "https://placehold.co/600x600?text=No+Image"}
                alt={product.name}
                className={`w-full h-full object-cover transition-transform duration-500 ${zoomed ? 'scale-150' : 'scale-100'}`}
              />

              {!isAvailable && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-10 pointer-events-none">
                  <span className="bg-red-600 text-white font-black px-6 py-3 rounded-full uppercase tracking-widest shadow-xl">Out of Stock</span>
                </div>
              )}

              {/* Badges Over Image */}
              <div className="absolute top-6 left-6 flex flex-col gap-2 pointer-events-none">
                {product.isGreen && (
                  <span className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white w-fit animate-in fade-in slide-in-from-left-4">
                    <Leaf size={20} />
                  </span>
                )}
                {product.isBestSeller && (
                  <span className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-xs font-black px-4 py-2 rounded-xl shadow-lg border border-white/20">
                    🔥 BEST SELLER
                  </span>
                )}
              </div>
            </div>

            {/* Thumbnails */}
            {product.images?.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-4">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImage(idx)}
                    className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === idx ? 'border-blue-600 ring-2 ring-blue-100' : 'border-transparent opacity-70 hover:opacity-100'}`}
                  >
                    <img src={img} className="w-full h-full object-cover" alt="thumbnail" />
                  </button>
                ))}
              </div>
            )}

            {/* Video Section (Optional) */}
            {product.videoUrl && (
              <a
                href={product.videoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-3 bg-slate-900 text-white p-4 rounded-2xl font-black uppercase hover:bg-slate-800 transition-all shadow-xl"
              >
                <PlayCircle size={20} className="text-red-500" /> Watch Demo Video
              </a>
            )}
          </div>

          {/* RIGHT COLUMN: DETAILS */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 bg-blue-50 text-blue-600 text-xs font-black uppercase tracking-widest rounded-lg">
                  {product.category || "General"}
                </span>
                <span className="flex items-center gap-1 text-xs font-bold text-slate-400">
                  <CheckCircle2 size={14} className="text-emerald-500" /> Verified Quality
                </span>
              </div>

              <h1 className="text-4xl lg:text-5xl font-black text-slate-900 leading-tight tracking-tight">
                {product.name}
              </h1>

              <div className="flex items-center gap-4">
                <span className="text-xs bg-slate-100 px-3 py-1 rounded-full font-mono text-slate-500">
                  {product.productCode || "SKU: 000"}
                </span>
              </div>
            </div>

            {/* Price Block */}
            <div className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex items-center justify-between">
              <div>
                <p className="text-slate-400 font-bold text-sm strikethrough decoration-2 decoration-red-400 line-through">₹{product.mrpPrice}</p>
                <div className="flex items-baseline gap-2">
                  <span className="text-4xl font-black text-blue-600">₹{product.ourPrice}</span>
                  <span className="bg-green-100 text-green-700 text-xs font-black px-2 py-1 rounded-lg">-{discount}% OFF</span>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wide">Availability</p>
                {isAvailable ? (
                  <p className="text-emerald-600 font-black flex items-center justify-end gap-1"><CheckCircle2 size={16} /> In Stock</p>
                ) : (
                  <p className="text-red-600 font-black flex items-center justify-end gap-1"><AlertTriangle size={16} /> Sold Out</p>
                )}
              </div>
            </div>

            {/* Quantity & Actions */}
            <div className="bg-white p-2 rounded-[2rem] border border-slate-100 shadow-lg flex flex-col sm:flex-row gap-4">
              <div className="flex items-center justify-between bg-slate-50 rounded-[1.5rem] p-2 min-w-[160px]">
                <button
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                  className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-slate-600 shadow-sm hover:scale-90 transition-transform disabled:opacity-50"
                  disabled={!isAvailable}
                >
                  <Minus size={20} />
                </button>
                <span className="font-black text-xl text-slate-900">{quantity}</span>
                <button
                  onClick={() => setQuantity(q => q + 1)}
                  className="w-12 h-12 bg-blue-600 text-white rounded-2xl flex items-center justify-center shadow-blue-200 shadow-lg hover:scale-90 transition-transform disabled:opacity-50 disabled:bg-slate-300 disabled:shadow-none"
                  disabled={!isAvailable}
                >
                  <Plus size={20} />
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                disabled={!isAvailable}
                className="flex-1 bg-slate-900 text-white rounded-[1.5rem] font-bold text-lg hover:bg-slate-800 transition-colors py-4 flex items-center justify-center gap-2 disabled:bg-slate-300 disabled:cursor-not-allowed"
              >
                <ShoppingCart size={20} /> Add to Cart
              </button>
            </div>

            {/* Info Grid */}
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-orange-50 p-5 rounded-3xl border border-orange-100">
                <div className="flex items-center gap-2 mb-2 text-orange-600">
                  <Flame size={20} />
                  <span className="font-black uppercase text-xs tracking-widest">Intensity</span>
                </div>
                <p className="font-bold text-slate-800">{product.noiseLevel || "Medium Noise"}</p>
              </div>
              <div className="bg-blue-50 p-5 rounded-3xl border border-blue-100">
                <div className="flex items-center gap-2 mb-2 text-blue-600">
                  <Clock size={20} />
                  <span className="font-black uppercase text-xs tracking-widest">Duration</span>
                </div>
                <p className="font-bold text-slate-800">{product.duration ? `${product.duration} sec` : "Normal"}</p>
              </div>
            </div>

            {/* Descriptions */}
            <div className="space-y-6">
              <div>
                <h3 className="font-black text-lg text-slate-900 flex items-center gap-2 mb-3">
                  <ShieldCheck className="text-emerald-500" /> Safety Instructions
                </h3>
                <div className="bg-slate-50 p-6 rounded-3xl text-sm font-medium text-slate-600 leading-relaxed border border-slate-100">
                  {product.safetyInstructions || "Use in open areas only. Maintain safe distance. Adult supervision required."}
                </div>
              </div>

              <div>
                <h3 className="font-black text-lg text-slate-900 mb-3">Product Description</h3>
                <p className="text-slate-600 leading-relaxed">
                  {product.longDescription || "This premium firework offers a spectacular display of lights and sounds, perfect for your celebrations. Made with high-quality materials for better performance and safety."}
                </p>
              </div>
            </div>

          </div>
        </div>

        {/* RELATED PRODUCTS */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-3xl font-black text-slate-900 mb-8 italic uppercase tracking-tighter">You might also like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {relatedProducts.map(rp => (
                <div key={rp.id} className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group cursor-pointer" onClick={() => navigate(`/product/${rp.id}`)}>
                  <div className="h-48 bg-slate-50 rounded-3xl overflow-hidden mb-4 relative">
                    <img src={rp.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform" alt={rp.name} />
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">{rp.category}</p>
                    <h4 className="font-bold text-slate-900 truncate mb-2">{rp.name}</h4>
                    <div className="flex items-center gap-2">
                      <span className="font-black text-slate-900">₹{rp.ourPrice}</span>
                      <span className="text-xs line-through text-slate-400">₹{rp.mrpPrice}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default ProductDetails;
