import { NavLink } from "react-router-dom";

import {
  FiGrid,
  FiUsers,
  FiBarChart2,
  FiSettings,
  FiBookOpen
} from "react-icons/fi";

function Sidebar() {

  const user = JSON.parse(localStorage.getItem("user"));

  const isAdmin = user?.role === "admin";

  return (

    <aside className="sidebar">

      <div className="logo">

        <div className="logo-circle">
          SP
        </div>

        <div>

          <h2>StudentPro</h2>

          <span>Management</span>

        </div>

      </div>

      <nav>

        <NavLink
          to="/dashboard"
          className={({isActive}) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FiGrid />

          Dashboard
        </NavLink>

        <NavLink
          to="/students"
          className={({isActive}) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FiUsers />

          Students
        </NavLink>

        {isAdmin && (

          <NavLink
            to="/analytics"
            className={({isActive}) =>
              isActive ? "menu active" : "menu"
            }
          >
            <FiBarChart2 />

            Analytics
          </NavLink>

        )}

        <NavLink
          to="/settings"
          className={({isActive}) =>
            isActive ? "menu active" : "menu"
          }
        >
          <FiSettings />

          Settings
        </NavLink>

      </nav>

      <div className="sidebar-bottom">

        <FiBookOpen />

        <div>

          <strong>

            Student Portal

          </strong>

          <span>

            Version 2.0

          </span>

        </div>

      </div>

    </aside>

  );

}

export default Sidebar;