import { useState, useEffect } from "react";
import {
  ShoppingBag, Truck, CheckCircle, XCircle,
  Download, Search, Filter, MoreVertical,
  User, Calendar, CreditCard, ArrowRight, Printer, X, FileText, Trash2, Loader2
} from "lucide-react";

// Firebase Imports
import { db } from "../config/firebase";
import {
  collection,
  onSnapshot,
  query,
  orderBy,
  doc,
  updateDoc,
  deleteDoc
} from "firebase/firestore";

export default function OrderManagement() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [selectedOrders, setSelectedOrders] = useState([]);

  // 1. Fetch Orders from Firebase in Real-time
  useEffect(() => {
    const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));

    const unsub = onSnapshot(q, (snapshot) => {
      const orderList = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setOrders(orderList);
      setLoading(false);
    }, (error) => {
      console.error("Firebase Fetch Error:", error);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  // 2. Filter & Search Logic
  const filteredOrders = orders.filter(order => {
    const matchesSearch =
      (order.customer?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
      (order.id?.toLowerCase() || "").includes(searchTerm.toLowerCase());
    const matchesFilter = filter === "All" || order.status === filter;
    return matchesSearch && matchesFilter;
  });

  // 3. Update Order Status
  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: newStatus });
    } catch (err) {
      console.error("Update Error:", err);
      alert("Failed to update status");
    }
  };

  // 4. Delete Order
  const handleDeleteOrder = async (id) => {
    if (!window.confirm("Are you sure you want to delete this order?")) return;
    try {
      await deleteDoc(doc(db, "orders", id));
    } catch (err) {
      alert("Error deleting order");
    }
  };

  const toggleOrderSelection = (id) => {
    setSelectedOrders(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  const statusColors = {
    Pending: "bg-orange-100 text-orange-600",
    Processing: "bg-blue-100 text-blue-600",
    Shipped: "bg-purple-100 text-purple-600",
    Delivered: "bg-emerald-100 text-emerald-600",
    Cancel: "bg-red-100 text-red-600",
  };

  if (loading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <Loader2 className="animate-spin text-blue-600 mb-4" size={40} />
        <p className="font-black text-slate-500 uppercase tracking-tighter">Syncing Orders...</p>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 bg-slate-50 min-h-screen relative">

      {/* HEADER */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 italic uppercase">Order Control Room</h1>
          <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">Live Dispatch Tracking</p>
        </div>

        <div className="flex gap-3">
          <button
            className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase transition-all shadow-lg ${selectedOrders.length > 0 ? 'bg-blue-600 text-white shadow-blue-200' : 'bg-slate-200 text-slate-400'}`}
          >
            Bulk Ship ({selectedOrders.length})
          </button>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="bg-white p-4 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-4 bg-slate-50 px-6 py-3 rounded-2xl w-full md:w-1/3">
          <Search size={18} className="text-slate-400" />
          <input
            type="text"
            placeholder="Search Customer or Order ID..."
            className="bg-transparent border-none outline-none text-sm font-bold w-full"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="flex gap-1 overflow-x-auto w-full md:w-auto p-1">
          {["All", "Pending", "Processing", "Shipped", "Delivered", "Cancel"].map((s) => (
            <button
              key={s}
              onClick={() => setFilter(s)}
              className={`text-[10px] font-black px-6 py-3 rounded-xl transition-all uppercase whitespace-nowrap ${filter === s ? 'bg-slate-900 text-white shadow-xl' : 'bg-white text-slate-400 border border-slate-100 hover:bg-slate-50'}`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* ORDERS TABLE */}
      <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden">
        <table className="w-full text-left">
          <thead className="bg-slate-50/50 text-[10px] font-black text-slate-400 uppercase tracking-widest">
            <tr>
              <th className="p-6 w-10 text-center">Select</th>
              <th className="p-6 text-center">S.No</th>
              <th className="p-6">Order Info</th>
              <th className="p-6">Amount</th>
              <th className="p-6">Status</th>
              <th className="p-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {filteredOrders.length > 0 ? filteredOrders.map((order, index) => (
              <tr key={order.id} className={`hover:bg-slate-50/30 transition-colors ${selectedOrders.includes(order.id) ? 'bg-blue-50/50' : ''}`}>
                <td className="p-6 text-center">
                  <input
                    type="checkbox"
                    checked={selectedOrders.includes(order.id)}
                    onChange={() => toggleOrderSelection(order.id)}
                    className="w-4 h-4 rounded border-slate-300 accent-blue-600"
                  />
                </td>
                <td className="p-6 text-center font-bold text-slate-500">
                  {index + 1}
                </td>
                <td className="p-6">
                  <p className="font-black text-slate-900 text-sm uppercase">{order.customer}</p>
                  <p className="text-[10px] text-slate-400 font-bold mt-1">
                    <span className="italic">#{order.id.slice(-6)}</span> • {order.date}
                  </p>
                </td>
                <td className="p-6 font-black text-slate-900">₹{order.total}</td>
                <td className="p-6">
                  <select
                    value={order.status}
                    onChange={(e) => handleUpdateStatus(order.id, e.target.value)}
                    className={`text-[9px] font-black px-4 py-2 rounded-full border-none outline-none cursor-pointer transition-all ${statusColors[order.status] || "bg-slate-100 text-slate-600"}`}
                  >
                    <option value="Pending">Pending</option>
                    <option value="Processing">Processing</option>
                    <option value="Shipped">Shipped</option>
                    <option value="Delivered">Delivered</option>
                    <option value="Cancel">Cancel</option>
                  </select>
                </td>
                <td className="p-6 text-right">
                  <div className="flex justify-end gap-2">
                    <button
                      onClick={() => setSelectedOrder({ ...order, sNo: index + 1 })}
                      className="flex items-center gap-2 bg-slate-100 px-4 py-2 rounded-xl text-[10px] font-black uppercase hover:bg-blue-600 hover:text-white transition-all"
                    >
                      <FileText size={14} /> Invoice
                    </button>
                    <button
                      onClick={() => handleDeleteOrder(order.id)}
                      className="flex items-center justify-center bg-red-100 text-red-600 px-3 py-2 rounded-xl hover:bg-red-600 hover:text-white transition-all"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan="6" className="p-20 text-center font-bold text-slate-300 uppercase tracking-widest">No Orders Found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- INVOICE MODAL --- */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm z-[200] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-2xl rounded-[3rem] shadow-2xl overflow-hidden relative">
            <button onClick={() => setSelectedOrder(null)} className="absolute top-8 right-8 text-slate-400 hover:text-red-500 transition-colors z-10">
              <X size={24} />
            </button>

            <div className="p-12 space-y-8" id="invoice-section">
              <div className="flex justify-between items-start border-b border-slate-100 pb-8">
                <div>
                  <h2 className="text-2xl font-black italic uppercase text-blue-600">Himalaya Crackers</h2>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-1">Official Invoice</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase">Order ID</p>
                  <p className="font-black text-slate-900 uppercase text-4xl">#{selectedOrder.sNo}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Bill To</p>
                  <p className="font-black text-slate-800 uppercase tracking-tight">{selectedOrder.customer}</p>
                  <p className="text-[11px] text-slate-500 font-bold leading-relaxed">{selectedOrder.address}</p>
                </div>
                <div className="text-right">
                  <p className="text-[10px] font-black text-slate-400 uppercase mb-1">Status</p>
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full uppercase italic ${statusColors[selectedOrder.status]}`}>
                    {selectedOrder.status}
                  </span>
                </div>
              </div>

              <div className="bg-slate-50 rounded-3xl p-6">
                <table className="w-full text-left">
                  <thead className="text-[9px] font-black text-slate-400 uppercase tracking-widest">
                    <tr>
                      <th className="pb-4">Description</th>
                      <th className="pb-4">Qty</th>
                      <th className="pb-4 text-right">Price</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {selectedOrder.items?.map((item, idx) => (
                      <tr key={idx} className="text-xs font-bold text-slate-700">
                        <td className="py-3 uppercase italic">{item.name}</td>
                        <td className="py-3">{item.qty}</td>
                        <td className="py-3 text-right">₹{item.price * item.qty}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex justify-between items-center border-t border-slate-100 pt-8">
                <div>
                  <p className="text-[10px] text-slate-400 font-black uppercase">Customer Mobile</p>
                  <p className="text-sm font-black text-slate-900">{selectedOrder.mobile || 'N/A'}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs font-bold text-slate-400 uppercase">Total Amount</p>
                  <p className="text-3xl font-black text-slate-900">₹{selectedOrder.total}</p>
                </div>
              </div>

              <div className="flex gap-4 mt-4">
                <button onClick={() => window.print()} className="flex-1 bg-slate-900 text-white py-4 rounded-2xl font-black text-xs uppercase flex items-center justify-center gap-2 hover:opacity-90">
                  <Printer size={16} /> Print Invoice
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}