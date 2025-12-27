import React, { useState } from "react";

interface RegisterProps {
  onRegisterSuccess: () => void;
  onSwitchToLogin: () => void;
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string>("");

  const handleRegister = async () => {
    if (!username || !password) {
      setError("All fields are required.");
      return;
    }

    try {
      const response = await fetch("http://localhost/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Account created successfully! You can now log in.");
        onRegisterSuccess();
      } else {
        setError("Registration error (possibly existing user).");
      }
    } catch (e) {
      console.error("Register error", e);
      setError("Server unavailable.");
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
        <span style={{ fontSize: "3rem" }}>👤</span>
        <h2 style={{ color: "#2c3e50", margin: "10px 0 0 0" }}>Create Account</h2>
        <p style={{ color: "#777", fontSize: "0.9rem" }}>It only takes a few seconds.</p>
      </div>

      <div style={{ textAlign: "left" }}>
        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>New Username</label>
        <input
          placeholder="Choose a username"
          value={username}
          onChange={(e) => { setUsername(e.target.value); setError(""); }}
          style={inputStyle}
        />

        <label style={{ display: "block", marginBottom: "5px", fontWeight: "bold", color: "#555" }}>New Password</label>
        <input
          type="password"
          placeholder="Choose a strong password"
          value={password}
          onChange={(e) => { setPassword(e.target.value); setError(""); }}
          style={inputStyle}
        />
      </div>

      {error && <div style={{ color: "#dc3545", marginBottom: "15px", fontSize: "0.9rem", fontWeight: "bold" }}>{error}</div>}

      <button
        onClick={handleRegister}
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
        Register
      </button>

      <div style={{ borderTop: "1px solid #eee", paddingTop: "20px", fontSize: "0.95rem" }}>
        Already have an account?{" "}
        <span
          onClick={onSwitchToLogin}
          style={{ color: "#007bff", cursor: "pointer", fontWeight: "bold" }}
          onMouseOver={(e) => (e.currentTarget.style.textDecoration = "underline")}
          onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
        >
          Log in here
        </span>
      </div>
    </div>
  );
};

export default Register;