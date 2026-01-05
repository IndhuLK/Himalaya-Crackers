import { createContext, useContext, useState } from "react";

const InContext = createContext();

export const InProvider = ({ children }) => {
  // --- PRODUCT MANAGEMENT ---
  const [products, setProducts] = useState([]);

  const addProduct = (newProduct) => {
    setProducts((prev) => [newProduct, ...prev]);
  };

  const updateStock = (id, newStock) => {
    setProducts(prev => prev.map(p => 
      p.id === id ? { ...p, stock: Number(newStock) } : p
    ));
  };

  const deleteProduct = (id) => {
    setProducts(prev => prev.filter(p => p.id !== id));
  };

  // --- ORDER MANAGEMENT ---
  const [orders, setOrders] = useState([
    { id: "ORD-9921", customer: "Rajesh Kumar", date: "2026-01-02", total: 4500, status: "Pending", items: [{name: "1000 Wala", qty: 2, price: 1500}, {name: "Sky Shot", qty: 1, price: 1500}], delivery: "Not Assigned" },
    { id: "ORD-9922", customer: "Anitha Devi", date: "2026-01-01", total: 8200, status: "Processing", items: [{name: "Flower Pot", qty: 10, price: 820}], delivery: "Dunzo" },
  ]);

  const updateOrderStatus = (id, status) => {
    setOrders(prev => prev.map(o => o.id === id ? { ...o, status } : o));
  };

  const cancelOrder = (orderId) => {
    setOrders(prev => prev.map(order => 
      order.id === orderId ? { ...order, status: "Cancelled" } : order
    ));
  };

  const deleteOrder = (id) => {
    setOrders(prev => prev.filter(order => order.id !== id));
  };

  // --- CONTENT MANAGEMENT (CMS) ---
  const [cmsData, setCmsData] = useState({
    banners: [
      { id: 1, url: "https://images.unsplash.com/photo-1590550409171-01f7622bc70c", title: "Diwali Sale 2026" }
    ],
    safetyGuidelines: ["Keep water nearby", "Wear cotton clothes", "Use a long agarbatti"],
    festivalMessage: "Wishing you a sparkling Diwali!",
    popup: { active: true, message: "Use Code: HIM10 for 10% Off!" },
    sections: {
      featured: true,
      bestsellers: true,
      safety: true,
      reviews: true
    }
  });

  // CMS Helper Functions
  const updateCMS = (newData) => {
    setCmsData(prev => ({ ...prev, ...newData }));
  };

  // --- STATS CALCULATIONS ---
  const totalItems = products.length;
  const lowStockItems = products.filter(p => Number(p.stock) > 0 && Number(p.stock) <= 10);
  const outOfStockItems = products.filter(p => Number(p.stock) === 0);
  const readyCount = products.filter(p => Number(p.stock) > 50).length;
  const festivalPercent = totalItems > 0 ? Math.round((readyCount / totalItems) * 100) : 0;

  const deleteBanner = (id) => {
  setCmsData(prev => ({
    ...prev,
    banners: prev.banners.filter(b => b.id !== id)
  }));
};

const saveBanner = (bannerData) => {
  setCmsData(prev => {
    const exists = prev.banners.find(b => b.id === bannerData.id);
    const newBanners = exists 
      ? prev.banners.map(b => b.id === bannerData.id ? bannerData : b)
      : [...prev.banners, { ...bannerData, id: Date.now() }];
    return { ...prev, banners: newBanners };
  });
};

  return (
    <InContext.Provider value={{ 
      // Products
      products, addProduct, updateStock, deleteProduct, 
      // Orders
      orders, updateOrderStatus, cancelOrder, deleteOrder,
      // CMS
      cmsData, setCmsData, updateCMS,
      deleteBanner, saveBanner,
      // Stats
      totalItems, lowStockItems, outOfStockItems, festivalPercent 
    }}>
      {children}
    </InContext.Provider>
  );
};

export const useIn = () => useContext(InContext);