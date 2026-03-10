import { useState } from 'react';
import {
  Edit2,
  Trash2,
  Plus,
  Leaf,
  List,
  Grid,
  Loader2,
  Package,
  Flame,
} from 'lucide-react';
import { useInventory } from './InventoryContext';
import { Link, useNavigate } from 'react-router-dom';

export default function ProductsList() {
  const { products, loading, deleteProduct } = useInventory();
  const [viewMode, setViewMode] = useState('list');
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
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Inventory Items
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Manage your store's products and stock ({products.length} live
            items)
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex bg-gray-100 p-1 rounded-md border border-gray-200">
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 rounded transition-all ${viewMode === 'list' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <List size={18} />
            </button>
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 rounded transition-all ${viewMode === 'grid' ? 'bg-white shadow-sm text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
            >
              <Grid size={18} />
            </button>
          </div>

          <Link
            to="/admin/add-product"
            className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
          >
            <Plus size={16} /> New Item
          </Link>
        </div>
      </div>

      {products.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-dashed border-gray-300 shadow-sm flex flex-col items-center justify-center">
          <Package className="w-12 h-12 mb-3 text-gray-400" strokeWidth={1.5} />
          <p className="text-gray-600 font-medium">Your inventory is empty.</p>
          <Link
            to="/admin/add-product"
            className="text-blue-600 font-medium mt-2 hover:underline text-sm"
          >
            Add your first item
          </Link>
        </div>
      ) : viewMode === 'list' ? (
        /* --- TABLE VIEW --- */
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
              <tr>
                <th className="p-4 py-3 font-semibold">Product Details</th>
                <th className="p-4 py-3 font-semibold">Category</th>
                <th className="p-4 py-3 font-semibold text-right">Pricing</th>
                <th className="p-4 py-3 font-semibold text-center">Stock</th>
                <th className="p-4 py-3 font-semibold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((product) => (
                <tr
                  key={product.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-md overflow-hidden border border-gray-200 shrink-0">
                        {product.images?.[0] ? (
                          <img
                            src={product.images[0]}
                            className="w-full h-full object-cover"
                            alt=""
                          />
                        ) : (
                          <div className="flex items-center justify-center h-full text-gray-400">
                            <Flame size={20} />
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">
                          {product.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {product.subCategory || 'General'}
                        </p>
                      </div>
                    </div>
                  </td>
                  <td className="p-4">
                    <span className="text-xs font-medium bg-gray-100 text-gray-700 px-2 py-1 rounded">
                      {product.category}
                    </span>
                  </td>
                  <td className="p-4 text-right">
                    <div className="font-semibold text-gray-900">
                      ₹{product.ourPrice}
                    </div>
                    <div className="text-xs text-gray-400 line-through">
                      ₹{product.mrpPrice}
                    </div>
                  </td>
                  <td className="p-4 text-center">
                    <div className="flex flex-col items-center">
                      <span
                        className={`text-sm font-semibold ${Number(product.stockQty) < 10 ? 'text-red-600' : 'text-green-600'}`}
                      >
                        {product.stockQty}
                      </span>
                      {product.isOutOfStock && (
                        <span className="text-[10px] font-medium text-red-600 uppercase mt-0.5">
                          Out of Stock
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button
                        onClick={() =>
                          navigate('/admin/add-product', { state: { product } })
                        }
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="Edit Item"
                      >
                        <Edit2 size={16} />
                      </button>
                      <button
                        onClick={() => deleteProduct(product.id)}
                        className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Item"
                      >
                        <Trash2 size={16} />
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
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 lg:gap-6 gap-4">
          {products.map((product) => (
            <div
              key={product.id}
              className="bg-white rounded-lg border border-gray-200 shadow-sm hover:shadow-md transition-shadow flex flex-col overflow-hidden"
            >
              <div className="aspect-square bg-gray-100 relative overflow-hidden border-b border-gray-200">
                {product.images?.[0] ? (
                  <img
                    src={product.images[0]}
                    className="w-full h-full object-cover"
                    alt=""
                  />
                ) : (
                  <div className="flex items-center justify-center h-full text-gray-300">
                    <Flame size={40} />
                  </div>
                )}
                {product.isGreen && (
                  <div
                    className="absolute top-2 left-2 bg-green-500 text-white p-1 rounded-sm shadow-sm"
                    title="Green Item"
                  >
                    <Leaf size={14} />
                  </div>
                )}
                <div className="absolute bottom-2 right-2 bg-white/90 backdrop-blur-sm px-2 py-1 rounded text-sm font-semibold text-gray-900 shadow-sm border border-gray-100">
                  ₹{product.ourPrice}
                </div>
              </div>

              <div className="p-4 flex flex-col flex-1">
                <p className="text-[10px] font-semibold text-blue-600 uppercase tracking-wide mb-1 flex-1">
                  {product.category}
                </p>
                <h3
                  className="font-medium text-gray-900 truncate text-sm mb-3"
                  title={product.name}
                >
                  {product.name}
                </h3>

                <div className="flex justify-between items-center pt-3 border-t border-gray-100 mt-auto">
                  <span
                    className={`text-xs font-semibold ${Number(product.stockQty) < 10 ? 'text-red-600' : 'text-gray-500'}`}
                  >
                    Stock: {product.stockQty}
                  </span>
                  <div className="flex gap-1 text-gray-400">
                    <button
                      onClick={() =>
                        navigate('/admin/add-product', { state: { product } })
                      }
                      className="p-1 hover:text-blue-600 hover:bg-blue-50 rounded transition-colors"
                      title="Edit"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => deleteProduct(product.id)}
                      className="p-1 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
                      title="Delete"
                    >
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
