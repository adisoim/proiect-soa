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
    if (localStorage.getItem("token")) {
      setIsLoggedIn(true);
    }
  }, []);

  const onLogin = () => {
    setIsLoggedIn(true);
  };

  const onLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    setAuthView("login");
  };

  return (
    <div className="container">
      <nav style={{ background: "#282c34", color: "white", padding: "15px", display: "flex", justifyContent: "space-between" }}>
        <h1 style={{margin: 0}}>SOA App</h1>
        {isLoggedIn && <button onClick={onLogout}>Logout</button>}
      </nav>

      <div style={{ padding: "20px", display: "flex", justifyContent: "center" }}>        
        {isLoggedIn ? (
          <TaskManager />
        ) : (
          authView === "login" ? (
            <Login 
                onLoginSuccess={onLogin} 
                onSwitchToRegister={() => setAuthView("register")}
            />
          ) : (
            <Register 
                onRegisterSuccess={() => setAuthView("login")}
                onSwitchToLogin={() => setAuthView("login")}
            />
          )
        )}
      </div>
    </div>
  );
};

const rootElement = document.getElementById("app");
if (!rootElement) throw new Error("Failed to find the root element");

const root = ReactDOM.createRoot(rootElement);

root.render(<App />);