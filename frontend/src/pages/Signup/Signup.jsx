import { useState } from "react";
import "./Signup.css";
import axios from '../../utils/axios'
import { useNavigate } from "react-router-dom";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      await axios.post("/auth/signup", {
        name,
        email,
        password,
      });

      navigate("/modes");

    } catch (err) {
      const message =
        err.response?.data?.message ||
        "Signup failed";

      setError(message);
    }

  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        
        <h1 className="auth-title">Create account</h1>
        <p className="auth-subtitle">
          Start a new investigation
        </p>

        {error && (
          <p className="auth-error">{error}</p>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />

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
            Sign up
          </button>
        </form>

        <div className="auth-footer">
          <span>Already have an account?</span>
          <a href="/login">Login</a>
        </div>

      </div>
    </div>
  );
};

export default Signup;