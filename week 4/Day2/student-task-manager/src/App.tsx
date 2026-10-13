
import { useEffect, useState } from "react";
import type { ChangeEvent, FormEvent } from "react";
import TaskCard from "./components/TaskCard";
import type { Task, Priority, Student } from "./types";
import "./App.css";

const initialTasks: Task[] = [
  {
    id: 1,
    title: "Learn TypeScript interfaces",
    priority: "High",
    status: "Pending",
  },
  {
    id: 2,
    title: "Practice React props",
    priority: "Medium",
    status: "Completed",
  },
];

function App() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [title, setTitle] = useState<string>("");
  const [priority, setPriority] = useState<Priority>("Medium");

  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [apiError, setApiError] = useState<string>("");

  // API se student data load karna
  useEffect(() => {
    async function fetchStudents(): Promise<void> {
      try {
        setLoading(true);
        setApiError("");

        const response = await fetch(
          "https://jsonplaceholder.typicode.com/users"
        );

        if (!response.ok) {
          throw new Error("Unable to load student data.");
        }

        const data: unknown = await response.json();

        if (
          !Array.isArray(data) ||
          !data.every(
            (item: unknown) =>
              typeof item === "object" &&
              item !== null &&
              "id" in item &&
              typeof item.id === "number" &&
              "name" in item &&
              typeof item.name === "string" &&
              "email" in item &&
              typeof item.email === "string"
          )
        ) {
          throw new Error("API returned invalid data.");
        }

        setStudents(data as Student[]);
      } catch {
        setApiError("Student data load nahi ho saka. Dobara try karein.");
      } finally {
        setLoading(false);
      }
    }

    void fetchStudents();
  }, []);

  // Input change event
  function handleTitleChange(
    event: ChangeEvent<HTMLInputElement>
  ): void {
    setTitle(event.target.value);
  }

  // Select change event
  function handlePriorityChange(
    event: ChangeEvent<HTMLSelectElement>
  ): void {
    setPriority(event.target.value as Priority);
  }

  // Form submit event
  function handleSubmit(event: FormEvent<HTMLFormElement>): void {
    event.preventDefault();

    const trimmedTitle = title.trim();

    if (!trimmedTitle) {
      return;
    }

    const newTask: Task = {
      id: Date.now(),
      title: trimmedTitle,
      priority: priority,
      status: "Pending",
    };

    setTasks((previousTasks) => [...previousTasks, newTask]);
    setTitle("");
    setPriority("Medium");
  }

  // Task complete ya undo karna
  function toggleTask(id: number): void {
    setTasks((previousTasks) =>
      previousTasks.map((task) =>
        task.id === id
          ? {
              ...task,
              status:
                task.status === "Completed" ? "Pending" : "Completed",
            }
          : task
      )
    );
  }

  // Task delete karna
  function deleteTask(id: number): void {
    setTasks((previousTasks) =>
      previousTasks.filter((task) => task.id !== id)
    );
  }

  const completedCount = tasks.filter(
    (task) => task.status === "Completed"
  ).length;

  const pendingCount = tasks.length - completedCount;

  return (
    <main className="app-container">
      <header className="page-header">
        <div>
          <p className="eyebrow">STUDENT PRODUCTIVITY</p>
          <h1>Student Task Manager</h1>
          <p className="subtitle">
            Organize your studies, one task at a time.
          </p>
        </div>
      </header>

      <section className="stats-grid">
        <div className="stat-card">
          <span>Total Tasks</span>
          <strong>{tasks.length}</strong>
        </div>

        <div className="stat-card">
          <span>Pending</span>
          <strong>{pendingCount}</strong>
        </div>

        <div className="stat-card">
          <span>Completed</span>
          <strong>{completedCount}</strong>
        </div>
      </section>

      <section className="panel">
        <h2>Add a New Task</h2>

        <form onSubmit={handleSubmit} className="task-form">
          <div className="form-field">
            <label htmlFor="task-title">Task title</label>
            <input
              id="task-title"
              type="text"
              placeholder="e.g. Practice TypeScript"
              value={title}
              onChange={handleTitleChange}
              required
            />
          </div>

          <div className="form-field">
            <label htmlFor="task-priority">Priority</label>
            <select
              id="task-priority"
              value={priority}
              onChange={handlePriorityChange}
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
            </select>
          </div>

          <button type="submit" className="primary-btn">
            Add Task
          </button>
        </form>
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Your Tasks</h2>
          <span>{tasks.length} tasks</span>
        </div>

        {tasks.length === 0 ? (
          <p className="empty-state">
            No tasks yet. Add your first task above.
          </p>
        ) : (
          <div className="task-list">
            {tasks.map((task) => (
              <TaskCard
                key={task.id}
                task={task}
                onToggle={toggleTask}
                onDelete={deleteTask}
              />
            ))}
          </div>
        )}
      </section>

      <section className="panel">
        <div className="section-heading">
          <h2>Sample Student Directory</h2>
          <span>API Demo</span>
        </div>

        {loading ? (
          <p>Loading students...</p>
        ) : apiError ? (
          <p className="error-message">{apiError}</p>
        ) : (
          <div className="student-list">
            {students.map((student) => (
              <div className="student-card" key={student.id}>
                <strong>{student.name}</strong>
                <span>{student.email}</span>
              </div>
            ))}
          </div>
        )}
      </section>

      <footer className="page-footer">
        Built with React + TypeScript
      </footer>
    </main>
  );
}

export default App;
