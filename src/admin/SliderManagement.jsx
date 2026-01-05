import { useState, useEffect } from "react";
import {
  Trash2,
  Plus,
  X,
  Edit3,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
} from "lucide-react";

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";

import {
  ref,
  uploadBytes,
  getDownloadURL,
} from "firebase/storage";

import { db, storage } from "../config/firebase";

export default function SliderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyBanner = {
    id: null,
    image: "",
    title: "",
    subtitle: "",
    desc: "",
    buttonText: "",
  };

  const [currentBanner, setCurrentBanner] = useState(emptyBanner);

  /* 🔥 REALTIME FIRESTORE */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "homeBanners"), (snap) => {
      const list = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      // Sort by createdAt if available
      setBanners(list.sort((a, b) => b.createdAt - a.createdAt));
    });
    return () => unsub();
  }, []);

  /* 📤 IMAGE UPLOAD */
  const handleImageUpload = async (file) => {
    if (!file) return;
    setUploading(true);
    try {
      const imgRef = ref(storage, `homeBanners/${Date.now()}-${file.name}`);
      await uploadBytes(imgRef, file);
      const url = await getDownloadURL(imgRef);
      setCurrentBanner((prev) => ({ ...prev, image: url }));
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to upload image.");
    } finally {
      setUploading(false);
    }
  };

  /* 💾 SAVE/UPDATE */
  const handleBannerSave = async () => {
    if (!currentBanner.image) {
      alert("Please upload an image first!");
      return;
    }

    setIsSaving(true);
    try {
      const bannerData = {
        image: currentBanner.image,
        title: currentBanner.title || "",
        subtitle: currentBanner.subtitle || "",
        desc: currentBanner.desc || "",
        buttonText: currentBanner.buttonText || "",
        updatedAt: serverTimestamp(),
      };

      if (currentBanner.id) {
        await updateDoc(doc(db, "homeBanners", currentBanner.id), bannerData);
      } else {
        await addDoc(collection(db, "homeBanners"), {
          ...bannerData,
          createdAt: Date.now(),
        });
      }

      setIsModalOpen(false);
      setCurrentBanner(emptyBanner);
    } catch (error) {
      console.error("Save error:", error);
      alert("Error saving slider. Check Firebase permissions.");
    } finally {
      setIsSaving(false);
    }
  };

  /* 🗑 DELETE */
  const handleDeleteBanner = async (id) => {
    if (window.confirm("Are you sure you want to delete this slider?")) {
      await deleteDoc(doc(db, "homeBanners", id));
    }
  };

  return (
    <div className="p-8 bg-[#f8fafc] min-h-screen text-slate-800">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex justify-between items-center mb-10">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-slate-900">
            SLIDER <span className="text-blue-600">MANAGEMENT</span>
          </h1>
          <p className="text-slate-500 text-sm mt-1">Manage your homepage hero banners</p>
        </div>
        <button
          onClick={() => {
            setCurrentBanner(emptyBanner);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 transition-all shadow-lg shadow-blue-200 active:scale-95"
        >
          <Plus size={20} /> Add New Slider
        </button>
      </div>

      {/* GRID LIST */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {banners.map((b) => (
          <div key={b.id} className="group bg-white rounded-3xl shadow-sm border border-slate-100 overflow-hidden hover:shadow-xl transition-all duration-300">
            <div className="h-48 relative overflow-hidden">
              <img src={b.image} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" alt={b.title} />
              <div className="absolute inset-0 bg-slate-900/40 opacity-0 group-hover:opacity-100 transition-opacity flex gap-3 items-center justify-center backdrop-blur-[2px]">
                <button
                  onClick={() => {
                    setCurrentBanner(b);
                    setIsModalOpen(true);
                  }}
                  className="bg-white p-3 rounded-full text-blue-600 hover:bg-blue-50 transition-colors shadow-lg"
                >
                  <Edit3 size={20} />
                </button>
                <button
                  onClick={() => handleDeleteBanner(b.id)}
                  className="bg-white p-3 rounded-full text-red-600 hover:bg-red-50 transition-colors shadow-lg"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            </div>
            <div className="p-5">
              <span className="text-[10px] font-bold uppercase tracking-widest text-blue-500">{b.subtitle || "No Subtitle"}</span>
              <h3 className="font-bold text-lg mt-1 line-clamp-1">{b.title || "Untitled Slider"}</h3>
              <p className="text-slate-400 text-sm line-clamp-2 mt-2 leading-relaxed">{b.desc || "No description provided."}</p>
            </div>
          </div>
        ))}
      </div>

      {/* MODERN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-[2.5rem] shadow-2xl overflow-hidden animate-in fade-in zoom-in duration-200">
            
            <div className="px-8 py-6 border-b border-slate-50 flex justify-between items-center">
              <h3 className="text-xl font-bold">Slider Details</h3>
              <button 
                onClick={() => setIsModalOpen(false)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-8 space-y-5">
              {/* IMAGE UPLOAD SLOT */}
              <div className="relative group">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-2 ml-1">Hero Image</label>
                <div className={`relative h-44 rounded-3xl border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                  ${currentBanner.image ? 'border-blue-200 bg-blue-50' : 'border-slate-200 bg-slate-50 hover:border-blue-400'}`}>
                  
                  {uploading ? (
                    <div className="flex flex-col items-center animate-pulse">
                      <Loader2 className="animate-spin text-blue-500 mb-2" />
                      <span className="text-sm font-medium text-blue-500">Uploading to Storage...</span>
                    </div>
                  ) : currentBanner.image ? (
                    <>
                      <img src={currentBanner.image} className="w-full h-full object-cover" />
                      <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-xs font-bold bg-black/50 px-4 py-2 rounded-full backdrop-blur-md">Change Image</p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-6">
                      <div className="bg-white p-3 rounded-2xl shadow-sm inline-block mb-3">
                        <UploadCloud className="text-blue-500" size={28} />
                      </div>
                      <p className="text-sm font-semibold text-slate-600">Click to browse or drag image</p>
                      <p className="text-xs text-slate-400 mt-1">Recommended: 1920x1080px</p>
                    </div>
                  )}
                  
                  <input
                    type="file"
                    accept="image/*"
                    onChange={(e) => handleImageUpload(e.target.files[0])}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                  />
                </div>
              </div>

              {/* INPUT FIELDS */}
              <div className="grid grid-cols-2 gap-4">
                <div className="col-span-2">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Main Title</label>
                  <input
                    placeholder="Enter headline..."
                    value={currentBanner.title}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, title: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all outline-none"
                  />
                </div>
                
                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Subtitle</label>
                  <input
                    placeholder="e.g. New Season"
                    value={currentBanner.subtitle}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, subtitle: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Button Label</label>
                  <input
                    placeholder="e.g. Shop Now"
                    value={currentBanner.buttonText}
                    onChange={(e) => setCurrentBanner({ ...currentBanner, buttonText: e.target.value })}
                    className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-500 mb-1.5 ml-1">Description</label>
                <textarea
                  placeholder="Tell your customers more about this offer..."
                  value={currentBanner.desc}
                  onChange={(e) => setCurrentBanner({ ...currentBanner, desc: e.target.value })}
                  className="w-full p-4 rounded-2xl bg-slate-50 border border-slate-100 focus:bg-white focus:ring-4 focus:ring-blue-50 focus:border-blue-400 transition-all outline-none h-24 resize-none"
                />
              </div>

              {/* ACTION BUTTONS */}
              <button
                disabled={uploading || isSaving || !currentBanner.image}
                onClick={handleBannerSave}
                className={`w-full py-4 rounded-2xl font-bold text-lg shadow-xl transition-all flex items-center justify-center gap-2
                  ${uploading || isSaving || !currentBanner.image 
                    ? "bg-slate-200 text-slate-400 cursor-not-allowed" 
                    : "bg-blue-600 hover:bg-blue-700 text-white active:scale-[0.98] shadow-blue-100"}`}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" />
                ) : currentBanner.id ? (
                  "Update Slider"
                ) : (
                  "Publish Slider"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}