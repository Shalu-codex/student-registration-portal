import { StrictMode } from "react";
import { createRoot } from "react-dom/client";

import "./index.css";
import "./styles/globals.css";
import "./styles/sidebar.css";
import "./styles/layout.css";
import "./styles/dashboard.css";
import "./styles/students.css";
import "./styles/darkmode.css";
import "./styles/settings.css";

import App from "./App.jsx";
import "./styles/animations.css";

import { ThemeProvider } from "./context/ThemeContext";

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </StrictMode>
);