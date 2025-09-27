
// // import React, { useEffect, useState } from "react";
// // import axios from "axios";

// // const TaskList = () => {
// //   const [tasks, setTasks] = useState([]);
// //   const [userId, setUserId] = useState(null);

// //   useEffect(() => {
// //     const token = localStorage.getItem("token");
// //     if (!token) return;

// //     // decode userId from token or get from API
// //     const payload = JSON.parse(atob(token.split(".")[1]));
// //     setUserId(payload.id);

// //     const fetchTasks = async () => {
// //       try {
// //         const res = await axios.get("http://localhost:5000/api/tasks", {
// //           headers: { Authorization: `Bearer ${token}` },
// //         });
// //         setTasks(res.data);
// //       } catch (err) {
// //         console.error("Failed to fetch tasks", err);
// //       }
// //     };

// //     fetchTasks();
// //   }, []);

// //   return (
// //     <div>
// //       <h3>Task List</h3>
// //       <ul>
// //         {tasks.map(t => (
// //           <li key={t._id}>
// //             <strong>{t.title}</strong> - {t.description} <br />
// //             ⏰ {t.scheduleAt ? new Date(t.scheduleAt).toLocaleString() : "N/A"} <br />
// //             👤 Assigned to: {t.assignedTo 
// //                 ? t.assignedTo._id === t.user._id ? "Self" : t.assignedTo.username 
// //                 : "N/A"} <br />
// //             📝 Created by: {t.user.username}
// //           </li>
// //         ))}
// //       </ul>
// //     </div>
// //   );
// // };

// // export default TaskList;
// import React from "react";

// const TaskList = ({ tasks }) => {
//   if (!tasks || tasks.length === 0) return <p>No tasks found.</p>;

//   return (
//     <div>
//       <h3>Task List</h3>
//       <ul>
//         {tasks.map((t) => (
//           <li key={t._id}>
//             <strong>{t.title}</strong> - {t.description || "No description"} <br />
//             🕒 {t.scheduleAt ? new Date(t.scheduleAt).toLocaleString() : "N/A"} <br />
//             🔄 {t.recurrence || "once"} <br />
//             👤 Assigned to: {t.assignedTo?.username || "Self"} <br />
//             📌 Created by: {t.user?.username || "Unknown"}
//           </li>
//         ))}
//       </ul>
//     </div>
//   );
// };

// export default TaskList;
// import React from "react";

// const TaskList = ({ tasks }) => {
//   if (!tasks || tasks.length === 0) return <p>No tasks available.</p>;

//   return (
//     <div className="row">
//       {tasks.map(task => (
//         <div className="col-md-6" key={task._id}>
//           <div className="card card-task p-3 mb-3">
//             <h5>{task.title}</h5>
//             <p>{task.description}</p>
//             <p><strong>Scheduled:</strong> {task.scheduleAt ? new Date(task.scheduleAt).toLocaleString() : "N/A"}</p>
//             <p>
//               <strong>Assigned To:</strong> {task.assignedTo?.username || task.user?.username || "Self"}
//             </p>
//             <span className={`task-status ${task.status}`}>{task.status}</span>
//           </div>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default TaskList;


import React from "react";
import { Pencil, Trash } from "react-bootstrap-icons"; // or any icon library

const TaskList = ({ tasks, onEdit, onDelete }) => {
  if (!tasks || tasks.length === 0) return <p>No tasks available.</p>;

  return (
    <div className="row">
      {tasks.map(task => (
        <div className="col-md-6" key={task._id}>
          <div className="card card-task p-3 mb-3">
            <h5>{task.title}</h5>
            <p>{task.description}</p>
            <p>
              <strong>Scheduled:</strong>{" "}
              {task.scheduleAt ? new Date(task.scheduleAt).toLocaleString() : "N/A"}
            </p>
            <p>
              <strong>Assigned To:</strong> {task.assignedTo?.username || task.user?.username || "Self"}
            </p>
            <span className={`task-status ${task.status}`}>{task.status}</span>

            {/* Icon buttons */}
            <div className="mt-2 d-flex gap-2">
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => onEdit(task)}
                title="Edit task"
              >
                <Pencil size={16} />
              </button>
              <button
                className="btn btn-outline-danger btn-sm"
                onClick={() => onDelete(task._id)}
                title="Delete task"
              >
                <Trash size={16} />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default TaskList;
