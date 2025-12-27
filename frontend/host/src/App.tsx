import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom/client";
import Login from "auth/Login";
import Register from "auth/Register";
import TaskManager from "tasks/TaskManager";

import "./index.css";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [authView, setAuthView] = useState<"login" | "register">("login");

  useEffect(() => {
    if (localStorage.getItem("token")) setIsLoggedIn(true);
  }, []);

  const onLogin = () => setIsLoggedIn(true);
  const onLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAuthView("login");
  };

  return (
    <div style={{ minHeight: "100vh", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif", background: "#f4f7f6" }}>
      
      <nav style={{ 
          background: "#2c3e50", 
          color: "white", 
          padding: "1rem 2rem", 
          display: "flex", 
          justifyContent: "space-between",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)"
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "1.5rem" }}>⚡</span>
            <h1 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 600 }}>SOA App</h1>
        </div>
        
        {isLoggedIn && (
            <button 
                onClick={onLogout}
                style={{
                    background: "transparent",
                    border: "1px solid rgba(255,255,255,0.3)",
                    color: "white",
                    padding: "8px 16px",
                    borderRadius: "4px",
                    cursor: "pointer",
                    transition: "all 0.2s"
                }}
            >
                Logout
            </button>
        )}
      </nav>

      <div style={{ 
          flex: 1, 
          display: "flex", 
          justifyContent: "center",
          paddingTop: "50px",
          paddingBottom: "50px"
      }}>
        <div style={{ width: "100%", maxWidth: "900px", padding: "0 20px" }}>
            {!isLoggedIn ? (
              authView === "login" ? (
                <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <Login onLoginSuccess={onLogin} onSwitchToRegister={() => setAuthView("register")} />
                </div>
              ) : (
                <div style={{ maxWidth: "400px", margin: "0 auto" }}>
                    <Register onRegisterSuccess={() => setAuthView("login")} onSwitchToLogin={() => setAuthView("login")} />
                </div>
              )
            ) : (
              <TaskManager />
            )}
        </div>
      </div>
    </div>
  );
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");
const root = ReactDOM.createRoot(rootElement);
root.render(<App />);