import "./App.css";
import Navbar from "./components/Navbar";
import Dashboard from "./components/Dashboard";
import TaskForm from "./components/TaskForm";
import SearchBar from "./components/SearchBar";
import Filter from "./components/Filter";
import TaskList from "./components/TaskList";
import Modal from "./components/Modal";
import Button from "./components/Button";
import { useState, useEffect } from "react";


const sampleTasks = [
  {
    id: 1,
    title: "Design homepage layout",
    description: "Create the first version of the homepage design.",
    status: "in-progress",
    priority: "high",
    dueDate: "2026-10-15",
  },
  {
    id: 2,
    title: "Write project README",
    description: "Explain features and setup steps.",
    status: "todo",
    priority: "medium",
    dueDate: "2026-10-20",
  },
  {
    id: 3,
    title: "Fix login bug",
    description: "Users cannot log in with special characters.",
    status: "todo",
    priority: "high",
    dueDate: "2026-10-10",
  },
  {
    id: 4,
    title: "Set up GitHub repository",
    description: "Create repo and push the first commit.",
    status: "completed",
    priority: "low",
    dueDate: "2026-10-01",
  },
  {
    id: 5,
    title: "Prepare sprint report",
    description: "Summarize work done this sprint.",
    status: "in-progress",
    priority: "medium",
    dueDate: "2026-10-12",
  },
  {
    id: 6,
    title: "Review pull requests",
    description: "Check and approve pending pull requests.",
    status: "completed",
    priority: "high",
    dueDate: "2026-10-03",
  },
  {
    id: 7,
    title: "Update documentation",
    description: "Add new API endpoints to the docs.",
    status: "todo",
    priority: "low",
    dueDate: "2026-10-25",
  },
];

const statusOptions = [
  { value: "all", label: "All Statuses" },
  { value: "todo", label: "Todo" },
  { value: "in-progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

const priorityOptions = [
  { value: "all", label: "All Priorities" },
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
];





const STORAGE_KEY = "taskflow-tasks";

function loadTasks() {
  try {
    const savedTasks = localStorage.getItem(STORAGE_KEY);

    if (savedTasks === null) {
      return sampleTasks;
    }

    const parsedTasks = JSON.parse(savedTasks);
    return Array.isArray(parsedTasks) ? parsedTasks : sampleTasks;
  } catch (error) {
    return sampleTasks;
  }
}

function App() {
    const [tasks, setTasks] = useState(loadTasks);
  const [editingTask, setEditingTask] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [priorityFilter, setPriorityFilter] = useState("all");

    useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tasks));
  }, [tasks]);

  function handleAddTask(newTask) {
    setTasks([newTask, ...tasks]);
  }

  function handleDeleteTask(taskId) {
    const confirmed = window.confirm("Are you sure you want to delete this task?");
    if (confirmed) {
      setTasks(tasks.filter((task) => task.id !== taskId));
    }
  }

  function handleStartEdit(task) {
    setEditingTask(task);
  }

  function handleUpdateTask(updatedTask) {
    setTasks(
      tasks.map((task) => (task.id === updatedTask.id ? updatedTask : task))
    );
    setEditingTask(null);
  }

  function handleStatusChange(taskId, newStatus) {
    setTasks(
      tasks.map((task) =>
        task.id === taskId ? { ...task, status: newStatus } : task
      )
    );
  }

  function handleCloseModal() {
    setEditingTask(null);
  }

  function handleClearFilters() {
    setSearchTerm("");
    setStatusFilter("all");
    setPriorityFilter("all");
  }

  const filteredTasks = tasks.filter((task) => {
    const matchesSearch = task.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase().trim());
    const matchesStatus = statusFilter === "all" || task.status === statusFilter;
    const matchesPriority =
      priorityFilter === "all" || task.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const hasActiveFilters =
    searchTerm !== "" || statusFilter !== "all" || priorityFilter !== "all";

  return (
    <div>
      <Navbar />
      <main className="app-container">
        <Dashboard tasks={tasks} />
        <TaskForm onAddTask={handleAddTask} />

        <section className="toolbar">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
          <Filter
            id="status-filter"
            label="Status"
            value={statusFilter}
            options={statusOptions}
            onChange={setStatusFilter}
          />
          <Filter
            id="priority-filter"
            label="Priority"
            value={priorityFilter}
            options={priorityOptions}
            onChange={setPriorityFilter}
          />
          {hasActiveFilters && (
            <Button variant="secondary" onClick={handleClearFilters}>
              Clear Filters
            </Button>
          )}
        </section>

        <TaskList
          tasks={filteredTasks}
          onEdit={handleStartEdit}
          onDelete={handleDeleteTask}
          onStatusChange={handleStatusChange}
        />
      </main>

      {editingTask && (
        <Modal onClose={handleCloseModal}>
          <TaskForm
            taskToEdit={editingTask}
            onUpdateTask={handleUpdateTask}
            onCancel={handleCloseModal}
          />
        </Modal>
      )}
    </div>
  );
}

export default App;