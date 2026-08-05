import { useNavigate } from "react-router-dom";
import {
  FiUser,
  FiMail,
  FiShield,
  FiSettings,
  FiMonitor,
  FiLogOut,
  FiMoon,
  FiBell,
  FiCheckCircle,
  FiDatabase,
} from "react-icons/fi";

function Settings() {
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();
  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  };

  return (
    <div className="settings-page">

      <div className="page-heading">
        <h1>Settings</h1>
        <p>Manage your account and application preferences.</p>
      </div>

      {/* Top Cards */}

      <div className="settings-top">

        <div className="profile-card">

          <div className="profile-avatar">
            {currentUser?.full_name?.charAt(0).toUpperCase()}
          </div>

          <h2>{currentUser?.full_name}</h2>

          <span className="role-badge">
            {currentUser?.role}
          </span>

          <p>{currentUser?.email}</p>

          <button className="settings-btn">
            Edit Profile
          </button>

        </div>

        <div className="status-card">

          <h2>Quick Status</h2>

          <div className="status-item">
            <span>Theme</span>
            <strong>Dark Mode</strong>
          </div>

          <div className="status-item">
            <span>Role</span>
            <strong>{currentUser?.role}</strong>
          </div>

          <div className="status-item">
            <span>Authentication</span>
            <strong>JWT Active</strong>
          </div>

          <div className="status-item">
            <span>Version</span>
            <strong>1.0.0</strong>
          </div>

        </div>

      </div>

      {/* Account */}

      <div className="settings-card">

        <h2>
          <FiUser />
          Account Information
        </h2>

        <div className="info-row">
          <span><FiUser /> Full Name</span>
          <strong>{currentUser?.full_name}</strong>
        </div>

        <div className="info-row">
          <span><FiMail /> Email</span>
          <strong>{currentUser?.email}</strong>
        </div>

        <div className="info-row">
  <span>
    <FiShield /> Role
  </span>
  <strong>{currentUser?.role}</strong>
</div>

      </div>

      {/* Security */}

      <div className="settings-card">

        <h2>
          <FiShield />
          Security
        </h2>

        <div className="info-row">
        <span>
  <FiShield /> Password
</span>
          <strong>••••••••••</strong>
        </div>

        <div className="info-row">
          <span>Login Status</span>
          <strong className="success-text">
            Active
          </strong>
        </div>

        <div className="info-row">
          <span>Two-Factor Authentication</span>
          <strong>Coming Soon</strong>
        </div>

      </div>

      {/* Preferences */}

      <div className="settings-card">

        <h2>
          <FiSettings />
          Preferences
        </h2>

        <div className="info-row">
          <span><FiMoon /> Dark Mode</span>
          <strong>Enabled</strong>
        </div>

        <div className="info-row">
          <span><FiBell /> Notifications</span>
          <strong>Coming Soon</strong>
        </div>

      </div>

      {/* System */}

      <div className="settings-card">

        <h2>
          <FiMonitor />
          System Information
        </h2>

        <div className="info-row">
          <span>React</span>
          <FiCheckCircle className="check-icon" />
        </div>

        <div className="info-row">
          <span>Node.js</span>
          <FiCheckCircle className="check-icon" />
        </div>

        <div className="info-row">
          <span>Express</span>
          <FiCheckCircle className="check-icon" />
        </div>

        <div className="info-row">
          <span>MySQL</span>
          <FiCheckCircle className="check-icon" />
        </div>

        <div className="info-row">
          <span>JWT Authentication</span>
          <FiCheckCircle className="check-icon" />
        </div>

      </div>

      {/* Danger */}

      <div className="settings-card danger-card">

  <h2>
    <FiLogOut />
    Danger Zone
  </h2>

  <p>
    Logging out will end your current session.
  </p>

  <button
    className="logout-setting-btn"
    onClick={handleLogout}
  >
    <FiLogOut />
    Logout
  </button>

      </div>
    </div>
  );
}

export default Settings;