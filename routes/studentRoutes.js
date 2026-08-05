const express = require("express");

const {
  getStudents,
  addStudent,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentController");

const authMiddleware = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware");
const uploadStudentPhoto = require("../middlewares/uploadStudentPhoto");

const router = express.Router();

router.use(authMiddleware);

router.get("/", authorizeRoles("admin", "staff"), getStudents);
router.post(
  "/",
  authorizeRoles("admin", "staff"),
  uploadStudentPhoto.single("profile_photo"),
  addStudent
);

router.put(
  "/:id",
  authorizeRoles("admin", "staff"),
  uploadStudentPhoto.single("profile_photo"),
  updateStudent
);

// ADMIN ONLY
router.delete("/:id", authorizeRoles("admin"), deleteStudent);

module.exports = router;