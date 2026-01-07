import React, { useState, useEffect, useMemo } from "react";
import { Link, useSearchParams } from "react-router-dom";
import {
  LayoutGrid,
  List,
  Search,
  Loader2,
  Leaf,
  Flame,
  X,
  Plus,
  ChevronDown,
  Filter
} from "lucide-react";

import { db } from "../../config/firebase";
import { collection, onSnapshot } from "firebase/firestore";
import { useCart } from "../../context/CartContext";

const ProductListing = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  /* UI STATE */
  const [searchParams, setSearchParams] = useSearchParams();
  const [view, setView] = useState("grid");
  const [showFilters, setShowFilters] = useState(false);

  /* FILTER STATE */
  const activeCategory = searchParams.get("category") || "All";
  const [priceRange, setPriceRange] = useState(10000);
  const [searchTerm, setSearchTerm] = useState("");
  const [noise, setNoise] = useState("All");
  const [greenOnly, setGreenOnly] = useState(false);
  const [sortBy, setSortBy] = useState("popularity");

  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProducts(list);
      setLoading(false);
    });
    return () => unsub();
  }, []);

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))];
    return ["All", ...cats];
  }, [products]);

  const filteredProducts = useMemo(() => {
    let data = products.filter((p) => {
      return (
        (activeCategory === "All" || p.category === activeCategory) &&
        Number(p.ourPrice) <= priceRange &&
        p.name?.toLowerCase().includes(searchTerm.toLowerCase()) &&
        (noise === "All" || p.noiseLevel === noise) &&
        (!greenOnly || p.isGreen)
      );
    });

    if (sortBy === "low") data.sort((a, b) => a.ourPrice - b.ourPrice);
    if (sortBy === "high") data.sort((a, b) => b.ourPrice - a.ourPrice);
    if (sortBy === "popularity") data.sort((a, b) => (b.stockQty || 0) - (a.stockQty || 0));

    return data;
  }, [products, activeCategory, priceRange, searchTerm, noise, greenOnly, sortBy]);

  const handleCategoryChange = (cat) => {
    setSearchParams({ category: cat });
  };

  // Reusable Filter UI
  const FilterElements = () => (
    <div className="space-y-8">
      {/* CATEGORY DROPDOWN */}
      <div className="space-y-3">
        <label className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Select Category</label>
        <div className="relative">
          <select 
            value={activeCategory}
            onChange={(e) => handleCategoryChange(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* PRICE RANGE */}
      <div>
        <div className="flex justify-between mb-4">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Budget</span>
          <span className="text-xs font-black text-blue-600 italic">₹{priceRange}</span>
        </div>
        <input
          type="range" min="100" max="10000" step="100"
          value={priceRange}
          onChange={(e) => setPriceRange(e.target.value)}
          className="w-full h-1.5 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-blue-600"
        />
      </div>

      {/* NOISE LEVEL */}
      <div className="space-y-3">
        <span className="text-[10px] font-black uppercase text-slate-400 tracking-[0.2em]">Noise Intensity</span>
        <div className="relative">
          <select 
            value={noise}
            onChange={(e) => setNoise(e.target.value)}
            className="w-full bg-slate-50 p-4 rounded-2xl border-none font-bold text-sm text-slate-700 outline-none appearance-none cursor-pointer focus:ring-2 focus:ring-blue-100"
          >
            <option value="All">All Intensities</option>
            <option value="Low Noise">Low Noise</option>
            <option value="Medium Noise">Medium Noise</option>
            <option value="High Noise">High Noise</option>
          </select>
          <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" size={18} />
        </div>
      </div>

      {/* GREEN TOGGLE */}
      <label className="flex items-center justify-between p-5 rounded-[2rem] bg-emerald-50/50 border border-emerald-100 cursor-pointer group hover:bg-emerald-50 transition-all">
        <div className="flex items-center gap-2">
          <Leaf size={18} className="text-emerald-600" />
          <span className="text-xs font-black text-emerald-900 uppercase tracking-widest">Eco Friendly</span>
        </div>
        <input
          type="checkbox" checked={greenOnly}
          onChange={() => setGreenOnly(!greenOnly)}
          className="w-5 h-5 accent-emerald-600 rounded-md"
        />
      </label>
    </div>
  );

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-white">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-black text-slate-400 tracking-[0.3em] uppercase text-[10px]">Preparing Sparks</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FDFDFD] pb-20">
      {/* --- HEADER --- */}
      <header className="bg-white/80 backdrop-blur-md border-b border-slate-50 sticky top-0 z-50 px-6 py-5">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-black text-slate-900 uppercase italic tracking-tighter">
              Himalaya <span className="text-blue-600">Crackers</span>
            </h1>
            <button onClick={() => setShowFilters(true)} className="lg:hidden p-3 bg-slate-50 rounded-2xl shadow-sm"><Filter size={20}/></button>
          </div>

          <div className="relative group w-full md:w-1/3">
            <Search className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 group-focus-within:text-blue-600 transition-all" size={18} />
            <input
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search for rockets, sparkles..."
              className="w-full bg-slate-50 border-none rounded-2xl py-4 pl-14 pr-6 font-bold text-sm outline-none focus:ring-2 focus:ring-blue-50 transition-all"
            />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* --- DYNAMIC TITLE SECTION --- */}
        <div className="mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-100 pb-10">
          <div>
            <h2 className="text-4xl md:text-7xl font-black text-slate-900 uppercase italic tracking-tighter leading-none mb-4">
              {activeCategory} <span className="text-blue-600 font-light not-italic">Section</span>
            </h2>
            <p className="text-slate-400 font-bold uppercase tracking-[0.3em] text-xs ml-1">
              {filteredProducts.length} Premium Fireworks Available
            </p>
          </div>
          
          <div className="flex items-center gap-4 bg-slate-50 p-2 rounded-2xl">
            <button onClick={() => setView("grid")} className={`p-3 rounded-xl transition-all ${view === "grid" ? "bg-white text-blue-600 shadow-md scale-110" : "text-slate-400"}`}><LayoutGrid size={20} /></button>
            <button onClick={() => setView("list")} className={`p-3 rounded-xl transition-all ${view === "list" ? "bg-white text-blue-600 shadow-md scale-110" : "text-slate-400"}`}><List size={20} /></button>
          </div>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          {/* --- DESKTOP FILTER --- */}
          <aside className="hidden lg:block w-80 shrink-0">
            <div className="bg-white p-10 rounded-[3rem] border border-slate-50 shadow-2xl shadow-slate-100 sticky top-32">
              <h3 className="font-black text-xs uppercase tracking-[0.3em] text-slate-300 mb-10">Refine Collection</h3>
              <FilterElements />
            </div>
          </aside>

          {/* --- PRODUCT GRID --- */}
          <main className="flex-1">
            <div className="flex justify-between items-center mb-10">
               <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Displaying Results</span>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-black text-slate-400 uppercase">Sort</span>
                 <select onChange={(e) => setSortBy(e.target.value)} className="bg-transparent font-black text-xs uppercase outline-none text-slate-900 cursor-pointer">
                   <option value="popularity">Popularity</option>
                   <option value="low">Price: Low to High</option>
                   <option value="high">Price: High to Low</option>
                 </select>
               </div>
            </div>

            <div className={view === "grid" ? "grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-x-10 gap-y-20" : "space-y-8"}>
              {filteredProducts.map((p) => {
                const isAvailable = Number(p.stockQty) > 0 && !p.isOutOfStock;
                return (
                  <div key={p.id} className={`group relative ${view === "list" ? "flex flex-col md:flex-row gap-8 bg-white p-6 rounded-[2.5rem] border border-slate-50 shadow-sm" : "flex flex-col"}`}>
                    
                    {/* IMAGE CONTAINER */}
                    <div className={`relative overflow-hidden bg-[#F1F5F9] transition-all duration-700 ${
                      view === "list" ? "w-full md:w-72 h-56 rounded-3xl" : "aspect-[3/4] rounded-[3rem] rounded-tr-none mb-8 group-hover:rounded-tr-[3rem] group-hover:rounded-bl-none"
                    }`}>
                      <Link to={`/product/${p.id}`} onClick={() => window.scrollTo(0,0)}>
                        <img src={p.images?.[0]} alt={p.name} className="w-full h-full object-cover grayscale-[20%] group-hover:grayscale-0 group-hover:scale-105 transition-all duration-1000" />
                      </Link>

                      {/* BADGES */}
                      <div className="absolute top-6 left-6 flex flex-col gap-2">
                         {p.isBestSeller && <div className="bg-white/90 backdrop-blur px-3 py-1.5 rounded-xl text-[9px] font-black uppercase text-orange-600 shadow-sm border border-orange-50">Hot Seller</div>}
                         {p.isGreen && <div className="bg-emerald-500 text-white p-2 rounded-full shadow-lg border-2 border-white"><Leaf size={14}/></div>}
                      </div>

                      {!isAvailable && (
                        <div className="absolute inset-0 bg-white/40 backdrop-blur-sm flex items-center justify-center">
                          <span className="bg-slate-900 text-white text-[10px] font-black px-6 py-2.5 rounded-full uppercase italic tracking-[0.2em] shadow-2xl">Temporarily Out</span>
                        </div>
                      )}
                    </div>

                    {/* DETAILS */}
                    <div className="flex-1 flex flex-col px-2">
                      <div className="flex justify-between items-center mb-3">
                        <span className="text-[10px] font-black text-blue-600 uppercase tracking-[0.2em]">{p.category}</span>
                        <div className="flex items-center gap-1.5 bg-orange-50 px-2 py-1 rounded-lg">
                          <Flame size={12} className="text-orange-500" fill="currentColor" />
                          <span className="text-[9px] font-black text-orange-600 uppercase italic">{p.noiseLevel || "Medium"}</span>
                        </div>
                      </div>

                      <h3 className="text-2xl font-black text-slate-900 tracking-tighter leading-[0.9] mb-6 group-hover:text-blue-600 transition-colors uppercase italic">{p.name}</h3>

                      <div className="mt-auto flex items-center justify-between border-t border-slate-50 pt-6">
                        <div className="flex flex-col">
                           <span className="text-3xl font-black text-slate-900 italic tracking-tighter">₹{p.ourPrice}</span>
                           <span className="text-[10px] text-slate-300 line-through font-bold">₹{p.mrpPrice}</span>
                        </div>
                        
                        <button
                          disabled={!isAvailable}
                          onClick={() => addToCart(p)}
                          className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-all shadow-xl active:scale-90 ${
                            isAvailable ? "bg-slate-900 text-white hover:bg-blue-600 shadow-blue-100" : "bg-slate-100 text-slate-300 cursor-not-allowed"
                          }`}
                        >
                          <Plus size={24} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </main>
        </div>
      </div>

      {/* --- MOBILE DRAWER --- */}
      {showFilters && (
        <div className="fixed inset-0 z-[100] bg-slate-900/60 backdrop-blur-sm lg:hidden transition-all duration-500">
          <div className="absolute right-0 top-0 h-full w-[85%] bg-white p-10 overflow-y-auto animate-in slide-in-from-right duration-500 rounded-l-[3rem]">
            <div className="flex justify-between items-center mb-12">
              <h3 className="font-black text-3xl italic tracking-tighter uppercase">Filters</h3>
              <button onClick={() => setShowFilters(false)} className="p-3 bg-slate-50 rounded-2xl"><X /></button>
            </div>
            <FilterElements />
            <button onClick={() => setShowFilters(false)} className="w-full mt-12 bg-slate-900 text-white py-5 rounded-[2rem] font-black uppercase tracking-[0.2em] shadow-2xl active:scale-95">Update Collection</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductListing;