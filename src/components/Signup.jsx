import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export default function Signup({ onSignup, onSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const nav = useNavigate();

  const submit = (e) => {
    e.preventDefault();
    const cleaned = username.trim();
    if (!cleaned) return alert("Enter username");
    const res = onSignup(cleaned, password);
    if (res.ok) {
      onSuccess(cleaned);
      nav("/");
    } else {
      alert(res.message || "Signup failed");
    }
  };

  return (
    <div className="auth-card">
      <h2>Create account</h2>
      <form onSubmit={submit}>
        <label>Username</label>
        <input value={username} onChange={e => setUsername(e.target.value)} required />
        <label>Password</label>
        <input value={password} onChange={e => setPassword(e.target.value)} type="password" required />
        <div style={{ display: "flex", gap: 8, marginTop: 12 }}>
          <button className="btn" type="submit">Create account</button>
          <Link to="/login" className="btn secondary">Login</Link>
        </div>
      </form>
    </div>
  );
}
