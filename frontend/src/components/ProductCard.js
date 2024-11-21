import React from "react";
import "./styles/ProductCard.css";

function ProductCard({ drug }) {
  return (
    <div className="product-card">
      <img src={drug.image} alt={drug.name} className="product-image" />
      <div className="product-info">
        <h3>{drug.name}</h3>
        <p>Giá: {drug.price} SOL</p>
        <button className="buy-btn">Mua ngay</button>
      </div>
    </div>
  );
}

export default ProductCard;
