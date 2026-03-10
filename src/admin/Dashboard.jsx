import { useState, useEffect } from 'react';
import {
  ShoppingBag,
  AlertTriangle,
  CreditCard,
  Plus,
  Truck,
  TrendingUp,
  Sparkles,
} from 'lucide-react';
import { db } from '../config/firebase';
import { collection, onSnapshot, query, orderBy } from 'firebase/firestore';
import { isToday } from 'date-fns';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 1. Fetch Orders
    const qOrders = query(
      collection(db, 'orders'),
      orderBy('createdAt', 'desc')
    );
    const unsubOrders = onSnapshot(qOrders, (snapshot) => {
      const orderList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(orderList);
    });

    // 2. Fetch Products
    const unsubProducts = onSnapshot(collection(db, 'products'), (snapshot) => {
      const productList = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProducts(productList);
      setLoading(false);
    });

    return () => {
      unsubOrders();
      unsubProducts();
    };
  }, []);

  // --- STATS CALCULATIONS ---

  // 1. Today's Sales
  const todaySales = orders
    .filter((order) => {
      if (!order.createdAt) return false;
      const orderDate = order.createdAt.toDate
        ? order.createdAt.toDate()
        : new Date(order.createdAt);
      return isToday(orderDate);
    })
    .reduce((sum, order) => sum + (Number(order.total) || 0), 0);

  // 2. Total Orders
  const totalOrders = orders.length;

  // 3. Pending Deliveries (Pending, Processing, Shipped)
  const pendingDeliveries = orders.filter((order) =>
    ['Pending', 'Processing', 'Shipped'].includes(order.status)
  ).length;

  // 4. Low Stock Alerts (Stock <= 10)
  // Note: AddProduct.jsx uses 'stockQty', while some older files might use 'stock'. We check both.
  const lowStockItems = products.filter((p) => {
    const stock =
      p.stockQty !== undefined ? Number(p.stockQty) : Number(p.stock) || 0;
    return stock <= 10;
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-blue-600 animate-pulse">
        Fetching Himalaya Data...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Dashboard
          </h1>
          <p className="text-gray-500 text-sm mt-1">
            Quick insights for your business.
          </p>
        </div>
        <Link
          to="/admin/add-product"
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium flex items-center gap-2 hover:bg-blue-700 transition-colors shadow-sm"
        >
          <Plus size={16} /> New Item
        </Link>
      </div>

      {/* Main 4 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: "Today's Sales",
            value: `₹${todaySales.toLocaleString()}`,
            icon: CreditCard,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
          },
          {
            label: 'Total Orders',
            value: totalOrders,
            icon: ShoppingBag,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
          },
          {
            label: 'Pending Deliveries',
            value: pendingDeliveries,
            icon: Truck,
            color: 'text-gray-700',
            bg: 'bg-gray-100',
          },
          {
            label: 'Low-Stock Alerts',
            value: lowStockItems.length,
            icon: AlertTriangle,
            color: 'text-red-600',
            bg: 'bg-red-50',
          },
        ].map((stat, i) => (
          <div
            key={i}
            className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm flex items-center gap-4 hover:shadow-md transition-shadow"
          >
            <div
              className={`${stat.bg} ${stat.color} w-12 h-12 rounded-lg flex items-center justify-center shrink-0`}
            >
              <stat.icon size={20} />
            </div>
            <div>
              <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                {stat.label}
              </p>
              <h2 className="text-xl font-semibold text-gray-900 mt-0.5">
                {stat.value}
              </h2>
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Section: Forecast & Detailed Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Festival Demand Forecast */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp size={18} className="text-blue-600" />
            <h3 className="font-semibold text-gray-900">Demand Forecast</h3>
          </div>
          <p className="text-gray-500 text-sm mb-6">
            Based on previous season trends
          </p>

          <div className="space-y-5 flex-1">
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5 text-gray-700">
                <span>Gift Boxes</span>
                <span className="text-blue-600">High Demand</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-blue-500 h-full w-[85%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-sm font-medium mb-1.5 text-gray-700">
                <span>Sparklers & Flower Pots</span>
                <span className="text-green-600">Stable</span>
              </div>
              <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                <div className="bg-green-500 h-full w-[60%]"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Low Stock List */}
        <div className="bg-white rounded-lg border border-gray-200 shadow-sm p-6 flex flex-col">
          <div className="flex items-center gap-2 mb-6 border-b border-gray-100 pb-4">
            <AlertTriangle className="text-red-500" size={18} />
            <h3 className="font-semibold text-gray-900">Low Stock Items</h3>
          </div>
          <div className="space-y-0 divide-y divide-gray-100 flex-1">
            {lowStockItems.length > 0 ? (
              lowStockItems.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="flex items-center justify-between py-3"
                >
                  <span className="font-medium text-gray-700 text-sm">
                    {item.name}
                  </span>
                  <span className="bg-red-50 border border-red-100 text-red-700 px-2.5 py-1 rounded-md text-xs font-semibold">
                    {item.stockQty !== undefined ? item.stockQty : item.stock}{' '}
                    left
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm py-4">
                All items are sufficiently stocked.
              </p>
            )}
            <Link
              to="/admin/products"
              className="block text-blue-600 text-sm font-medium mt-4 hover:underline pt-2"
            >
              View Full Inventory
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
