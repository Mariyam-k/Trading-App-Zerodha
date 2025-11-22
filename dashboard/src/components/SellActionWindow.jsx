import React, { useState } from "react";
import axios from "axios";
import './SellActionWindow.css'
import { Colors } from "chart.js";

const SellActionWindow = ({ uid, availableQty, onClose, refreshHoldings }) => {
  const [sellQty, setSellQty] = useState("");
  const [sellPrice, setSellPrice] = useState("");
  const [isSelling, setIsSelling] = useState(false);

  const handleSell = async () => {
    
    if (!uid || !sellQty || sellQty <= 0) {
      alert("Enter a valid quantity!");
      return;
    }
     if (!sellPrice || sellPrice <= 0) {
      alert("Enter a valid selling price!");
      return;
    }
    if (sellQty > availableQty) {
      alert("You cannot sell more than you hold!");
      return;
    }

    setIsSelling(true);

    try {
      const response = await axios.post("http://localhost:3002/sell", {
        uid,
        sellQty: Number(sellQty),
        sellPrice: Number(sellPrice),  // ✅ Added
        ltp: Number(sellPrice),        // ✅ Added LTP (currently same as sell price)
      });

      if (response.status === 200) {
        alert(`Successfully sold ${sellQty} units.`);
        refreshHoldings(); // update UI
        onClose();
      }
    } catch (err) {
      console.error("Sell failed:", err);
      alert("Error selling stock. Try again.");
    } finally {
      setIsSelling(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box ">
        <h3>Sell Stock</h3>
        <p>Available Quantity: {availableQty}</p>
       {/* ✅ Quantity input */}
        <input
          type="number"
          className="sell-input"
          placeholder="Enter quantity"
          min="1"
          max={availableQty}
          value={sellQty}
          onChange={(e) => setSellQty(e.target.value)}
        />

        {/* ✅ Selling price input (this was missing) */}
        <input
          type="number"
          className="sell-input"
          placeholder="Enter selling price"
          min="1"
          value={sellPrice}
          onChange={(e) => setSellPrice(e.target.value)}
          style={{ marginTop: "10px" }}
        />

        <div className="actions">
          <button
            className="btn btn-danger"
            style={{backgroundColor:"red", color:"white", borderRadius:"10px"}}
            onClick={handleSell}
            disabled={isSelling}
          >
            {isSelling ? "Selling..." : "Confirm Sell"}
          </button>
          <button 
           style={{ borderRadius:"10px"}}
          className="btn btn-secondary" onClick={onClose}>
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};

export default SellActionWindow;
