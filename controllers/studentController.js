const pool = require("../config/db");

// GET all students
const getStudents = async (req, res) => {
  try {
    const [students] = await pool.query(
      "SELECT * FROM students ORDER BY id DESC"
    );

    res.status(200).json(students);
  } catch (error) {
    console.error("Get students error:", error);

    res.status(500).json({
      message: "Error fetching students",
    });
  }
};

// ADD student
const addStudent = async (req, res) => {
  try {
    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      address,
      department,
      city,
      state,
      course,
      semester,
      status,
    } = req.body;

    // Generate Student ID
    const [rows] = await pool.query(`
      SELECT student_id
      FROM students
      ORDER BY id DESC
      LIMIT 1
    `);

    let student_id = "STU001";

    if (rows.length > 0 && rows[0].student_id) {
      const lastNumber = parseInt(
        rows[0].student_id.replace("STU", ""),
        10
      );

      student_id = `STU${String(lastNumber + 1).padStart(3, "0")}`;
    }

    // Uploaded image path
    const profile_photo = req.file
      ? `uploads/students/${req.file.filename}`
      : null;

    const [result] = await pool.query(
      `INSERT INTO students
      (
        student_id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        phone,
        address,
        department,
        city,
        state,
        course,
        semester,
        status,
        profile_photo
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        student_id,
        first_name,
        last_name,
        gender,
        date_of_birth,
        email,
        phone,
        address,
        department,
        city,
        state,
        course,
        semester,
        status || "Active",
        profile_photo,
      ]
    );

    res.status(201).json({
      message: "Student added successfully",
      student_id,
      id: result.insertId,
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE student
const updateStudent = async (req, res) => {
  try {
    const { id } = req.params;

    const {
      first_name,
      last_name,
      gender,
      date_of_birth,
      email,
      phone,
      address,
      department,
      city,
      state,
      course,
      semester,
      status,
    } = req.body;

    let profile_photo;

    if (req.file) {
      profile_photo = `uploads/students/${req.file.filename}`;

      await pool.query(
        `UPDATE students
         SET first_name=?,
             last_name=?,
             gender=?,
             date_of_birth=?,
             email=?,
             phone=?,
             address=?,
             department=?,
             city=?,
             state=?,
             course=?,
             semester=?,
             status=?,
             profile_photo=?
         WHERE id=?`,
        [
          first_name,
          last_name,
          gender,
          date_of_birth,
          email,
          phone,
          address,
          department,
          city,
          state,
          course,
          semester,
          status,
          profile_photo,
          id,
        ]
      );
    } else {
      await pool.query(
        `UPDATE students
         SET first_name=?,
             last_name=?,
             gender=?,
             date_of_birth=?,
             email=?,
             phone=?,
             address=?,
             department=?,
             city=?,
             state=?,
             course=?,
             semester=?,
             status=?
         WHERE id=?`,
        [
          first_name,
          last_name,
          gender,
          date_of_birth,
          email,
          phone,
          address,
          department,
          city,
          state,
          course,
          semester,
          status,
          id,
        ]
      );
    }

    res.status(200).json({
      message: "Student updated successfully",
    });
  } catch (error) {
    console.error("Update student error:", error);

    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE student
const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM students WHERE id = ?",
      [id]
    );

    res.status(200).json({
      message: "Student deleted successfully",
    });
  } catch (error) {
    console.error("Delete student error:", error);

    res.status(500).json({
      message: "Error deleting student",
    });
  }
};

module.exports = {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
};