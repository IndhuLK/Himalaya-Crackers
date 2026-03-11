import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  Truck,
  CheckCircle,
  XCircle,
  Download,
  Search,
  Filter,
  MoreVertical,
  User,
  Calendar,
  CreditCard,
  ArrowRight,
  Printer,
  X,
  FileText,
  Trash2,
  Loader2,
} from 'lucide-react';

// Firebase Imports
import { db } from '../config/firebase';
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc,
} from 'firebase/firestore';
import { useToast } from '../components/Toast';

export default function OrderManagement() {
  const toast = useToast();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // 1. Fetch Orders from Firebase in Real-time
  useEffect(() => {
    const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));

    const unsub = onSnapshot(
      q,
      (snapshot) => {
        const orderList = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setOrders(orderList);
        setLoading(false);
      },
      (error) => {
        console.error('Firebase Fetch Error:', error);
        setLoading(false);
      }
    );

    return () => unsub();
  }, []);

  // 2. Filter & Search Logic
  const filteredOrders = orders.filter((order) => {
    const matchesSearch =
      (order.customer?.toLowerCase() || '').includes(
        searchTerm.toLowerCase()
      ) || (order.id?.toLowerCase() || '').includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'All' || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  // 3. Update Order Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, 'orders', orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error('Update Error:', err);
      toast.error('Failed to update status');
    }
  };

  // 4. Delete Order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm('Are you sure you want to delete this order?')) return;
    try {
      await deleteDoc(doc(db, 'orders', id));
    } catch (err) {
      toast.error('Error deleting order');
    }
  };

  const toggleOrderSelection = (id) => {
    setSelectedOrders((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  const statusColors = {
    Pending: 'bg-orange-100 text-orange-600',
    Processing: 'bg-blue-100 text-blue-600',
    Shipped: 'bg-purple-100 text-purple-600',
    Delivered: 'bg-emerald-100 text-emerald-600',
    Cancel: 'bg-red-100 text-red-600',
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-black text-slate-500 uppercase tracking-tighter">
          Syncing Orders...
        </p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen relative">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Sales Orders
          </h1>
          <p className="text-sm text-gray-500 mt-1">
            Manage and track all customer orders
          </p>
        </div>

        <div className="flex gap-3">
          <button
            className={`px-4 py-2 rounded-md font-medium text-sm transition-colors shadow-sm ${selectedOrders.length > 0 ? 'bg-blue-600 text-white hover:bg-blue-700' : 'bg-gray-200 text-gray-500 cursor-not-allowed'}`}
          >
            Bulk Ship ({selectedOrders.length})
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-lg border border-gray-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex items-center gap-2 w-full md:w-96">
          <div className="flex items-center bg-gray-50 border border-gray-200 rounded-md px-3 py-2 w-full focus-within:ring-1 focus-within:ring-blue-500 focus-within:border-blue-500 transition-shadow">
            <Search size={16} className="text-gray-400" />
            <input
              type="text"
              placeholder="Search by customer name or order ID..."
              className="bg-transparent border-none outline-none text-sm w-full ml-2 text-gray-700 placeholder-gray-400"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <div className="flex gap-2 overflow-x-auto w-full md:w-auto">
          {[
            'All',
            'Pending',
            'Processing',
            'Shipped',
            'Delivered',
            'Cancel',
          ].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-sm font-medium px-4 py-1.5 rounded-md transition-colors border ${filter === s ? 'bg-blue-50 text-blue-700 border-blue-200' : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
            <tr>
              <th className="p-4 w-12 text-center">
                <input
                  type="checkbox"
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500 bg-white"
                />
              </th>
              <th className="p-4 py-3 font-semibold">Order ID</th>
              <th className="p-4 py-3 font-semibold">Customer Details</th>
              <th className="p-4 py-3 font-semibold">Order Date</th>
              <th className="p-4 py-3 font-semibold">Amount</th>
              <th className="p-4 py-3 font-semibold">Status</th>
              <th className="p-4 py-3 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filteredOrders.length > 0 ? (
              filteredOrders.map((order, index) => (
                <tr
                  key={order.id}
                  className={`hover:bg-gray-50/80 transition-colors ${selectedOrders.includes(order.id) ? 'bg-blue-50/50' : ''}`}
                >
                  <td className="p-4 text-center">
                    <input
                      type="checkbox"
                      checked={selectedOrders.includes(order.id)}
                      onChange={() => toggleOrderSelection(order.id)}
                      className="w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  </td>
                  <td className="p-4 text-gray-900 font-medium">
                    #{order.id.slice(-6)}
                  </td>
                  <td className="p-4">
                    <div className="font-medium text-blue-600">
                      {order.customer}
                    </div>
                  </td>
                  <td className="p-4 text-gray-500">{order.date || 'N/A'}</td>
                  <td className="p-4 font-semibold text-gray-900">
                    ₹{order.total}
                  </td>
                  <td className="p-4">
                    <select
                      value={order.status}
                      onChange={(e) =>
                        handleUpdateStatus(order.id, e.target.value)
                      }
                      className={`text-xs font-semibold px-2.5 py-1 rounded-md border-none focus:ring-1 focus:ring-blue-500 cursor-pointer ${statusColors[order.status] || 'bg-gray-100 text-gray-600'}`}
                    >
                      <option value="Pending">Pending</option>
                      <option value="Processing">Processing</option>
                      <option value="Shipped">Shipped</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancel">Cancel</option>
                    </select>
                  </td>
                  <td className="p-4 text-right">
                    <div className="flex justify-end gap-2 text-gray-400">
                      <button
                        onClick={() =>
                          setSelectedOrder({ ...order, sNo: index + 1 })
                        }
                        className="p-1.5 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title="View Invoice"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => handleDeleteOrder(order.id)}
                        className="p-1.5 hover:text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title="Delete Order"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="p-12 text-center text-gray-500">
                  No Orders Found matching your criteria.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- INVOICE MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-gray-900/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-lg shadow-xl overflow-hidden relative border border-gray-200">
            <button
              onClick={() => setSelectedOrder(null)}
              className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors p-1 rounded-md hover:bg-gray-100"
            >
              <X size={20} />
            </button>

            <div className="p-8 space-y-8" id="invoice-section">
              <div className="flex justify-between items-start border-b border-gray-200 pb-6">
                <div>
                  <h2 className="text-2xl font-semibold text-gray-900">
                    Himalaya Crackers
                  </h2>
                  <p className="text-xs text-gray-500 font-medium uppercase mt-1 tracking-wide">
                    Tax Invoice
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Invoice No.
                  </p>
                  <p className="font-semibold text-gray-900 text-2xl">
                    #INV-{selectedOrder.sNo}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8 text-sm">
                <div>
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Billed To
                  </p>
                  <p className="font-semibold text-gray-900">
                    {selectedOrder.customer}
                  </p>
                  <p className="text-gray-600 leading-relaxed max-w-xs mt-1">
                    {selectedOrder.address || 'Address not provided'}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-semibold text-gray-500 uppercase mb-2">
                    Order Status
                  </p>
                  <span
                    className={`text-xs font-semibold px-2.5 py-1 rounded-md ${statusColors[selectedOrder.status]}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="border border-gray-200 rounded-md overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="bg-gray-50 text-gray-600 font-medium border-b border-gray-200">
                    <tr>
                      <th className="p-3">Item Name</th>
                      <th className="p-3 text-center">Qty</th>
                      <th className="p-3 text-right">Price</th>
                      <th className="p-3 text-right">Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100 bg-white">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="text-gray-800">
                        <td className="p-3">{item.name}</td>
                        <td className="p-3 text-center">{item.qty}</td>
                        <td className="p-3 text-right">₹{item.price}</td>
                        <td className="p-3 text-right font-medium">
                          ₹{item.price * item.qty}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-end border-t border-gray-200 pt-6">
                <div className="w-64">
                  <div className="flex justify-between py-1.5 text-sm text-gray-600">
                    <span>Subtotal</span>
                    <span>₹{selectedOrder.total}</span>
                  </div>
                  <div className="flex justify-between py-1.5 text-sm text-gray-600">
                    <span>Tax (0%)</span>
                    <span>₹0.00</span>
                  </div>
                  <div className="flex justify-between py-3 border-t border-gray-200 mt-2">
                    <span className="font-semibold text-gray-900">Total</span>
                    <span className="font-semibold text-gray-900 text-lg">
                      ₹{selectedOrder.total}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons (Don't print these) */}
              <div className="flex justify-end gap-3 mt-8 print:hidden">
                <button
                  onClick={() => window.print()}
                  className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-md font-medium text-sm flex items-center gap-2 transition-colors"
                >
                  <Printer size={16} /> Print
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
