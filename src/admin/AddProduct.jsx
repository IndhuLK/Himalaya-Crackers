import { useState, useRef, useEffect } from 'react';
import {
  Upload,
  Save,
  PlayCircle,
  Info,
  ShieldCheck,
  PlusCircle,
  Loader2,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

// 1. Import Firebase tools
import { db, storage } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  getDocs,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

export default function AddProduct() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();

  // 2. State for categories and loading
  const [categories, setCategories] = useState([]);
  const [newCatName, setNewCatName] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loadingCats, setLoadingCats] = useState(true);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    subCategory: '',
    mrpPrice: '',
    ourPrice: '',
    stockQty: '',
    noiseSubCategory: '',
    duration: '',
    isGreen: false,
    longDescription: '',
    safetyInstructions: '',
    isBestSeller: false,
    isFestivalSpecial: false,
    isOutOfStock: false,
    images: [], // This will store permanent Firebase URLs
    videoUrl: '',
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
        console.error('Upload error', err);
      }
    }

    setFormData((prev) => ({
      ...prev,
      images: uploadedUrls.slice(0, 5),
    }));
    setUploadingImage(false);
  };

  // 4. FIX: Save to Firestore (So ProductListing can see it)
  const handleSave = async () => {
    if (!formData.name || !formData.category || !formData.ourPrice) {
      alert('Please fill Name, Category and Our Price');
      return;
    }

    setIsSaving(true);
    try {
      const productData = {
        ...formData,
        mrpPrice: Number(formData.mrpPrice),
        ourPrice: Number(formData.ourPrice),
        stockQty: Number(formData.stockQty),
        noiseLevel: formData.noiseSubCategory || 'Medium Noise',
        updatedAt: serverTimestamp(),
      };

      if (formData.id) {
        // Update existing product
        await updateDoc(doc(db, 'products', formData.id), productData);
        alert('Product Updated!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        alert('Product Added Successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      alert('Error saving to Database');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      const catList = snap.docs.map((doc) => doc.data().name);
      setCategories(catList);
      setLoadingCats(false);
    });
    return () => unsub();
  }, []);

  const addNewCategory = async () => {
    const formattedName = newCatName.trim();
    if (formattedName && !categories.includes(formattedName)) {
      try {
        await addDoc(collection(db, 'categories'), {
          name: formattedName,
          createdAt: serverTimestamp(),
        });
        setFormData({ ...formData, category: formattedName });
        setNewCatName('');
      } catch (err) {
        console.error('Error adding category', err);
        alert('Failed to add category');
      }
    }
  };

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6 pb-20 bg-gray-50 min-h-screen">
      <input
        type="file"
        multiple
        accept="image/*"
        ref={fileInputRef}
        className="hidden"
        onChange={handleImageChange}
      />

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Add New Item
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Create or update product in your catalog
          </p>
        </div>
        <button
          onClick={handleSave}
          disabled={isSaving || uploadingImage}
          className="flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:bg-gray-400"
        >
          {isSaving ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <Save size={16} />
          )}
          {formData.id ? 'Update Item' : 'Save Item'}
        </button>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-1 space-y-6">
          {/* Images Section */}
          <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-5">
            <h3 className="font-medium text-gray-900 mb-4 text-sm">
              Product Images
            </h3>
            <div
              onClick={() => fileInputRef.current.click()}
              className="bg-gray-50 p-4 rounded-md border border-dashed border-gray-300 flex flex-col items-center justify-center aspect-square text-center cursor-pointer hover:bg-gray-100 transition-colors"
            >
              {uploadingImage ? (
                <div className="flex flex-col items-center">
                  <Loader2
                    className="animate-spin text-blue-600 mb-2"
                    size={24}
                  />
                  <p className="text-xs text-gray-500">Uploading...</p>
                </div>
              ) : formData.images.length > 0 ? (
                <div className="grid grid-cols-2 gap-2 w-full h-full">
                  {formData.images.map((img, idx) => (
                    <img
                      key={idx}
                      src={img}
                      className="w-full h-full object-cover rounded shadow-sm border border-gray-200"
                      alt="product"
                    />
                  ))}
                  {formData.images.length < 5 && (
                    <div className="border border-dashed border-gray-300 rounded flex items-center justify-center text-gray-400">
                      <PlusCircle size={20} />
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center text-gray-500">
                  <Upload size={24} className="mb-2" />
                  <p className="text-sm font-medium">Upload Images</p>
                  <p className="text-xs text-gray-400 mt-1">
                    Up to 5 images (PNG, JPG)
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* New Category Input UI */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
              Add New Category
            </h3>
            <div className="space-y-3">
              <input
                type="text"
                placeholder="e.g. Sparklers, Fancy Rockets"
                value={newCatName}
                onChange={(e) => setNewCatName(e.target.value)}
                className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
              />
              <button
                onClick={addNewCategory}
                className="w-full bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-md hover:bg-gray-200 transition-colors flex items-center justify-center gap-2"
              >
                <PlusCircle size={16} /> Save Category
              </button>
            </div>
          </div>

          {/* Video URL */}
          <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <PlayCircle size={18} className="text-red-500" />
              <h3 className="text-sm font-medium text-gray-900">
                Product Video
              </h3>
            </div>
            <input
              type="text"
              value={formData.videoUrl}
              onChange={(e) =>
                setFormData({ ...formData, videoUrl: e.target.value })
              }
              placeholder="YouTube Link"
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-6">
            <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
              Basic Info
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 5000 Wala Mega Garland"
                />
              </div>

              {/* Categories Dropdown Section */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  value={formData.category}
                  onChange={(e) =>
                    setFormData({ ...formData, category: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="">
                    {loadingCats ? 'Loading...' : 'Select Category'}
                  </option>
                  {categories.map((cat, idx) => (
                    <option key={idx} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Sub Category
                </label>
                <input
                  type="text"
                  value={formData.subCategory}
                  onChange={(e) =>
                    setFormData({ ...formData, subCategory: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. Atom Bomb"
                />
              </div>
            </div>

            {/* Badges */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-gray-100">
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-transparent hover:bg-gray-50 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isBestSeller}
                  onChange={(e) =>
                    setFormData({ ...formData, isBestSeller: e.target.checked })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs font-medium text-gray-700">
                  Best Seller
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-transparent hover:bg-gray-50 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isFestivalSpecial}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isFestivalSpecial: e.target.checked,
                    })
                  }
                  className="rounded text-blue-600 focus:ring-blue-500 border-gray-300"
                />
                <span className="text-xs font-medium text-gray-700">
                  Festival
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-transparent hover:red-50 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isOutOfStock}
                  onChange={(e) =>
                    setFormData({ ...formData, isOutOfStock: e.target.checked })
                  }
                  className="rounded text-red-600 focus:ring-red-500 border-gray-300"
                />
                <span className="text-xs font-medium text-red-600">
                  Out of Stock
                </span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer p-2 border border-transparent hover:bg-green-50 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isGreen}
                  onChange={(e) =>
                    setFormData({ ...formData, isGreen: e.target.checked })
                  }
                  className="rounded text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="text-xs font-medium text-green-700">
                  Green Only
                </span>
              </label>
            </div>

            {/* Pricing */}
            <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2 mt-6">
              Stock & Pricing
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1">
                <label className="text-xs text-gray-600">MRP Price (₹)</label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.mrpPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, mrpPrice: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">
                  Our Price (₹) <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  placeholder="0.00"
                  value={formData.ourPrice}
                  onChange={(e) =>
                    setFormData({ ...formData, ourPrice: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 font-medium text-gray-900"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Stock Qty</label>
                <input
                  type="number"
                  placeholder="0"
                  value={formData.stockQty}
                  onChange={(e) =>
                    setFormData({ ...formData, stockQty: e.target.value })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs text-gray-600">Noise Level</label>
                <select
                  value={formData.noiseSubCategory}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      noiseSubCategory: e.target.value,
                    })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="Low Noise">Low Noise</option>
                  <option value="Medium Noise">Medium Noise</option>
                  <option value="High Noise">High Noise</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2 border-b border-gray-100 pb-2">
              <ShieldCheck size={18} className="text-gray-600" />
              <h3 className="text-sm font-medium text-gray-900">
                Safety Instructions
              </h3>
            </div>
            <textarea
              rows="4"
              value={formData.safetyInstructions}
              onChange={(e) =>
                setFormData({ ...formData, safetyInstructions: e.target.value })
              }
              placeholder="e.g. Keep 5 meters distance..."
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm space-y-4">
            <h3 className="text-sm font-medium text-gray-900 border-b border-gray-100 pb-2">
              Detailed Description
            </h3>
            <textarea
              rows="5"
              value={formData.longDescription}
              onChange={(e) =>
                setFormData({ ...formData, longDescription: e.target.value })
              }
              className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
