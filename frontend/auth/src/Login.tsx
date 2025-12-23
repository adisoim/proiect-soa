import React, { useState } from "react";

// Definim ce props primeste componenta
interface LoginProps {
  onLoginSuccess: () => void;
  onSwitchToRegister?: () => void;
}

const Login: React.FC<LoginProps> = ({ onLoginSuccess, onSwitchToRegister }) => {
  const [username, setUser] = useState<string>("");
  const [password, setPass] = useState<string>("");

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
        onLoginSuccess(); // TypeScript stie acum ca asta e o functie
      } else {
        alert("Login failed");
      }
    } catch (e) {
      console.error("Login error", e);
    }
  };

  return (
    <div style={{ border: "1px solid red", padding: "20px", margin: "10px" }}>
      <h2>🔐 Auth MFE (TS)</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        <input
          placeholder="User"
          value={username}
          onChange={(e) => setUser(e.target.value)}
        />
        <input
          type="password"
          placeholder="Pass"
          value={password}
          onChange={(e) => setPass(e.target.value)}
        />
        <button onClick={handleLogin}>Login</button>
      </div>
      <p style={{ marginTop: "15px", fontSize: "0.9em" }}>
            Nu ai cont?{" "}
            <span 
                onClick={onSwitchToRegister} 
                style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}
            >
                Înregistrează-te
            </span>
        </p>
    </div>
  );
};

export default Login;