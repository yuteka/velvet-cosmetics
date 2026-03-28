import { createContext, useContext, useState } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [wishlist, setWishlist] = useState([]);

  const addToCart = (product, shade = null) => {
    setCartItems(prev => {
      const existing = prev.find(
        i => i.id === product.id && i.shade === shade
      );
      if (existing) {
        return prev.map(i =>
          i.id === product.id && i.shade === shade
            ? { ...i, qty: i.qty + 1 }
            : i
        );
      }
      return [...prev, { ...product, qty: 1, shade }];
    });
  };

  const removeFromCart = (id, shade) => {
    setCartItems(prev =>
      prev.filter(i => !(i.id === id && i.shade === shade))
    );
  };

  const updateQty = (id, shade, qty) => {
    if (qty < 1) return removeFromCart(id, shade);
    setCartItems(prev =>
      prev.map(i =>
        i.id === id && i.shade === shade ? { ...i, qty } : i
      )
    );
  };

  const clearCart = () => setCartItems([]);

  const toggleWishlist = (id) => {
    setWishlist(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const isWishlisted = (id) => wishlist.includes(id);

  const cartCount = cartItems.reduce((sum, i) => sum + i.qty, 0);
  const cartTotal = cartItems.reduce((sum, i) => sum + i.price * i.qty, 0);
  const shipping = cartTotal > 100 ? 0 : 9.99;
  const cartGrandTotal = cartTotal + shipping;

  return (
    <CartContext.Provider value={{
      cartItems,
      addToCart,
      removeFromCart,
      updateQty,
      clearCart,
      wishlist,
      toggleWishlist,
      isWishlisted,
      cartCount,
      cartTotal,
      shipping,
      cartGrandTotal,
    }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);