import React,{useState,useEffect} from "react";
import axios from "axios";

// import { positions } from "../data/data";

const Positions = () => {

    const [allPostions,setAllPostions] =useState([]);
  //we are getting data from backend through the localhost:3002/allPostions, and seting it to allPostions

  useEffect(()=>{
    axios.get("http://localhost:3002/allPositions").then((res)=>{
      console.log(res.data)
      setAllPostions(res.data)
    })
  },[])
  return (
    <div className="container-positions m1-2">
      <h1 className="title">Positions ({allPostions.length})</h1>
      <div className="row boder-top m-2">
        <div className="order-table">
          <table>
            <tr>
              <th>Product</th>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Avg.</th>
              <th>LTP</th>
              <th>P&L</th>
              <th>Chg.</th>
            </tr>
            {allPostions.map((stock, index) => {
              const currValue = stock.price * stock.qty;
              const isProfit = currValue - stock.avg * stock.qty >= 0.0;
              const profClass = isProfit ? "pofit" : "loss"; //setting the colour according to prfit and lost
              const dayClass = stock.isLoss ? "loss" : "profit";

              return (
                <tr className="" key={index}>
                    <td>{stock.product}</td>
                  <td>{stock.name}</td>
                  <td>{stock.qty}</td>
                  <td>{stock.avg.toFixed(2)}</td>
                  <td>{stock.price.toFixed(2)}</td>
                  <td className={profClass}>
                    {(currValue - stock.avg * stock.qty).toFixed(2)}
                  </td>
                  <td className={dayClass}>{stock.day}</td>
                </tr>
              );
            })}
          </table>
        </div>
      </div>
    </div>
  );
};

export default Positions;
