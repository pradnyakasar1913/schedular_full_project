
// import React, { useState } from "react";
// import Login from "./components/Login";
// import Register from "./components/Register";
// import Dashboard from "./components/Dashboard";

// const App = () => {
//   const [userLoggedIn, setUserLoggedIn] = useState(false);
//   const [showRegister, setShowRegister] = useState(false);

//   const handleLogin = () => setUserLoggedIn(true);
//   const handleLogout = () => setUserLoggedIn(false);

//   const handleSwitchToRegister = () => setShowRegister(true);
//   const handleSwitchToLogin = () => setShowRegister(false);

//   if (userLoggedIn) {
//     return <Dashboard onLogout={handleLogout} />;
//   }

//   return showRegister ? (
//     <Register onSwitchToLogin={handleSwitchToLogin} />
//   ) : (
//     <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
//   );
// };

// export default App;
import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";

const App = () => {
  const [userLoggedIn, setUserLoggedIn] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  // ✅ Check token in localStorage on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) setUserLoggedIn(true);
  }, []);

  const handleLogin = () => setUserLoggedIn(true);
  const handleLogout = () => {
    localStorage.clear(); // clear token and role
    setUserLoggedIn(false);
  };

  const handleSwitchToRegister = () => setShowRegister(true);
  const handleSwitchToLogin = () => setShowRegister(false);

  if (userLoggedIn) {
    return <Dashboard onLogout={handleLogout} />;
  }

  return showRegister ? (
    <Register onSwitchToLogin={handleSwitchToLogin} />
  ) : (
    <Login onLogin={handleLogin} onSwitchToRegister={handleSwitchToRegister} />
  );
};

export default App;
