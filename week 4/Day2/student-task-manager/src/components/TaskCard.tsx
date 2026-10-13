
import type { Task } from "../types";

interface TaskCardProps {
  task: Task;
  onToggle: (id: number) => void;
  onDelete: (id: number) => void;
}

function TaskCard({ task, onToggle, onDelete }: TaskCardProps) {
  return (
    <article className="task-card">
      <div className="task-info">
        <h3 className={task.status === "Completed" ? "completed" : ""}>
          {task.title}
        </h3>

        <div className="task-meta">
          <span className={`priority ${task.priority.toLowerCase()}`}>
            {task.priority}
          </span>

          <span>{task.status}</span>
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onToggle(task.id)}>
          {task.status === "Completed" ? "Undo" : "Complete"}
        </button>

        <button className="delete-btn" onClick={() => onDelete(task.id)}>
          Delete
        </button>
      </div>
    </article>
  );
}

export default TaskCard;
