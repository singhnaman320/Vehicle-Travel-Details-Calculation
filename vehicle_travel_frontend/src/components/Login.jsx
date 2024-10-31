import React, { useState } from "react";
import axios from "axios";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import travelLogo from "../assets/travel_logo.png";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("/api/auth/login", {
        username,
        password,
      });
      // Pass both token and userId to `login`
      login(response.data.token, response.data.userId);
      navigate("/upload");
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  return (
    <div className="wrapper">
      <div className="logo">
        <img src={travelLogo} alt="no image found" />
      </div>
      {/* <div className="text-center mt-4 name">Login</div> */}
      <form onSubmit={handleLogin} className="p-3 mt-3">
        <div className="form-field d-flex align-items-center">
          <span className="far fa-user"></span>
          <input
            type="text"
            placeholder="Username"
            name="userName"
            id="userName"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div className="form-field d-flex align-items-center">
          <span className="fas fa-key"></span>
          <input
            type="password"
            placeholder="Password"
            name="password"
            id="pwd"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button className="btn mt-3" type="submit">
          Login
        </button>
      </form>
      <div class="text-center fs-6">
        <p>
          New user, Register here <Link to="/register">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
