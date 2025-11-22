import React, { useState,useEffect } from "react";
import axios from "axios";
import BuyActionWindow from "./BuyActionWindow";
import SellActionWindow from "./SellActionWindow";

// Create context
export const GeneralContext = React.createContext({
  openBuyWindow: () => {},
  closeBuyWindow: () => {},
  openSellWindow: () => {},
  closeSellWindow: () => {},
  isBuyWindowOpen: false,
  isSellWindowOpen: false,
  selectedStockUID: "",
  holdings: [],
  refreshHoldings: () => {},
});

// Provider
export const GeneralContextProvider = ({ children }) => {
  const [isBuyWindowOpen, setIsBuyWindowOpen] = useState(false);
  const [isSellWindowOpen, setIsSellWindowOpen] = useState(false);
  const [selectedStockUID, setSelectedStockUID] = useState("");
  const [availableQty, setAvailableQty] = useState(0);
  const [holdings, setHoldings] = useState([]);

  // ---------------------- BUY ACTION ----------------------
  const handleOpenBuyWindow = (uid) => {
    setIsBuyWindowOpen(true);
    setSelectedStockUID(uid);
  };

  const handleCloseBuyWindow = () => {
    setIsBuyWindowOpen(false);
    setSelectedStockUID("");
  };

  // ---------------------- SELL ACTION ----------------------
  const handleOpenSellWindow = (uid, qty) => {
    console.log("openSellWindow called with:", uid, qty);
    setIsSellWindowOpen(true);
    setSelectedStockUID(uid);
    setAvailableQty(qty);
  };

  const handleCloseSellWindow = () => {
    setIsSellWindowOpen(false);
    setSelectedStockUID("");
    setAvailableQty(0);
  };

  // ---------------------- REFRESH HOLDINGS ----------------------
  const refreshHoldings = async () => {
    try {
      const res = await axios.get("http://localhost:3002/allHoldings", {});
      setHoldings(res.data);
    } catch (err) {
      console.error("Error fetching holdings:", err);
      setHoldings([]);
    }
  };

useEffect(() => {
  console.log("isSellWindowOpen:", isSellWindowOpen);
}, [isSellWindowOpen]);


  // ---------------------- RETURN PROVIDER ----------------------
  return (
    <GeneralContext.Provider
      value={{
        openBuyWindow: handleOpenBuyWindow,
        closeBuyWindow: handleCloseBuyWindow,
        openSellWindow: handleOpenSellWindow,
        closeSellWindow: handleCloseSellWindow,
        isBuyWindowOpen,
        isSellWindowOpen,
        selectedStockUID,
        availableQty,
        holdings,
        refreshHoldings,
      }}
    >
      {children}

      {isBuyWindowOpen && (
        <BuyActionWindow
          uid={selectedStockUID}
          onClose={handleCloseBuyWindow}
          refreshHoldings={refreshHoldings}
        />
      )}

      {isSellWindowOpen && (
        <SellActionWindow
          uid={selectedStockUID}
          availableQty={availableQty}
          onClose={handleCloseSellWindow}
          refreshHoldings={refreshHoldings}
        />
      )}
    </GeneralContext.Provider>
  );
};

export default GeneralContext;
