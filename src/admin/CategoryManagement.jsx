import { useEffect, useMemo, useRef, useState } from 'react';
import {
  FolderTree,
  Save,
  Pencil,
  Trash2,
  Search,
  Loader2,
  Tag,
  ImagePlus,
} from 'lucide-react';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  onSnapshot,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useToast } from '../components/Toast';

const toSlug = (value) =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

const initialForm = {
  name: '',
  slug: '',
  description: '',
  imageUrl: '',
  isActive: true,
};

export default function CategoryManagement() {
  const toast = useToast();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [search, setSearch] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState(initialForm);
  const imageInputRef = useRef(null);

  useEffect(() => {
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
      const list = snap.docs.map((item) => ({
        id: item.id,
        ...item.data(),
      }));
      setCategories(list);
      setLoading(false);
    });

    const unsubProducts = onSnapshot(collection(db, 'products'), (snap) => {
      setProducts(snap.docs.map((item) => item.data()));
    });

    return () => {
      unsubCategories();
      unsubProducts();
    };
  }, []);

  const categoryUsageMap = useMemo(() => {
    const usage = {};
    for (const product of products) {
      const key = (product.category || '').trim();
      if (!key) continue;
      usage[key] = (usage[key] || 0) + 1;
    }
    return usage;
  }, [products]);

  const filteredCategories = useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return categories;
    return categories.filter((item) => {
      const name = (item.name || '').toLowerCase();
      const slug = (item.slug || '').toLowerCase();
      const desc = (item.description || '').toLowerCase();
      return name.includes(q) || slug.includes(q) || desc.includes(q);
    });
  }, [categories, search]);

  const resetForm = () => {
    setFormData(initialForm);
    setEditingId(null);
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setUploadingImage(true);
    try {
      const imageRef = ref(storage, `categories/${Date.now()}-${file.name}`);
      await uploadBytes(imageRef, file);
      const url = await getDownloadURL(imageRef);
      setFormData((prev) => ({ ...prev, imageUrl: url }));
      toast.success('Category image uploaded');
    } catch (error) {
      console.error('Category image upload failed', error);
      toast.error('Image upload failed');
    } finally {
      setUploadingImage(false);
      e.target.value = '';
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    const name = formData.name.trim();
    const slug = (formData.slug || toSlug(name)).trim();

    if (!name) {
      toast.warning('Category name is required');
      return;
    }

    if (!slug) {
      toast.warning('Valid slug is required');
      return;
    }

    const duplicate = categories.find(
      (item) =>
        item.id !== editingId &&
        ((item.name || '').toLowerCase() === name.toLowerCase() ||
          (item.slug || '').toLowerCase() === slug.toLowerCase())
    );

    if (duplicate) {
      toast.warning('Category name or slug already exists');
      return;
    }

    setIsSaving(true);
    try {
      const payload = {
        name,
        slug,
        description: formData.description.trim(),
        imageUrl: formData.imageUrl || '',
        isActive: formData.isActive,
        updatedAt: serverTimestamp(),
      };

      if (editingId) {
        await updateDoc(doc(db, 'categories', editingId), payload);
        toast.success('Category updated');
      } else {
        await addDoc(collection(db, 'categories'), {
          ...payload,
          createdAt: serverTimestamp(),
        });
        toast.success('Category added');
      }

      resetForm();
    } catch (error) {
      console.error('Category save failed', error);
      toast.error('Failed to save category');
    } finally {
      setIsSaving(false);
    }
  };

  const handleEdit = (item) => {
    setEditingId(item.id);
    setFormData({
      name: item.name || '',
      slug: item.slug || toSlug(item.name || ''),
      description: item.description || '',
      imageUrl: item.imageUrl || '',
      isActive: item.isActive !== false,
    });
  };

  const handleDelete = async (item) => {
    const usageCount = categoryUsageMap[item.name] || 0;
    const message =
      usageCount > 0
        ? `This category is used in ${usageCount} product(s). Delete anyway?`
        : 'Delete this category?';

    if (!window.confirm(message)) return;

    try {
      await deleteDoc(doc(db, 'categories', item.id));
      if (editingId === item.id) resetForm();
      toast.success('Category deleted');
    } catch (error) {
      console.error('Category delete failed', error);
      toast.error('Failed to delete category');
    }
  };

  if (loading) {
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-3 text-slate-500">
        <Loader2 className="animate-spin text-blue-600" />
        <p>Loading category data...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6 max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Category Management
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Create, edit and organize item categories.
          </p>
        </div>
        <div className="flex items-center gap-2 rounded-md bg-white border border-gray-200 px-3 py-2 text-sm text-gray-700">
          <FolderTree size={16} className="text-blue-600" />
          Total Categories:{' '}
          <span className="font-semibold">{categories.length}</span>
        </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <form
          onSubmit={handleSave}
          className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 space-y-4 xl:col-span-1"
        >
          <h2 className="text-sm font-semibold text-gray-900 border-b border-gray-100 pb-2">
            {editingId ? 'Edit Category' : 'New Category'}
          </h2>

          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
          />

          <div className="space-y-2">
            <label className="text-xs font-medium text-gray-700">
              Category Image
            </label>
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg border border-gray-200 bg-gray-50 overflow-hidden shrink-0">
                {formData.imageUrl ? (
                  <img
                    src={formData.imageUrl}
                    alt="Category preview"
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">
                    <ImagePlus size={16} />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => imageInputRef.current?.click()}
                disabled={uploadingImage}
                className="inline-flex items-center gap-2 rounded-md border border-gray-300 px-3 py-2 text-xs font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-60"
              >
                {uploadingImage ? (
                  <Loader2 size={14} className="animate-spin" />
                ) : (
                  <ImagePlus size={14} />
                )}
                {uploadingImage ? 'Uploading...' : 'Upload Image'}
              </button>
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Name</label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  name: e.target.value,
                  slug: toSlug(e.target.value),
                }))
              }
              placeholder="e.g. Sparklers"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">Slug</label>
            <input
              type="text"
              value={formData.slug}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  slug: toSlug(e.target.value),
                }))
              }
              placeholder="e.g. sparklers"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-medium text-gray-700">
              Description
            </label>
            <textarea
              rows={4}
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({
                  ...prev,
                  description: e.target.value,
                }))
              }
              placeholder="Short category note"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm resize-none focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>

          <label className="flex items-center gap-2 text-sm text-gray-700">
            <input
              type="checkbox"
              checked={formData.isActive}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, isActive: e.target.checked }))
              }
              className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            Active Category
          </label>

          <div className="flex gap-2 pt-1">
            <button
              type="submit"
              disabled={isSaving || uploadingImage}
              className="flex-1 inline-flex justify-center items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:bg-gray-400"
            >
              {isSaving ? (
                <Loader2 size={16} className="animate-spin" />
              ) : (
                <Save size={16} />
              )}
              {editingId ? 'Update' : 'Save'}
            </button>
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="inline-flex items-center justify-center rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
            )}
          </div>
        </form>

        <div className="bg-white border border-gray-200 rounded-lg shadow-sm p-5 xl:col-span-2">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-4">
            <h2 className="text-sm font-semibold text-gray-900">
              Category Details
            </h2>
            <div className="relative w-full sm:w-72">
              <Search
                size={15}
                className="absolute left-3 top-2.5 text-gray-400"
              />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search category..."
                className="w-full rounded-md border border-gray-300 py-2 pl-9 pr-3 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200 text-gray-600">
                  <th className="text-left py-2.5 font-semibold">Image</th>
                  <th className="text-left py-2.5 font-semibold">Category</th>
                  <th className="text-left py-2.5 font-semibold">Slug</th>
                  <th className="text-left py-2.5 font-semibold">
                    Description
                  </th>
                  <th className="text-center py-2.5 font-semibold">Products</th>
                  <th className="text-center py-2.5 font-semibold">Status</th>
                  <th className="text-right py-2.5 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredCategories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="text-center py-8 text-gray-500">
                      No categories found.
                    </td>
                  </tr>
                ) : (
                  filteredCategories.map((item) => {
                    const usageCount = categoryUsageMap[item.name] || 0;
                    return (
                      <tr
                        key={item.id}
                        className="border-b border-gray-100 hover:bg-gray-50/70"
                      >
                        <td className="py-3 pr-3">
                          <div className="w-10 h-10 rounded-md border border-gray-200 bg-gray-50 overflow-hidden">
                            {item.imageUrl ? (
                              <img
                                src={item.imageUrl}
                                alt={item.name}
                                className="w-full h-full object-cover"
                              />
                            ) : (
                              <div className="w-full h-full flex items-center justify-center text-gray-400">
                                <ImagePlus size={12} />
                              </div>
                            )}
                          </div>
                        </td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center gap-2 text-gray-900 font-medium">
                            <Tag size={14} className="text-blue-600" />
                            {item.name}
                          </div>
                        </td>
                        <td className="py-3 pr-3 text-gray-600">
                          {item.slug || '-'}
                        </td>
                        <td
                          className="py-3 pr-3 text-gray-600 max-w-56 truncate"
                          title={item.description || ''}
                        >
                          {item.description || '-'}
                        </td>
                        <td className="py-3 text-center">
                          <span className="rounded bg-gray-100 px-2 py-1 text-xs font-semibold text-gray-700">
                            {usageCount}
                          </span>
                        </td>
                        <td className="py-3 text-center">
                          <span
                            className={`px-2 py-1 rounded text-xs font-semibold ${item.isActive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-600'}`}
                          >
                            {item.isActive !== false ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="py-3 text-right">
                          <div className="inline-flex items-center gap-1.5">
                            <button
                              onClick={() => handleEdit(item)}
                              className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded"
                              title="Edit"
                            >
                              <Pencil size={15} />
                            </button>
                            <button
                              onClick={() => handleDelete(item)}
                              className="p-1.5 text-gray-500 hover:text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                            >
                              <Trash2 size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
