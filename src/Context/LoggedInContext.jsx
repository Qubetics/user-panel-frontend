import { createContext, useContext, useEffect, useState } from "react";

export const MyLoggedInContext = createContext();

export const LoggedInProvider = ({ children }) => {
  const [authData,setAuthData]=useState("");
  const [status,setStatus]=useState("");
  const [request,setRequest]=useState("");

  return (
    <MyLoggedInContext.Provider value={{authData,setAuthData,status,setStatus,request,setRequest }}>
      {children}
    </MyLoggedInContext.Provider>
  );
};

export const useIsLoggedIn = () => useContext(MyLoggedInContext);
