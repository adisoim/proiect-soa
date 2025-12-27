import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [error, setError] = useState("");
  const token = localStorage.getItem("token");

  const colors = {
    PENDING: "#6c757d",
    IN_PROGRESS: "#ffc107",
    DONE: "#28a745"
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return colors.PENDING;
      case "IN_PROGRESS": return colors.IN_PROGRESS;
      case "DONE": return colors.DONE;
      default: return "#333";
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost/tasks", { headers: { Authorization: `Bearer ${token}` } });
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data.sort((a, b) => a.id - b.id));
      }
    } catch (e) { console.error(e); }
  };

  const createTask = async () => {
    if (!title.trim()) { setError("Title is required"); return; }
    setError("");
    await fetch("http://localhost/tasks", {
      method: "POST", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title, description: description || "No description" })
    });
    setTitle(""); setDescription(""); fetchTasks();
  };

  const updateTaskStatus = async (task: Task, newStatus: string) => {
    await fetch(`http://localhost/tasks/${task.id}`, {
      method: "PUT", headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
      body: JSON.stringify({ title: task.title, description: task.description, status: newStatus })
    });
    fetchTasks();
  };

  const deleteTask = async (id: number) => {
    if (!window.confirm("Delete?")) return;
    await fetch(`http://localhost/tasks/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
    fetchTasks();
  };

  useEffect(() => { fetchTasks(); }, []);

  return (
    <div style={{
      background: "white",
      borderRadius: "12px",
      boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
      padding: "30px",
      width: "100%"
    }}>
      <div style={{ display: "flex", alignItems: "center", marginBottom: "25px", borderBottom: "2px solid #f0f0f0", paddingBottom: "15px" }}>
        <span style={{ fontSize: "1.8rem", marginRight: "10px" }}>📋</span>
        <h2 style={{ margin: 0, color: "#2c3e50" }}>Task Manager</h2>
      </div>

      <div style={{ display: "flex", gap: "15px", marginBottom: "30px", alignItems: "flex-start" }}>
        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: "10px" }}>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(""); }}
            placeholder="Task title..."
            style={{
              padding: "12px", borderRadius: "6px", border: error ? "1px solid red" : "1px solid #ddd",
              fontSize: "1rem", outline: "none", width: "100%", boxSizing: "border-box"
            }}
          />
          {error && <small style={{ color: "red" }}>{error}</small>}
        </div>

        <input
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description..."
          style={{
            padding: "12px", borderRadius: "6px", border: "1px solid #ddd",
            fontSize: "1rem", outline: "none", flex: 2
          }}
        />

        <button
          onClick={createTask}
          style={{
            padding: "12px 25px", background: "#28a745", color: "white", border: "none",
            borderRadius: "6px", cursor: "pointer", fontWeight: "bold", fontSize: "1rem",
            boxShadow: "0 2px 5px rgba(40, 167, 69, 0.3)"
          }}
        >
          Add
        </button>
      </div>

      <ul style={{ listStyle: "none", padding: 0, display: "flex", flexDirection: "column", gap: "15px" }}>
        {tasks.map((t) => (
          <li key={t.id} style={{
            background: "#fff", border: "1px solid #eee", borderRadius: "8px", padding: "20px",
            display: "flex", justifyContent: "space-between", alignItems: "center",
            boxShadow: "0 2px 5px rgba(0,0,0,0.02)", transition: "transform 0.1s"
          }}>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "700", fontSize: "1.1rem", color: "#333", marginBottom: "5px" }}>
                #{t.id} {t.title}
              </div>
              <div style={{ color: "#777", fontSize: "0.95rem" }}>{t.description}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "15px" }}>
              <div style={{ position: "relative" }}>
                <select
                  value={t.status}
                  onChange={(e) => updateTaskStatus(t, e.target.value)}
                  style={{
                    padding: "8px 12px",
                    borderRadius: "20px",
                    border: `2px solid ${getStatusColor(t.status)}`,
                    color: getStatusColor(t.status),
                    fontWeight: "bold",
                    cursor: "pointer",
                    background: "white",
                    outline: "none"
                  }}
                >
                  <option value="PENDING" style={{ color: colors.PENDING, fontWeight: "bold" }}>
                    ⏳ PENDING
                  </option>
                  <option value="IN_PROGRESS" style={{ color: colors.IN_PROGRESS, fontWeight: "bold" }}>
                    🔨 IN PROGRESS
                  </option>
                  <option value="DONE" style={{ color: colors.DONE, fontWeight: "bold" }}>
                    ✅ DONE
                  </option>
                </select>
              </div>

              <button
                onClick={() => deleteTask(t.id)}
                style={{
                  background: "#dc3545", color: "white", border: "none", borderRadius: "6px",
                  width: "35px", height: "35px", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center"
                }}
                title="Delete Task"
              >
                🗑️
              </button>
            </div>
          </li>
        ))}
      </ul>

      {tasks.length === 0 && (
        <div style={{ textAlign: "center", padding: "40px", color: "#999" }}>
          You have no tasks at the moment!
        </div>
      )}
    </div>
  );
};

export default TaskManager;