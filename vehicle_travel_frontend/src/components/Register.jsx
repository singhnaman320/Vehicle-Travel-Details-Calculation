import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import travelLogo from "../assets/travel_logo.png";
import { Link } from "react-router-dom";

const Register = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await axios.post("/api/auth/register", { username, password, email });
      navigate("/");
    } catch (error) {
      console.error("Registration failed", error);
    }
  };

  return (
    <div class="wrapper">
      <div class="logo">
        <img src={travelLogo} alt="" />
      </div>
      {/* <div class="text-center mt-4 name">Register</div> */}
      <form onSubmit={handleRegister} className="p-3 mt-3">
        <div class="form-field d-flex align-items-center">
          <span class="far fa-user"></span>
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
        <div class="form-field d-flex align-items-center">
          <span class="fas fa-envelope"></span>
          <input
            type="email"
            placeholder="email"
            name="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
        </div>
        <div class="form-field d-flex align-items-center">
          <span class="fas fa-key"></span>
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
        <button type="submit" className="btn mt-3">
          Register
        </button>
      </form>
      <div class="text-center fs-6">
        <p>
          Already a user, Login here <Link to="/">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
