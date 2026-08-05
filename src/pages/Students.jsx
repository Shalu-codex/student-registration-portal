import { useEffect, useState } from "react";
import {
  FiSearch,
  FiFilter,
  FiPlus,
  FiEdit2,
  FiTrash2,
  FiUser,
  FiPhone,
  FiBookOpen,
  FiCamera,
} from "react-icons/fi";
import axios from "axios";

const API_URL = "http://localhost:5000";

const emptyStudent = {
  student_id: "",

  first_name: "",
  last_name: "",

  gender: "Male",
  date_of_birth: "",

  email: "",
  phone: "",

  address: "",
  department: "",

  city: "",
  state: "",

  course: "",
  semester: "",

  status: "Active",

  profile_photo: "",
};

import toast from "react-hot-toast";

function Students() {
  const [students, setStudents] = useState([]);
  const [student, setStudent] = useState(emptyStudent);
  const [editingId, setEditingId] = useState(null);

  const [photoPreview, setPhotoPreview] = useState(null);

  // SEARCH + FILTER + PAGINATION
  const [searchTerm, setSearchTerm] = useState("");
  const [genderFilter, setGenderFilter] = useState("All");
  const [currentPage, setCurrentPage] = useState(1);

  const studentsPerPage = 5;

  // CURRENT USER
  const user = JSON.parse(localStorage.getItem("user"));
  const isAdmin = user?.role === "admin";

  // AUTH CONFIG
  const getAuthConfig = () => ({
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
  });

  // FETCH STUDENTS
  const fetchStudents = async () => {
    try {
      const res = await axios.get(
        `${API_URL}/students`,
        getAuthConfig()
      );

      setStudents(res.data);
    } catch (err) {
      console.error("Fetch students error:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // STUDENT FORM CHANGE
  const handleChange = (e) => {
    setStudent({
      ...student,
      [e.target.name]: e.target.value,
    });
  };

  const handlePhotoChange = (e) => {
    const file = e.target.files[0];
  
    if (!file) return;
  
    setStudent({
      ...student,
      profile_photo: file,
    });
  
    setPhotoPreview(URL.createObjectURL(file));
  };

  // ADD / UPDATE STUDENT
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
      const formData = new FormData();
  
      formData.append("first_name", student.first_name);
      formData.append("last_name", student.last_name);
      formData.append("gender", student.gender);
      formData.append("date_of_birth", student.date_of_birth);
      formData.append("email", student.email);
      formData.append("phone", student.phone);
      formData.append("address", student.address);
      formData.append("department", student.department);
      formData.append("city", student.city);
      formData.append("state", student.state);
      formData.append("course", student.course);
      formData.append("semester", student.semester);
      formData.append("status", student.status);
  
      if (student.profile_photo instanceof File) {
        formData.append("profile_photo", student.profile_photo);
      }
  
      let res;
  
      if (editingId !== null) {
        res = await axios.put(
          `${API_URL}/students/${editingId}`,
          formData,
          {
            headers: {
              ...getAuthConfig().headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      } else {
        res = await axios.post(
          `${API_URL}/students`,
          formData,
          {
            headers: {
              ...getAuthConfig().headers,
              "Content-Type": "multipart/form-data",
            },
          }
        );
      }
  
      toast.success(res.data.message);
  
      setStudent(emptyStudent);
      setEditingId(null);
      setPhotoPreview(null);
  
      fetchStudents();
    } catch (err) {
      console.error(err);
  
      toast.error(
        err.response?.data?.message ||
        "Unable to save student"
      );
    }
  };

  // EDIT STUDENT
  const handleEdit = (selectedStudent) => {
    setStudent({
      student_id: selectedStudent.student_id || "",
      first_name: selectedStudent.first_name || "",
      last_name: selectedStudent.last_name || "",
      gender: selectedStudent.gender || "Male",
      date_of_birth: selectedStudent.date_of_birth || "",
      email: selectedStudent.email || "",
      phone: selectedStudent.phone || "",
      address: selectedStudent.address || "",
      department: selectedStudent.department || "",
      city: selectedStudent.city || "",
      state: selectedStudent.state || "",
      course: selectedStudent.course || "",
      semester: selectedStudent.semester || "",
      status: selectedStudent.status || "Active",
      profile_photo: selectedStudent.profile_photo || "",
    });

    setEditingId(selectedStudent.id);

    setPhotoPreview(
      selectedStudent.profile_photo
        ? `${API_URL}/${selectedStudent.profile_photo}`
        : null
    );

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // CANCEL EDIT
  const handleCancelEdit = () => {
    setStudent(emptyStudent);
    setEditingId(null);
    setPhotoPreview(null);
  };

  // DELETE STUDENT
  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this student?"
    );

    if (!confirmed) return;

    try {
      const res = await axios.delete(
        `${API_URL}/students/${id}`,
        getAuthConfig()
      );

      toast.success(res.data.message);

      if (editingId === id) {
        handleCancelEdit();
      }

      fetchStudents();
    } catch (err) {
      console.error("Delete student error:", err);

      toast.error(
        err.response?.data?.message ||
          "Unable to delete student"
      );
    }
  };

  // SEARCH + FILTER
  const filteredStudents = students.filter((s) => {
    const search = searchTerm.toLowerCase();

    const matchesSearch =
      s.student_id.toLowerCase().includes(search) ||
      s.first_name.toLowerCase().includes(search) ||
      s.last_name.toLowerCase().includes(search) ||
      s.email.toLowerCase().includes(search);

    const matchesGender =
      genderFilter === "All" ||
      s.gender === genderFilter;

    return matchesSearch && matchesGender;
  });

  // PAGINATION
  const totalPages = Math.ceil(
    filteredStudents.length / studentsPerPage
  );

  const indexOfLastStudent =
    currentPage * studentsPerPage;

  const indexOfFirstStudent =
    indexOfLastStudent - studentsPerPage;

  const currentStudents = filteredStudents.slice(
    indexOfFirstStudent,
    indexOfLastStudent
  );

  // SEARCH CHANGE
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1);
  };

  // FILTER CHANGE
  const handleFilterChange = (e) => {
    setGenderFilter(e.target.value);
    setCurrentPage(1);
  };

  return (
    <div className="students-page">
      <div className="page-heading">
        <h1>Student Management</h1>

        <p>
          Add, update, and manage registered students.
        </p>
      </div>

      <div className="student-form-card">
        <h2>
          {editingId !== null
            ? "Edit Student"
            : "Register New Student"}
        </h2>

        <form onSubmit={handleSubmit}>

  {/* Top Row */}
  <div className="student-form-grid">

  <div className="student-section">

<h3 className="section-title">
  <FiCamera />
  Student Photo
</h3>

<div className="photo-upload-wrapper">

  <div className="photo-circle">
    {photoPreview ? (
      <img
        src={photoPreview}
        alt="Student"
      />
    ) : (
      <span>
        {student.first_name
          ? student.first_name.charAt(0).toUpperCase()
          : "ST"}
      </span>
    )}
  </div>

  <div className="photo-upload-info">

    <label className="upload-btn">
      Choose Photo

      <input
        type="file"
        hidden
        accept="image/*"
        onChange={handlePhotoChange}
      />
    </label>

    <small>JPG, PNG • Maximum 5 MB</small>

  </div>

</div>

</div>

<div className="student-section">

  <h3 className="section-title">
    <FiUser />
    Personal Information
  </h3>

  <div className="section-grid">

    <div className="form-group">
      <label>Student ID</label>
      <input
        type="text"
        placeholder="Generated Automatically"
value={student.student_id}
        readOnly
      />
    </div>

    <div className="form-group">
      <label>Status</label>
      <select
        name="status"
        value={student.status}
        onChange={handleChange}
      >
        <option value="Active">Active</option>
        <option value="Inactive">Inactive</option>
      </select>
    </div>

    <div className="form-group">
      <label>First Name</label>
      <input
        type="text"
        name="first_name"
        value={student.first_name}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Last Name</label>
      <input
        type="text"
        name="last_name"
        value={student.last_name}
        onChange={handleChange}
        required
      />
    </div>

    <div className="form-group">
      <label>Gender</label>
      <select
        name="gender"
        value={student.gender}
        onChange={handleChange}
      >
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>
    </div>

    <div className="form-group">
      <label>Date of Birth</label>
      <input
        type="date"
        name="date_of_birth"
        value={student.date_of_birth}
        onChange={handleChange}
      />
    </div>

  </div>
</div>
</div>

<div className="student-section full-card">
  <h3 className="section-title">
    <FiPhone />
    Contact Information
  </h3>

  <div className="section-grid">

    <div className="form-group">
      <label>Email</label>
      <input
        type="email"
        name="email"
        value={student.email}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Phone</label>
      <input
        type="text"
        name="phone"
        value={student.phone}
        onChange={handleChange}
      />
    </div>

    <div className="form-group full-width">
      <label>Address</label>
      <textarea
        name="address"
        rows="3"
        value={student.address}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>Department</label>
      <input
        type="text"
        name="department"
        value={student.department}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>City</label>
      <input
        type="text"
        name="city"
        value={student.city}
        onChange={handleChange}
      />
    </div>

    <div className="form-group">
      <label>State</label>
      <input
        type="text"
        name="state"
        value={student.state}
        onChange={handleChange}
      />
    </div>

  </div>
</div>

<div className="student-section full-card">
  <h3 className="section-title">
    <FiBookOpen />
    Academic Information
  </h3>

  <div className="section-grid">

    <div className="form-group">
      <label>Course</label>
      <select
        name="course"
        value={student.course}
        onChange={handleChange}
      >
        <option value="">Select Course</option>
        <option value="BCA">BCA</option>
        <option value="BBA">BBA</option>
        <option value="B.Tech">B.Tech</option>
        <option value="MBA">MBA</option>
        <option value="MCA">MCA</option>
      </select>
    </div>

    <div className="form-group">
      <label>Semester</label>
      <select
        name="semester"
        value={student.semester}
        onChange={handleChange}
      >
        <option value="">Select Semester</option>
        <option value="1">Semester 1</option>
        <option value="2">Semester 2</option>
        <option value="3">Semester 3</option>
        <option value="4">Semester 4</option>
        <option value="5">Semester 5</option>
        <option value="6">Semester 6</option>
        <option value="7">Semester 7</option>
        <option value="8">Semester 8</option>
      </select>
    </div>

  </div>
</div>

  <div className="form-actions">

    <button type="submit">
      {editingId !== null
        ? "Update Student"
        : "Register Student"}
    </button>

    {editingId !== null && (
      <button
        type="button"
        onClick={handleCancelEdit}
      >
        Cancel Edit
      </button>
    )}

  </div>

</form>

      </div>

      <div className="students-table-card">
        <h2>Registered Students</h2>

        <div className="student-toolbar">

  <div className="search-box">

    <FiSearch />

    <input
      type="text"
      placeholder="Search students..."
      value={searchTerm}
      onChange={handleSearchChange}
    />

  </div>

  <div className="toolbar-actions">

    <div className="filter-box">

      <FiFilter />

      <select
        value={genderFilter}
        onChange={handleFilterChange}
      >
        <option value="All">All Genders</option>
        <option value="Male">Male</option>
        <option value="Female">Female</option>
        <option value="Other">Other</option>
      </select>

    </div>

    <button
      className="add-student-btn"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: "smooth",
        })
      }
    >
      <FiPlus />
      Add Student
    </button>

  </div>

