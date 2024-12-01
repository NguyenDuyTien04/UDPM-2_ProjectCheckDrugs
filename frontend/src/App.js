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

import ShippingTracking from './pages/ShippingTracking';
import CreateNFT from "./pages/CreateNFT";
import NftList from "./pages/UserNFTs";
import UserTransactionStatsChart from './pages/UserTransactionStatsChart';


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
        <Route path="/nft-list" element={<NftList />} />
        <Route path="/market" element={<MarketNFT />} />
        <Route path="/purchase-history" element={<PurchaseHistory />} />
        <Route path="/shippingtracking" element={<ShippingTracking />} />
        <Route path="/usertransactionstatschart" element={<UserTransactionStatsChart />} />
      </Routes>
    </UserProvider>
  );
}

export default App;
