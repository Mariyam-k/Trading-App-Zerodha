import React, { useState, useEffect } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

const Orders = () => {
  const [orders, setOrders] = useState([]);

  // Fetch all orders from backend
  const fetchOrders = async () => {
     try {
      const res = await axios.get("http://localhost:3002/allOrders")
      setOrders(res.data)
    } 
    catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  if (orders.length === 0) {
    return (
      <div className="orders">
        <div className="no-orders">
          <p>You haven't placed any orders today</p>
          <Link to={"/"} className="btn">
            Get Started
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="orders">
      <h2>My Orders ({orders.length})</h2>
      <div className="row boder-top m-2 mb-5 mt-4">
        <table style={{ border: "1px soild " }} className="table-striped table table-bordered">
          <thead>
            <tr>
              <th>Instrument</th>
              <th>Qty.</th>
              <th>Price</th>
              <th>Mode</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order, index) => (
              <tr key={index}>
                <td>{order.name}</td>
                <td>{order.qty}</td>
                <td>{order.price}</td>
                <td>{order.mode}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
export default Orders;
