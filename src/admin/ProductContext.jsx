import React, { createContext, useContext, useState, useEffect } from "react";

const ProductContext = createContext();

export const ProductProvider = ({ children }) => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        // Mock Inventory Data
        const mockProducts = [
          { id: 1, name: "1000 Wala Garland", stock: 3, category: "Garlands", productCode: "H-001" },
          { id: 2, name: "Sky Shot 12 Chars", stock: 15, category: "Aerial", productCode: "H-045" },
          { id: 3, name: "Flower Pots Giant", stock: 2, category: "Ground", productCode: "H-012" },
          { id: 4, name: "Electric Crackers", stock: 50, category: "Sound", productCode: "H-088" }
        ];
        setProducts(mockProducts);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

  return (
    <ProductContext.Provider value={{ products, loading }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => useContext(ProductContext);