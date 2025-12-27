import React, { useState } from "react";

interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUser] = useState<string>("");
  const [password, setPass] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleLogin = async () => {
    try {
      const response = await fetch("http://localhost/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        localStorage.setItem("token", data.token);
        onLoginSuccess();
      } else {
        setError("User or password incorrect!");
      }
    } catch (e) {
      console.error("Login error", e);
      setError("Unavailable at the moment.");
    }
  };

  const inputStyle = {
    width: "100%",
    padding: "12px",
    marginBottom: "15px",
    border: "1px solid #ddd",
    borderRadius: "6px",
    fontSize: "1rem",
    boxSizing: "border-box" as const,
    outline: "none"
  };

  return (
    <div style={{
      background: "white",
      padding: "40px",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      textAlign: "center",
      width: "100%",
      maxWidth: "400px"
    }}>
      <div style={{ marginBottom: "20px" }}>
        <span style={{ fontSize: "3rem" }}>🔐</span>
        <h2 style={{ color: "#2c3e50", margin: "10px 0 0 0" }}>Welcome back!</h2>
        <p style={{ color: "#777", fontSize: "0.9rem" }}>Please log in.</p>
      </div>

      <div style={{ textAlign: "left" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>Username</label>
        <input
          placeholder="ex: student"
          value={username}
          onChange={(e) => { setUser(e.target.value); setError(""); }}
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>Password</label>
        <input
          type="password"
          placeholder="••••••"
          value={password}
          onChange={(e) => { setPass(e.target.value); setError(""); }}
          style={inputStyle}
          onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
        />
      </div>

      {error && <div style={{ color: "#dc3545", marginBottom: "15px", fontSize: "0.9rem", fontWeight: "bold" }}>{error}</div>}

      <button
        onClick={handleLogin}
        style={{
          width: "100%",
          padding: "12px",
          background: "#28a745",
          color: "white",
          border: "none",
          borderRadius: "6px",
          fontSize: "1.1rem",
          fontWeight: "bold",
          cursor: "pointer",
          marginBottom: "20px",
          boxShadow: "0 2px 5px rgba(40, 167, 69, 0.3)"
        }}
      >
        Log In
      </button>

      <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", fontSize: "0.95rem" }}>
        Don't have an account?{" "}
        <span
          onClick={onSwitchToRegister}
          style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold", textDecoration: "none" }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Register here
        </span>
      </div>
    </div>
  );
};

export default Login;