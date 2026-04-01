import React, { useEffect, useMemo, useState } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';

// Standardizing imports (assumed paths from your snippet)
import sparklersImg from '../../assets/sparklers.png';
import rocketsImg from '../../assets/rockets.png';
import fancyCrackersImg from '../../assets/fancy_crackers.png';
import giftBoxesImg from '../../assets/gift_boxes.png';

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const fallbackCategories = [
  {
    id: '01',
    title: 'Sparklers',
    image: sparklersImg,
  },
  {
    id: '02',
    title: 'Rockets',
    image: rocketsImg,
  },
  {
    id: '03',
    title: 'Fancy Crackers',
    image: fancyCrackersImg,
  },
  {
    id: '04',
    title: 'Gift Boxes',
    image: giftBoxesImg,
  },
];

const FeaturedCategories = () => {
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      const list = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((cat) => cat.isActive !== false && cat.name)
        .map((cat, idx) => ({
          id: cat.id || String(idx),
          title: cat.name.trim(),
          slug: cat.slug || toSlug(cat.name),
          image: cat.imageUrl || '',
        }));
      setCategories(list);
    });

    return () => unsub();
  }, []);

  const displayCategories = useMemo(() => {
    if (categories.length > 0) return categories;
    return fallbackCategories;
  }, [categories]);

  return (
    <section className="py-14 md:py-16 bg-white relative overflow-hidden font-poppins">
      {/* Subtle background pattern */}
      <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] bg-size-[24px_24px] opacity-40 pointer-events-none"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        <div className="text-center mb-10">
          <p className="text-orange-500 font-bold tracking-widest uppercase text-xs mb-3">
            Our Collections
          </p>
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
            Explore Our <span className="text-[#1E60F2]">Premium Range</span>
          </h2>
          <div className="w-16 h-1 bg-linear-to-r from-orange-400 to-[#1E60F2] mx-auto mt-4 rounded-full"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
          {displayCategories.map((cat) => (
            <Link
              key={cat.id}
              to={`/products?categorySlug=${encodeURIComponent(cat.slug || toSlug(cat.title))}`}
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="group relative flex justify-center"
            >
              <div className="relative w-38 h-38 md:w-44 md:h-44 rounded-full overflow-hidden shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-1">
                <img
                  src={cat.image}
                  alt={cat.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/20 to-transparent" />

                {/* Content overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-end text-center pb-5 px-3">
                  <div className="inline-flex items-center justify-center p-2 rounded-full bg-linear-to-br from-amber-400 to-orange-500 text-white mb-2 shadow-lg">
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <h3 className="text-sm md:text-base font-bold text-white mb-0.5">
                    {cat.title}
                  </h3>
                  <div className="flex items-center gap-1 text-white/75 text-xs font-medium opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                    <span>Explore</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          >
            <button className="inline-flex items-center gap-2 px-8 py-3.5 bg-slate-900 text-white font-bold rounded-full hover:bg-[#1E60F2] hover:shadow-lg hover:shadow-blue-500/25 transition-all duration-300 transform hover:-translate-y-0.5">
              View All Categories
              <ArrowRight className="w-4 h-4" />
            </button>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedCategories;
