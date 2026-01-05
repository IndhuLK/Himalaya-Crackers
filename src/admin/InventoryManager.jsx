import { useState } from "react";
import { Package, AlertTriangle, EyeOff, BarChart3, Plus, Save, Trash2, Box, Search, CheckCircle2 } from "lucide-react";
import { useIn } from "./InContext";

export default function InventoryManager() {
  const { products, addProduct, updateStock, deleteProduct, totalItems, lowStockItems, festivalPercent } = useIn();
  const [stockFilter, setStockFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");

  // Local state for the inline entry form
  const [formData, setFormData] = useState({
    name: "",
    stock: "",
    category: "Sky Shots",
    status: "In Stock" // Default status
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name) return;

    // Logic to auto-assign stock based on selected status if stock field is empty
    let finalStock = Number(formData.stock);
    if (formData.status === "Out of Stock") finalStock = 0;
    if (formData.status === "Low Stock" && (finalStock > 10 || finalStock === 0)) finalStock = 5; 
    if (formData.status === "In Stock" && finalStock <= 10) finalStock = 50;

    const newCracker = {
      ...formData,
      id: Date.now(),
      productCode: `HIM-${Math.floor(1000 + Math.random() * 9000)}`,
      stock: finalStock,
    };

    addProduct(newCracker);
    setFormData({ name: "", stock: "", category: "Sky Shots", status: "In Stock" }); // Reset
  };

  // Filter & Search Logic
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          p.productCode.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (stockFilter === "low") return matchesSearch && (Number(p.stock) > 0 && Number(p.stock) <= 10);
    if (stockFilter === "out") return matchesSearch && Number(p.stock) === 0;
    if (stockFilter === "in") return matchesSearch && Number(p.stock) > 10;
    return matchesSearch;
  });

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

      {/* 2. QUICK ENTRY FORM WITH STATUS DROPDOWN */}
      <div className="bg-white p-8 rounded-[2.5rem] border-2 border-blue-50 shadow-sm relative overflow-hidden">
        <h3 className="font-black text-slate-800 italic uppercase mb-6 flex items-center gap-2">
          <Plus className="text-blue-600" size={20} /> New Entry Details
        </h3>
        
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-5 gap-4 items-end relative z-10">
          <div className="md:col-span-1 space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Product Name</label>
            <input 
              type="text" 
              required
              placeholder="Product Name"
              value={formData.name}
              onChange={(e) => setFormData({...formData, name: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Initial Stock</label>
            <input 
              type="number" 
              placeholder="Qty"
              value={formData.stock}
              onChange={(e) => setFormData({...formData, stock: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-blue-500"
            />
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Category</label>
            <select 
              value={formData.category}
              onChange={(e) => setFormData({...formData, category: e.target.value})}
              className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-bold outline-blue-500 appearance-none cursor-pointer"
            >
              <option>Sky Shots</option>
              <option>Chakkars</option>
              <option>Flower Pots</option>
              <option>Fancy Fountains</option>
            </select>
          </div>

          {/* NEW STATUS DROPDOWN */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-slate-400 uppercase ml-2">Availability Status</label>
            <select 
              value={formData.status}
              onChange={(e) => setFormData({...formData, status: e.target.value})}
              className={`w-full border-none rounded-2xl p-4 text-sm font-black appearance-none cursor-pointer ${
                formData.status === 'In Stock' ? 'bg-emerald-50 text-emerald-600' : 
                formData.status === 'Low Stock' ? 'bg-orange-50 text-orange-600' : 'bg-red-50 text-red-600'
              }`}
            >
              <option className="font-bold text-emerald-600">In Stock</option>
              <option className="font-bold text-orange-600">Low Stock</option>
              <option className="font-bold text-red-600">Out of Stock</option>
            </select>
          </div>

          <button type="submit" className="bg-blue-600 text-white p-4 rounded-2xl font-black text-xs uppercase hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all flex items-center justify-center gap-2">
            <Save size={18} /> Save Entry
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
                <th className="p-6">Stock Level</th>
                <th className="p-6">Status</th>
                <th className="p-6 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {filteredProducts.map((product) => (
                <tr key={product.id} className={`group transition-colors ${Number(product.stock) === 0 ? 'bg-slate-50/50 grayscale opacity-60' : 'hover:bg-blue-50/30'}`}>
                  <td className="p-8">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-100 rounded-xl flex items-center justify-center font-black text-[10px] text-slate-400 uppercase">
                        {product.category.substring(0, 2)}
                      </div>
                      <div>
                        <p className="font-black text-slate-800 text-sm italic uppercase tracking-tight">{product.name}</p>
                        <p className="text-[9px] text-slate-400 font-mono">{product.productCode}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <input 
                        type="number"
                        value={product.stock}
                        onChange={(e) => updateStock(product.id, e.target.value)}
                        className={`w-20 px-3 py-2 rounded-xl font-black text-xs border-2 transition-all outline-none ${
                          Number(product.stock) === 0 ? 'bg-red-50 border-red-100 text-red-600' :
                          Number(product.stock) <= 10 ? 'border-orange-200 bg-orange-50 text-orange-600' : 
                          'border-slate-100 bg-white text-slate-800 focus:border-blue-300'
                        }`}
                      />
                    </div>
                  </td>
                  <td className="p-6">
                    {Number(product.stock) > 10 ? (
                      <span className="flex items-center gap-1.5 text-emerald-600 font-black text-[10px] bg-emerald-50 px-3 py-1.5 rounded-full w-fit uppercase">
                        <CheckCircle2 size={12} /> In Stock
                      </span>
                    ) : Number(product.stock) > 0 ? (
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
                      onClick={() => deleteProduct(product.id)}
                      className="p-3 text-slate-300 hover:text-red-500 transition-all"
                    >
                      <Trash2 size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}