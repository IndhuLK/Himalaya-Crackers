import React, { createContext, useContext, useState, useEffect } from "react";

const OrderContext = createContext();

export const OrderProvider = ({ children }) => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  // In a real app, you would fetch from Firebase or your API here
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        // Mock Data for Himalaya Crackers
        const mockOrders = [
          {
            id: "ORD9901",
            customer: { name: "Rajesh Kumar", city: "Sivakasi", phone: "9876543210" },
            total: 4500,
            paymentStatus: "Delivered",
            orderDate: { toDate: () => new Date() }
          },
          {
            id: "ORD9902",
            customer: { name: "Anjali Sharma", city: "Chennai", phone: "9123456789" },
            total: 12000,
            paymentStatus: "Pending",
            orderDate: { toDate: () => new Date() }
          }
        ];
        setOrders(mockOrders);
      } catch (error) {
        console.error("Error fetching orders:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return (
    <OrderContext.Provider value={{ orders, loading }}>
      {children}
    </OrderContext.Provider>
  );
};

export const useOrders = () => useContext(OrderContext);