import React from 'react';
import { Truck, MapPin, Globe, AlertTriangle, PhoneCall } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const DeliveryAreas = () => {
  const navigate = useNavigate();
  return (
    <section className="py-12 md:py-14 bg-[#F8FAFC] font-poppins relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex flex-col lg:flex-row gap-7 items-center">
          {/* Left Content */}
          <div className="lg:w-1/2 space-y-4">
            <div>
              <p className="text-[#F2A31E] font-bold tracking-widest uppercase mb-2 text-xs">
                We Deliver Happiness
              </p>
              <h2 className="text-2xl md:text-3xl font-black text-gray-900 leading-tight">
                Accessible Delivery Across{' '}
                <span className="text-[#1E60F2]">Tamil Nadu</span>
              </h2>
              <p className="text-gray-500 text-sm md:text-base mt-3 leading-relaxed">
                We ensure your celebration reaches you on time. Our specialized
                logistics network is designed to handle fireworks with care and
                safety.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-3.5 bg-white rounded-xl shadow-md border-l-4 border-[#1E60F2]">
                <div className="flex items-center gap-3 mb-2">
                  <MapPin className="text-[#1E60F2]" />
                  <h3 className="font-bold text-base">Local Districts</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Sivakasi, Virudhunagar, Madurai, and surrounding areas.
                </p>
              </div>
              <div className="p-3.5 bg-white rounded-xl shadow-md border-l-4 border-[#F2A31E]">
                <div className="flex items-center gap-3 mb-2">
                  <Truck className="text-[#F2A31E]" />
                  <h3 className="font-bold text-base">Transport Service</h3>
                </div>
                <p className="text-sm text-gray-500">
                  Reliable lorry booking service for other districts in TN.
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 p-2.5 bg-orange-50 rounded-lg border border-orange-100">
              <AlertTriangle className="text-orange-500 shrink-0" />
              <p className="text-sm text-gray-700 font-medium">
                Note: For other states/bulk orders, please contact our support
                team directly.
              </p>
            </div>

            <button
              className="flex items-center gap-2 px-5 py-2.5 bg-[#1E60F2] cursor-pointer
            text-white rounded-full font-bold text-sm shadow-lg hover:bg-blue-700 hover:shadow-xl transition-all duration-300"
              onClick={() => {
                navigate('/contact');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            >
              <PhoneCall size={20} />
              Contact for Delivery Enquiry
            </button>
          </div>

          {/* Right Visual / Map Representation */}
          <div className="lg:w-1/2 w-full relative">
            {/* Abstract Map Graphic */}
            <div
              className="relative z-10 bg-white rounded-[2.25rem] p-6 md:p-7 shadow-2xl border
             border-gray-100 overflow-hidden min-h-96 flex items-center justify-center "
            >
              <div className="absolute inset-0 bg-linear-to-br from-blue-50/50 to-orange-50/50"></div>

              <div className="relative text-center space-y-5 z-20">
                <div className="inline-block p-5 rounded-full bg-white shadow-xl animate-pulse">
                  <Globe size={52} className="text-[#1E60F2]" />
                </div>
                <div>
                  <h3 className="text-xl md:text-2xl font-black text-gray-900 mb-2">
                    Pan India Service
                  </h3>
                  <span className="px-4 py-1 bg-green-100 text-green-700 rounded-full text-xs font-bold uppercase">
                    Wholesale Only
                  </span>
                </div>
                <ul className="text-left space-y-2.5 text-gray-600 font-medium text-sm md:text-base">
                  <li className="flex items-center gap-2">
                    ✓ Minimum Order Value applies
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Lorry Transport Booking
                  </li>
                  <li className="flex items-center gap-2">
                    ✓ Safety Guidelines Followed
                  </li>
                </ul>
              </div>
            </div>

            {/* Decor Elements */}
            <div
              className="absolute -bottom-6 -right-6 w-full h-full
            bg-[#1E60F2]/5 rounded-[3rem] -z-10"
            ></div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .bg-grid-pattern {
          background-image: radial-gradient(#cbd5e1 1px, transparent 1px);
          background-size: 20px 20px;
        }
      `}</style>
    </section>
  );
};

export default DeliveryAreas;
