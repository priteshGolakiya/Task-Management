// TodoApp.jsx
import { useState, useEffect, useContext, useCallback } from "react";
import axios from "axios";
import "./TodoApp.css";
import toast from "react-hot-toast";
import Modal from "../modal/Modal";
import { TokenContext } from "../../TokenContext";

const TodoApp = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [task, setTask] = useState({
    email: "",
    title: "",
    description: "",
    priority: "High",
  });
  const { token } = useContext(TokenContext);
  const [todos, setTodos] = useState([]);

  const fetchTodos = useCallback(async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setTodos(response.data);
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  }, [token]);

  useEffect(() => {
    fetchTodos();
  }, [fetchTodos]);

  const createTask = async () => {
    try {
      const response = await axios.post(
        "http://127.0.0.1:5000/admin/",
        { task },
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
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/${id}`);
      fetchTodos();
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const editTodo = (id) => {
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

  const handleEditSubmit = async (editedTask) => {
    try {
      const res = await axios.put(
        `http://127.0.0.1:5000/tasks/${editedTask._id}`,
        editedTask
      );
      console.log(res.data);
      fetchTodos();
      toast.info("Task Updated Successfully");
      closeModal();
    } catch (err) {
      console.error("Failed to update the Task:", err);
      toast.error("Failed to update the Task. Please try again.");
    }
  };

  return (
    <div className="todo-app">
      <form
        className="input-section"
        onSubmit={(e) => {
          e.preventDefault();
          createTask();
        }}
      >
        <input
          type="text"
          placeholder="Email"
          name="email"
          value={task.email}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Title"
          name="title"
          value={task.title}
          onChange={handleChange}
        />
        <input
          type="text"
          placeholder="Description"
          name="description"
          value={task.description}
          onChange={handleChange}
        />
        <select name="priority" value={task.priority} onChange={handleChange}>
          <option value="high">High</option>
          <option value="medium">Medium</option>
          <option value="low">Low</option>
        </select>
        <button type="submit" className="add">
          Add Task
        </button>
      </form>
      <div className="todos">
        <h2>Todo List</h2>
        <table>
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
            {todos?.map((todo, index) => (
              <tr key={todo._id}>
                <td>{index + 1}</td>
                <td>{todo.userName}</td>
                <td>{todo.userEmail}</td>
                <td>{todo.title}</td>
                <td>{todo.description}</td>
                <td>{todo.priority}</td>
                <td>{todo.status}</td>
                <td>
                  <button
                    className="edit-button"
                    onClick={() => editTodo(todo._id)}
                  >
                    <i className="fa-solid fa-pen-to-square"></i>
                  </button>
                  <button
                    className="delete-button"
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
          <div className="modal">
            <button className="close-button" onClick={closeModal}>
              <i className="fa-solid fa-x"></i>{" "}
            </button>
            <h2>Edit Task</h2>
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleEditSubmit(selectedTask);
              }}
            >
              {/* Input fields for editing task */}
              <button type="submit">Submit</button>
            </form>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default TodoApp;
