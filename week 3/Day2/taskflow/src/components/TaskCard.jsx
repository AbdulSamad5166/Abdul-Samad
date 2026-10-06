import "./TaskCard.css";
import Button from "./Button";

const statusLabels = {
  "todo": "Todo",
  "in-progress": "In Progress",
  "completed": "Completed",
};

function formatDate(dateString) {
  if (!dateString) return "No due date";
  const date = new Date(dateString);
  return date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

function TaskCard({ task, onEdit, onDelete, onStatusChange }) {
  return (
    <article className="task-card">
      <div className="task-card-header">
        <h3 className="task-card-title">{task.title}</h3>
        <span className={`badge badge-priority-${task.priority}`}>
          {task.priority}
        </span>
      </div>

      {task.description && (
        <p className="task-card-description">{task.description}</p>
      )}

      <div className="task-card-footer">
                <select
          className={`badge status-select badge-status-${task.status}`}
          value={task.status}
          onChange={(event) => onStatusChange(task.id, event.target.value)}
          aria-label="Change task status"
        >
          <option value="todo">Todo</option>
          <option value="in-progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <span className="task-card-due">Due: {formatDate(task.dueDate)}</span>
      </div>
            <div className="task-card-actions">
        <Button variant="secondary" onClick={() => onEdit(task)}>
          Edit
        </Button>
        <Button variant="danger" onClick={() => onDelete(task.id)}>
          Delete
        </Button>
      </div>
    </article>
  );
}

export default TaskCard;