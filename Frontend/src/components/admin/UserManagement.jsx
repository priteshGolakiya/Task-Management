import { useState, useEffect } from "react";
import axios from "axios";
import UserForm from "./UserForm.jsx";
import UserList from "./UserList.jsx";
import styles from "./UserManagement.module.css";
import toast from "react-hot-toast";

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("userForm");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://127.0.0.1:5000/users/");
      setUsers(response.data || []);
      setLoading(false);
    } catch (error) {
      setError("Error fetching users");
      setLoading(false);
    }
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setActiveTab("userForm");
  };

  const handleTabChange = (tabName) => {
    setActiveTab(tabName);
  };

  const handleDeleteUser = async (userId) => {
    console.log("userId in delet", userId);
    setLoading(true);
    try {
      await axios.delete(`http://127.0.0.1:5000/users/${userId}`);
      toast.success("Delet User  successfully!");
      fetchUsers();
      setLoading(false);
    } catch (error) {
      console.error("Error deleting user:", error);
      setError("Error deleting user. Please try again.");
      setLoading(false);
      throw new Error("Error deleting user");
    }
  };

  return (
    <div className={styles.container}>
      <h2>{activeTab === "userForm" ? "User From" : "User List"}</h2>
      <div className="tabs">
        <button
          className={activeTab === "userForm" ? "active" : ""}
          onClick={() => handleTabChange("userForm")}
        >
          Add User
        </button>
        <button
          className={activeTab === "userList" ? "active" : ""}
          onClick={() => handleTabChange("userList")}
        >
          User List
        </button>
      </div>
      {error && <div className={styles.error}>{error}</div>}
      {loading ? (
        <div className={styles.loading}>Loading...</div>
      ) : (
        <>
          {activeTab === "userForm" && (
            <UserForm
              editingUserId={editingUserId}
              setEditingUserId={setEditingUserId}
              fetchUsers={fetchUsers} // Pass fetchUsers function
              setUsers={setUsers}
              users={users}
            />
          )}
          {activeTab === "userList" && (
            <UserList
              users={users}
              handleEditUser={handleEditUser}
              handleDeleteUser={handleDeleteUser}
              fetchUsers={fetchUsers} // Pass fetchUsers function
            />
          )}
        </>
      )}
    </div>
  );
};

export default UserManagement;
