import React, { createContext, useState, useContext, useEffect } from "react";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Lấy thông tin người dùng từ localStorage khi ứng dụng khởi chạy
    const walletAddress = localStorage.getItem("walletAddress");
    const token = localStorage.getItem("token");

    if (walletAddress && token) {
      setUser({ walletAddress, token }); // Cập nhật trạng thái người dùng
    }
  }, []);

  const login = (walletAddress, token) => {
    // Cập nhật trạng thái người dùng và lưu vào localStorage
    localStorage.setItem("walletAddress", walletAddress);
    localStorage.setItem("token", token);
    setUser({ walletAddress, token });
  };

  const logout = () => {
    // Xóa thông tin người dùng khỏi localStorage và reset trạng thái
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
