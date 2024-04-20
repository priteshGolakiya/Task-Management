/* eslint-disable no-undef */
import { useState, useEffect } from "react";
import axios from "axios";
import "./TodoApp.css";

const TodoApp = () => {
  const [todos, setTodos] = useState([]);
  const [editIndex, setEditIndex] = useState(-1);
  const [todoText, setTodoText] = useState("");
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTodos();
  }, []);

  const fetchTodos = async () => {
    try {
      const response = await axios.get("http://127.0.0.1:5000/admin/");
      setTodos(response.data.todos); // Assuming API returns todos array
    } catch (error) {
      console.error("Error fetching todos:", error.message);
    }
  };

  const addOrUpdateTodo = async () => {
    if (todoText.trim() !== "") {
      const currentDate = new Date();
      const newTodo = {
        text: todoText,
        completed: false,
        date: currentDate.toLocaleString(),
      };

      if (editIndex === -1) {
        try {
          await axios.post("http://127.0.0.1:5000/admin/", newTodo);
          fetchTodos(); // Refresh todos after adding
        } catch (error) {
          console.error("Error adding todo:", error.message);
        }
      } else {
        try {
          await axios.put(`http://127.0.0.1:5000/admin/${todos[editIndex]._id}`, newTodo);
          fetchTodos(); // Refresh todos after updating
        } catch (error) {
          console.error("Error updating todo:", error.message);
        }
        setEditIndex(-1);
      }

      setTodoText("");
    }
  };

  const deleteTodo = async (id) => {
    try {
      await axios.delete(`http://127.0.0.1:5000/admin/${id}`);
      fetchTodos(); // Refresh todos after deletion
    } catch (error) {
      console.error("Error deleting todo:", error.message);
    }
  };

  const searchTodo = async () => {
    if (searchQuery.trim() !== "") {
      try {
        const response = await axios.get(`http://127.0.0.1:5000/admin/?search=${searchQuery}`);
        setTodos(response.data.todos); // Update todos based on search results
      } catch (error) {
        console.error("Error searching todos:", error.message);
      }
    } else {
      fetchTodos(); // Reload all todos if search query is empty
    }
  };

  return (
    <div className="todo-app">
      <form className="input-section" onSubmit={(e) => { e.preventDefault(); addOrUpdateTodo(); }}>
        <input
          type="text"
          placeholder="Add item..."
          value={todoText}
          onChange={(e) => setTodoText(e.target.value)}
        />
        <button type="submit" className="add">
          {editIndex === -1 ? "Add" : "Update"}
        </button>
        <input
          type="text"
          placeholder="Search"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
        <button type="button" onClick={searchTodo}>
          Search
        </button>
      </form>
      <div className="todos">
        <ul className="todo-list">
          {todos.map((todo, index) => (
            <li key={todo._id}>
              <input
                type="checkbox"
                checked={todo.completed}
                onChange={() => toggleTodoCompleted(todo._id)}
              />
              <span className="todo-text">{`${todo.text} (${todo.date})`}</span>
              <span className="span-button" onClick={() => deleteTodo(todo._id)}>
                <i className="fa-solid fa-trash"></i>
              </span>
              <span className="span-button" onClick={() => editTodo(index)}>
                <i className="fa-solid fa-pen"></i>
              </span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TodoApp;