</div>

        {filteredStudents.length === 0 ? (
          <p>No matching students found.</p>
        ) : (
          <>
            <table>
            <thead>
  <tr>
    <th>ID</th>
    <th>Student</th>
    <th>Gender</th>
    <th>Actions</th>
  </tr>
</thead>

<tbody>
  {currentStudents.map((s) => {
    const initials = `${s.first_name?.charAt(0) || ""}${s.last_name?.charAt(0) || ""}`;

    return (
      <tr key={s.id}>
        <td>{s.student_id}</td>

        <td>
          <div className="student-profile">

          <div className="student-avatar">

{s.profile_photo ? (

  <img
    src={`${API_URL}/${s.profile_photo}`}
    alt={`${s.first_name} ${s.last_name}`}
  />

) : (

  initials.toUpperCase()

)}

</div>

            <div className="student-details">
              <strong>
                {s.first_name} {s.last_name}
              </strong>

              <span>{s.email}</span>
            </div>

          </div>
        </td>

        <td>
          <span
            className={`gender-badge ${s.gender.toLowerCase()}`}
          >
            {s.gender}
          </span>
        </td>

        <td>

          <div className="action-buttons">

          <button
  className="edit-btn"
  type="button"
  onClick={() => handleEdit(s)}
>
  <FiEdit2 />
</button>

            {isAdmin && (
              <button
              className="delete-btn"
              type="button"
              onClick={() => handleDelete(s.id)}
            >
              <FiTrash2 />
            </button>
            )}

          </div>

        </td>
      </tr>
    );
  })}
</tbody>
            </table>

            <div className="pagination">

  <button
    className="page-btn"
    type="button"
    disabled={currentPage === 1}
    onClick={() => setCurrentPage(page => page - 1)}
  >
    ← Previous
  </button>

  <div className="page-info">
    Page <strong>{currentPage}</strong> of <strong>{totalPages}</strong>
  </div>

  <button
    className="page-btn"
    type="button"
    disabled={currentPage === totalPages}
    onClick={() => setCurrentPage(page => page + 1)}
  >
    Next →
  </button>

</div>
          </>
        )}
      </div>
    </div>
  );
}

export default Students;