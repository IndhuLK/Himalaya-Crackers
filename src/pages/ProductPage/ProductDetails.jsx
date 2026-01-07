import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { useCart } from '../../context/CartContext';
import {
  ShoppingCart,
  Heart,
  Share2,
  ShieldCheck,
  Flame,
  Clock,
  ChevronLeft,
  Minus,
  Plus,
  PlayCircle,
  Leaf,
  CheckCircle2,
  ChevronDown,
  ChevronUp,
  Zap,
  Info
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
  const [openSection, setOpenSection] = useState('description');

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      try {
        const docRef = doc(db, "products", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = { id: docSnap.id, ...docSnap.data() };
          setProduct(data);
          
          const q = query(collection(db, "products"), where("category", "==", data.category));
          const querySnapshot = await getDocs(q);
          setRelatedProducts(querySnapshot.docs
            .map(d => ({ id: d.id, ...d.data() }))
            .filter(p => p.id !== id).slice(0, 4));
        }
      } catch (error) { console.error(error); } finally { setLoading(false); }
    };
    fetchProduct();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="w-10 h-10 border-2 border-slate-100 border-t-blue-600 rounded-full animate-spin"></div>
    </div>
  );

  if (!product) return <div className="p-20 text-center font-bold">Product not found.</div>;

  const isAvailable = Number(product.stockQty || product.stock || 0) > 0 && !product.isOutOfStock;
  const discount = Math.round(((product.mrpPrice - product.ourPrice) / product.mrpPrice) * 100);

  return (
    <div className="min-h-screen bg-[#FDFDFD] text-slate-900">
      {/* MINIMAL NAV */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <button onClick={() => navigate('/products')} className="flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-blue-600 transition-all">
            <ChevronLeft size={18} /> Back to Shop
          </button>
          <div className="flex gap-4">
            <button className="text-slate-400 hover:text-slate-900"><Share2 size={18}/></button>
            <button className="text-slate-400 hover:text-rose-500"><Heart size={18}/></button>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16">
          
          {/* IMAGE GALLERY (Span 7) */}
          <div className="lg:col-span-7 space-y-6">
            <div className="aspect-square rounded-[3rem] overflow-hidden bg-white border border-slate-100 shadow-2xl shadow-slate-200/40 relative">
              <img 
                src={product.images?.[activeImage]} 
                className="w-full h-full object-cover transition-transform duration-1000 hover:scale-110" 
                alt={product.name} 
              />
              {!isAvailable && (
                <div className="absolute inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center">
                  <span className="bg-slate-900 text-white px-8 py-3 rounded-full font-black tracking-widest text-sm">SOLD OUT</span>
                </div>
              )}
            </div>
            
            <div className="flex gap-4 overflow-x-auto pb-2 justify-center">
              {product.images?.map((img, i) => (
                <button 
                  key={i} 
                  onClick={() => setActiveImage(i)}
                  className={`w-20 h-20 rounded-2xl overflow-hidden border-2 transition-all flex-shrink-0 ${activeImage === i ? 'border-blue-600 scale-105 shadow-lg' : 'border-transparent opacity-40'}`}
                >
                  <img src={img} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* PRODUCT INFO (Span 5) */}
          <div className="lg:col-span-5 flex flex-col pt-4">
            <div className="space-y-6">
              <div className="flex items-center gap-3">
                <span className="bg-blue-50 text-blue-600 text-[10px] font-black uppercase tracking-widest px-3 py-1 rounded-full">
                  {product.category}
                </span>
                {product.isBestSeller && <span className="flex items-center gap-1 text-[10px] font-black text-orange-500 uppercase tracking-widest"><Flame size={12}/> Best Seller</span>}
              </div>

              <h1 className="text-5xl lg:text-6xl font-black tracking-tighter leading-[0.9] text-slate-900">
                {product.name}
              </h1>

              <div className="flex items-baseline gap-4 pt-2">
                <span className="text-5xl font-black text-blue-600 tracking-tighter">₹{product.ourPrice}</span>
                <span className="text-xl text-slate-300 line-through font-bold">₹{product.mrpPrice}</span>
                <span className="text-emerald-500 font-black text-xs uppercase tracking-widest">{discount}% OFF</span>
              </div>

              <p className="text-slate-400 text-sm font-medium">SKU: {product.productCode || product.id?.slice(0,8).toUpperCase()}</p>
            </div>

            {/* ACTION AREA */}
            <div className="mt-10 p-2 bg-white border border-slate-100 rounded-[2.5rem] shadow-xl shadow-slate-200/50 flex flex-col sm:flex-row gap-2">
              <div className="flex items-center justify-between bg-slate-50 rounded-[2rem] px-6 py-4 sm:w-44">
                <button onClick={() => setQuantity(q => Math.max(1, q-1))} className="text-slate-400 hover:text-slate-900"><Minus size={18}/></button>
                <span className="font-black text-xl">{quantity}</span>
                <button onClick={() => setQuantity(q => q+1)} className="text-slate-400 hover:text-slate-900"><Plus size={18}/></button>
              </div>
              <button 
                onClick={() => addToCart(product, quantity)}
                disabled={!isAvailable}
                className="flex-1 bg-slate-900 hover:bg-blue-600 disabled:bg-slate-200 text-white rounded-[2rem] py-5 font-black text-lg transition-all flex items-center justify-center gap-3"
              >
                <ShoppingCart size={22} /> Add to Cart
              </button>
            </div>

            {/* QUICK SPECS */}
            <div className="grid grid-cols-2 gap-4 mt-8">
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                <Clock size={24} className="text-blue-500 mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Duration</p>
                <p className="font-black text-slate-800">{product.duration} Seconds</p>
              </div>
              <div className="p-6 rounded-[2rem] bg-slate-50 border border-slate-100">
                <Zap size={24} className="text-yellow-500 mb-3" />
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Intensity</p>
                <p className="font-black text-slate-800">{product.noiseLevel || 'High Impact'}</p>
              </div>
            </div>

            {/* MODERN DROPDOWNS */}
            <div className="mt-10 space-y-1">
              {[
                { id: 'description', label: 'Product Details', icon: <Info size={18}/>, content: product.longDescription },
                { id: 'safety', label: 'Safety Guidelines', icon: <ShieldCheck size={18}/>, content: product.safetyInstructions }
              ].map((section) => (
                <div key={section.id} className="border-b border-slate-100 last:border-0">
                  <button 
                    onClick={() => setOpenSection(openSection === section.id ? null : section.id)}
                    className="w-full py-5 flex items-center justify-between group transition-all"
                  >
                    <span className="flex items-center gap-3 font-black text-xs uppercase tracking-[0.2em] text-slate-400 group-hover:text-blue-600 transition-colors">
                      {section.icon} {section.label}
                    </span>
                    {openSection === section.id ? <ChevronUp size={18} className="text-blue-600"/> : <ChevronDown size={18} className="text-slate-300"/>}
                  </button>
                  <div className={`overflow-hidden transition-all duration-500 ease-in-out ${openSection === section.id ? 'max-h-96 pb-8' : 'max-h-0'}`}>
                    <p className="text-slate-600 leading-relaxed text-base font-medium">
                      {section.content || "Experience high-quality fireworks designed for safety and visual excellence."}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* RELATED EFFECTS */}
        {relatedProducts.length > 0 && (
          <section className="mt-32 border-t border-slate-100 pt-16">
            <h3 className="text-3xl font-black tracking-tighter italic mb-12">COMPLEMENTARY EFFECTS</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(rp => (
                <div key={rp.id} onClick={() => navigate(`/product/${rp.id}`)} className="group cursor-pointer">
                  <div className="aspect-square rounded-[2rem] bg-white border border-slate-100 overflow-hidden mb-5 shadow-sm group-hover:shadow-2xl group-hover:-translate-y-2 transition-all duration-500">
                    <img src={rp.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <h4 className="font-black text-slate-900 group-hover:text-blue-600 transition-colors uppercase text-sm tracking-tight">{rp.name}</h4>
                  <div className="flex gap-2 mt-1">
                    <span className="font-black text-blue-600">₹{rp.ourPrice}</span>
                    <span className="text-slate-300 line-through font-bold text-sm">₹{rp.mrpPrice}</span>
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