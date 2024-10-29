import { createContext, useState } from "react";
import { getCart } from "../util/api";

export const AuthContext = createContext({
  isAuthenticated: false,
  user: {
    id: 0,
    email: "",
    name: "",
  },
  appLoading: true,
});

export const AuthWrapper = (props) => {
  const [auth, setAuth] = useState({
    isAuthenticated: false,
    user: {
      id: 0,
      email: "",
      name: "",
    },
  });
  const [cart, setCart] = useState(0);
  //////////////////////////////////////////////////////////
  const [appLoading, setAppLoading] = useState(true);
  //
  const getUserIdFromLocalStorage = () => {
    const getInfo = localStorage.getItem("info");
    const infoData = getInfo ? JSON.parse(getInfo) : null;

    if (infoData) {
      const idUser = infoData?.data?.id;
      console.log("idUser", idUser);
      return idUser; // Trả về idUser nếu có
    } else {
      console.log("infoData is null, cannot retrieve idUser");
      return null; // Trả về null nếu infoData là null
    }
  };
  const fetchCart = async () => {
    const idUserr = getUserIdFromLocalStorage();
    if (!idUserr) return;

    try {
      const result = await getCart(idUserr);
      const countCart = result?.message?.data?.CartItems?.length || 0;
      console.log("count cart", countCart);
      localStorage.removeItem("cart");

      localStorage.setItem("cart", countCart);
      console.log("success");
    } catch (error) {
      console.log("Failed to call API: ", error);
    }
  };
  ////////////////////////////////////////////////////
  return (
    <AuthContext.Provider
      value={{
        auth,
        setAuth,
        appLoading,
        setAppLoading,
        cart,
        setCart,
        fetchCart,
      }}
    >
      {props.children}
    </AuthContext.Provider>
  );
};
