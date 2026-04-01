import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Package,
  AlertTriangle,
  EyeOff,
  Plus,
  Save,
  Trash2,
  Box,
  Search,
  CheckCircle2,
  Pencil,
  X,
} from 'lucide-react';
import { useToast } from '../components/Toast';
import { db } from '../config/firebase';
import {
  collection,
  onSnapshot,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from 'firebase/firestore';

const toSlug = (value = '') =>
  value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-');

export default function InventoryManager() {
  const toast = useToast();
  const navigate = useNavigate();
  const [products, setProducts] = useState([]); // from 'products' collection
  const [inventoryItems, setInventoryItems] = useState([]); // from 'inventory' collection
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [isUpdatingItem, setIsUpdatingItem] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    category: '',
    stockQty: 0,
    status: 'In Stock',
  });

  // Local state for the inline entry form
  const [formData, setFormData] = useState({
    name: '',
    stock: '',
    category: '',
    status: 'In Stock', // Default status
  });

  // 1. Fetch Products & Categories & Inventory Real-time
  useEffect(() => {
    // Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const list = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        type: 'product',
      }));
      setProducts(list);
    });

    // Inventory
    const unsubInventory = onSnapshot(
      collection(db, 'inventory'),
      (snapshot) => {
        const list = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
          type: 'inventory',
        }));
        setInventoryItems(list);
      }
    );

    // Categories
    const unsubCategories = onSnapshot(collection(db, 'categories'), (snap) => {
      const catList = snap.docs
        .map((doc) => doc.data())
        .filter((cat) => cat.isActive !== false && cat.name)
        .map((cat) => cat.name.trim());
      setCategories(catList);
      if (catList.length > 0 && !formData.category) {
        setFormData((prev) => ({ ...prev, category: catList[0] }));
      }
    });

    setLoading(false);

    return () => {
      unsubProducts();
      unsubInventory();
      unsubCategories();
    };
  }, []);

  // Combine products and inventory items for display
  const allItems = [...products, ...inventoryItems];

  // 2. Add Inventory Item (Strictly to 'inventory' collection)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    let finalStock = Number(formData.stock);
    if (formData.status === 'Out of Stock') finalStock = 0;
    if (
      formData.status === 'Low Stock' &&
      (finalStock > 10 || finalStock === 0)
    )
      finalStock = 5;
    if (formData.status === 'In Stock' && finalStock <= 10) finalStock = 50;

    try {
      // NOTE: Saving to 'inventory' collection, NOT 'products'
      await addDoc(collection(db, 'inventory'), {
        name: formData.name,
        category: formData.category || categories[0] || 'General',
        stockQty: finalStock,
        status: formData.status,
        productCode: `INV-${Math.floor(1000 + Math.random() * 9000)}`, // Distinction in code
        createdAt: serverTimestamp(),
      });
      setFormData({
        name: '',
        stock: '',
        category: categories[0] || '',
        status: 'In Stock',
      });
    } catch (err) {
      console.error('Error adding inventory item:', err);
      toast.error('Failed to add inventory item');
    }
  };

  // 3. Update Stock
  const handleUpdateStock = async (id, newStock, type) => {
    try {
      const stockVal = Number(newStock);
      // Determine collection based on item type
      const collectionName = type === 'product' ? 'products' : 'inventory';
      const itemRef = doc(db, collectionName, id);

      const payload = {
        stockQty: stockVal,
        stock: stockVal, // Maintain legacy field if needed
      };

      if (type === 'product') {
        payload.isOutOfStock = stockVal <= 0;
      }

      await updateDoc(itemRef, payload);
    } catch (err) {
      console.error('Error updating stock:', err);
    }
  };

  // 4. Delete Product/Inventory Item
  const handleDeleteProduct = async (id, type) => {
    if (!window.confirm('Are you sure you want to delete this item?')) return;
    try {
      const collectionName = type === 'product' ? 'products' : 'inventory';
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error('Delete error:', err);
      toast.error('Failed to delete');
    }
  };

  const openEditModal = (item) => {
    const stockVal =
      item.stockQty !== undefined ? Number(item.stockQty) : Number(item.stock);
    setEditingItem(item);
    setEditForm({
      name: item.name || '',
      category: item.category || categories[0] || 'General',
      stockQty: Number.isNaN(stockVal) ? 0 : stockVal,
      status:
        item.status ||
        (stockVal === 0
          ? 'Out of Stock'
          : stockVal <= 10
            ? 'Low Stock'
            : 'In Stock'),
    });
  };

  const closeEditModal = () => {
    setEditingItem(null);
  };

  const handleSaveEdit = async () => {
    if (!editingItem) return;

    const stockVal = Number(editForm.stockQty) || 0;
    const collectionName =
      editingItem.type === 'product' ? 'products' : 'inventory';

    setIsUpdatingItem(true);
    try {
      const payload = {
        name: editForm.name.trim(),
        category: editForm.category || 'General',
        stockQty: stockVal,
        stock: stockVal,
      };

      if (editingItem.type === 'product') {
        payload.isOutOfStock = stockVal === 0;
      } else {
        payload.status = editForm.status;
      }

      await updateDoc(doc(db, collectionName, editingItem.id), payload);
      toast.success('Item updated successfully');
      closeEditModal();
    } catch (err) {
      console.error('Update item error:', err);
      toast.error('Failed to update item');
    } finally {
      setIsUpdatingItem(false);
    }
  };

  // Stats Calculations from Unified Data
  const totalItems = allItems.length;
  const lowStockItems = allItems.filter((p) => {
    const s = p.stockQty !== undefined ? p.stockQty : p.stock;
    return Number(s) > 0 && Number(s) <= 10;
  });

  // Filter & Search Logic
  const filteredProducts = allItems.filter((p) => {
    const s = p.stockQty !== undefined ? p.stockQty : p.stock;
    const stockVal = Number(s);
    const matchesSearch =
      (p.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (p.productCode?.toLowerCase() || '').includes(searchQuery.toLowerCase());

    if (stockFilter === 'low')
      return matchesSearch && stockVal > 0 && stockVal <= 10;
    if (stockFilter === 'out') return matchesSearch && stockVal === 0;
    if (stockFilter === 'in') return matchesSearch && stockVal > 10;
    return matchesSearch;
  });

  if (loading) {
    return (
      <div className="p-10 text-center font-bold text-slate-400 animate-pulse">
        Loading Inventory...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* 1. HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Himalaya Stock Center
          </h1>
          <p className="text-sm text-gray-500 mt-1">Inventory Control Panel</p>
        </div>

        <div className="flex gap-4 items-start">
          <div className="bg-white px-5 py-3 rounded-lg shadow-sm border border-gray-200 flex items-center gap-3">
            <Box className="text-blue-600" size={20} />
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase">
                Catalog
              </p>
              <p className="text-lg font-semibold text-gray-900">
                {totalItems}
              </p>
            </div>
          </div>
          <div className="bg-white px-5 py-3 rounded-lg border border-orange-200 shadow-sm flex items-center gap-3">
            <AlertTriangle className="text-orange-500" size={20} />
            <div>
              <p className="text-xs font-medium text-orange-600 uppercase">
                Alerts
              </p>
              <p className="text-lg font-semibold text-orange-700">
                {lowStockItems.length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. LIVE TABLE WITH FILTERS */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden flex flex-col">
        <div className="p-4 border-b border-gray-200 flex flex-col md:flex-row justify-between gap-4 bg-gray-50/50">
          <div className="relative w-full md:w-80">
            <Search
              size={16}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
            />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500 text-sm"
            />
          </div>

          <div className="flex gap-1 bg-gray-100 p-1 rounded-md border border-gray-200">
            {['all', 'in', 'low', 'out'].map((f) => (
              <button
                key={f}
                onClick={() => setStockFilter(f)}
                className={`text-xs font-medium px-4 py-1.5 rounded transition-colors capitalize ${stockFilter === f ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
              >
                {f === 'in'
                  ? 'In Stock'
                  : f === 'low'
                    ? 'Low Stock'
                    : f === 'out'
                      ? 'Out of Stock'
                      : 'All'}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 py-3">Product Details</th>
                <th className="p-4 py-3">Category</th>
                <th className="p-4 py-3">Stock Level</th>
                <th className="p-4 py-3">Status</th>
                <th className="p-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredProducts.map((product) => {
                const stockVal =
                  product.stockQty !== undefined
                    ? Number(product.stockQty)
                    : Number(product.stock);
                return (
                  <tr
                    key={product.id}
                    className={`group transition-colors ${stockVal === 0 ? 'bg-gray-50/50' : 'hover:bg-gray-50'}`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-gray-100 border border-gray-200 rounded flex items-center justify-center font-semibold text-xs text-gray-500 uppercase overflow-hidden shrink-0">
                          {product.images?.[0] ? (
                            <img
                              src={product.images[0]}
                              className="w-full h-full object-cover"
                              alt=""
                            />
                          ) : (
                            (product.category || 'GE').substring(0, 2)
                          )}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-medium text-gray-900 text-sm">
                              {product.name}
                            </p>
                            {product.type === 'inventory' && (
                              <span className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded border border-gray-200 font-medium uppercase">
                                Internal
                              </span>
                            )}
                          </div>
                          <p className="text-xs text-gray-500 font-mono mt-0.5">
                            {product.productCode || product.id.substring(0, 8)}
                          </p>
                          <p className="text-[10px] text-blue-600 font-medium mt-0.5">
                            /{product.slug || toSlug(product.name || '')}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span className="text-xs font-medium text-gray-600 bg-gray-100 px-2 py-1 rounded border border-gray-200">
                        {product.category || 'General'}
                      </span>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <input
                          type="number"
                          value={stockVal}
                          onChange={(e) =>
                            handleUpdateStock(
                              product.id,
                              e.target.value,
                              product.type
                            )
                          }
                          className={`w-20 px-2 py-1 rounded-md text-sm border focus:outline-none focus:ring-1 transition-all ${
                            stockVal === 0
                              ? 'bg-red-50 border-red-200 text-red-700 focus:border-red-500 focus:ring-red-500'
                              : stockVal <= 10
                                ? 'border-orange-200 bg-orange-50 text-orange-700 focus:border-orange-500 focus:ring-orange-500'
                                : 'border-gray-300 bg-white text-gray-900 focus:border-blue-500 focus:ring-blue-500'
                          }`}
                        />
                      </div>
                    </td>
                    <td className="p-4">
                      {stockVal > 10 ? (
                        <span className="inline-flex items-center gap-1.5 text-green-700 text-xs font-medium bg-green-50 px-2 py-1 rounded-full border border-green-200">
                          <CheckCircle2 size={14} /> In Stock
                        </span>
                      ) : stockVal > 0 ? (
                        <span className="inline-flex items-center gap-1.5 text-orange-700 text-xs font-medium bg-orange-50 px-2 py-1 rounded-full border border-orange-200">
                          <AlertTriangle size={14} /> Low Stock
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 text-red-700 text-xs font-medium bg-red-50 px-2 py-1 rounded-full border border-red-200">
                          <EyeOff size={14} /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-4 text-right">
                      <div className="inline-flex items-center gap-1">
                        <button
                          onClick={() => {
                            if (product.type === 'product') {
                              navigate('/admin/add-product', {
                                state: { product },
                              });
                              return;
                            }
                            openEditModal(product);
                          }}
                          className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="Edit"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() =>
                            handleDeleteProduct(product.id, product.type)
                          }
                          className="p-1.5 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                          title="Delete"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {editingItem && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-[1px] flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-white rounded-xl border border-gray-200 shadow-2xl">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">
                Edit Item
              </h3>
              <button
                onClick={closeEditModal}
                className="p-1.5 rounded hover:bg-gray-100 text-gray-500"
              >
                <X size={16} />
              </button>
            </div>

            <div className="p-5 space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Item Name
                </label>
                <input
                  type="text"
                  value={editForm.name}
                  onChange={(e) =>
                    setEditForm((prev) => ({ ...prev, name: e.target.value }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-gray-700">
                  Category
                </label>
                <select
                  value={editForm.category}
                  onChange={(e) =>
                    setEditForm((prev) => ({
                      ...prev,
                      category: e.target.value,
                    }))
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                >
                  {categories.length > 0 ? (
                    categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))
                  ) : (
                    <option value="General">General</option>
                  )}
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Stock Qty
                  </label>
                  <input
                    type="number"
                    value={editForm.stockQty}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        stockQty: Number(e.target.value),
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    value={editForm.status}
                    onChange={(e) =>
                      setEditForm((prev) => ({
                        ...prev,
                        status: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-white"
                  >
                    <option>In Stock</option>
                    <option>Low Stock</option>
                    <option>Out of Stock</option>
                  </select>
                </div>
              </div>
            </div>

            <div className="px-5 py-4 border-t border-gray-100 flex justify-end gap-2">
              <button
                onClick={closeEditModal}
                className="px-4 py-2 text-sm font-medium rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveEdit}
                disabled={isUpdatingItem}
                className="px-4 py-2 text-sm font-medium rounded-md bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400"
              >
                {isUpdatingItem ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
