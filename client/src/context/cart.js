import { useContext, useState, createContext, useEffect } from "react";

const CartContext = createContext();

const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    let prevItems = localStorage.getItem("cart");
    if (prevItems) setCart(JSON.parse(prevItems));
  }, []);

  return (
    <CartContext.Provider value={[cart, setCart]}>
      {children}
    </CartContext.Provider>
  );
};

//custom hook..

const useCart = () => {
  return useContext(CartContext);
};

export { useCart, CartProvider };
