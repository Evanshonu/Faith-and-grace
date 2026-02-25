const CART_STORAGE_KEY = 'faith_grace_cart';

export const getCart = () => {
  try {
    const cart = localStorage.getItem(CART_STORAGE_KEY);
    return cart ? JSON.parse(cart) : [];
  } catch (error) {
    console.error('Error reading cart:', error);
    return [];
  }
};

export const saveCart = (cart) => {
  try {
    localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  } catch (error) {
    console.error('Error saving cart:', error);
  }
};

export const addToCart = (item) => {
  const cart = getCart();
  const existingItem = cart.find(cartItem => cartItem.id === item.id);
  
  if (existingItem) {
    existingItem.quantity += item.quantity || 1;
  } else {
    cart.push({ ...item, quantity: item.quantity || 1 });
  }
  
  saveCart(cart);
  return cart;
};

export const updateCartItem = (itemId, quantity) => {
  const cart = getCart();
  const item = cart.find(cartItem => cartItem.id === itemId);
  
  if (item) {
    item.quantity = quantity;
    if (quantity <= 0) {
      return removeFromCart(itemId);
    }
  }
  
  saveCart(cart);
  return cart;
};

export const removeFromCart = (itemId) => {
  let cart = getCart();
  cart = cart.filter(item => item.id !== itemId);
  saveCart(cart);
  return cart;
};

export const clearCart = () => {
  localStorage.removeItem(CART_STORAGE_KEY);
  return [];
};

export const getCartTotal = (cart) => {
  return cart.reduce((total, item) => total + (parseFloat(item.price) * item.quantity), 0);
};

export const getCartItemCount = (cart) => {
  return cart.reduce((count, item) => count + item.quantity, 0);
};
