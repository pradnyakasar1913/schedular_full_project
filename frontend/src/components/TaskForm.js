
// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const TaskForm = ({ onTaskCreated, isAdmin }) => {
//   const [users, setUsers] = useState([]);
//   const [title, setTitle] = useState("");
//   const [description, setDescription] = useState("");
//   const [scheduleTime, setScheduleTime] = useState("");
//   const [recurrence, setRecurrence] = useState("once");
//   const [selectedUser, setSelectedUser] = useState("");

//   useEffect(() => {
//     if (!isAdmin) return;

//     const fetchUsers = async () => {
//       try {
//         const token = localStorage.getItem("token");
//         if (!token) return;

//         const res = await axios.get("http://localhost:5000/api/users", {
//           headers: { Authorization: `Bearer ${token}` },
//         });

//         const clients = Array.isArray(res.data)
//           ? res.data.filter((u) => u.role === "client")
//           : [];
//         setUsers(clients);
//       } catch (err) {
//         console.error("Failed to fetch users:", err);
//       }
//     };
//     fetchUsers();
//   }, [isAdmin]);

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     const token = localStorage.getItem("token");
//     if (!token) return alert("You must log in!");

//     const payload = { title, description, scheduleTime, recurrence };
//     if (isAdmin && selectedUser) payload.assignedTo = selectedUser;

//     try {
//       await axios.post("http://localhost:5000/api/tasks", payload, {
//         headers: { Authorization: `Bearer ${token}` },
//       });

//       setTitle("");
//       setDescription("");
//       setScheduleTime("");
//       setRecurrence("once");
//       setSelectedUser("");

//       onTaskCreated(); // refresh task list
//     } catch (err) {
//       console.error(err);
//       alert(err.response?.data?.message || "Failed to create task");
//     }
//   };

//   return (
//     <form onSubmit={handleSubmit}>
//       <input type="text" placeholder="Title" value={title} onChange={(e) => setTitle(e.target.value)} required />
//       <textarea placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} required />
//       <input type="datetime-local" value={scheduleTime} onChange={(e) => setScheduleTime(e.target.value)} />
//       <select value={recurrence} onChange={(e) => setRecurrence(e.target.value)}>
//         <option value="once">Once</option>
//         <option value="daily">Daily</option>
//         <option value="weekly">Weekly</option>
//       </select>

//       {isAdmin && users.length > 0 && (
//         <select value={selectedUser} onChange={(e) => setSelectedUser(e.target.value)} required>
//           <option value="">Select Client</option>
//           {users.map((u) => <option key={u._id} value={u._id}>{u.username}</option>)}
//         </select>
//       )}

//       <button type="submit">Create Task</button>
//     </form>
//   );
// };

// export default TaskForm;
import React, { useState } from "react";
import axios from "axios";

const TaskForm = ({ user, users, onTaskCreated }) => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [scheduleTime, setScheduleTime] = useState("");
  const [recurrence, setRecurrence] = useState("once");
  const [selectedUser, setSelectedUser] = useState("");

  const isAdmin = user?.role === "admin";
  const token = localStorage.getItem("token");

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !description || !scheduleTime) return;

    const payload = { title, description, scheduleTime, recurrence };
    if (isAdmin && selectedUser) payload.assignedTo = selectedUser;

    try {
      await axios.post("http://localhost:5000/api/tasks", payload, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setTitle(""); setDescription(""); setScheduleTime(""); setRecurrence("once"); setSelectedUser("");
      onTaskCreated();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Failed to create task");
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label className="form-label">Title</label>
        <input type="text" className="form-control" value={title} onChange={e => setTitle(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Description</label>
        <textarea className="form-control" value={description} onChange={e => setDescription(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Schedule Date & Time</label>
        <input type="datetime-local" className="form-control" value={scheduleTime} onChange={e => setScheduleTime(e.target.value)} required />
      </div>

      <div className="mb-3">
        <label className="form-label">Recurrence</label>
        <select className="form-select" value={recurrence} onChange={e => setRecurrence(e.target.value)}>
          <option value="once">Once</option>
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
        </select>
      </div>

      {isAdmin && users.length > 0 && (
        <div className="mb-3">
          <label className="form-label">Assign to Client</label>
          <select className="form-select" value={selectedUser} onChange={e => setSelectedUser(e.target.value)} required>
            <option value="">Select Client</option>
            {users.map(u => <option key={u._id} value={u._id}>{u.username}</option>)}
          </select>
        </div>
      )}

      <button type="submit" className="btn btn-primary">Create Task</button>
    </form>
  );
};

export default TaskForm;
