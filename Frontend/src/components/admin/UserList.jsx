/* eslint-disable no-unused-vars */
/* eslint-disable react/prop-types */
import { useState } from "react";
import styles from "./UserManagement.module.css";
import Modal from "../modal/Modal";
import axios from "axios";
import toast from "react-hot-toast";

const UserList = (props) => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const { fetchUsers } = props;

  const openModal = (user) => {
    setSelectedUser(user);
    setName(user.name);
    setEmail(user.email);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.put(
        `http://127.0.0.1:5000/users/${selectedUser._id}`,
        { name, email }
      );
      fetchUsers();
      toast.success("User  updated successfully!");
      // You can add a success message or handle the UI update as needed
      closeModal(); // Close the modal after successful update
    } catch (error) {
      console.error("Error updating user:", error);
      toast.error("Error updating user:");
      // Handle errors or show an error message
    }
  };

  const { users, handleDeleteUser } = props;

  if (users.length === 0) {
    return (
      <div className={styles.userListContainer}>
        <h3>User List</h3>
        <p>No users found</p>
      </div>
    );
  }

  return (
    <div className={styles.userListContainer}>
      <h3>User List</h3>
      <table className={styles.userTable}>
        <thead>
          <tr>
            <th>Number</th>
            <th>Name</th>
            <th>Email</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.data.map((user, index) => (
            <tr key={user._id} className={styles.userRow}>
              <td>{index + 1}</td>
              <td>{user.name}</td>
              <td>{user.email}</td>

              <td>
                <button
                  className={styles.editButton}
                  onClick={() => openModal(user)}
                >
                  <i className="fa-solid fa-pen-to-square"></i>
                </button>
                <button
                  className={styles.deleteButton}
                  onClick={() => handleDeleteUser(user._id)}
                >
                  <i className="fa-solid fa-trash"></i>
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <Modal isOpen={isOpen} onClose={closeModal}>
        {isOpen && (
          <div className={styles["modal-comp"]}>
            <div className={styles["modal-content"]}>
              <button className={styles["close-button"]} onClick={closeModal}>
                <i className="fa-solid fa-x"></i>{" "}
              </button>
              <h2>Edit User</h2>
              <form className={styles["modal-form"]} onSubmit={handleSubmit}>
                <div>
                  <label htmlFor="name">Name:</label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={handleNameChange}
                    required
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    type="email"
                    id="email"
                    value={email}
                    onChange={handleEmailChange}
                    required
                  />
                </div>
                <button type="submit">Submit</button>
              </form>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default UserList;
