import React, { createContext, useContext, useState, useEffect } from "react";
import { db } from "../config/firebase";
import { 
  collection, 
  onSnapshot, 
  deleteDoc, 
  doc, 
  query, 
  orderBy 
} from "firebase/firestore";

const InventoryContext = createContext();

export const InventoryProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- 📡 REAL-TIME LISTENER ---
  useEffect(() => {
    const q = query(collection(db, "products"), orderBy("createdAt", "desc"));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const productData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setProducts(productData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  // --- 🗑️ DELETE FUNCTION ---
  const deleteProduct = async (id) => {
    if (window.confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteDoc(doc(db, "products", id));
      } catch (error) {
        console.error("Error deleting product:", error);
      }
    }
  };

  return (
    <InventoryContext.Provider value={{ products, loading, deleteProduct }}>
      {children}
    </InventoryContext.Provider>
  );
};

export const useInventory = () => useContext(InventoryContext);