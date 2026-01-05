import { useState } from "react";
import {
  Edit2,
  Trash2,
  Plus,
  Leaf,
  List,
  Grid,
  Loader2,
} from "lucide-react";
import { useInventory } from "./InventoryContext";
import { Link, useNavigate } from "react-router-dom";

export default function ProductsList() {
  const { products, loading, deleteProduct } = useInventory();
  const [viewMode, setViewMode] = useState("list");
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="h-96 flex flex-col items-center justify-center gap-4">
        <Loader2 className="animate-spin text-blue-600" size={40} />
        <p className="font-bold text-slate-500">Syncing with Cloud...</p>
      </div>
    );

  return (
    <div className="p-6 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic uppercase">Inventory Manager</h1>
          <p className="text-slate-500 text-sm font-medium">
            {products.length} Products Live in Store
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-slate-200/50 p-1 rounded-2xl">
            <button onClick={() => setViewMode("list")} className={`p-2.5 rounded-xl transition-all ${viewMode === "list" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}><List size={20} /></button>
            <button onClick={() => setViewMode("grid")} className={`p-2.5 rounded-xl transition-all ${viewMode === "grid" ? "bg-white shadow-md text-blue-600" : "text-slate-500"}`}><Grid size={20} /></button>
          </div>

          <Link to="/admin/add-product" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 shadow-lg shadow-blue-100 transition-all active:scale-95">
            <Plus size={20} /> ADD PRODUCT
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-24 bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
          <div className="text-6xl mb-4">📦</div>
          <p className="text-slate-400 font-bold text-lg">Your inventory is empty.</p>
          <Link to="/admin/add-product" className="text-blue-600 font-bold mt-2 inline-block underline">Add your first product</Link>
        </div>
      ) : viewMode === "list" ? (
        /* --- TABLE VIEW --- */
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-slate-50/50 text-[11px] uppercase font-black text-slate-400 tracking-widest border-b border-slate-100">
              <tr>
                <th className="p-6">Product Details</th>
                <th className="p-6">Category</th>
                <th className="p-6">Pricing</th>
                <th className="p-6">Stock Status</th>
                <th className="p-6 text-right">Control</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {products.map((product) => (
                <tr key={product.id} className="hover:bg-slate-50/50 transition-colors group">
                  <td className="p-4 px-6">
                    <div className="flex items-center gap-4">
                      <div className="w-14 h-14 bg-slate-100 rounded-2xl overflow-hidden border border-slate-100">
                        {product.images?.[0] ? (
                          <img src={product.images[0]} className="w-full h-full object-cover" alt="" />
                        ) : (
                          <div className="flex items-center justify-center h-full text-2xl">🧨</div>
                        )}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{product.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold uppercase">{product.subCategory || 'No Sub-Cat'}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black text-blue-600 bg-blue-50 px-3 py-1.5 rounded-full uppercase">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-6">
                    <div className="text-base font-black text-slate-900">₹{product.ourPrice}</div>
                    <div className="text-[11px] text-slate-400 line-through font-bold">₹{product.mrpPrice}</div>
                  </td>
                  <td className="p-6">
                    <div className="flex flex-col">
                      <span className={`text-sm font-black ${Number(product.stockQty) < 10 ? "text-red-500" : "text-green-600"}`}>
                        {product.stockQty} Units
                      </span>
                      {product.isOutOfStock && <span className="text-[9px] font-bold text-red-600 uppercase">Out of Stock</span>}
                    </div>
                  </td>
                  <td className="p-6 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => navigate("/admin/add-product", { state: { product } })}
                        className="p-3 text-blue-600 hover:bg-blue-50 rounded-2xl transition-all"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-3 text-red-500 hover:bg-red-50 rounded-2xl transition-all"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ) : (
        /* --- GRID VIEW --- */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div key={product.id} className="bg-white p-5 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl transition-all group relative">
              <div className="aspect-square bg-slate-50 rounded-[2rem] mb-4 relative overflow-hidden border border-slate-50">
                {product.images?.[0] ? (
                  <img src={product.images[0]} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" alt="" />
                ) : (
                  <div className="flex items-center justify-center h-full text-5xl opacity-20">🧨</div>
                )}
                {product.isGreen && (
                  <div className="absolute top-3 left-3 bg-emerald-500 text-white p-2 rounded-xl shadow-lg border-2 border-white">
                    <Leaf size={14} />
                  </div>
                )}
                <div className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm px-3 py-1.5 rounded-xl font-black text-slate-900 shadow-sm">
                  ₹{product.ourPrice}
                </div>
              </div>

              <div className="space-y-1 px-1">
                <p className="text-[10px] font-black text-blue-500 uppercase tracking-widest">{product.category}</p>
                <h3 className="font-bold text-slate-900 truncate text-lg">{product.name}</h3>
                
                <div className="flex justify-between items-center pt-4 mt-2 border-t border-slate-50">
                  <span className={`text-[11px] font-bold ${Number(product.stockQty) < 10 ? 'text-red-500' : 'text-slate-400'}`}>
                    STOCK: {product.stockQty}
                  </span>
                  <div className="flex gap-1">
                    <button onClick={() => navigate("/admin/add-product", { state: { product } })} className="p-2 text-blue-600 hover:bg-blue-50 rounded-xl transition-all">
                      <Edit2 size={16} />
                    </button>
                    <button onClick={() => deleteProduct(product.id)} className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}