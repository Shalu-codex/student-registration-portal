import { useEffect, useState } from "react";
import axios from "axios";
import DashboardSkeleton from "../components/DashboardSkeleton";
import { useNavigate } from "react-router-dom";
import {
  FiUsers,
  FiUser,
  FiUserCheck,
  FiShield
} from "react-icons/fi";
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

import { Doughnut, Line } from "react-chartjs-2";

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const API_URL = "http://localhost:5000";

function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));

  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);

  const [students, setStudents] = useState([]);

  const getAuthConfig = () => {
    const token = localStorage.getItem("token");

    return {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/students`,
        getAuthConfig()
      );
  
      setStudents(res.data);
    } catch (err) {
      console.error("Dashboard error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const totalStudents = students.length;

  const maleStudents = students.filter(
    (student) => student.gender === "Male"
  ).length;

  const femaleStudents = students.filter(
    (student) => student.gender === "Female"
  ).length;

  const recentStudents = [...students]
  .sort((a ,b) => b.id - a.id)
  .slice(0, 5);

  const genderData = {
    labels: ["Male", "Female"],
    datasets: [
      {
        data: [maleStudents, femaleStudents],
        backgroundColor: [
          "#2563eb",
          "#ec4899",
        ],
        borderWidth: 0,
      },
    ],
  };

  const registrationsByDay = {};

students.forEach((student) => {
  const date = new Date(student.created_at)
  .toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });

  registrationsByDay[date] =
    (registrationsByDay[date] || 0) + 1;
});

const lineData = {
  labels: Object.keys(registrationsByDay),
  datasets: [
    {
      label: "Registrations",
      data: Object.values(registrationsByDay),
      borderColor: "#2563eb",
      backgroundColor: "rgba(37,99,235,.15)",
      tension: 0.4,
      fill: true,
    },
  ],
};

const lineOptions = {
  responsive: true,

  plugins: {
    legend: {
      display: false,
    },
  },

  scales: {
    y: {
      beginAtZero: true,
      ticks: {
        stepSize: 1,
      },
      grid: {
        color: "#e5e7eb",
      },
    },

    x: {
      grid: {
        display: false,
      },
    },
  },
};

  if (loading) {
    return <DashboardSkeleton />;
  }

  return (
  <div className="dashboard-page">
    <div className="page-heading">
      <h1>Welcome, {user?.full_name} 👋</h1>

      <p>
        {user?.role === "admin"
          ? "Administrator Dashboard"
          : "Staff Dashboard"}
      </p>
    </div>

    <div className="stats-grid fade-in">

  <div className="stat-card blue-card">
    <div className="stat-header">
      <div className="stat-icon">
        <FiUsers />
      </div>

      <span className="trend up">
        ↑ {students.length} Total
      </span>
    </div>

    <h2>{totalStudents}</h2>

    <p>Total Students</p>
  </div>

  <div className="stat-card green-card">
    <div className="stat-header">
      <div className="stat-icon">
        <FiUser />
      </div>

      <span className="trend up">
        ↑ {maleStudents}
      </span>
    </div>

    <h2>{maleStudents}</h2>

    <p>Male Students</p>
  </div>

  <div className="stat-card pink-card">
    <div className="stat-header">
      <div className="stat-icon">
        <FiUserCheck />
      </div>

      <span className="trend up">
        ↑ {femaleStudents}
      </span>
    </div>

    <h2>{femaleStudents}</h2>

    <p>Female Students</p>
  </div>

  <div className="stat-card orange-card">
    <div className="stat-header">
      <div className="stat-icon">
        <FiShield />
      </div>

      <span className="trend neutral">
        Secure
      </span>
    </div>

    <h2 style={{ textTransform: "capitalize" }}>
      {user?.role}
    </h2>

    <p>Your Role</p>
  </div>

</div>

<div className="dashboard-charts">

  <div className="chart-card slide-up">
    <h2>Registration Overview</h2>

    <Line
      data={lineData}
      options={{
        responsive: true,
        maintainAspectRatio: false,
      }}
    />
  </div>

  <div className="chart-card slide-up">
    <h2>Student Gender Distribution</h2>

    <div className="chart-container">
      <Doughnut
        data={genderData}
        options={{
          responsive: true,
          maintainAspectRatio: false,
        }}
      />
    </div>
  </div>

</div>

    <div className="recent-students-card fade-in">
      <h2>Recent Registrations</h2>

      {recentStudents.length === 0 ? (
        <p>No student registrations found.</p>
      ) : (
        <table>
          <thead>
<tr>

<th>ID</th>

<th>Student</th>

<th>Gender</th>

<th>Status</th>

</tr>
</thead>

          <tbody>
  {recentStudents.map((student) => {
    const initials = `${student.first_name?.charAt(0) || ""}${student.last_name?.charAt(0) || ""}`;

    return (
      <tr key={student.id}>

        <td>{student.student_id}</td>

        <td>

          <div className="student-info">

            <div className="student-avatar">

              {initials.toUpperCase()}

            </div>

            <div>

              <strong>

                {student.first_name} {student.last_name}

              </strong>

              <span>

                {student.email}

              </span>

            </div>

          </div>

        </td>

        <td>{student.gender}</td>

        <td>

          <span
            className={`status-badge ${
              student.status === "Inactive"
                ? "inactive"
                : "active"
            }`}
          >
            {student.status || "Active"}
          </span>

        </td>

      </tr>
    );
  })}
</tbody>
        </table>
      )}
    </div>

    <div className="quick-actions">

<h2>Quick Actions</h2>

<div className="actions-grid">

  <div
    className="action-card"
    onClick={() => navigate("/students")}
  >
    <FiUsers />
    <span>View Students</span>
  </div>

  <div
    className="action-card"
    onClick={() => navigate("/students")}
  >
    <FiUserCheck />
    <span>Add Student</span>
  </div>

  {user?.role === "admin" && (
    <div
      className="action-card"
      onClick={() => navigate("/analytics")}
    >
      <FiShield />
      <span>Analytics</span>
    </div>
  )}

  <div
    className="action-card"
    onClick={() => navigate("/settings")}
  >
    <FiUser />
    <span>Settings</span>
  </div>

</div>

</div>

  </div>

  

);
}

export default Dashboard;