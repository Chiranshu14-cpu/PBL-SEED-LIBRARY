import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  // 1. Purchase Cart State
  const [purchaseCart, setPurchaseCart] = useState(() => {
    try {
      const saved = localStorage.getItem('seedvault_purchase_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // 2. Borrow Cart State
  const [borrowCart, setBorrowCart] = useState(() => {
    try {
      const saved = localStorage.getItem('seedvault_borrow_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  // Drawer modal visibility
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('purchase'); // 'purchase' | 'borrow'

  // Persist carts to localStorage
  useEffect(() => {
    localStorage.setItem('seedvault_purchase_cart', JSON.stringify(purchaseCart));
  }, [purchaseCart]);

  useEffect(() => {
    localStorage.setItem('seedvault_borrow_cart', JSON.stringify(borrowCart));
  }, [borrowCart]);

  // --- Purchase Cart Actions ---
  const addToPurchaseCart = (seed, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));
    setPurchaseCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.seed._id === seed._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(seed.availableStock, updated[existingIndex].quantity + qty);
        updated[existingIndex].quantity = newQty;
        return updated;
      }
      return [
        ...prev,
        {
          seed,
          quantity: Math.min(seed.availableStock, qty),
          pricePerPacket: seed.pricePerPacket,
          packetWeightGrams: seed.packetWeightGrams || 25,
        },
      ];
    });
    setActiveTab('purchase');
    setIsDrawerOpen(true);
  };

  const updatePurchaseQty = (seedId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromPurchaseCart(seedId);
      return;
    }
    setPurchaseCart((prev) =>
      prev.map((item) => {
        if (item.seed._id === seedId) {
          const maxAllowed = item.seed.availableStock || 999;
          return { ...item, quantity: Math.min(qty, maxAllowed) };
        }
        return item;
      })
    );
  };

  const removeFromPurchaseCart = (seedId) => {
    setPurchaseCart((prev) => prev.filter((item) => item.seed._id !== seedId));
  };

  const clearPurchaseCart = () => {
    setPurchaseCart([]);
  };

  // --- Borrow Cart Actions ---
  const addToBorrowCart = (seed, quantity = 1) => {
    const qty = Math.max(1, parseInt(quantity, 10));
    setBorrowCart((prev) => {
      const existingIndex = prev.findIndex((item) => item.seed._id === seed._id);
      if (existingIndex > -1) {
        const updated = [...prev];
        const newQty = Math.min(seed.availableStock, updated[existingIndex].quantity + qty);
        updated[existingIndex].quantity = newQty;
        return updated;
      }
      return [
        ...prev,
        {
          seed,
          quantity: Math.min(seed.availableStock, qty),
          packetWeightGrams: seed.packetWeightGrams || 25,
        },
      ];
    });
    setActiveTab('borrow');
    setIsDrawerOpen(true);
  };

  const updateBorrowQty = (seedId, newQuantity) => {
    const qty = parseInt(newQuantity, 10);
    if (isNaN(qty) || qty <= 0) {
      removeFromBorrowCart(seedId);
      return;
    }
    setBorrowCart((prev) =>
      prev.map((item) => {
        if (item.seed._id === seedId) {
          const maxAllowed = item.seed.availableStock || 999;
          return { ...item, quantity: Math.min(qty, maxAllowed) };
        }
        return item;
      })
    );
  };

  const removeFromBorrowCart = (seedId) => {
    setBorrowCart((prev) => prev.filter((item) => item.seed._id !== seedId));
  };

  const clearBorrowCart = () => {
    setBorrowCart([]);
  };

  // --- Calculations (Separated: Money vs Seed Weight) ---
  const purchaseTotalQty = purchaseCart.reduce((sum, item) => sum + item.quantity, 0);
  const purchaseTotalPrice = purchaseCart.reduce(
    (sum, item) => sum + item.quantity * item.pricePerPacket,
    0
  );
  const purchaseTotalWeightGrams = purchaseCart.reduce(
    (sum, item) => sum + item.quantity * (item.packetWeightGrams || 25),
    0
  );

  const borrowTotalQty = borrowCart.reduce((sum, item) => sum + item.quantity, 0);
  const borrowTotalWeightGrams = borrowCart.reduce(
    (sum, item) => sum + item.quantity * (item.packetWeightGrams || 25),
    0
  );

  return (
    <CartContext.Provider
      value={{
        purchaseCart,
        borrowCart,
        isDrawerOpen,
        setIsDrawerOpen,
        activeTab,
        setActiveTab,
        // Purchase methods & metrics
        addToPurchaseCart,
        updatePurchaseQty,
        removeFromPurchaseCart,
        clearPurchaseCart,
        purchaseTotalQty,
        purchaseTotalPrice,
        purchaseTotalWeightGrams,
        // Borrow methods & metrics
        addToBorrowCart,
        updateBorrowQty,
        removeFromBorrowCart,
        clearBorrowCart,
        borrowTotalQty,
        borrowTotalWeightGrams,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

