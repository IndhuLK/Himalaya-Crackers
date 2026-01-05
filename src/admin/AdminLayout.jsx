import { useState, useEffect } from "react";
import Sidebar from "./Sidebar"; // check your path
import { Outlet } from "react-router-dom";

export default function AdminLayout() {
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Screen size check panna
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 1024);
      if (window.innerWidth < 1024) setIsOpen(false);
      else setIsOpen(true);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar inga thaan iruku */}
      <Sidebar isOpen={isOpen} setIsOpen={setIsOpen} isMobile={isMobile} />
      
      <main className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Mobile-la irukkum pothu Sidebar open panna button venumna inga add pannikalam */}
        <div className="p-4 lg:hidden bg-white border-b">
             <button onClick={() => setIsOpen(true)} className="p-2 bg-blue-600 text-white rounded-lg font-bold">MENU</button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 md:p-8">
          <Outlet /> {/* Indha idathula thaan Dashboard show aagum */}
        </div>
      </main>
    </div>
  );
}