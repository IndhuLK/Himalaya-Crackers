import { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { collection, onSnapshot } from "firebase/firestore";
import { db } from "../../config/firebase";

const Hero = () => {
  const [slides, setSlides] = useState([]);
  const [current, setCurrent] = useState(0);

  // 🔥 FIRESTORE LIVE DATA
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "homeBanners"), (snap) => {
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
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative text-center max-w-3xl px-6">
        <h1 className="text-5xl font-black mb-4">{slide.title}</h1>
        <h2 className="text-xl font-bold mb-3">{slide.subtitle}</h2>
        <p className="mb-6">{slide.desc}</p>

        {slide.buttonText && (
          <button className="bg-[#F2A31E] px-8 py-4 rounded-full font-bold">
            {slide.buttonText}
          </button>
        )}
      </div>

      <button
        onClick={() =>
          setCurrent(current === 0 ? slides.length - 1 : current - 1)
        }
        className="absolute left-4 p-3 bg-black/40 rounded-full"
      >
        <ChevronLeft />
      </button>

      <button
        onClick={() => setCurrent((current + 1) % slides.length)}
        className="absolute right-4 p-3 bg-black/40 rounded-full"
      >
        <ChevronRight />
      </button>
    </section>
  );
};

export default Hero;
