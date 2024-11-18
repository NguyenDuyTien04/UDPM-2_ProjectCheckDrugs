import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Header from "./components/Header";
import Footer from "./components/Footer";
import HomePage from "./components/HomePage";
import AddDrug from "./components/AddDrug";
import DrugList from "./components/DrugList";
import NFTManager from "./components/NFTManager";
import Register from "./components/Register";
import Login from "./components/Login";
import ConnectWalletPage from "./components/ConnectWalletPage";

function App() {
  const [walletAddress, setWalletAddress] = useState(null); // Phantom wallet address
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Login state

  // Check if Phantom wallet is connected on load
  useEffect(() => {
    const checkWalletConnection = async () => {
      if (window.solana && window.solana.isPhantom) {
        try {
          const connection = await window.solana.connect({ onlyIfTrusted: true });
          setWalletAddress(connection.publicKey.toString());
          console.log("Wallet connected:", connection.publicKey.toString());
        } catch (error) {
          console.error("Wallet not connected:", error.message);
        }
      }
    };
    checkWalletConnection();
  }, []);

  return (
    <Router>
      <Header
        walletAddress={walletAddress}
        setWalletAddress={setWalletAddress}
        isLoggedIn={isLoggedIn}
        setIsLoggedIn={setIsLoggedIn}
      />
      <Routes>
        {!walletAddress ? (
          // Show Connect Wallet Page if wallet is not connected
          <Route path="*" element={<ConnectWalletPage />} />
        ) : isLoggedIn ? (
          // Show authenticated routes if logged in
          <>
            <Route path="/" element={<HomePage />} />
            <Route path="/drugs/add" element={<AddDrug />} />
            <Route path="/drugs/list" element={<DrugList />} />
            <Route path="/nft/create" element={<NFTManager />} />
          </>
        ) : (
          // Show login/register routes if wallet is connected but not logged in
          <>
            <Route
              path="/register"
              element={
                <Register
                  setIsLoggedIn={setIsLoggedIn}
                  walletAddress={walletAddress}
                />
              }
            />
            <Route
              path="/login"
              element={
                <Login
                  setIsLoggedIn={setIsLoggedIn}
                  setWalletAddress={setWalletAddress}
                />
              }
            />
            <Route path="*" element={<Navigate to="/login" />} />
          </>
        )}
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
