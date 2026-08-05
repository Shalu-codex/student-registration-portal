import "../App.css";

import { useState } from "react";
  import { useNavigate, Link } from "react-router-dom";
  import axios from "axios";
import toast from "react-hot-toast";
  
  const API_URL = "http://localhost:5000";
  
  function Login() {
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);
  
    const [form, setForm] = useState({
      email: "",
      password: "",
    });
  
    const handleChange = (e) => {
      setForm({
        ...form,
        [e.target.name]: e.target.value,
      });
    };
  
    const handleSubmit = async (e) => {
      e.preventDefault();
    
      setLoading(true);
    
      try {
        const res = await axios.post(
          `${API_URL}/api/auth/login`,
          form
        );
    
        localStorage.setItem("token", res.data.token);
    
        localStorage.setItem(
          "user",
          JSON.stringify(res.data.user)
        );
    
        toast.success(res.data.message);
    
        navigate("/dashboard");
      } catch (err) {
        console.error("Login error:", err);
    
        toast.error(
          err.response?.data?.message ||
            "Login failed"
        );
      } finally {
        setLoading(false);
      }
    };
  
    return (
      <div className="auth-page">
        <div className="auth-card">
  
          <h1>Student Registration Portal</h1>
  
          <h2>Login</h2>
  
          <form onSubmit={handleSubmit}>
  
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
  
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={form.password}
              onChange={handleChange}
              required
            />
  
            <button type="submit" disabled={loading}>
  {loading ? "Logging in..." : "Login"}
</button>
  
          </form>
  
          <p>
            Don't have an account?
          </p>
  
          <Link to="/register">
            Create Account
          </Link>
  
        </div>
      </div>
    );
  }
  
  export default Login;