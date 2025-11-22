import React, { useState , useContext } from "react";
import { Tooltip, Grow } from "@mui/material";
import {
  BarChartOutlined,
  KeyboardArrowDown,
  KeyboardArrowUp,
  MoreHoriz,
} from "@mui/icons-material";
import GeneralContext  from "./GeneralContext";
import { watchlist } from "../data/data";
import { Doughnut } from "react-chartjs-2";
import { DoughnutChart } from "./DoughnutChart";

const WatchList = () => {

  const labels =watchlist.map((subArray)=> subArray["name"]);
  const data = {
    labels,
    datasets : [
    {
      label: 'Price',
      data: watchlist.map((stock)=> stock.price),
      backgroundColor: [
        'rgba(255, 99, 132, 0.2)',
        'rgba(54, 162, 235, 0.2)',
        'rgba(255, 206, 86, 0.2)',
        'rgba(75, 192, 192, 0.2)',
        'rgba(153, 102, 255, 0.2)',
        'rgba(255, 159, 64, 0.2)',
      ],
      borderColor: [
        'rgba(255, 99, 132, 1)',
        'rgba(54, 162, 235, 1)',
        'rgba(255, 206, 86, 1)',
        'rgba(75, 192, 192, 1)',
        'rgba(153, 102, 255, 1)',
        'rgba(255, 159, 64, 1)',
      ],
      borderWidth: 1,
    },
  ],
  }
  return (
    <div className="watchlist-container">
      <div className="search-container">
        <input
          type="text"
          name="search"
          id="search"
          placeholder="Search eg:infy, bse, nifty fut weekly, gold mcx"
          className="search"
        />
        <span className="counts">{watchlist.length} / 50</span>
      </div>
      <ul className="list">
        {watchlist.map((stock, index) => {
          return <WatchListItem stock={stock} key={index} />;
        })}
      </ul>

      <DoughnutChart data ={data}/>
    </div>
  );
};



//component
const WatchListItem = ({ stock }) => {
  const [showWatchListActions, setShowWatchListActions] = useState(false);

  const handleMouseHover = (e) => {
    setShowWatchListActions(true);
  };
  const handleMouseHoverExit = (e) => {
    setShowWatchListActions(false);
  };

  return (
    <li onMouseEnter={handleMouseHover} onMouseLeave={handleMouseHoverExit}>
      <div className="item">
        <p className={stock.isDown ? "down" : "up"}>{stock.name}</p>
        <div className="itemInfo">
          <span className="percent">{stock.percent}</span>
          {stock.isDown ? (
            <KeyboardArrowDown className="down" />
          ) : (
            <KeyboardArrowUp className="up" />
          )}
          <span className="price">{stock.price}</span>
        </div>
      </div>
      {/* showWatchListActions is true then it will display the WatchListActions */}
      {showWatchListActions && <WatchListActions uid={stock.name} />}
    </li>
  );}
//component
const WatchListActions = ({ uid ,qty}) => {
  const { openBuyWindow, openSellWindow } = useContext(GeneralContext) // ✅ Correct way

 

  
  return (
    <span className="actions">
      <span>
        <Tooltip title="Buy (B)" placement="top" arrow TransitionComponent={Grow}>
          <button className="buy" onClick={() => openBuyWindow(uid)}>
            Buy
          </button>
        </Tooltip>

        <Tooltip title="Sell (S)" placement="top" arrow TransitionComponent={Grow}>
          <button className="sell" onClick={() => openSellWindow(uid , qty)} >Sell</button>
        </Tooltip>

        <Tooltip title="Analytics (A)" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <BarChartOutlined className="icon" />
          </button>
        </Tooltip>

        <Tooltip title="More" placement="top" arrow TransitionComponent={Grow}>
          <button className="action">
            <MoreHoriz className="icon" />
          </button>
        </Tooltip>
      </span>
    </span>
  );
};
export default WatchList;
