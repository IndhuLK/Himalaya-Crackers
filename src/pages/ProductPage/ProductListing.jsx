import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  List,
  SlidersHorizontal,
  ShoppingCart,
  Search,
  Loader2,
  Leaf,
  Flame,
} from "lucide-react";

import { db } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useCart } from "../../context/CartContext";

const ProductListing = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useCart();

  /* UI STATES */
  const [searchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [activeCategory, setActiveCategory] = useState(searchParams.get("category") || "All");
  const [priceRange, setPriceRange] = useState(10000);
  const [searchTerm, setSearchTerm] = useState("");

  /* FILTER STATES */
  const [noise, setNoise] = useState("All");
  const [duration, setDuration] = useState(0);
  const [greenOnly, setGreenOnly] = useState(false);

  /* SORT */
  const [sortBy, setSortBy] = useState("popularity");

  /* 🔥 FIREBASE REALTIME */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  /* CATEGORIES */
  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["All", ...cats];
  }, [products]);

  /* FILTER + SORT LOGIC */
  const filteredProducts = useMemo(() => {
    let data = products.filter((p) => {
      const matchCat = activeCategory === "All" || p.category === activeCategory;
      const matchPrice = Number(p.ourPrice) <= priceRange;
      const matchSearch = p.name.toLowerCase().includes(searchTerm.toLowerCase());

      // Fixed Noise filter to match AddProduct values
      const matchNoise = noise === "All" || p.noiseLevel === noise;
      const matchDuration = duration === 0 || Number(p.duration) >= duration;

      // FIX: Using p.isGreen instead of p.isGreenCracker to match AddProduct state
      const matchGreen = !greenOnly || p.isGreen;

      return matchCat && matchPrice && matchSearch && matchNoise && matchDuration && matchGreen;
    });

    if (sortBy === "low") data.sort((a, b) => a.ourPrice - b.ourPrice);
    if (sortBy === "high") data.sort((a, b) => b.ourPrice - a.ourPrice);
    if (sortBy === "popularity") data.sort((a, b) => (b.stockQty || 0) - (a.stockQty || 0));

    return data;
  }, [products, activeCategory, priceRange, searchTerm, noise, duration, greenOnly, sortBy]);

  if (loading) {
    return (
      <div className="h-screen flex items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600" size={48} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-10">
      {/* HEADER */}
      <header className="bg-white py-4 px-6 sticky top-0 z-50 shadow-sm border-b border-slate-100">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="flex items-center gap-2">
            <div className="bg-blue-600 p-2 rounded-lg text-white font-black text-xl">H</div>
            <h1 className="text-xl font-black text-[#1E40AF] tracking-tighter uppercase italic">
              Himalaya <span className="text-[#F59E0B]">Crackers</span>
            </h1>
          </div>

          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-3 text-slate-400" size={18} />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-100 border-none rounded-2xl py-3 pl-12 pr-4 text-slate-900 outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              placeholder="Search for rockets, sparkles..."
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 py-8 flex flex-col lg:flex-row gap-8">
        {/* FILTER SIDEBAR */}
        <aside className="w-full lg:w-72">
          <div className="bg-white p-6 rounded-[2.5rem] shadow-sm border border-slate-100 sticky top-28 space-y-8">
            <h3 className="font-black text-slate-900 flex items-center gap-2 text-lg">
              <SlidersHorizontal size={20} className="text-blue-600" /> Filters
            </h3>

            {/* PRICE */}
            <div>
              <div className="flex justify-between mb-2">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Price Limit</p>
                <p className="text-sm font-black text-blue-600">₹{priceRange}</p>
              </div>
              <input
                type="range"
                min="100"
                max="10000"
                value={priceRange}
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
              />
            </div>

            {/* CATEGORY */}
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-4">Categories</p>
              <div className="flex flex-wrap lg:flex-col gap-2">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2.5 rounded-xl text-sm font-bold transition-all text-left ${activeCategory === cat
                      ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                      : "bg-slate-50 text-slate-600 hover:bg-slate-100"
                      }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* NOISE & DURATION */}
            <div className="space-y-3">
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Performance</p>
              <select onChange={(e) => setNoise(e.target.value)} className="w-full p-3 rounded-xl bg-slate-50 border-none font-bold text-sm text-slate-700">
                <option value="All">All Noise Levels</option>
                <option value="Low Noise">Low Noise</option>
                <option value="Medium Noise">Medium Noise</option>
                <option value="High Noise">High Noise</option>
              </select>
            </div>

            {/* GREEN CRACKER TOGGLE */}
            <label className="flex items-center justify-between p-4 rounded-2xl bg-emerald-50 cursor-pointer group">
              <div className="flex items-center gap-2">
                <Leaf size={18} className="text-emerald-600" />
                <span className="text-sm font-black text-emerald-900">Green Only</span>
              </div>
              <input
                type="checkbox"
                checked={greenOnly}
                onChange={() => setGreenOnly(!greenOnly)}
                className="w-5 h-5 accent-emerald-600 rounded-md"
              />
            </label>
          </div>
        </aside>

        {/* PRODUCTS AREA */}
        <main className="flex-1">
          <div className="flex justify-between items-center mb-8 bg-white p-4 rounded-2xl shadow-sm border border-slate-100">
            <div className="flex bg-slate-100 p-1 rounded-xl">
              <button onClick={() => setView("grid")} className={`p-2 rounded-lg transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}><LayoutGrid size={20} /></button>
              <button onClick={() => setView("list")} className={`p-2 rounded-lg transition-all ${view === "list" ? "bg-white text-blue-600 shadow-sm" : "text-slate-400"}`}><List size={20} /></button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[10px] font-black text-slate-400 uppercase">Sort By</span>
              <select onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-bold text-sm outline-none text-slate-700">
                <option value="popularity">Popularity</option>
                <option value="low">Price: Low to High</option>
                <option value="high">Price: High to Low</option>
              </select>
            </div>
          </div>

          <div className={view === "grid" ? "grid sm:grid-cols-2 xl:grid-cols-3 gap-8" : "space-y-4"}>
            {filteredProducts.map((p) => {
              // Stock logic: combines quantity and boolean toggle
              const isAvailable = Number(p.stockQty) > 0 && !p.isOutOfStock;

              return (
                <div key={p.id} className="bg-white rounded-[2.5rem] border border-slate-100 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all group">
                  <div className="h-64 relative overflow-hidden bg-slate-50">
                    <Link to={`/product/${p.id}`} className="block h-full w-full">
                      <img src={p.images?.[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" alt={p.name} />
                    </Link>

                    {/* 🔥 BADGES SECTION - LEFT SIDE CORNER */}
                    <div className="absolute top-4 left-4 flex flex-col gap-2 z-10 pointer-events-none">
                      {/* Green Badge */}
                      {p.isGreen && (
                        <div className="bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white w-fit">
                          <Leaf size={16} />
                        </div>
                      )}

                      {/* Best Seller Badge */}
                      {p.isBestSeller && (
                        <div className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl border border-white/20">
                          🔥 BEST SELLER
                        </div>
                      )}

                      {/* Festival Special Badge */}
                      {p.isFestivalSpecial && (
                        <div className="bg-purple-600 text-white text-[10px] font-black px-3 py-1.5 rounded-lg shadow-xl border border-white/20">
                          ✨ FESTIVAL
                        </div>
                      )}
                    </div>

                    {!isAvailable && (
                      <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] flex items-center justify-center z-20 pointer-events-none">
                        <span className="bg-red-600 text-white text-[10px] font-black px-4 py-2 rounded-full uppercase tracking-tighter">Temporarily Sold Out</span>
                      </div>
                    )}
                  </div>

                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <span className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{p.category}</span>
                      <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                        <Flame size={12} className="text-orange-400" /> {p.noiseLevel || 'Med Noise'}
                      </span>
                    </div>
                    <h3 className="text-xl font-black text-slate-900 mb-4 tracking-tight leading-tight">{p.name}</h3>

                    <div className="flex justify-between items-center bg-slate-50 p-4 rounded-3xl">
                      <div>
                        <div className="flex items-baseline gap-2">
                          <span className="text-2xl font-black text-slate-900">₹{p.ourPrice}</span>
                          <span className="text-xs line-through text-slate-400 font-bold">₹{p.mrpPrice}</span>
                        </div>
                        <p className="text-[10px] font-bold text-emerald-600">Special Offer</p>
                      </div>

                      <button
                        disabled={!isAvailable}
                        onClick={() => addToCart(p)}
                        className={`p-4 rounded-2xl transition-all shadow-lg ${isAvailable
                          ? "bg-blue-600 text-white hover:bg-orange-500 shadow-blue-100 active:scale-90"
                          : "bg-slate-200 text-slate-400 cursor-not-allowed"
                          }`}
                      >
                        <ShoppingCart size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {filteredProducts.length === 0 && (
            <div className="text-center py-20">
              <p className="text-slate-400 font-bold">No products found matching your filters.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default ProductListing;