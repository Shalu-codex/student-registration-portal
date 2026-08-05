import { Outlet, useLocation, useNavigate } from "react-router-dom";
import {
  FiSearch,
  FiBell,
  FiMoon,
  FiSun,
  FiLogOut,
} from "react-icons/fi";

import Sidebar from "./Sidebar";

import { useTheme } from "../context/ThemeContext";

function Layout() {
  const navigate = useNavigate();
  const location = useLocation();

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const { theme, toggleTheme } = useTheme();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  const pageTitles = {
    "/dashboard": "Dashboard",
    "/students": "Students",
    "/analytics": "Analytics",
    "/settings": "Settings",
  };

  const currentTitle =
    pageTitles[location.pathname] || "Dashboard";

  return (
    <div className="app-layout">
      <Sidebar />

      <div className="main-wrapper">

        <header className="topbar">

          <div>
            <h2>{currentTitle}</h2>
            <p>Welcome back, {currentUser?.full_name}</p>
          </div>

          <div className="topbar-right">

            <div className="search-box">
              <FiSearch />
              <input
                type="text"
                placeholder="Search..."
              />
            </div>

            <button className="icon-btn">
              <FiBell />
            </button>

            <button
  className="icon-btn"
  onClick={toggleTheme}
  title={
    theme === "light"
      ? "Switch to Dark Mode"
      : "Switch to Light Mode"
  }
>
  {theme === "light" ? <FiMoon /> : <FiSun />}
</button>

            <div className="profile">

              <div className="avatar">
                {currentUser?.full_name
                  ?.charAt(0)
                  .toUpperCase()}
              </div>

              <div>
                <strong>{currentUser?.full_name}</strong>
                <span>{currentUser?.role}</span>
              </div>

            </div>

            <button
              className="logout-btn"
              onClick={handleLogout}
            >
              <FiLogOut />
            </button>

          </div>

        </header>

        <main className="main-content">
          <Outlet />
        </main>

      </div>

    </div>
  );
}

export default Layout;