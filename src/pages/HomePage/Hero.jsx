import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../../config/firebase';
import { Link } from 'react-router-dom';

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // 🔥 FIRESTORE LIVE DATA
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'homeBanners'), (snap) => {
      const list = snap.docs.map((d) => d.data());
      setSlides(list);
    });
    return () => unsub();
  }, []);

  useEffect(() => {
    if (!slides.length) return;
    const timer = setInterval(() => {
      setCurrent((c) => (c + 1) % slides.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [slides]);

  if (!slides.length)
    return (
      <div className="h-[60vh] flex items-center justify-center bg-slate-100">
        No banners yet
      </div>
    );

  const slide = slides[current];

  return (
    <section
      className="h-[75vh] relative flex items-center justify-center text-white"
      style={{
        backgroundImage: `url(${slide.image})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px]" />

      <div className="relative text-center max-w-4xl px-6 animate-in fade-in slide-in-from-bottom-8 duration-700">
        <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4 leading-tight">
          {slide.title}
        </h1>
        <h2 className="text-xl md:text-2xl font-medium text-gray-200 mb-4">
          {slide.subtitle}
        </h2>
        <p className="mb-8 text-gray-300 md:text-lg max-w-2xl mx-auto leading-relaxed">
          {slide.desc}
        </p>

        {slide.buttonText && (
          <Link
            to="/products"
            className="inline-block bg-white text-gray-900 hover:bg-gray-50 px-8 py-3.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
          >
            {slide.buttonText}
          </Link>
        )}
      </div>

      <button
        onClick={() =>
          setCurrent(current === 0 ? slides.length - 1 : current - 1)
        }
        className="absolute left-4 md:left-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all text-white border border-white/10"
      >
        <ChevronLeft size={24} />
      </button>

      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-4 md:right-8 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all text-white border border-white/10"
      >
        <ChevronRight size={24} />
      </button>
    </section>
  );
};

export default Hero;
