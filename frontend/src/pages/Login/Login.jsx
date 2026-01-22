import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import axios from '../../utils/axios'

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");
    
    try {
      await axios.post("/auth/login", {
        email,
        password,
      });

      navigate("/modes");

    } catch (err) {
      
      const message =
        err.response?.data?.message ||
        "Login failed";

      setError(message);
    }

  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-title">Welcome back</h1>
        <p className="auth-subtitle">
          Continue your investigation
        </p>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />

          <button type="submit" className="auth-button">
            Login
          </button>
        </form>

        <div className="auth-footer">
          <span>Don’t have an account?</span>
          <a href="/signup">Sign up</a>
        </div>
      </div>
    </div>
  );
};

export default Login;