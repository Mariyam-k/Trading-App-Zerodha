import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { GeneralContext } from "./GeneralContext";
import { VerticalGraph } from "./VerticalGraph";
import SellActionWindow from "./SellActionWindow";

// import { holdings } from "../data/data";
import axios from "axios";
import { data } from "react-router-dom";

const Holdings = () => {
  const { refreshHoldings, holdings, openSellWindow } = useContext(GeneralContext);
  const [allHoldings, setAllHoldings] = useState([]);
  // const [selectedStock, setSelectedStock] = useState(null);

  // Sync with context holdings
  useEffect(() => {
    setAllHoldings(holdings);
  }, [holdings]);

  useEffect(() => {
    refreshHoldings();
  }, [refreshHoldings]);

  

  const labels = allHoldings.map((subArray) => subArray["name"]);

  const data = {
    labels,
    datasets: [
      {
        label: "Stock Price",
        data: allHoldings.map((stock) => stock.price),
        backgroundColor: "rgba(255, 99, 132, 0.5)",
      },
    ],
  };

  return (
    <>
      <div className="container-holdings mb-5">
        <h1 className="title mb-5">Holdings({allHoldings.length})</h1>
        <div className="row boder-top m-2">
          <div className="order-table">
            <table>
              <thead>
              <tr>
                <th>Instrument</th>
                <th>Qty.</th>
                <th>Avg. cost</th>
                <th>LTP</th>
                <th>Cur. val</th>
                <th>P&L</th>
                <th>Net chg.</th>
                <th>Day chg.</th>
                <th>Action</th>
              </tr>
              </thead>

              {allHoldings.map((stock, index) => {
                const currValue = stock.price * stock.qty;
                const isProfit = currValue - stock.avg * stock.qty >= 0.0;
                const profClass = isProfit ? "pofit" : "loss"; //setting the colour according to prfit and lost
                const dayClass = stock.isLoss ? "loss" : "profit";

                return (
                  <tr className="" key={index}>
                    <td>{stock.name}</td>
                    <td>{stock.qty}</td>
                    <td>{stock.avg?.toFixed(2)|| "0.00"} </td>
                    <td>{stock.price?.toFixed(2) || 0.00} </td>
                    <td>{currValue?.toFixed(2)}</td>
                    <td className={profClass}>
                      {(currValue - stock.avg * stock.qty).toFixed(2)}
                    </td>
                    <td className={profClass}>{stock.net}</td>
                    <td className={dayClass}>{stock.day}</td>
                    <td>
                      <button
                        className="text-center fs-6  m-2 btn-danger "
                        onClick={() => openSellWindow(stock._id, stock.qty)}
                        style={{
                          width: "100%",
                          padding: "8px",
                          textDecoration: "none",
                          borderRadius: "15px",
                           cursor: "pointer"
                        }}
                      >
                        Sell
                      </button>
                    </td>
                  </tr>
                );
              })}
            </table>
          </div>
        </div>
        <div className="row">
          <div className="col">
            <h5>
              {" "}
              29,875.<span>55</span>
            </h5>
          </div>
          <div className="col">
            <h5>
              31,428.<span>95</span>{" "}
            </h5>
          </div>
          <div className="col">
            <h5>1,553.40 (+5.20%)</h5>
            <p>P&L</p>
          </div>
        </div>
      </div>

      <VerticalGraph data={data} />
    </>
  );
};

export default Holdings;
