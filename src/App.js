import React, { useState } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";

function App() {
  const [isDarkTheme, setIsDarkTheme] = useState(false);
  const [todos, setTodos] = useState([]);
  const [newTodo, setNewTodo] = useState("");
  const [filter, setFilter] = useState("all");

  const toggleTheme = () => {
    setIsDarkTheme((prevTheme) => !prevTheme);
  };

  const handleInputChange = (e) => {
    setNewTodo(e.target.value);
  };

  const handleInputKeyPress = (e) => {
    if (e.key === "Enter") {
      addTodo();
    }
  };

  const addTodo = () => {
    if (newTodo.trim() === "") {
      return;
    }
    const newTodoItem = {
      id: Date.now(),
      text: newTodo,
      status: "active", // Initial status is set to "active"
    };
    setTodos([...todos, newTodoItem]);
    setNewTodo("");
  };

  const toggleStatus = (id) => {
    setTodos(
      todos.map((todo) =>
        todo.id === id
          ? {
              ...todo,
              status: todo.status === "active" ? "completed" : "active",
            }
          : todo
      )
    );
  };

  const deleteTodo = (id) => {
    setTodos(todos.filter((todo) => todo.id !== id));
  };

  const onDragEnd = (result) => {
    if (!result.destination) {
      return;
    }

    const reorderedTodos = Array.from(todos);
    const [removed] = reorderedTodos.splice(result.source.index, 1);
    reorderedTodos.splice(result.destination.index, 0, removed);

    setTodos(reorderedTodos);
  };

  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") {
      return todo.status === "active";
    }
    if (filter === "completed") {
      return todo.status === "completed";
    }
    return true; // Show all todos when the filter is "all"
  });

  const handleFilterClick = (selectedFilter) => {
    setFilter(selectedFilter);
  };

  const clearCompletedTodos = () => {
    const activeTodos = todos.filter((todo) => todo.status === "active");
    setTodos(activeTodos);
  };

  const countActiveTodos = () => {
    return todos.filter((todo) => todo.status === "active").length;
  };

  return (
    <>
      <div className={`container ${isDarkTheme ? "dark-theme" : ""}`}>
        <header></header>
        <div className="app">
          <div className="app-title">
            <h1>todo</h1>
            <div className="theme-choice" onClick={toggleTheme}></div>
          </div>

          <div className="input-container">
            <div
              className={`input-circle ${newTodo.length > 0 ? "enabled" : ""}`}
              onClick={addTodo}
            ></div>
            <input
              type="text"
              placeholder="Create a new todo..."
              value={newTodo}
              onChange={handleInputChange}
              onKeyPress={handleInputKeyPress}
            />
          </div>

          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable droppableId="todos">
              {(provided) => (
                <div
                  className="todo-list"
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                >
                  {filteredTodos.map((todo, index) => (
                    <Draggable
                      key={todo.id}
                      draggableId={todo.id.toString()}
                      index={index}
                    >
                      {(provided) => (
                        <div
                          className={`todo-item ${
                            todo.status === "completed" ? "completed" : ""
                          }`}
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                        >
                          <div className="left">
                            <div
                              className={`todo-circle ${
                                todo.status === "completed" ? "active" : ""
                              }`}
                              onClick={() => toggleStatus(todo.id)}
                            ></div>
                            <div className="todo-text">{todo.text}</div>
                          </div>
                          <div
                            className="right"
                            onClick={() => deleteTodo(todo.id)}
                          >
                            <svg
                              className="todo-delete"
                              xmlns="http://www.w3.org/2000/svg"
                              width="18"
                              height="18"
                            >
                              <path
                                fill="#494C6B"
                                fillRule="evenodd"
                                d="M16.97 0l.708.707L9.546 8.84l8.132 8.132-.707.707-8.132-8.132-8.132 8.132L0 16.97l8.132-8.132L0 .707.707 0 8.84 8.132 16.971 0z"
                              />
                            </svg>
                          </div>
                        </div>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </div>
              )}
            </Droppable>
          </DragDropContext>
          {todos.length > 0 && (
            <div className="todo-info">
              <div className="todo-info-left">
                {countActiveTodos()} items left
              </div>
              <div className="todo-info-middle">
                <span
                  className={`sort-all ${
                    filter === "all" && filteredTodos.length > 0
                      ? "active-info"
                      : ""
                  }`}
                  onClick={() => handleFilterClick("all")}
                >
                  All
                </span>
                <span
                  className={`sort-active ${
                    filter === "active" && filteredTodos.length > 0
                      ? "active-info"
                      : ""
                  }`}
                  onClick={() => handleFilterClick("active")}
                >
                  Active
                </span>
                <span
                  className={`sort-completed ${
                    filter === "completed" && filteredTodos.length > 0
                      ? "active-info"
                      : ""
                  }`}
                  onClick={() => handleFilterClick("completed")}
                >
                  Completed
                </span>
              </div>
              <div
                className="todo-clear-completed"
                onClick={clearCompletedTodos}
              >
                Clear completed
              </div>
            </div>
          )}
        </div>

        {todos.length > 0 && (
          <div className="todo-info-mobile">
            <span
              className={`sort-all ${
                filter === "all" && filteredTodos.length > 0
                  ? "active-info"
                  : ""
              }`}
              onClick={() => handleFilterClick("all")}
            >
              All
            </span>
            <span
              className={`sort-active ${
                filter === "active" && filteredTodos.length > 0
                  ? "active-info"
                  : ""
              }`}
              onClick={() => handleFilterClick("active")}
            >
              Active
            </span>
            <span
              className={`sort-completed ${
                filter === "completed" && filteredTodos.length > 0
                  ? "active-info"
                  : ""
              }`}
              onClick={() => handleFilterClick("completed")}
            >
              Completed
            </span>
          </div>
        )}
        {todos.length > 1 && <footer>Drag and drop to reorder list</footer>}
      </div>

      <div className="attribution">
        Challenge by{" "}
        <a href="https://www.frontendmentor.io?ref=challenge" target="_blank">
          Frontend Mentor
        </a>
        . Coded by{" "}
        <a
          href="https://www.frontendmentor.io/profile/vonjytahina"
          target="_blank"
        >
          Vonjy Tahina CHAN
        </a>
        .
      </div>
    </>
  );
}

export default App;
