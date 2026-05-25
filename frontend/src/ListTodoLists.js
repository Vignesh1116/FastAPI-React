import "./ListsTodoLists.css";
import { useRef } from "react";
import { BiSolidTrash, BiPlus } from "react-icons/bi";

function ListToDoLists({
  listSummaries,
  handleSelectList,
  handleNewToDoList,
  handleDeleteToDoList,
}) {
  const inputRef = useRef(null);

  const handleSubmit = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      handleNewToDoList(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleSubmit();
    }
  };

  if (listSummaries === null) {
    return (
      <div className="ListToDoLists loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading to-do lists ...</div>
      </div>
    );
  }

  return (
    <div className="ListToDoLists">
      <header className="app-header-title">
        <h1>ZenTodo</h1>
        <p className="subtitle">Manage your daily focus and tasks</p>
      </header>

      <div className="input-card">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            placeholder="Create a new to-do list..."
            onKeyDown={handleKeyDown}
          />
          <button className="btn-primary" onClick={handleSubmit}>
            <BiPlus /> Create List
          </button>
        </div>
      </div>

      {listSummaries.length === 0 ? (
        <div className="empty-state">
          <p>No to-do lists yet. Create one above to get started!</p>
        </div>
      ) : (
        <div className="lists-grid">
          {listSummaries.map((summary) => {
            return (
              <div
                key={summary.id}
                className="list-summary-card"
                onClick={() => handleSelectList(summary.id)}
              >
                <div className="card-content">
                  <span className="name">{summary.name}</span>
                  <span className="count">
                    {summary.item_count} {summary.item_count === 1 ? 'task' : 'tasks'}
                  </span>
                </div>
                <button
                  className="trash-btn"
                  title="Delete List"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    handleDeleteToDoList(summary.id);
                  }}
                >
                  <BiSolidTrash />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default ListToDoLists;