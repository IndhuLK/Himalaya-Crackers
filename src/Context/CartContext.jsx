import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cartItems, setCartItems] = useState(() => {
    const savedCart = localStorage.getItem('himalaya_cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('himalaya_cart', JSON.stringify(cartItems));
  }, [cartItems]);

  const addToCart = (product, quantity = 1) => {
    setCartItems(prev => {
      const existing = prev.find(item => item.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.id === product.id ? { ...item, qty: item.qty + quantity } : item
        );
      }
      return [...prev, { ...product, price: product.ourPrice, qty: quantity }];
    });
  };

  // ✅ FIXED: Ippo quantity plus aagathu, neenga anupura value direct-ah set aagum
  const updateQty = (id, newQty) => {
    if (newQty < 1) return; // 1-ku killa pogaathu
    setCartItems(prev =>
      prev.map(item => (item.id === id ? { ...item, qty: newQty } : item))
    );
  };

  const removeFromCart = (id) => {
    setCartItems(prev => prev.filter(item => item.id !== id));
  };

  const clearCart = () => setCartItems([]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, updateQty, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);