import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Login({ onLogin, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const res = onLogin(username.trim(), password);
    if (res.ok) {
      onSuccess(username.trim());
      nav("/");
    } else {
      alert(res.message || "Login failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Login</h2>
      <form onSubmit={submit}>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn" type="submit">Login</button>
          <Link to="/signup" className="btn secondary">Sign up</Link>
        </div>
      </form>
    </div>
  );
}
