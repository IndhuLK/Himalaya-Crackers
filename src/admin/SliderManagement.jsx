import { useState, useEffect } from 'react';
import {
  Trash2,
  Plus,
  X,
  Edit3,
  UploadCloud,
  Loader2,
  Image as ImageIcon,
} from 'lucide-react';

import {
  collection,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
} from 'firebase/firestore';

import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

import { db, storage } from '../config/firebase';

export default function SliderManagement() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [banners, setBanners] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  const emptyBanner = {
    id: null,
    image: '',
    title: '',
    subtitle: '',
    desc: '',
    buttonText: '',
  };

  const [currentBanner, setCurrentBanner] = useState(emptyBanner);

  /* 🔥 REALTIME FIRESTORE */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, 'homeBanners'), (snap) => {
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
      console.error('Upload error:', error);
      alert('Failed to upload image.');
    } finally {
      setUploading(false);
    }
  };

  /* 💾 SAVE/UPDATE */
  const handleBannerSave = async () => {
    if (!currentBanner.image) {
      alert('Please upload an image first!');
      return;
    }

    setIsSaving(true);
    try {
      const bannerData = {
        image: currentBanner.image,
        title: currentBanner.title || '',
        subtitle: currentBanner.subtitle || '',
        desc: currentBanner.desc || '',
        buttonText: currentBanner.buttonText || '',
        updatedAt: serverTimestamp(),
      };

      if (currentBanner.id) {
        await updateDoc(doc(db, 'homeBanners', currentBanner.id), bannerData);
      } else {
        await addDoc(collection(db, 'homeBanners'), {
          ...bannerData,
          createdAt: Date.now(),
        });
      }

      setIsModalOpen(false);
      setCurrentBanner(emptyBanner);
    } catch (error) {
      console.error('Save error:', error);
      alert('Error saving slider. Check Firebase permissions.');
    } finally {
      setIsSaving(false);
    }
  };

  /* 🗑 DELETE */
  const handleDeleteBanner = async (id) => {
    if (window.confirm('Are you sure you want to delete this slider?')) {
      await deleteDoc(doc(db, 'homeBanners', id));
    }
  };

  return (
    <div className="p-6 bg-gray-50 min-h-screen">
      {/* HEADER */}
      <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between md:items-center gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Slider Management
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your homepage hero banners
          </p>
        </div>
        <button
          onClick={() => {
            setCurrentBanner(emptyBanner);
            setIsModalOpen(true);
          }}
          className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-md text-sm font-medium flex items-center gap-2 transition-colors shadow-sm"
        >
          <Plus size={16} /> Add New Slider
        </button>
      </div>

      {/* GRID LIST */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {banners.map((b) => (
          <div
            key={b.id}
            className="group bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden hover:shadow-md transition-shadow flex flex-col"
          >
            <div className="h-40 relative overflow-hidden bg-gray-100 border-b border-gray-200">
              <img
                src={b.image}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                alt={b.title}
              />
              <div className="absolute inset-0 bg-gray-900/50 opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 items-center justify-center backdrop-blur-sm">
                <button
                  onClick={() => {
                    setCurrentBanner(b);
                    setIsModalOpen(true);
                  }}
                  className="bg-white p-2 rounded-md text-blue-600 hover:bg-blue-50 transition-colors shadow-sm"
                  title="Edit Slider"
                >
                  <Edit3 size={18} />
                </button>
                <button
                  onClick={() => handleDeleteBanner(b.id)}
                  className="bg-white p-2 rounded-md text-red-600 hover:bg-red-50 transition-colors shadow-sm"
                  title="Delete Slider"
                >
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
            <div className="p-4 flex flex-col flex-1">
              <span className="text-[10px] font-semibold uppercase tracking-wide text-blue-600 mb-1">
                {b.subtitle || 'No Subtitle'}
              </span>
              <h3 className="font-medium text-gray-900 text-sm line-clamp-1">
                {b.title || 'Untitled Slider'}
              </h3>
              <p className="text-gray-500 text-xs line-clamp-2 mt-1 flex-1">
                {b.desc || 'No description provided.'}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* MODERN MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white w-full max-w-xl rounded-lg shadow-xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-medium text-gray-900">
                Slider Details
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-6 space-y-6 overflow-y-auto">
              {/* IMAGE UPLOAD SLOT */}
              <div className="relative group">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Hero Image
                </label>
                <div
                  className={`relative h-40 rounded-md border-2 border-dashed transition-all flex flex-col items-center justify-center overflow-hidden
                  ${currentBanner.image ? 'border-blue-300 bg-blue-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-gray-400'}`}
                >
                  {uploading ? (
                    <div className="flex flex-col items-center">
                      <Loader2
                        className="animate-spin text-blue-600 mb-2"
                        size={24}
                      />
                      <span className="text-xs text-gray-500">
                        Uploading...
                      </span>
                    </div>
                  ) : currentBanner.image ? (
                    <>
                      <img
                        src={currentBanner.image}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gray-900/40 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                        <p className="text-white text-sm font-medium bg-gray-900/70 px-3 py-1.5 rounded-md">
                          Change Image
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="text-center p-4">
                      <UploadCloud
                        className="text-gray-400 mx-auto mb-2"
                        size={28}
                      />
                      <p className="text-sm font-medium text-gray-700">
                        Click to browse image
                      </p>
                      <p className="text-xs text-gray-400 mt-1">
                        Recommended: 1920x1080px
                      </p>
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
                <div className="col-span-2 space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Main Title
                  </label>
                  <input
                    placeholder="Enter headline..."
                    value={currentBanner.title}
                    onChange={(e) =>
                      setCurrentBanner({
                        ...currentBanner,
                        title: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Subtitle
                  </label>
                  <input
                    placeholder="e.g. New Season"
                    value={currentBanner.subtitle}
                    onChange={(e) =>
                      setCurrentBanner({
                        ...currentBanner,
                        subtitle: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-sm font-medium text-gray-700">
                    Button Label
                  </label>
                  <input
                    placeholder="e.g. Shop Now"
                    value={currentBanner.buttonText}
                    onChange={(e) =>
                      setCurrentBanner({
                        ...currentBanner,
                        buttonText: e.target.value,
                      })
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              <div className="space-y-1">
                <label className="block text-sm font-medium text-gray-700">
                  Description
                </label>
                <textarea
                  placeholder="Tell your customers more about this offer..."
                  value={currentBanner.desc}
                  onChange={(e) =>
                    setCurrentBanner({ ...currentBanner, desc: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 h-20 resize-none"
                />
              </div>
            </div>

            <div className="px-6 py-4 border-t border-gray-200 bg-gray-50 flex justify-end">
              {/* ACTION BUTTON */}
              <button
                disabled={uploading || isSaving || !currentBanner.image}
                onClick={handleBannerSave}
                className={`px-5 py-2.5 rounded-md text-sm font-medium flex items-center justify-center gap-2 min-w-[120px] transition-colors
                  ${
                    uploading || isSaving || !currentBanner.image
                      ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                      : 'bg-blue-600 hover:bg-blue-700 text-white shadow-sm'
                  }`}
              >
                {isSaving ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : currentBanner.id ? (
                  'Update Slider'
                ) : (
                  'Publish Slider'
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
