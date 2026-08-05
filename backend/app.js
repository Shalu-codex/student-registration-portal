const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const morgan = require("morgan");
const path = require("path");

const authRoutes = require("./routes/authRoutes");
const studentRoutes = require("./routes/studentRoutes");

console.log(path.join(__dirname, "uploads"));

const app = express();

//app.use(helmet());

app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan("dev"));

app.get("/api/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Student Registration Portal API is running",
  });
});

// Serve uploaded student photos
const uploadPath = path.resolve(__dirname, "uploads");

console.log("Upload Path:",uploadPath);

app.use("/uploads", express.static(uploadPath));

// Authentication routes
app.use("/api/auth", authRoutes);

// Student CRUD routes
app.use("/students", studentRoutes);

module.exports = app;
