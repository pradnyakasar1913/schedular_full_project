import React from "react";
import TaskForm from "./TaskForm";
import TaskList from "./TaskList";

const AdminDashboard = () => {
  const [refresh, setRefresh] = React.useState(false);

  const handleTaskCreated = () => {
    setRefresh((prev) => !prev); // trigger task list refresh
  };

  return (
    <div>
      <h1>Admin Dashboard</h1>
      <TaskForm onTaskCreated={handleTaskCreated} isAdmin={true} />
      <TaskList key={refresh} isAdmin={true} />
    </div>
  );
};

export default AdminDashboard;
