import React, { useEffect, useMemo, useState } from 'react';
import { ShoppingCart, Heart, Flame, Zap, Star } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';

import { db } from '../../config/firebase';
import { useCart } from '../../Context/CartContext';

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const TopSelling = () => {
  const { addToCart } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onSnapshot(
      collection(db, 'products'),
      (snapshot) => {
        const list = snapshot.docs.map((entry) => ({
          id: entry.id,
          ...entry.data(),
        }));
        setProducts(list);
        setLoading(false);
      },
      () => {
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const topSellingProducts = useMemo(() => {
    const visible = products.filter(
      (item) => item.isActive !== false && item.isOutOfStock !== true
    );

    return visible
      .sort((a, b) => {
        const scoreA =
          (a.isBestSeller ? 1000 : 0) +
          Number(a.salesCount || a.totalSold || 0) +
          Number(a.stockQty || a.stock || 0);
        const scoreB =
          (b.isBestSeller ? 1000 : 0) +
          Number(b.salesCount || b.totalSold || 0) +
          Number(b.stockQty || b.stock || 0);
        return scoreB - scoreA;
      })
      .slice(0, 4);
  }, [products]);

  if (loading) {
    return (
      <section className="py-20 bg-[#F8FAFC] font-poppins">
        <div className="max-w-7xl mx-auto px-6">
          <div className="mb-8">
            <p className="text-orange-500 font-bold tracking-widest uppercase mb-2 text-xs">
              Customer Favorites
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight capitalize">
              Top Selling <span className="text-[#1E60F2]">Crackers</span>
            </h2>
          </div>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div
                key={idx}
                className="aspect-4/5 rounded-2xl border border-slate-100 bg-white animate-pulse"
              />
            ))}
          </div>
        </div>
      </section>
    );
  }

  if (topSellingProducts.length === 0) {
    return null;
  }

  return (
    <section className="py-20 bg-[#F8FAFC] font-poppins">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
          <div>
            <p className="text-orange-500 font-bold tracking-widest uppercase mb-2 text-xs">
              Customer Favorites
            </p>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight leading-tight capitalize">
              Top Selling <span className="text-[#1E60F2]">Crackers</span>
            </h2>
          </div>
          <Link to="/products">
            <button
              className="hidden md:flex items-center gap-2 group px-6 py-2.5 bg-white
          text-slate-900 font-bold border-2 border-slate-200 hover:border-[#1E60F2] hover:text-[#1E60F2]
           transition-all rounded-full cursor-pointer"
              onClick={() => {
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              View All
              <Zap
                size={16}
                className="text-orange-500 group-hover:animate-pulse"
              />
            </button>
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {topSellingProducts.map((product, idx) => {
            const price = Number(product.ourPrice || product.price || 0);
            const mrp = Number(product.mrpPrice || product.mrp || price);
            const discount =
              mrp > 0 ? Math.round(((mrp - price) / mrp) * 100) : 0;
            const category = (product.category || 'Crackers').toUpperCase();
            const noise = String(product.noiseLevel || 'High Noise');
            const tag = product.isBestSeller
              ? 'Bestseller'
              : Number(product.offerPercentage || 0) > 0
                ? 'Hot Deal'
                : idx === 0
                  ? 'Trending'
                  : null;
            const targetSlug =
              product.slug || toSlug(product.name || product.id);

            return (
              <div key={product.id} className="group relative">
                {/* Image */}
                <div className="relative aspect-4/5 overflow-hidden rounded-2xl shadow-sm bg-white border border-slate-100">
                  <img
                    src={product.images?.[0] || product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />

                  {/* Gradient Overlay */}
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                  {/* Tag */}
                  {tag && (
                    <span className="absolute top-3 left-3 bg-white/95 backdrop-blur text-[#1E60F2] text-[10px] font-bold px-2.5 py-1 rounded-full shadow-sm">
                      {tag}
                    </span>
                  )}

                  {/* Wishlist */}
                  <button className="absolute top-3 right-3 p-1.5 bg-white/90 rounded-full text-slate-400 hover:text-red-500 transition-colors">
                    <Heart size={15} />
                  </button>

                  {/* Floating Cart */}
                  <button
                    onClick={() => addToCart(product, 1)}
                    className="absolute bottom-3 right-3 w-9 h-9 bg-[#1E60F2] text-white rounded-full flex items-center justify-center hover:scale-110 transition-transform shadow-lg opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300"
                  >
                    <ShoppingCart size={15} />
                  </button>
                </div>

                {/* Content */}
                <div className="mt-3 space-y-1.5 px-0.5">
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase tracking-wider">
                    <span className="text-[#1E60F2]">{category}</span>
                    <span className="flex items-center gap-0.5 text-orange-500">
                      <Flame size={10} />
                      {noise.replace(' Noise', '')}
                    </span>
                  </div>

                  <Link to={`/product/${targetSlug}`}>
                    <h3 className="text-sm font-bold text-slate-900 leading-snug group-hover:text-[#1E60F2] transition-colors">
                      {product.name}
                    </h3>
                  </Link>

                  <div className="flex items-center gap-2">
                    <span className="text-base font-black text-slate-900">
                      ₹{price}
                    </span>
                    <span className="text-xs line-through text-slate-400">
                      ₹{mrp}
                    </span>
                    {discount > 0 && (
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                        {discount}% OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Mobile View All Button */}
        <div className="mt-10 text-center md:hidden">
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <button className="w-full py-3 bg-slate-900 text-white font-bold text-sm rounded-xl shadow-md active:scale-95 transition-transform">
              View All Bestsellers
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default TopSelling;
