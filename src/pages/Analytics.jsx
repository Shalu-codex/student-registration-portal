import { useEffect, useState } from "react";
import axios from "axios";

import {
  FiUsers,
  FiUserCheck,
  FiBookOpen,
  FiGrid,
  FiPieChart,
  FiTrendingUp,
} from "react-icons/fi";

import "../styles/analytics.css";

const API_URL = "http://localhost:5000";

function Analytics() {
  const [students, setStudents] = useState([]);

  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/students`,
        getAuthConfig()
      );

      setStudents(res.data);
    } catch (err) {
      console.error("Analytics error:", err);
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

  const otherStudents = students.filter(
    (student) => student.gender === "Other"
  ).length;

  const activeStudents = students.filter(
    (student) => student.status === "Active"
  ).length;
  
  const totalCourses = new Set(
    students.map((student) => student.course)
  ).size;
  
  const totalDepartments = new Set(
    students.map((student) => student.department)
  ).size;

  const recentStudents = [...students]
  .slice(-5)
  .reverse();

  const courseStats = {};

students.forEach((student) => {
  courseStats[student.course] =
    (courseStats[student.course] || 0) + 1;
});

const departmentStats = {};

students.forEach((student) => {
  departmentStats[student.department] =
    (departmentStats[student.department] || 0) + 1;
});

  const getPercentage = (count) => {
    if (totalStudents === 0) {
      return 0;
    }

    return ((count / totalStudents) * 100).toFixed(1);
  };

  return (
    <div className="analytics-page">
  
      {/* Heading */}
  
      <div className="page-heading">
        <h1>Analytics</h1>
        <p>View statistics and insights from student records.</p>
      </div>
  
      {/* Top Statistics */}
  
      <div className="analytics-cards">
  
        <div className="analytics-card">
          <FiUsers className="analytics-icon blue" />
          <h3>Total Students</h3>
          <h2>{totalStudents}</h2>
          <span>Registered Students</span>
        </div>
  
        <div className="analytics-card">
          <FiUserCheck className="analytics-icon green" />
          <h3>Active Students</h3>
          <h2>{activeStudents}</h2>
          <span>Currently Active</span>
        </div>
  
        <div className="analytics-card">
          <FiBookOpen className="analytics-icon purple" />
          <h3>Courses</h3>
          <h2>{totalCourses}</h2>
          <span>Available Courses</span>
        </div>
  
        <div className="analytics-card">
          <FiGrid className="analytics-icon orange" />
          <h3>Departments</h3>
          <h2>{totalDepartments}</h2>
          <span>Total Departments</span>
        </div>
  
      </div>
  
      {/* Overview Section */}
  
      <div className="analytics-overview">
  
        <div className="overview-card">
  
          <h2>
            <FiTrendingUp />
            Overview
          </h2>
  
          <div className="overview-item">
            <span>Total Students</span>
            <strong>{totalStudents}</strong>
          </div>
  
          <div className="overview-item">
            <span>Male Students</span>
            <strong>{maleStudents}</strong>
          </div>
  
          <div className="overview-item">
            <span>Female Students</span>
            <strong>{femaleStudents}</strong>
          </div>
  
          <div className="overview-item">
            <span>Other Students</span>
            <strong>{otherStudents}</strong>
          </div>
  
        </div>
  
        <div className="overview-card">
  
          <h2>
            <FiPieChart />
            Student Ratio
          </h2>
  
          <div className="ratio-circle">
  
            <div className="ratio-number">
              {getPercentage(activeStudents)}%
            </div>
  
            <span>Active Students</span>
  
          </div>
  
        </div>
  
      </div>
  
      {/* Gender Distribution */}
  
      <div className="analytics-details-card">
  
        <h2>
          <FiPieChart />
          Gender Distribution
        </h2>
  
        <div className="distribution-item">
  
          <div>
            <span>Male</span>
            <span>{getPercentage(maleStudents)}%</span>
          </div>
  
          <progress
            value={maleStudents}
            max={totalStudents || 1}
          />
  
        </div>
  
        <div className="distribution-item">
  
          <div>
            <span>Female</span>
            <span>{getPercentage(femaleStudents)}%</span>
          </div>
  
          <progress
            value={femaleStudents}
            max={totalStudents || 1}
          />
  
        </div>
  
        <div className="distribution-item">
  
          <div>
            <span>Other</span>
            <span>{getPercentage(otherStudents)}%</span>
          </div>
  
          <progress
            value={otherStudents}
            max={totalStudents || 1}
          />
  
        </div>

        <div className="analytics-grid">

  {/* Course Distribution */}

  <div className="analytics-panel">

    <h2>
      <FiBookOpen />
      Course Distribution
    </h2>

    {Object.entries(courseStats).map(([course, count]) => (

      <div className="analytics-row" key={course}>

        <div className="analytics-label">
          {course || "Not Assigned"}
        </div>

        <div className="analytics-bar">

          <div
            className="analytics-fill blue-fill"
            style={{
              width: `${(count / totalStudents) * 100}%`,
            }}
          />

        </div>

        <strong>{count}</strong>

      </div>

    ))}

  </div>

  {/* Department Distribution */}

  <div className="analytics-panel">

    <h2>
      <FiGrid />
      Department Distribution
    </h2>

    {Object.entries(departmentStats).map(([department, count]) => (

      <div className="analytics-row" key={department}>

        <div className="analytics-label">
          {department || "Not Assigned"}
        </div>

        <div className="analytics-bar">

          <div
            className="analytics-fill green-fill"
            style={{
              width: `${(count / totalStudents) * 100}%`,
            }}
          />

        </div>

        <strong>{count}</strong>

      </div>

    ))}

  </div>

  {/* Recent Students */}

<div className="analytics-table-card">

<div className="table-header">

  <h2>
    <FiUsers />
    Recent Students
  </h2>

  <span>Last 5 Registered</span>

</div>

<table className="analytics-table">

  <thead>

    <tr>

      <th>Name</th>
      <th>Gender</th>
      <th>Course</th>
      <th>Status</th>

    </tr>

  </thead>

  <tbody>

    {recentStudents.map((student) => (

      <tr key={student.id}>

        <td>
          {student.first_name} {student.last_name}
        </td>

        <td>{student.gender}</td>

        <td>{student.course || "Not Assigned"}</td>

        <td>

          <span
            className={
              student.status === "Active"
                ? "status-active"
                : "status-inactive"
            }
          >
            {student.status}
          </span>

        </td>

      </tr>

    ))}

  </tbody>

</table>

</div>

</div>
  
      </div>
  
    </div>
  );
}

export default Analytics;