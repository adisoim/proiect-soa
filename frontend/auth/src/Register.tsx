// auth/src/Register.tsx
import React, { useState } from "react";

interface RegisterProps {
  onRegisterSuccess: () => void; // Ne trimite la Login dupa succes
  onSwitchToLogin: () => void;   // Link "Ai deja cont?"
}

const Register: React.FC<RegisterProps> = ({ onRegisterSuccess, onSwitchToLogin }) => {
  const [username, setUsername] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [message, setMessage] = useState<string>("");

  const handleRegister = async () => {
    try {
      const response = await fetch("http://localhost/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        alert("Cont creat cu succes! Te rugăm să te loghezi.");
        onRegisterSuccess(); // Ne intoarcem la ecranul de Login
      } else {
        setMessage("Eroare la înregistrare.");
      }
    } catch (e) {
      console.error("Register error", e);
      setMessage("Server indisponibil.");
    }
  };

  return (
    <div style={{ border: "1px solid green", padding: "20px", margin: "10px", textAlign: "center" }}>
      <h2>🆕 Creează Cont</h2>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "300px", margin: "0 auto" }}>
        <input
          placeholder="Username nou"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          style={{ padding: "8px" }}
        />
        <input
          type="password"
          placeholder="Parolă nouă"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          style={{ padding: "8px" }}
        />
        <button onClick={handleRegister} style={{ padding: "8px", background: "green", color: "white", cursor: "pointer" }}>
          Înregistrează-te
        </button>
        
        {message && <p style={{ color: "red" }}>{message}</p>}
        
        <p style={{ fontSize: "0.9em", marginTop: "10px" }}>
          Ai deja cont? <span onClick={onSwitchToLogin} style={{ color: "blue", cursor: "pointer", textDecoration: "underline" }}>Loghează-te aici</span>
        </p>
      </div>
    </div>
  );
};

export default Register;