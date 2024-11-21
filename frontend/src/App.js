import React from "react";
import { Routes, Route } from "react-router-dom";
import { UserProvider } from "./context/UserContext";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import DrugsList from "./pages/DrugsList";
import AddDrug from "./pages/AddDrug";
import MarketNFT from "./pages/MarketNFT";
import PurchaseHistory from "./pages/PurchaseHistory";

function App() {
  return (
    <UserProvider>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/drugs-list" element={<DrugsList />} />
        <Route path="/add-drug" element={<AddDrug />} />
        <Route path="/market-nft" element={<MarketNFT />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
