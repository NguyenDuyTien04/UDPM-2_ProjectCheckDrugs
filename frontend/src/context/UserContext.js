import React, { createContext, useState, useContext } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const walletAddress = localStorage.getItem("walletAddress");
    const token = localStorage.getItem("token");
    return walletAddress && token ? { walletAddress, token } : null;
  });

  const login = (userData) => {
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("walletAddress");
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUserContext = () => useContext(UserContext);
