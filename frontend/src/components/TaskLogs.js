import React, { useEffect, useState } from "react";
import axios from "axios";

const TaskLogs = ({ taskId, token }) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    const fetchLogs = async () => {
      const res = await axios.get(`http://localhost:5000/api/tasks/${taskId}/logs`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setLogs(res.data);
    };
    fetchLogs();
  }, [taskId, token]);

  return (
    <div>
      <h3>Task Logs</h3>
      <ul>
        {logs.map((log) => (
          <li key={log._id}>
            {new Date(log.executionTime).toLocaleString()} - {log.status} - {log.result}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskLogs;
