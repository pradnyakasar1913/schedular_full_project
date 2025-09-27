

// // // export default Dashboard;
// // import React, { useState, useEffect } from "react";
// // import axios from "axios";
// // import TaskForm from "./TaskForm";

// // const Dashboard = ({ onLogout }) => {
// //   const [tasks, setTasks] = useState([]);
// //   const [users, setUsers] = useState([]);
// //   const [role, setRole] = useState(localStorage.getItem("role") || "client");

// //   const fetchTasks = async () => {
// //     const token = localStorage.getItem("token");
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/tasks", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setTasks(res.data);
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   const fetchUsers = async () => {
// //     if (role !== "admin") return;
// //     const token = localStorage.getItem("token");
// //     try {
// //       const res = await axios.get("http://localhost:5000/api/users", {
// //         headers: { Authorization: `Bearer ${token}` },
// //       });
// //       setUsers(res.data); // backend returns array directly
// //     } catch (err) {
// //       console.error(err);
// //     }
// //   };

// //   useEffect(() => {
// //     fetchTasks();
// //     fetchUsers();
// //   }, []);

// //   return (
// //     <div style={{ padding: "20px" }}>
// //       <h2>Dashboard ({role})</h2>
// //       <button onClick={onLogout}>Logout</button>

// //       {/* Task creation form */}
// //       <TaskForm onTaskCreated={fetchTasks} users={users} isAdmin={role === "admin"} />

// //       <h3>Tasks</h3>
// //       {tasks.length === 0 ? (
// //         <p>No tasks found.</p>
// //       ) : (
// //         <ul>
// //           {tasks.map((task) => (
// //             <li key={task._id}>
// //               {task.title} – {task.status} – Assigned to: {task.assignedToName || "N/A"}
// //             </li>
// //           ))}
// //         </ul>
// //       )}
// //     </div>
// //   );
// // };

// // export default Dashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import TaskForm from "./TaskForm";
// import TaskList from "./TaskList";

// const Dashboard = ({ onLogout }) => {
//   const [tasks, setTasks] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [role, setRole] = useState(localStorage.getItem("role") || "client");
//   const [username, setUsername] = useState(localStorage.getItem("username") || "User");
//   const token = localStorage.getItem("token");

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/tasks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTasks(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchUsers = async () => {
//     if (role !== "admin") return;
//     try {
//       const res = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchUsers();
//   }, []);

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>Dashboard ({role}) – {username}</h2>
//       <button onClick={onLogout}>Logout</button>

//       <TaskForm onTaskCreated={fetchTasks} users={users} isAdmin={role === "admin"} />

//       <TaskList tasks={tasks} />
//     </div>
//   );
// };

// export default Dashboard;
// import React, { useState, useEffect } from "react";
// import axios from "axios";
// import TaskForm from "./TaskForm";
// import TaskList from "./TaskList";

// const Dashboard = ({ onLogout }) => {
//   const [tasks, setTasks] = useState([]);
//   const [users, setUsers] = useState([]);
//   const [role, setRole] = useState(localStorage.getItem("role") || "client");
//   const [username, setUsername] = useState(localStorage.getItem("username") || "User");
//   const token = localStorage.getItem("token");

//   const fetchTasks = async () => {
//     try {
//       const res = await axios.get("http://localhost:5000/api/tasks", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setTasks(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchUsers = async () => {
//     if (role !== "admin") return;
//     try {
//       const res = await axios.get("http://localhost:5000/api/users", {
//         headers: { Authorization: `Bearer ${token}` },
//       });
//       setUsers(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   useEffect(() => {
//     fetchTasks();
//     fetchUsers();
//   }, []);

//   return (
//     <div className="container mt-4">
//       <div className="d-flex justify-content-between align-items-center mb-4">
//         <h2>Dashboard - {username} ({role})</h2>
//         <button className="btn btn-danger" onClick={onLogout}>Logout</button>
//       </div>

//       <div className="card p-4 mb-4 shadow-sm">
//         <h4>Create New Task</h4>
//         <TaskForm user={{ role, username, id: localStorage.getItem("userId") }} users={users} onTaskCreated={fetchTasks} />
//       </div>

//       <div>
//         <h4>Tasks</h4>
//         <TaskList tasks={tasks} />
//       </div>
//     </div>
//   );
// };

// export default Dashboard;
import React, { useState, useEffect } from "react";
import axios from "axios";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";
import EditTaskModal from "./EditTaskModal"; // new modal component

const Dashboard = ({ onLogout }) => {
  const [tasks, setTasks] = useState([]);
  const [users, setUsers] = useState([]);
  const [role, setRole] = useState(localStorage.getItem("role") || "client");
  const [username, setUsername] = useState(localStorage.getItem("username") || "User");
  const [editingTask, setEditingTask] = useState(null); // track which task is being edited
  const token = localStorage.getItem("token");

  const fetchTasks = async () => {
    try {
      const res = await axios.get("http://localhost:5000/api/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTasks(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchUsers = async () => {
    if (role !== "admin") return;
    try {
      const res = await axios.get("http://localhost:5000/api/users", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  // Edit task
  const handleEdit = async (taskId, updatedData) => {
    try {
      await axios.put(`http://localhost:5000/api/tasks/${taskId}`, updatedData, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // refresh tasks
    } catch (err) {
      console.error("Edit task error:", err);
    }
  };

  // Delete task
  const handleDelete = async (taskId) => {
    if (!window.confirm("Are you sure you want to delete this task?")) return;
    try {
      await axios.delete(`http://localhost:5000/api/tasks/${taskId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchTasks(); // refresh tasks
    } catch (err) {
      console.error("Delete task error:", err);
    }
  };

  useEffect(() => {
    fetchTasks();
    fetchUsers();
  }, []);

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Dashboard - {username} ({role})</h2>
        <button className="btn btn-danger" onClick={onLogout}>Logout</button>
      </div>

      <div className="card p-4 mb-4 shadow-sm">
        <h4>Create New Task</h4>
        <TaskForm 
          user={{ role, username, id: localStorage.getItem("userId") }} 
          users={users} 
          onTaskCreated={fetchTasks} 
        />
      </div>

      <div>
        <h4>Tasks</h4>
        <TaskList
          tasks={tasks}
          onEdit={(task) => setEditingTask(task)} // open modal
          onDelete={handleDelete}
        />
      </div>

      {/* Edit Task Modal */}
      {editingTask && (
        <EditTaskModal
          task={editingTask}
          onClose={() => setEditingTask(null)}
          onSave={(updatedData) => handleEdit(editingTask._id, updatedData)}
        />
      )}
    </div>
  );
};

export default Dashboard;
