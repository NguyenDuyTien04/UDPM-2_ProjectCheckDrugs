import React, { useContext } from "react";
import { WalletContext } from "../context/WalletContext";
import "./../styles/Navbar.css";

const PhantomConnect = () => {
  const { connectWallet } = useContext(WalletContext);

  return (
    <div className="phantom-connect">
      <button onClick={connectWallet} className="btn-connect">
        Kết nối ví
      </button>
    </div>
  );
};

export default PhantomConnect;
