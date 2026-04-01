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
      <div className="h-[45vh] flex items-center justify-center bg-slate-100">
        No banners yet
      </div>
    );

  const slide = slides[current];

  return (
    <section className="relative h-[58vh] min-h-105 md:h-[68vh] lg:h-[74vh] overflow-hidden">
      {/* Background Image with smooth transition */}
      {slides.map((s, i) => (
        <div
          key={i}
          className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            backgroundImage: `url(${s.image})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
      ))}

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-linear-to-t from-black/70 via-black/30 to-black/10" />
      <div className="absolute inset-0 bg-linear-to-r from-black/30 to-transparent" />

      {/* Content */}
      <div className="relative h-full flex items-center">
        <div className="max-w-7xl mx-auto px-6 w-full">
          <div className="max-w-3xl">
            <div
              key={current}
              className="animate-in fade-in slide-in-from-bottom-6 duration-700"
            >
              <h1 className="text-3xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-4 leading-[1.1]">
                {slide.title}
              </h1>
              <h2 className="text-base md:text-xl font-medium text-white/80 mb-3">
                {slide.subtitle}
              </h2>
              <p className="mb-6 text-white/70 md:text-base max-w-xl leading-relaxed">
                {slide.desc}
              </p>

              {slide.buttonText && (
                <Link
                  to="/products"
                  className="inline-flex items-center gap-2 bg-white text-gray-900 hover:bg-orange-500 hover:text-white px-6 py-3 rounded-full font-bold transition-all duration-300 shadow-xl hover:shadow-orange-500/30 transform hover:-translate-y-0.5"
                >
                  {slide.buttonText}
                  <ChevronRight size={18} />
                </Link>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Slide Indicators */}
      <div className="absolute bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {slides.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className={`h-1.5 rounded-full transition-all duration-500 ${
              i === current
                ? 'w-10 bg-white'
                : 'w-4 bg-white/40 hover:bg-white/60'
            }`}
          />
        ))}
      </div>

      {/* Nav Arrows */}
      <button
        onClick={() =>
          setCurrent(current === 0 ? slides.length - 1 : current - 1)
        }
        className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full transition-all duration-300 text-white border border-white/20 hover:scale-110"
      >
        <ChevronLeft size={22} />
      </button>

      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 p-3 bg-white/10 hover:bg-white/25 backdrop-blur-md rounded-full transition-all duration-300 text-white border border-white/20 hover:scale-110"
      >
        <ChevronRight size={22} />
      </button>
    </section>
  );
};

export default Hero;
