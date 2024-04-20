import { useState } from "react";
import "./AdminPanel.css";
import UserManagement from "../components/admin/UserManagement";
import TodoManagement from "../components/admin/TodoManagement";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("users");

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  return (
    <div className="admin-panel">
      <div className="tabs">
        <button
          className={activeTab === "users" ? "active" : ""}
          onClick={() => handleTabChange("users")}
        >
          Users
        </button>
        <button
          className={activeTab === "todos" ? "active" : ""}
          onClick={() => handleTabChange("todos")}
        >
          Todos
        </button>
      </div>

      <div className="tab-content">
        {activeTab === "users" && <UserManagement />}
        {activeTab === "todos" && <TodoManagement />}
      </div>
    </div>
  );
};

export default AdminDashboard;
