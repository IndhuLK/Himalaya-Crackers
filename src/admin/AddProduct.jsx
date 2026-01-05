import { useState, useRef, useEffect } from "react";
import { Upload, Save, PlayCircle, Info, ShieldCheck, PlusCircle, Loader2 } from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

// 1. Import Firebase tools
import { db, storage } from "../config/firebase"; 
import { collection, addDoc, updateDoc, doc, serverTimestamp, getDocs } from "firebase/firestore";
import { ref, uploadBytes, getDownloadURL } from "firebase/storage";

export default function AddProduct() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 2. State for categories and loading
  const [categories, setCategories] = useState(["1000 Wala", "Night Crackers"]); // Default categories
  const [newCatName, setNewCatName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    category: "",
    subCategory: "",
    mrpPrice: "",
    ourPrice: "",
    stockQty: "",
    noiseSubCategory: "",
    duration: "",
    isGreen: true,
    longDescription: "",
    safetyInstructions: "",
    isBestSeller: false,
    isFestivalSpecial: false,
    isOutOfStock: false,
    images: [], // This will store permanent Firebase URLs
    videoUrl: "",
  });

  // Load product data if editing
  useEffect(() => {
    if (location.state?.product) {
      setFormData(location.state.product);
    }
  }, [location.state]);

  // 3. FIX: Upload images to Firebase Storage (Permanent Links)
  const handleImageChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setUploadingImage(true);
    const uploadedUrls = [...formData.images];

    for (const file of files) {
      try {
        const storageRef = ref(storage, `products/${Date.now()}-${file.name}`);
        await uploadBytes(storageRef, file);
        const url = await getDownloadURL(storageRef);
        uploadedUrls.push(url);
      } catch (err) {
        console.error("Upload error", err);
      }
    }
    
    setFormData(prev => ({ 
      ...prev, 
      images: uploadedUrls.slice(0, 5) 
    }));
    setUploadingImage(false);
  };

  // 4. FIX: Save to Firestore (So ProductListing can see it)
  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.ourPrice) {
      alert("Please fill Name, Category and Our Price");
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        ...formData,
        mrpPrice: Number(formData.mrpPrice),
        ourPrice: Number(formData.ourPrice),
        stockQty: Number(formData.stockQty),
        noiseLevel: formData.noiseSubCategory || "Medium Noise",
        updatedAt: serverTimestamp(),
      };

      if (formData.id) {
        // Update existing product
        await updateDoc(doc(db, "products", formData.id), productData);
        alert("Product Updated!");
      } else {
        // Add new product
        await addDoc(collection(db, "products"), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        alert("Product Added Successfully!");
      }

      navigate("/admin/products");
    } catch (error) {
      console.error(error);
      alert("Error saving to Database");
    } finally {
      setIsSaving(false);
    }
  };

  const addNewCategory = () => {
    if (newCatName.trim() && !categories.includes(newCatName)) {
      setCategories([...categories, newCatName]);
      setFormData({ ...formData, category: newCatName });
      setNewCatName("");
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-8 animate-in fade-in pb-20 bg-slate-50 min-h-screen">
      <input type="file" multiple accept="image/*" ref={fileInputRef} className="hidden" onChange={handleImageChange} />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase tracking-tighter">Add New Cracker</h1>
          <p className="text-slate-500 font-medium">Synced with Real-time Shop Listing</p>
        </div>
        <button 
          onClick={handleSave}
          disabled={isSaving || uploadingImage}
          className="flex items-center gap-2 bg-blue-600 text-white px-8 py-4 rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg disabled:bg-slate-400"
        >
          {isSaving ? <Loader2 className="animate-spin" /> : <Save size={20} />} 
          {formData.id ? "UPDATE PRODUCT" : "SAVE PRODUCT"}
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        <div className="lg:col-span-4 space-y-6">
          {/* Images Section */}
          <div 
            onClick={() => fileInputRef.current.click()}
            className="bg-white p-6 rounded-[2.5rem] border-2 border-dashed border-slate-200 flex flex-col items-center justify-center aspect-square text-center cursor-pointer overflow-hidden shadow-sm"
          >
            {uploadingImage ? (
              <div className="flex flex-col items-center">
                <Loader2 className="animate-spin text-blue-600 mb-2" size={30} />
                <p className="text-sm font-bold text-slate-500">Uploading to Cloud...</p>
              </div>
            ) : formData.images.length > 0 ? (
              <div className="grid grid-cols-2 gap-2 w-full h-full">
                {formData.images.map((img, idx) => (
                  <img key={idx} src={img} className="w-full h-full object-cover rounded-2xl" alt="product" />
                ))}
                {formData.images.length < 5 && <div className="border-2 border-dashed border-slate-100 rounded-2xl flex items-center justify-center text-slate-300"><PlusCircle /></div>}
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload size={30} className="text-blue-600 mb-2" />
                <p className="font-black text-slate-700 uppercase text-sm">Upload Product Images</p>
              </div>
            )}
          </div>

          {/* New Category UI */}
          <div className="bg-[#0f172a] p-6 rounded-[2.5rem] text-white shadow-2xl space-y-4">
            <h3 className="text-xl font-bold">New Category</h3>
            <input 
              type="text" 
              placeholder="Category Name..." 
              value={newCatName}
              onChange={(e) => setNewCatName(e.target.value)}
              className="w-full bg-slate-800/50 border border-slate-700 rounded-xl px-4 py-3 text-sm outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button 
              onClick={addNewCategory}
              className="w-full bg-white text-black font-black py-4 rounded-2xl flex items-center justify-center gap-2 hover:bg-slate-200 transition-all"
            >
              <PlusCircle size={18} /> ADD CATEGORY
            </button>
          </div>

          {/* Video URL */}
          <div className="bg-slate-900 p-8 rounded-[2.5rem] text-white shadow-xl">
             <div className="flex items-center gap-3 mb-4">
                <PlayCircle size={24} className="text-red-500" />
                <h3 className="font-black text-lg">Product Video</h3>
             </div>
             <input 
                type="text" 
                value={formData.videoUrl}
                onChange={(e) => setFormData({...formData, videoUrl: e.target.value})}
                placeholder="YouTube Link" 
                className="w-full bg-white/10 border border-white/10 rounded-2xl px-5 py-4 text-sm"
             />
          </div>
        </div>

        <div className="lg:col-span-8 space-y-6">
          <div className="bg-white p-8 rounded-[2.5rem] border border-slate-100 shadow-sm space-y-6">
            <div className="grid grid-cols-2 gap-6">
              <div className="col-span-2 space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Product Name</label>
                <input 
                  type="text" 
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-semibold" 
                  placeholder="e.g. 5000 Wala Mega Garland" 
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-semibold"
                >
                  <option value="">Select Category</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Sub Category</label>
                <input 
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                  className="w-full bg-slate-50 border-none rounded-2xl px-5 py-4 font-semibold"
                  placeholder="e.g. Atom Bomb"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-3 gap-4 pt-4 border-t border-slate-50">
                <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer ${formData.isBestSeller ? 'bg-orange-50 border-orange-200' : 'bg-slate-50'}`}>
                    <input type="checkbox" checked={formData.isBestSeller} onChange={(e)=>setFormData({...formData, isBestSeller: e.target.checked})} className="w-5 h-5 accent-orange-500" />
                    <span className="text-xs font-black uppercase text-orange-700">Best Seller</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer ${formData.isFestivalSpecial ? 'bg-purple-50 border-purple-200' : 'bg-slate-50'}`}>
                    <input type="checkbox" checked={formData.isFestivalSpecial} onChange={(e)=>setFormData({...formData, isFestivalSpecial: e.target.checked})} className="w-5 h-5 accent-purple-500" />
                    <span className="text-xs font-black uppercase text-purple-700">Festival</span>
                </label>
                <label className={`flex items-center gap-3 p-4 rounded-2xl cursor-pointer ${formData.isOutOfStock ? 'bg-red-50 border-red-200' : 'bg-slate-50'}`}>
                    <input type="checkbox" checked={formData.isOutOfStock} onChange={(e)=>setFormData({...formData, isOutOfStock: e.target.checked})} className="w-5 h-5 accent-red-500" />
                    <span className="text-xs font-black uppercase text-red-700">Out of Stock</span>
                </label>
            </div>

            {/* Pricing */}
            <div className="grid grid-cols-2 gap-6">
              <input type="number" placeholder="MRP Price (₹)" value={formData.mrpPrice} onChange={(e)=>setFormData({...formData, mrpPrice: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4" />
              <input type="number" placeholder="Our Price (₹)" value={formData.ourPrice} onChange={(e)=>setFormData({...formData, ourPrice: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4 font-bold text-green-600" />
              <input type="number" placeholder="Stock Qty" value={formData.stockQty} onChange={(e)=>setFormData({...formData, stockQty: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4" />
              <select value={formData.noiseSubCategory} onChange={(e)=>setFormData({...formData, noiseSubCategory: e.target.value})} className="w-full bg-slate-50 rounded-2xl px-5 py-4">
                <option value="Low Noise">Low Noise</option>
                <option value="Medium Noise">Medium Noise</option>
                <option value="High Noise">High Noise</option>
              </select>
            </div>
          </div>

          <div className="bg-amber-50 p-8 rounded-[2.5rem] border border-amber-100 space-y-4">
             <div className="flex items-center gap-3">
                <ShieldCheck className="text-amber-600" />
                <h3 className="font-black text-amber-900 uppercase">Safety Instructions</h3>
             </div>
             <textarea 
                rows="4"
                value={formData.safetyInstructions}
                onChange={(e) => setFormData({...formData, safetyInstructions: e.target.value})}
                placeholder="1. Keep distance..."
                className="w-full bg-white/50 border-amber-200 rounded-2xl px-5 py-4 text-sm outline-none"
             />
          </div>

          <div className="bg-slate-50 p-8 rounded-[2.5rem] border border-slate-200 space-y-4">
            <h3 className="font-black uppercase text-slate-800 tracking-wide">Detailed Description</h3>
            <textarea
              rows="5"
              value={formData.longDescription}
              onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
              className="w-full bg-white border border-slate-200 rounded-2xl px-5 py-4 text-sm outline-none"
            />
          </div>
        </div>
      </div>
    </div>
  );
}