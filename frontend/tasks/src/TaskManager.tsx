import React, { useEffect, useState } from "react";

interface Task {
  id: number;
  title: string;
  description: string;
  status: string;
}

const TaskManager: React.FC = () => {
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [error, setError] = useState<string>("");

  const token = localStorage.getItem("token");

  // --- Functie Helper pentru Culori ---
  const getStatusColor = (status: string) => {
    switch (status) {
      case "PENDING": return "red";        // Rosu
      case "IN_PROGRESS": return "orange"; // Portocaliu
      case "DONE": return "green";    // Verde
      default: return "#333";
    }
  };

  const fetchTasks = async () => {
    try {
      const res = await fetch("http://localhost/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.ok) {
        const data: Task[] = await res.json();
        setTasks(data.sort((a, b) => a.id - b.id));
      }
    } catch (error) {
      console.error(error);
    }
  };

  const createTask = async () => {
    if (!title.trim()) {
      setError("Titlul este obligatoriu!");
      return;
    }
    setError("");

    try {
      await fetch("http://localhost/tasks", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ 
            title, 
            description: description || "Fără descriere"
        }),
      });

      setTitle("");
      setDescription("");
      fetchTasks();
    } catch (e) {
      console.error("Eroare la creare task", e);
    }
  };

  const updateTaskStatus = async (task: Task, newStatus: string) => {
    try {
      await fetch(`http://localhost/tasks/${task.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          title: task.title,
          description: task.description,
          status: newStatus, 
        }),
      });
      fetchTasks();
    } catch (e) {
      console.error("Eroare la update", e);
    }
  };

  const deleteTask = async (id: number) => {
    if (!window.confirm("Ești sigur că vrei să ștergi acest task?")) return;

    try {
        const res = await fetch(`http://localhost/tasks/${id}`, {
            method: "DELETE",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (res.ok) fetchTasks();
        else alert("Nu ai permisiunea să ștergi acest task!");
    } catch (e) {
        console.error("Eroare la stergere", e);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  return (
    <div style={{ border: "1px solid #007bff", padding: "20px", margin: "10px", borderRadius: "8px", maxWidth: "800px" }}>
      <h2 style={{color: "#333"}}>📝 Task Manager</h2>

      {/* Formular Adaugare */}
      <div style={{ background: "#f9f9f9", padding: "15px", borderRadius: "5px", marginBottom: "20px" }}>
        <div style={{ display: "flex", gap: "10px", marginBottom: "10px", flexWrap: "wrap" }}>
          <input
            value={title}
            onChange={(e) => { setTitle(e.target.value); setError(""); }}
            placeholder="Titlu Task..."
            style={{ padding: "8px", flex: "1 1 200px", border: error ? "1px solid red" : "1px solid #ccc" }}
          />
          <input
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Descriere..."
            style={{ padding: "8px", flex: "2 1 300px", border: "1px solid #ccc" }}
          />
          <button 
            onClick={createTask} 
            style={{ padding: "8px 20px", background: "#28a745", color: "white", border: "none", cursor: "pointer", borderRadius: "4px" }}
          >
            Adaugă
          </button>
        </div>
        {error && <small style={{ color: "red" }}>{error}</small>}
      </div>

      {/* Lista Task-uri */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {tasks.map((t) => (
          <li 
            key={t.id} 
            style={{ 
                display: "flex", 
                justifyContent: "space-between", 
                alignItems: "center",
                background: "#fff",
                borderBottom: "1px solid #eee",
                padding: "15px 10px",
                gap: "15px"
            }}
          >
            <div style={{ flex: 1 }}>
              <div style={{fontWeight: "bold", fontSize: "1.1em"}}>#{t.id} {t.title}</div>
              <div style={{ fontSize: "0.9em", color: "#666" }}>{t.description}</div>
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                {/* --- DROPDOWN STATUS COLORAT --- */}
                <select
                  value={t.status}
                  onChange={(e) => updateTaskStatus(t, e.target.value)}
                  style={{
                    padding: "6px",
                    borderRadius: "4px",
                    border: "1px solid #ccc",
                    cursor: "pointer",
                    fontWeight: "bold",
                    // Aici setam culoarea textului selectat in functie de valoarea curenta a task-ului
                    color: getStatusColor(t.status), 
                    outline: "none"
                  }}
                >
                  <option value="PENDING" style={{ color: "red", fontWeight: "bold" }}>
                    PENDING ⏳
                  </option>
                  <option value="IN_PROGRESS" style={{ color: "orange", fontWeight: "bold" }}>
                    IN PROGRESS 🔨
                  </option>
                  <option value="DONE" style={{ color: "green", fontWeight: "bold" }}>
                    DONE ✅
                  </option>
                </select>

                <button 
                    onClick={() => deleteTask(t.id)}
                    title="Șterge Task"
                    style={{
                        background: "#dc3545",
                        color: "white",
                        border: "none",
                        borderRadius: "4px",
                        padding: "6px 10px",
                        cursor: "pointer",
                        fontSize: "1.1em"
                    }}
                >
                    🗑️
                </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskManager;