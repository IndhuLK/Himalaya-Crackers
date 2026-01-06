import { useState, useEffect } from "react";
import { Package, AlertTriangle, EyeOff, BarChart3, Plus, Save, Trash2, Box, Search, CheckCircle2 } from "lucide-react";
import { db } from "../config/firebase";
import { collection, onSnapshot, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from "firebase/firestore";

export default function InventoryManager() {
  const [products, setProducts] = useState([]); // from 'products' collection
  const [inventoryItems, setInventoryItems] = useState([]); // from 'inventory' collection
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [stockFilter, setStockFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Local state for the inline entry form
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    category: "",
    status: "In Stock" // Default status
  });

  // 1. Fetch Products & Categories & Inventory Real-time
  useEffect(() => {
    // Products
    const unsubProducts = onSnapshot(collection(db, "products"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'product' }));
      setProducts(list);
    });

    // Inventory
    const unsubInventory = onSnapshot(collection(db, "inventory"), (snapshot) => {
      const list = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data(), type: 'inventory' }));
      setInventoryItems(list);
    });

    // Categories
    const unsubCategories = onSnapshot(collection(db, "categories"), (snap) => {
      const catList = snap.docs.map(doc => doc.data().name);
      setCategories(catList);
      if (catList.length > 0 && !formData.category) {
        setFormData(prev => ({ ...prev, category: catList[0] }));
      }
    });

    setLoading(false);

    return () => {
      unsubProducts();
      unsubInventory();
      unsubCategories();
    };
  }, []);

  // Combine items for display
  const allItems = [...products, ...inventoryItems];

  // 2. Add Inventory Item (Strictly to 'inventory' collection)
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name) return;

    let finalStock = Number(formData.stock);
    if (formData.status === "Out of Stock") finalStock = 0;
    if (formData.status === "Low Stock" && (finalStock > 10 || finalStock === 0)) finalStock = 5;
    if (formData.status === "In Stock" && finalStock <= 10) finalStock = 50;

    try {
      // NOTE: Saving to 'inventory' collection, NOT 'products'
      await addDoc(collection(db, "inventory"), {
        name: formData.name,
        category: formData.category || categories[0] || "General",
        stockQty: finalStock,
        status: formData.status,
        productCode: `INV-${Math.floor(1000 + Math.random() * 9000)}`, // Distinction in code
        createdAt: serverTimestamp(),
      });
      setFormData({ name: "", stock: "", category: categories[0] || "", status: "In Stock" });
    } catch (err) {
      console.error("Error adding inventory item:", err);
      alert("Failed to add inventory item");
    }
  };

  // 3. Update Stock
  const handleUpdateStock = async (id, newStock, type) => {
    try {
      const stockVal = Number(newStock);
      // Determine collection based on item type
      const collectionName = type === 'product' ? 'products' : 'inventory';
      const itemRef = doc(db, collectionName, id);

      await updateDoc(itemRef, {
        stockQty: stockVal,
        stock: stockVal // Maintain legacy field if needed
      });
    } catch (err) {
      console.error("Error updating stock:", err);
    }
  };

  // 4. Delete Product/Inventory Item
  const handleDeleteProduct = async (id, type) => {
    if (!window.confirm("Are you sure you want to delete this item?")) return;
    try {
      const collectionName = type === 'product' ? 'products' : 'inventory';
      await deleteDoc(doc(db, collectionName, id));
    } catch (err) {
      console.error("Delete error:", err);
      alert("Failed to delete");
    }
  };

  // Stats Calculations from Unified Data
  const totalItems = allItems.length;
  const lowStockItems = allItems.filter(p => {
    const s = p.stockQty !== undefined ? p.stockQty : p.stock;
    return Number(s) > 0 && Number(s) <= 10;
  });

  // Filter & Search Logic
  const filteredProducts = allItems.filter(p => {
    const s = p.stockQty !== undefined ? p.stockQty : p.stock;
    const stockVal = Number(s);
    const matchesSearch = (p.name?.toLowerCase() || "").includes(searchQuery.toLowerCase()) ||
      (p.productCode?.toLowerCase() || "").includes(searchQuery.toLowerCase());

    if (stockFilter === "low") return matchesSearch && (stockVal > 0 && stockVal <= 10);
    if (stockFilter === "out") return matchesSearch && stockVal === 0;
    if (stockFilter === "in") return matchesSearch && stockVal > 10;
    return matchesSearch;
  });

  if (loading) {
    return <div className="p-10 text-center font-bold text-slate-400 animate-pulse">Loading Inventory...</div>;
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen">

      {/* 1. HEADER & STATS */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 italic uppercase tracking-tighter">Himalaya Stock Center</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Admin Control Panel</p>
        </div>

        <div className="flex gap-4">
          <div className="bg-white px-6 py-3 rounded-2xl shadow-sm border border-slate-100 flex items-center gap-3">
            <Box className="text-blue-600" size={20} />
            <div>
              <p className="text-[9px] font-black text-slate-400 uppercase leading-none">Catalog</p>
              <p className="text-xl font-black text-slate-800">{totalItems}</p>
            </div>
          </div>
          <div className="bg-orange-50 px-6 py-3 rounded-2xl border border-orange-100 flex items-center gap-3">
            <AlertTriangle className="text-orange-600" size={20} />
            <div>
              <p className="text-[9px] font-black text-orange-600 uppercase leading-none">Alerts</p>
              <p className="text-xl font-black text-orange-900">{lowStockItems.length}</p>
            </div>
          </div>
        </div>
      </div>

      {/* 2. QUICK ENTRY FORM (SAVES TO INVENTORY, NOT PRODUCTS) */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-sm relative overflow-hidden">
        <h3 className="font-black text-slate-800 italic uppercase mb-6 flex items-center gap-2">
          <Plus className="text-blue-600" size={20} /> New Inventory Entry <span className="text-[10px] bg-slate-100 px-2 py-1 rounded text-slate-400 uppercase tracking-widest ml-2">Internal Only</span>
        </h3>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end relative z-10">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Item Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Packing Material"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Initial Stock</label>
            <input
              type="number"
              placeholder="Qty"
              value={formData.stock}
              onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-blue-500 appearance-none cursor-pointer"
            >
              <option value="" disabled>Select Category</option>
              {categories.map((cat, idx) => (
                <option key={idx} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Availability Status</label>
            <select
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className={`w-full border-none rounded-2xl p-4 text-sm font-black appearance-none cursor-pointer ${formData.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' :
                  formData.status === 'Low Stock' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
                }`}
            >
              <option className="font-bold text-emerald-600">In Stock</option>
              <option className="font-bold text-orange-600">Low Stock</option>
              <option className="font-bold text-red-600">Out of Stock</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
            <Save size={18} /> Save Internal Item
          </button>
        </form>
      </div>

      {/* 3. LIVE TABLE WITH FILTERS */}
      <div className="bg-white rounded-[3rem] border border-slate-100 shadow-sm overflow-hidden">
        <div className="p-8 border-b border-slate-50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-4 bg-slate-100 px-4 py-2 rounded-2xl w-full md:w-96">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search items..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-transparent border-none outline-none text-sm font-bold w-full"
            />
          </div>

          <div className="flex gap-2 bg-slate-100 p-1.5 rounded-2xl">
            {["all", "in", "low", "out"].map((f) => (
              <button
                key={f}
                onClick={() => setStockFilter(f)}
                className={`text-[10px] font-black px-6 py-2 rounded-xl transition-all uppercase ${stockFilter === f ? 'bg-white shadow text-blue-600' : 'text-slate-400'}`}
              >
                {f === 'in' ? 'Available' : f} {f !== 'all' ? 'Stock' : ''}
              </button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
              <tr>
                <th className="p-8">Product Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Stock Level</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => {
                const stockVal = product.stockQty !== undefined ? Number(product.stockQty) : Number(product.stock);
                return (
                  <tr key={product.id} className={`group transition-colors ${stockVal === 0 ? 'bg-slate-50/50 grayscale opacity-60' : 'hover:bg-blue-50/30'}`}>
                    <td className="p-8">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px] text-slate-400 uppercase">
                          {(product.category || "GE").substring(0, 2)}
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="font-black text-slate-800 text-sm italic uppercase tracking-tight">{product.name}</p>
                            {product.type === 'inventory' && <span className="text-[8px] bg-slate-100 text-slate-400 px-1.5 py-0.5 rounded font-bold uppercase tracking-wide">Internal</span>}
                          </div>
                          <p className="text-[9px] text-slate-400 font-mono">{product.productCode}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <span className="font-bold text-slate-500 text-xs uppercase tracking-wide bg-slate-100 px-3 py-1.5 rounded-lg border border-slate-200/50">
                        {product.category || "General"}
                      </span>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <input
                          type="number"
                          value={stockVal}
                          onChange={(e) => handleUpdateStock(product.id, e.target.value, product.type)}
                          className={`w-20 px-3 py-2 rounded-xl font-black text-xs border-2 transition-all outline-none ${stockVal === 0 ? 'bg-red-50 border-red-100 text-red-600' :
                              stockVal <= 10 ? 'border-orange-200 bg-orange-50 text-orange-600' :
                                'border-slate-100 bg-white text-slate-800 focus:border-blue-300'
                            }`}
                        />
                      </div>
                    </td>
                    <td className="p-6">
                      {stockVal > 10 ? (
                        <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] bg-emerald-50 px-3 py-1.5 rounded-full w-fit uppercase">
                          <CheckCircle2 size={12} /> In Stock
                        </span>
                      ) : stockVal > 0 ? (
                        <span className="flex items-center gap-1.5 text-orange-600 font-black text-[10px] bg-orange-50 px-3 py-1.5 rounded-full w-fit uppercase">
                          <AlertTriangle size={12} /> Low Stock
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-red-600 font-black text-[10px] bg-red-50 px-3 py-1.5 rounded-full w-fit uppercase">
                          <EyeOff size={12} /> Out of Stock
                        </span>
                      )}
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => handleDeleteProduct(product.id, product.type)}
                        className="p-3 text-slate-300 hover:text-red-500 transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}