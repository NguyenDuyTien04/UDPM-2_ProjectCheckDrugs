import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import MarketNFT from "./pages/MarketNFT";
import PurchaseHistory from "./pages/PurchaseHistory";
import Collection from "./pages/Collection";
import CreateNFT from "./pages/CreateNFT";

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/collections" element={<Collection />} />
        <Route path="/create-nft" element={<CreateNFT />} />
        <Route path="/market" element={<MarketNFT />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
