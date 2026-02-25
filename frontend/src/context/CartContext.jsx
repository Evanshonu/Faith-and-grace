import { createContext, useContext, useState, useEffect } from 'react';
import {
  getCart,
  addToCart     as addToCartUtil,
  removeFromCart as removeFromCartUtil,
  updateCartItem as updateCartItemUtil,
  clearCart      as clearCartUtil,
  getCartTotal,
  getCartItemCount,
} from '../utils/cart';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  // Reads from localStorage on first load — survives page refresh
  const [cart, setCart] = useState(() => getCart());

  // Syncs cart if user has multiple tabs open
  useEffect(() => {
    const handleStorage = () => setCart(getCart());
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const addToCart = item => {
    const updated = addToCartUtil(item);
    setCart([...updated]);
  };

  const removeFromCart = itemId => {
    const updated = removeFromCartUtil(itemId);
    setCart([...updated]);
  };

  const updateCartItem = (itemId, quantity) => {
    const updated = updateCartItemUtil(itemId, quantity);
    setCart([...updated]);
  };

  const clearCart = () => {
    clearCartUtil();
    setCart([]);
  };

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateCartItem,
      clearCart,
      total:     getCartTotal(cart),
      itemCount: getCartItemCount(cart),
    }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) throw new Error('useCart must be used inside CartProvider');
  return context;
};