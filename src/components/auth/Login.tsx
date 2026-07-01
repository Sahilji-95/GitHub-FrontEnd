import { PageHeader } from "@primer/react";
import { Button } from "@primer/react";
import "./auth.css";
import axios from "axios";
import { useAuth } from "../../authContext";

import { useState } from "react";

import logo from "/github-mark-white.svg";
import { Link } from "react-router-dom";

interface LoginForm {
  email: string;
  password: string;
}

interface LoginResponse {
  token: string;
  userId: string;
}

export default function Signup() {
  const [formData, setFormData] = useState<LoginForm>({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const { setCurrUser } = useAuth();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSignup = async (
    e: React.MouseEvent<HTMLButtonElement>,
  ): Promise<void> => {
    e.preventDefault();

    try {
      setLoading(true);
      const res = await axios.post<LoginResponse>("52.66.237.207:8080/login", {
        password: formData.password,
        email: formData.email,
      });

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("userId", res.data.userId);

      setCurrUser(res.data.userId);
      setLoading(false);

      window.location.href = "/";
    } catch (error) {
      console.error(error);
      alert("Login Failed!");
      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-logo-container">
        <img className="logo-login" src={logo} alt="Logo" />
      </div>

      <div className="login-box-wrapper">
        <div className="login-heading">
          <PageHeader>
            <PageHeader.TitleArea variant="large">
              <PageHeader.Title>Login</PageHeader.Title>
            </PageHeader.TitleArea>
          </PageHeader>
        </div>

        <div className="login-box">
          <div>
            <label className="label">Email</label>
            <input
              autoComplete="off"
              name="email"
              id="email"
              className="input"
              type="email"
              value={formData.email}
              onChange={handleChange}
            />
          </div>

          <div className="div">
            <label className="label">Password</label>
            <input
              autoComplete="off"
              name="password"
              id="password"
              className="input"
              type="password"
              value={formData.password}
              onChange={handleChange}
            />
          </div>

          <Button
            variant="primary"
            className="login-btn"
            disabled={loading}
            onClick={handleSignup}
          >
            {loading ? "Loading..." : "Login"}
          </Button>
        </div>

        <div className="pass-box">
          <p>
            Don't have an account? <Link to="/signup">Signup</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
