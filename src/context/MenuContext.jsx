import { collection, doc, onSnapshot } from "firebase/firestore";
import { useState, createContext, useEffect, useContext } from "react";
import { getFirebase } from "../utils/firebaseConfig";

const MenuContext = createContext();

function MenuProvider({ children }) {
  const [menuList, setMenuList] = useState({});

  useEffect(() => {
    const { firestore } = getFirebase();
    const MENU_DOC_ID = "menu_items";
    const MENU_COLLECTION_ID = "menu";
    const menuCol = collection(firestore, MENU_COLLECTION_ID);
    const menuDoc = doc(menuCol, MENU_DOC_ID);

    const unsubscribe = onSnapshot(menuDoc, (document) => {
      setMenuList(document.data());
    });

    return () => {
      unsubscribe();
    };
  }, []);

  return (
    <MenuContext.Provider value={{ menuList }}>{children}</MenuContext.Provider>
  );
}

export function useMenu() {
  return useContext(MenuContext);
}

export default MenuProvider;
