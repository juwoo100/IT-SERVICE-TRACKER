// frontend/src/components/Login.jsx

import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { login, register, getMe } from "../api/ticketAPI.js";

export default function Login() {
  const [mode, setMode] = useState("login"); // "login" | "signup"
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const isSignup = mode === "signup";

  // On page load, check whether the saved token is still valid
  useEffect(() => {
    if (!localStorage.getItem("token")) return;
    getMe()
      .then((data) => setUser(data.user))
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
      });
  }, []);

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const data = isSignup
        ? await register({ username, email, password })
        : await login({ email, password });

      localStorage.setItem("token", data.token);
      localStorage.setItem("username", data.user.username);
      setUser(data.user);
      navigate("/dashboard");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setUser(null);
    setUsername("");
    setEmail("");
    setPassword("");
    navigate("/login");
  }

  function toggleMode() {
    setMode(isSignup ? "login" : "signup");
    setError("");
  }

  if (user) {
    return (
      <div className="container">
        <p>
          Welcome,<b>{user.username}</b>
        </p>
        <button type="button" onClick={handleLogout}>
          Logout
        </button>
      </div>
    );
  }

  return (
    <div className="flex bg-yellow-300 rounded-md">
      <form onSubmit={handleSubmit} aria-labelledby="auth-heading">
        <h1 id="auth-heading">{isSignup ? "Sign up" : "Login"}</h1>

        {error && (
          <p role="alert" className="text-red-700">
            {error}
          </p>
        )}
        {isSignup && (
          <div>
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              autoComplete="username"
              required
              minLength={3}
              maxLength={15}
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
        )}

        <div>
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            autoComplete="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>

        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            autoComplete={isSignup ? "new-password" : "current-password"}
            required
            minLength={isSignup ? 8 : undefined}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <button type="submit" disabled={loading}>
          {loading ? "Please wait..." : isSignup ? "Create account" : "Login"}
        </button>

        <button type="button" onClick={toggleMode}>
          {isSignup ? "Have an account? Login" : "New here? Sign up"}
        </button>
      </form>
    </div>
  );
}
