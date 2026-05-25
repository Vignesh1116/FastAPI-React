import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";
import ListToDoLists from "./ListTodoLists";
import ToDoList from "./ToDoLists";

function App() {
  const [listSummaries, setListSummaries] = useState(null);
  const [selectedItem, setSelectedItem] = useState(null);

  useEffect(() => {
    reloadData().catch(console.error);
  }, []);

  async function reloadData() {
    const response = await axios.get("/api/lists");
    const data = await response.data;
    setListSummaries(data);
  }

  function handleNewToDoList(newName) {
    const updateData = async () => {
      const newListData = {
        name: newName,
      };

      await axios.post(`/api/lists`, newListData);
      reloadData().catch(console.error);
    };
    updateData();
  }

  function handleDeleteToDoList(id) {
    const updateData = async () => {
      await axios.delete(`/api/lists/${id}`);
      reloadData().catch(console.error);
    };
    updateData();
  }

  function handleSelectList(id) {
    console.log("Selecting item", id);
    setSelectedItem(id);
  }

  function backToList() {
    setSelectedItem(null);
    reloadData().catch(console.error);
  }

  return (
    <div className="App">
      <div className="app-container">
        <aside className={`app-sidebar ${selectedItem !== null ? 'mobile-hidden' : ''}`}>
          <ListToDoLists
            listSummaries={listSummaries}
            selectedItem={selectedItem}
            handleSelectList={handleSelectList}
            handleNewToDoList={handleNewToDoList}
            handleDeleteToDoList={handleDeleteToDoList}
          />
        </aside>
        <main className={`app-main ${selectedItem === null ? 'mobile-hidden' : ''}`}>
          {selectedItem !== null ? (
            <ToDoList listId={selectedItem} handleBackButton={backToList} />
          ) : (
            <div className="empty-detail-state">
              <div className="empty-detail-icon">✓</div>
              <h2>Select a list to get started</h2>
              <p>Choose an existing to-do list from the sidebar or create a new one to start adding tasks.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}

export default App;