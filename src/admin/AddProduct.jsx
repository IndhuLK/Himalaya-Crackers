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
import { useToast } from '../components/Toast';

// 1. Import Firebase tools
import { db, storage } from '../config/firebase';
import {
  collection,
  addDoc,
  updateDoc,
  doc,
  serverTimestamp,
  onSnapshot,
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function AddProduct() {
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const toast = useToast();

  // 2. State for categories and loading
  const [categories, setCategories] = useState([]);
  const [categorySearch, setCategorySearch] = useState('');
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);

  const [loadingCats, setLoadingCats] = useState(true);
  const [noiseOptions, setNoiseOptions] = useState([
    'Low Noise',
    'Medium Noise',
    'High Noise',
  ]);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category: '',
    categorySlug: '',
    subCategory: '',
    mrpPrice: '',
    ourPrice: '',
    stockQty: '',
    noiseSubCategory: '',
    duration: '',
    isGreen: false,
    isEcoFriendly: false,
    longDescription: '',
    safetyInstructions: '',
    highlightType: 'none',
    offerPercentage: '',
    isBestSeller: false,
    isFestivalSpecial: false,
    isOutOfStock: false,
    images: [], // This will store permanent Firebase URLs
    videoUrl: '',
  });

  // Load product data if editing
  useEffect(() => {
    if (location.state?.product) {
      const product = location.state.product;
      setFormData((prev) => ({
        ...prev,
        ...product,
        slug: product.slug || toSlug(product.name || ''),
        categorySlug: product.categorySlug || toSlug(product.category || ''),
        noiseSubCategory: product.noiseLevel || prev.noiseSubCategory || '',
        highlightType:
          product.highlightType ||
          (Number(product.offerPercentage) > 0
            ? 'offer'
            : product.isBestSeller
              ? 'bestSeller'
              : product.isFestivalSpecial
                ? 'festival'
                : 'none'),
        offerPercentage:
          product.offerPercentage !== undefined
            ? String(product.offerPercentage || '')
            : prev.offerPercentage,
        isEcoFriendly:
          product.isEcoFriendly !== undefined
            ? product.isEcoFriendly
            : Boolean(product.isGreen),
      }));
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
      toast.warning('Please fill Name, Category and Our Price');
      return;
    }

    if (formData.highlightType === 'offer' && !formData.offerPercentage) {
      toast.warning('Please enter offer percentage');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCategory = categories.find(
        (cat) => cat.name === formData.category
      );

      const productData = {
        ...formData,
        isGreen: Boolean(formData.isEcoFriendly),
        isEcoFriendly: Boolean(formData.isEcoFriendly),
        isOutOfStock: Number(formData.stockQty || 0) <= 0,
        isBestSeller: formData.highlightType === 'bestSeller',
        isFestivalSpecial: formData.highlightType === 'festival',
        offerPercentage:
          formData.highlightType === 'offer'
            ? Number(formData.offerPercentage || 0)
            : 0,
        slug: formData.slug || toSlug(formData.name),
        categorySlug:
          formData.categorySlug ||
          selectedCategory?.slug ||
          toSlug(formData.category),
        mrpPrice: Number(formData.mrpPrice),
        ourPrice: Number(formData.ourPrice),
        stockQty: Number(formData.stockQty),
        noiseLevel: formData.noiseSubCategory || 'Medium Noise',
        updatedAt: serverTimestamp(),
      };

      if (formData.id) {
        // Update existing product
        await updateDoc(doc(db, 'products', formData.id), productData);
        toast.success('Product Updated!');
      } else {
        // Add new product
        await addDoc(collection(db, 'products'), {
          ...productData,
          createdAt: serverTimestamp(),
        });
        toast.success('Product Added Successfully!');
      }

      navigate('/admin/products');
    } catch (error) {
      console.error(error);
      toast.error('Error saving to Database');
    } finally {
      setIsSaving(false);
    }
  };

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'categories'), (snap) => {
      const catList = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((cat) => cat.isActive !== false && cat.name)
        .map((cat) => ({
          id: cat.id,
          name: cat.name.trim(),
          slug: cat.slug || toSlug(cat.name),
        }));
      setCategories(catList);
      setLoadingCats(false);
    });
    return () => unsub();
  }, []);

  const normalizedCategorySearch = categorySearch.trim().toLowerCase();
  const filteredCategories = categories.filter((cat) => {
    if (!normalizedCategorySearch) return true;
    return cat.name.toLowerCase().includes(normalizedCategorySearch);
  });
  const hasExactCategoryMatch = categories.some(
    (cat) => cat.name.toLowerCase() === normalizedCategorySearch
  );

  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'products'), (snap) => {
      const dynamicNoise = snap.docs
        .map((doc) => doc.data()?.noiseLevel)
        .filter(Boolean);

      const merged = [
        'Low Noise',
        'Medium Noise',
        'High Noise',
        ...dynamicNoise,
      ];
      const uniqueNoise = [...new Set(merged.map((v) => String(v).trim()))];
      setNoiseOptions(uniqueNoise);
    });

    return () => unsub();
  }, []);

  const addNewCategory = async (nameInput) => {
    const formattedName = (nameInput ?? categorySearch).trim();
    const exists = categories.some(
      (cat) => cat.name.toLowerCase() === formattedName.toLowerCase()
    );
    if (formattedName && !exists) {
      try {
        const newSlug = toSlug(formattedName);
        await addDoc(collection(db, 'categories'), {
          name: formattedName,
          slug: newSlug,
          isActive: true,
          createdAt: serverTimestamp(),
        });
        setFormData({
          ...formData,
          category: formattedName,
          categorySlug: newSlug,
        });
        setCategorySearch('');
        setIsCategoryDropdownOpen(false);
        toast.success(`Category "${formattedName}" created and selected!`);
      } catch (err) {
        console.error(err);
        toast.error('Failed to create category');
      }
      return;
    }

    if (formattedName && exists) {
      const selected = categories.find(
        (cat) => cat.name.toLowerCase() === formattedName.toLowerCase()
      );
      if (selected) {
        setFormData({
          ...formData,
          category: selected.name,
          categorySlug: selected.slug,
        });
        setCategorySearch('');
        setIsCategoryDropdownOpen(false);
      }
    }
  };

  const handleCategoryInputChange = (value) => {
    setCategorySearch(value);
    setIsCategoryDropdownOpen(true);
  };

  const handleCategorySelect = (selected) => {
    setFormData({
      ...formData,
      category: selected.name,
      categorySlug: selected.slug,
    });
    setCategorySearch('');
    setIsCategoryDropdownOpen(false);
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
                    setFormData({
                      ...formData,
                      name: e.target.value,
                      slug: toSlug(e.target.value),
                    })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="e.g. 5000 Wala Mega Garland"
                />
              </div>

              <div className="md:col-span-2 space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Slug
                </label>
                <input
                  type="text"
                  value={formData.slug}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      slug: toSlug(e.target.value),
                    })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="auto-generated-product-slug"
                />
              </div>

              {/* Categories Searchable Input */}
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Category <span className="text-red-500">*</span>
                </label>
                <div className="relative">
                  <input
                    type="text"
                    placeholder={
                      loadingCats
                        ? 'Loading...'
                        : formData.category
                          ? `Selected: ${formData.category} | Search or type new category`
                          : 'Search or type new category'
                    }
                    value={categorySearch || formData.category}
                    onChange={(e) => handleCategoryInputChange(e.target.value)}
                    onFocus={() => setIsCategoryDropdownOpen(true)}
                    onKeyDown={(e) => {
                      const typed = categorySearch.trim();
                      if (e.key === 'Escape') {
                        setIsCategoryDropdownOpen(false);
                        return;
                      }
                      if (e.key === 'Enter' && typed) {
                        e.preventDefault();
                        const exact = categories.find(
                          (c) => c.name.toLowerCase() === typed.toLowerCase()
                        );
                        if (exact) {
                          handleCategorySelect(exact);
                        } else {
                          addNewCategory(typed);
                        }
                      }
                    }}
                    onBlur={() => {
                      setTimeout(() => setIsCategoryDropdownOpen(false), 120);
                      const typed = categorySearch.trim();
                      if (!typed) return;
                      const selected = categories.find(
                        (cat) => cat.name.toLowerCase() === typed.toLowerCase()
                      );
                      if (selected) {
                        handleCategorySelect(selected);
                      }
                    }}
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />

                  {isCategoryDropdownOpen && (
                    <div className="absolute z-20 mt-1 w-full max-h-56 overflow-y-auto rounded-md border border-gray-200 bg-white shadow-lg">
                      {filteredCategories.map((cat) => (
                        <button
                          key={cat.id || cat.slug}
                          type="button"
                          onMouseDown={() => handleCategorySelect(cat)}
                          className="w-full px-3 py-2 text-left text-sm text-gray-700 hover:bg-blue-50 hover:text-blue-700"
                        >
                          {cat.name}
                        </button>
                      ))}

                      {normalizedCategorySearch && !hasExactCategoryMatch && (
                        <button
                          type="button"
                          onMouseDown={() =>
                            addNewCategory(categorySearch.trim())
                          }
                          className="w-full border-t border-gray-100 px-3 py-2 text-left text-sm font-medium text-blue-600 hover:bg-blue-50"
                        >
                          + Create "{categorySearch.trim()}"
                        </button>
                      )}

                      {filteredCategories.length === 0 &&
                        (!normalizedCategorySearch ||
                          hasExactCategoryMatch) && (
                          <div className="px-3 py-2 text-sm text-gray-500">
                            No categories found
                          </div>
                        )}
                    </div>
                  )}
                </div>

                {!categorySearch && formData.category && (
                  <p className="text-xs text-green-600 mt-1">
                    Selected category: {formData.category}
                  </p>
                )}
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

            {/* Highlights */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-gray-100">
              <div className="space-y-1">
                <label className="text-xs font-medium text-gray-700">
                  Highlights
                </label>
                <select
                  value={formData.highlightType}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      highlightType: e.target.value,
                      offerPercentage:
                        e.target.value === 'offer'
                          ? formData.offerPercentage
                          : '',
                    })
                  }
                  className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 appearance-none"
                >
                  <option value="none">None</option>
                  <option value="bestSeller">Best Seller</option>
                  <option value="festival">Festival</option>
                  <option value="offer">Off with Percentage</option>
                </select>
              </div>

              {formData.highlightType === 'offer' && (
                <div className="space-y-1">
                  <label className="text-xs font-medium text-gray-700">
                    Offer Percentage (%)
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="100"
                    value={formData.offerPercentage}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        offerPercentage: e.target.value,
                      })
                    }
                    className="w-full bg-white border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                    placeholder="e.g. 25"
                  />
                </div>
              )}

              <label className="flex items-center gap-2 cursor-pointer p-2 border border-transparent hover:bg-green-50 rounded-md transition-colors">
                <input
                  type="checkbox"
                  checked={formData.isEcoFriendly}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      isEcoFriendly: e.target.checked,
                      isGreen: e.target.checked,
                    })
                  }
                  className="rounded text-green-600 focus:ring-green-500 border-gray-300"
                />
                <span className="text-xs font-medium text-green-700">
                  Eco Friendly
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
                  <option value="">Select Noise Level</option>
                  {noiseOptions.map((noiseName) => (
                    <option key={noiseName} value={noiseName}>
                      {noiseName}
                    </option>
                  ))}
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
