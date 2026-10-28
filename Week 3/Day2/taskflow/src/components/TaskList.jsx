import "./TaskList.css";
import TaskCard from "./TaskCard";

function TaskList({ tasks, onEdit, onDelete, onStatusChange }) {
  return (
    <section className="task-list">
      <h2 className="task-list-title">Your Tasks</h2>

      {tasks.length === 0 ? (
        <div className="task-list-empty">
          <p>No tasks found. Add a task to get started!</p>
        </div>
      ) : (
        <div className="task-list-grid">
          {tasks.map((task) => (
  <TaskCard
    key={task.id}
    task={task}
    onEdit={onEdit}
    onDelete={onDelete}
    onStatusChange={onStatusChange}
  />
))}
        </div>
      )}
    </section>
  );
}

export default TaskList;