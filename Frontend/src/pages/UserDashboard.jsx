import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../components/modal/Modal";
import { TokenContext } from "../../src/TokenContext";
import styles from "../components/admin/TodoManagement.module.css";

const UserDashboard = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  const options = [
    { value: "all", label: "All" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]);
  const { token } = useContext(TokenContext);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/tasks/users", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (Array.isArray(response.data.data)) {
        setTodos(response.data.data);
        setFilteredTodos(response.data.data);
      } else {
        console.error("Invalid response data format");
      }
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const editTodo = async (id) => {
    const editedTask = todos.find((todo) => {
      return todo._id === id;
    });

    if (!editedTask) {
      console.error("Task not found for editing.");
      return;
    }
    setSelectedTask(editedTask);
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.put(
        `http://127.0.0.1:5000/tasks/users/${selectedTask._id}`,
        { ...selectedTask, status: selectedTask.status },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      fetchTodos();
      toast.success("Task Updated Successfully");
      closeModal();
    } catch (err) {
      console.error("Failed to update the Task:", err);
      toast.error("Failed to update the Task. Please try again.");
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSelectedTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const handleSelectChange = (selectedOption) => {
    setSelectedOption(selectedOption);

    if (selectedOption.value === "all") {
      setFilteredTodos(todos);
    } else {
      const filteredTasks = todos.filter((task) => {
        return task.priority === selectedOption.value;
      });
      setFilteredTodos(filteredTasks);
    }
  };

  return (
    <div className={styles.todoApp}>
      <div className={styles.todosContainer}>
        <h2>Todo List</h2>
        <div className={styles.todoList}>
          <h3>
            Filtered Tasks With Priority:-
            <select
              className={styles.selector}
              value={selectedOption.value}
              onChange={(e) =>
                handleSelectChange({
                  value: e.target.value,
                  label: e.target.value,
                })
              }
            >
              {options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </h3>

          <table className={styles.todoTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>Title</th>
                <th>Description</th>
                <th>Priority</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredTodos?.map((todo, index) => (
                <tr
                  key={todo._id}
                  className={`${styles.todoItem} ${
                    todo.status === "completed" ? styles.completedStatus : ""
                  }`}
                >
                  <td>{index + 1}</td>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>{todo.priority}</td>
                  {/* Apply conditional class for completed status */}
                  <td className={`${styles.statusColumn}`}>{todo.status}</td>
                  <td>
                    <button
                      className={`${styles.editButton} edit-button`}
                      onClick={() => editTodo(todo._id)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Modal isOpen={isOpen} onClose={closeModal}>
          {isOpen && (
            <div className={styles.formContainer}>
              <button className={styles.closeButton} onClick={closeModal}>
                <i className="fa-solid fa-x"></i>
              </button>
              <h2>Edit Task</h2>
              <form onSubmit={handleEditSubmit}>
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status:</label>
                  <select
                    id="status"
                    name="status"
                    value={selectedTask?.status || ""}
                    onChange={handleInputChange}
                  >
                    <option value="todo">Todo</option>
                    <option value="in-progress">In Progress</option>
                    <option value="completed">Completed</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <button type="submit" className={styles.submitButton}>
                    Submit
                  </button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default UserDashboard;
