import React, { useState } from "react";
import { Link } from "react-router-dom";

const Menu = () => {
  const [selectedMenu, setSelectedMenu] = useState(0);
  const [isPofileDropdownOpen, setIsPofileDropdownOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(true);

  const handleMenuClick = (index) => {
    setSelectedMenu(index);
  };
  const handleIsPofileClick = (index) => {
    setIsPofileDropdownOpen(!isPofileDropdownOpen);
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";
  return (
    <nav className="navbar navbar-expand-lg navbar-white ">
      <div className="container-nav " style={{ marginBottom: "15px" }}>
        <div className="row navbar links">
          <div className="col-6 ">
            {/* logo */}
            <Link to="/" className="navbar-brand d-flex align-items-center">
              <img
                src="public\logo.png"
                alt="logo"
                style={{ width: "50px", marginLeft: "15px" }}
              />
            </Link>
            {/* Toggle button (for small screens) */}
            <button
              className="navbar-toggler"
              type="button"
              onClick={() => setIsCollapsed(!isCollapsed)}
              data-bs-toggle="collapse"
              data-bs-target="#navbarSupportedContent"
              aria-controls="navbarSupportedContent"
              aria-expanded={!isCollapsed}
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon">
                <i className="fa fa-bars " aria-hidden="true"></i>
              </span>
            </button>

            {/* Collapsible menu */}
          </div>
          <div className="col-6">
            <div
              className={`collapse navbar-collapse  ${
                isCollapsed ? "" : "show"
              }`}
              id="navbarNav navbarSupportedContent"
            >
              <ul className="navbar-nav mx-auto justify-content-end">
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none" }}
                    to={"/"}
                    className="nav-link"
                    onClick={() => handleMenuClick(0)}
                  >
                    <p
                      className={
                        selectedMenu === 0 ? activeMenuClass : menuClass
                      }
                    >
                      Dashboard
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  <Link
                    style={{ textDecoration: "none" }}
                    to={"/orders"}
                    className="nav-link"
                    onClick={() => handleMenuClick(1)}
                  >
                    <p
                      className={
                        selectedMenu === 1 ? activeMenuClass : menuClass
                      }
                    >
                      Orders
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  {" "}
                  <Link
                    style={{ textDecoration: "none" }}
                    className="nav-link"
                    to={"/holdings"}
                    onClick={() => handleMenuClick(2)}
                  >
                    <p
                      className={
                        selectedMenu === 2 ? activeMenuClass : menuClass
                      }
                    >
                      Holdings
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  {" "}
                  <Link
                    style={{ textDecoration: "none" }}
                    className="nav-link"
                    to={"/positions"}
                    onClick={() => handleMenuClick(3)}
                  >
                    <p
                      className={
                        selectedMenu === 3 ? activeMenuClass : menuClass
                      }
                    >
                      Positions
                    </p>
                  </Link>
                </li>
                <li className="nav-item">
                  {" "}
                  <Link
                    style={{ textDecoration: "none" }}
                    className="nav-link"
                    to={"/apps"}
                    onClick={() => handleMenuClick(4)}
                  >
                    <p
                      className={
                        selectedMenu === 4 ? activeMenuClass : menuClass
                      }
                    >
                      Apps
                    </p>
                  </Link>
                </li>
              </ul>
              <hr />

              <div className="profile" onClick={handleIsPofileClick}>
                <div className="avatar">ZU </div>
                <div className="btn-group">
                  <p
                    className="username mt-3 dropdown-toggle"
                    type="button"
                    data-bs-toggle="dropdown"
                    aria-expanded="false"
                  >
                    USERID
                  </p>
                  <ul
                    class="dropdown-menu "
                    style={{ padding: "", textAlign: "center" }}
                  >
                    <li>
                      <button
                        className="dropdown-item"
                        onClick={() => {
                          localStorage.removeItem("token");
                          window.location.href = "  http://localhost:5174/login";
                        }}
                      >
                        Logout
                      </button>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
