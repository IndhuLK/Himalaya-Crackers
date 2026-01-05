import { 
  ShoppingBag, 
  AlertTriangle, 
  CreditCard, 
  Plus, 
  Truck, 
  TrendingUp, 
  Sparkles 
} from "lucide-react";
import { useOrders } from "./OrderContext";
import { useProducts } from "./ProductContext";
import { isToday } from "date-fns";
import { Link } from "react-router-dom";

export default function Dashboard() {
  const { orders, loading: ordersLoading } = useOrders();
  const { products, loading: productsLoading } = useProducts();

  // 1. Today's Sales Calculation
  const todaySales = orders
    .filter(order => order.orderDate?.toDate && isToday(order.orderDate.toDate()))
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // 2. Total Orders
  const totalOrders = orders.length;

  // 3. Pending Deliveries
  const pendingDeliveries = orders.filter(
    (order) => order.paymentStatus === "Pending" || order.status === "Processing"
  ).length;

  // 4. Low Stock Alerts
  const lowStockItems = products.filter((p) => (Number(p.stock) || 0) < 10);

  if (ordersLoading || productsLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse">
        Fetching Himalaya Data...
      </div>
    );
  }

  return (
    <div className="p-6 space-y-8 animate-in fade-in duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 italic">HIMALAYA DASHBOARD</h1>
          <p className="text-slate-500 font-medium">Quick insights for your cracker business.</p>
        </div>
        <Link to="/admin/add-product" className="bg-blue-600 text-white px-6 py-3 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 transition-all shadow-lg shadow-blue-100">
          <Plus size={18} /> Add Stock
        </Link>
      </div>

      {/* Main 4 Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[
          { label: "Today's Sales", value: `₹${todaySales}`, icon: CreditCard, color: "text-emerald-600", bg: "bg-emerald-50" },
          { label: "Total Orders", value: totalOrders, icon: ShoppingBag, color: "text-blue-600", bg: "bg-blue-50" },
          { label: "Pending Deliveries", value: pendingDeliveries, icon: Truck, color: "text-orange-600", bg: "bg-orange-50" },
          { label: "Low-Stock Alerts", value: lowStockItems.length, icon: AlertTriangle, color: "text-red-600", bg: "bg-red-50" },
        ].map((stat, i) => (
          <div key={i} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
            <div className={`${stat.bg} ${stat.color} w-12 h-12 rounded-2xl flex items-center justify-center mb-4`}>
              <stat.icon size={24} />
            </div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
            <h2 className="text-2xl font-black text-slate-900">{stat.value}</h2>
          </div>
        ))}
      </div>

      {/* Bottom Section: Forecast & Detailed Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* Festival Demand Forecast */}
        <div className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-[2.5rem] p-8 text-white shadow-xl relative overflow-hidden">
          <Sparkles className="absolute top-4 right-4 text-blue-300 opacity-50" size={40} />
          <div className="relative z-10">
            <h3 className="text-xl font-black mb-2 flex items-center gap-2">
              <TrendingUp size={20} /> Festival Demand Forecast
            </h3>
            <p className="text-blue-100 text-sm mb-6">Based on previous season sales (Diwali/New Year)</p>
            
            <div className="space-y-4">
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Gift Boxes</span>
                  <span className="text-orange-400">High Demand</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-orange-400 h-full w-[85%]"></div>
                </div>
              </div>
              <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10">
                <div className="flex justify-between text-sm font-bold mb-1">
                  <span>Sparklers & Flower Pots</span>
                  <span className="text-emerald-400">Stable</span>
                </div>
                <div className="w-full bg-white/20 h-2 rounded-full overflow-hidden">
                  <div className="bg-emerald-400 h-full w-[60%]"></div>
                </div>
              </div>
            </div>
            <p className="mt-6 text-[10px] uppercase font-black tracking-widest text-blue-300 italic">
              * Advice: Restock Multi-shot Aerials before next week.
            </p>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8">
          <h3 className="font-black text-slate-800 mb-6 flex items-center gap-2">
            <AlertTriangle className="text-red-500" size={20} /> Low Stock Items
          </h3>
          <div className="space-y-3">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 4).map((item) => (
                <div key={item.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100">
                  <span className="font-bold text-slate-700 text-sm">{item.name}</span>
                  <span className="bg-red-100 text-red-600 px-3 py-1 rounded-lg font-black text-xs">
                    {item.stock} left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-slate-400 text-sm italic py-4">All items are sufficiently stocked.</p>
            )}
            <Link to="/admin/products" className="block text-center text-blue-600 text-xs font-black uppercase mt-4 hover:underline">
              View Full Inventory
            </Link>
          </div>
        </div>

      </div>
    </div>
  );
}