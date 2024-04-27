import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import Modal from "../modal/Modal";
import { TokenContext } from "../../TokenContext";
import styles from "./TodoManagement.module.css";

const TodoManagement = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [task, setTask] = useState({
    email: "",
    title: "",
    description: "",
    priority: "high",
  });
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");

  const options = [
    { value: "all", label: "All" },
    { value: "high", label: "High" },
    { value: "medium", label: "Medium" },
    { value: "low", label: "Low" },
  ];

  const status = [
    { value: "all", label: "All" },
    { value: "todo", label: "Todo" },
    { value: "in-progress", label: "In Progress" },
    { value: "completed", label: "Completed" },
  ];
  const [selectedOption, setSelectedOption] = useState(options[0]); // Default to "All"
  const { token } = useContext(TokenContext);
  const [todos, setTodos] = useState([]);
  const [filteredTodos, setFilteredTodos] = useState([]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
      setFilteredTodos(response.data); // Initialize filteredTodos with all todos
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTask = async () => {
    if (!task.title || !task.email)
      return toast.error("Please fill out all fields");

    // Convert priority to lowercase
    const taskData = {
      ...task,
      priority: task.priority.toLowerCase(),
    };

    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/admin/",
        { task: taskData }, // Use taskData with lowercase priority
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log("Task created successfully:", response.data);
      fetchTodos();
      toast.success(`Task Created Successfully for ${task.email}`);
      setTask({
        email: "",
        title: "",
        description: "",
        priority: "High",
      });
    } catch (error) {
      console.error("Error creating task:", error);
      toast.error("Something went wrong! Please try again later.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setTask((prevTask) => ({
      ...prevTask,
      [name]: value,
    }));
  };

  const deleteTodo = async (id) => {
    console.log("Deleting todo with id ", id);
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      toast.success("Task Deleted Successfully");
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error.message);
      toast.error("Failed to delete the task!");
    }
  };

  const editTodo = async (id) => {
    const editedTask = todos.find((todo) => todo._id === id);
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
        `http://127.0.0.1:5000/admin/${selectedTask._id}`,
        selectedTask,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      console.log(res.data);
      fetchTodos(); // Fetch updated data
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

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
    filterTasks(e.target.value, selectedStatus);
  };

  const handleSelectStatusChange = (selectedOption) => {
    setSelectedStatus(selectedOption.value);
    filterTasks(searchTerm, selectedOption.value);
  };

  const filterTasks = (search, status) => {
    let filteredTasks = todos.filter((task) => {
      return (
        (task.userName.toLowerCase().includes(search.toLowerCase()) ||
          task.userEmail.toLowerCase().includes(search.toLowerCase())) &&
        (status === "all" || task.status === status)
      );
    });
    setFilteredTodos(filteredTasks);
  };

  return (
    <div className={styles.todoApp}>
      <form
        className={styles.inputSection}
        onSubmit={(e) => {
          e.preventDefault();
          createTask();
        }}
      >
        <div className={styles.formGroup}>
          <label htmlFor="email">Email:</label>
          <input
            type="text"
            placeholder="Email"
            name="email"
            value={task.email}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="title">Title:</label>
          <input
            type="text"
            placeholder="Title"
            name="title"
            value={task.title}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="description">Description:</label>
          <input
            type="text"
            placeholder="Description"
            name="description"
            value={task.description}
            onChange={handleChange}
          />
        </div>
        <div className={styles.formGroup}>
          <label htmlFor="priority">Priority:</label>
          <select
            name="priority"
            className={styles.selector}
            value={task.priority}
            onChange={handleChange}
          >
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button type="submit" className={styles.add}>
          Add Task
        </button>
      </form>

      <div className={styles.todos}>
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
              <option value="all">All</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <div className={styles.searchBar}>
              <div className={styles.formGroup}>
                <label htmlFor="searchbar">Search:</label>
                <input
                  type="text"
                  placeholder="Search by User Name or Email"
                  value={searchTerm}
                  onChange={handleSearch}
                />
              </div>
              <h3>Filter Task With Status :-</h3>
              <select
                className={styles.selector}
                value={selectedStatus}
                onChange={(e) =>
                  handleSelectStatusChange({
                    value: e.target.value,
                    label: e.target.value,
                  })
                }
              >
                {status.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          </h3>

          <table className={styles.todoTable}>
            <thead>
              <tr>
                <th>No.</th>
                <th>User Name</th>
                <th>User Email</th>
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
                  <td>{todo.userName}</td>
                  <td>{todo.userEmail}</td>
                  <td>{todo.title}</td>
                  <td>{todo.description}</td>
                  <td>{todo.priority}</td>
                  <td>{todo.status}</td>
                  <td>
                    <button
                      className={styles.editButton}
                      onClick={() => editTodo(todo._id)}
                    >
                      <i className="fa-solid fa-pen-to-square"></i>
                    </button>
                    <button
                      className={styles.deleteButton}
                      onClick={() => deleteTodo(todo._id)}
                    >
                      <i className="fa-solid fa-trash"></i>
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
                  <label htmlFor="title">Title:</label>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    value={selectedTask?.title || ""}
                    onChange={handleInputChange}
                  />
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="description">Description:</label>
                  <textarea
                    rows="4"
                    cols="50"
                    id="description"
                    name="description"
                    value={selectedTask?.description || ""}
                    onChange={handleInputChange}
                  ></textarea>
                </div>
                <div className={styles.formGroup}>
                  <label htmlFor="status">Status:</label>
                  <select
                    className={styles.selector}
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
                  <label htmlFor="priority">Priority:</label>
                  <select
                    className={styles.selector}
                    id="priority"
                    name="priority"
                    value={selectedTask?.priority || ""}
                    onChange={handleInputChange}
                  >
                    <option value="high">High</option>
                    <option value="medium">Medium</option>
                    <option value="low">Low</option>
                  </select>
                </div>
                <div className={styles.formGroup}>
                  <button type="submit">Submit</button>
                </div>
              </form>
            </div>
          )}
        </Modal>
      </div>
    </div>
  );
};

export default TodoManagement;
