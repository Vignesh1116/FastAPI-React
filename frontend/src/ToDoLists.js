import "./ToDoLists.css";
import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { BiSolidTrash, BiPlus, BiArrowBack } from "react-icons/bi";

function ToDoList({ listId, handleBackButton }) {
  const inputRef = useRef(null);
  const [listData, setListData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      const response = await axios.get(`/api/lists/${listId}`);
      const newData = await response.data;
      setListData(newData);
    };
    fetchData();
  }, [listId]);

  const handleCreate = () => {
    if (inputRef.current && inputRef.current.value.trim()) {
      handleCreateItem(inputRef.current.value.trim());
      inputRef.current.value = "";
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleCreate();
    }
  };

  function handleCreateItem(label) {
    const updateData = async () => {
      const response = await axios.post(`/api/lists/${listData.id}/items/`, {
        label: label,
      });
      setListData(await response.data);
    };
    updateData();
  }

  function handleDeleteItem(id) {
    const updateData = async () => {
      const response = await axios.delete(
        `/api/lists/${listData.id}/items/${id}`
      );
      setListData(await response.data);
    };
    updateData();
  }

  function handleCheckToggle(itemId, newState) {
    const updateData = async () => {
      const response = await axios.patch(
        `/api/lists/${listData.id}/checked_state`,
        {
          item_id: itemId,
          checked_state: newState,
        }
      );
      setListData(await response.data);
    };
    updateData();
  }

  if (listData === null) {
    return (
      <div className="ToDoList loading-container">
        <div className="loading-spinner"></div>
        <div className="loading-text">Loading to-do list ...</div>
      </div>
    );
  }

  return (
    <div className="ToDoList">
      <header className="list-header">
        <button className="back-btn" onClick={handleBackButton} title="Back to Lists">
          <BiArrowBack /> Back
        </button>
        <h1 className="list-title">{listData.name}</h1>
      </header>

      <div className="input-card">
        <div className="input-group">
          <input
            ref={inputRef}
            type="text"
            placeholder="Add a new task..."
            onKeyDown={handleKeyDown}
          />
          <button className="btn-primary" onClick={handleCreate}>
            <BiPlus /> Add Task
          </button>
        </div>
      </div>

      <div className="tasks-container">
        {listData.items.length > 0 ? (
          listData.items.map((item) => {
            return (
              <div
                key={item.id}
                className={item.checked ? "task-item checked" : "task-item"}
                onClick={() => handleCheckToggle(item.id, !item.checked)}
              >
                <div className="checkbox-wrapper">
                  <div className={`custom-checkbox ${item.checked ? 'checked' : ''}`}>
                    {item.checked && <span className="checkmark">✓</span>}
                  </div>
                </div>
                <span className="label">{item.label}</span>
                <button
                  className="trash-btn"
                  title="Delete Task"
                  onClick={(evt) => {
                    evt.stopPropagation();
                    handleDeleteItem(item.id);
                  }}
                >
                  <BiSolidTrash />
                </button>
              </div>
            );
          })
        ) : (
          <div className="empty-state">
            <p>No tasks yet! Add one above to get started.</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default ToDoList;