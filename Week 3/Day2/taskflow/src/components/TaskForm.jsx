import { useState } from "react";
import "./TaskForm.css";
import Button from "./Button";

const initialFormData = {
  title: "",
  description: "",
  priority: "medium",
  status: "todo",
  dueDate: "",
};

function TaskForm({ onAddTask, onUpdateTask, taskToEdit, onCancel }) {
  const isEditing = Boolean(taskToEdit);
  const idPrefix = isEditing ? "edit-" : "add-";

  const [formData, setFormData] = useState(
    isEditing ? taskToEdit : initialFormData
  );
  const [error, setError] = useState("");

  function handleChange(event) {
    const { name, value } = event.target;
    setFormData({ ...formData, [name]: value });
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanTitle = formData.title.trim();

    if (cleanTitle === "") {
      setError("Task title is required.");
      return;
    }

    if (isEditing) {
      onUpdateTask({ ...formData, id: taskToEdit.id, title: cleanTitle });
      return;
    }

    const newTask = {
      ...formData,
      id: Date.now(),
      title: cleanTitle,
    };

    onAddTask(newTask);
    setFormData(initialFormData);
    setError("");
  }

  return (
    <section className="task-form">
      <h2 className="task-form-title">
        {isEditing ? "Edit Task" : "Add New Task"}
      </h2>

      <form onSubmit={handleSubmit}>
        <div className="task-form-grid">
          <div className="form-group form-group-full">
            <label className="form-label" htmlFor={`${idPrefix}title`}>Title</label>
            <input
              className="form-input"
              type="text"
              id={`${idPrefix}title`}
              name="title"
              placeholder="e.g. Finish landing page"
              value={formData.title}
              onChange={handleChange}
            />
            {error && <p className="form-error">{error}</p>}
          </div>

          <div className="form-group form-group-full">
            <label className="form-label" htmlFor={`${idPrefix}description`}>Description</label>
            <textarea
              className="form-input"
              id={`${idPrefix}description`}
              name="description"
              placeholder="Optional details about the task"
              value={formData.description}
              onChange={handleChange}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${idPrefix}priority`}>Priority</label>
            <select
              className="form-input"
              id={`${idPrefix}priority`}
              name="priority"
              value={formData.priority}
              onChange={handleChange}
            >
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${idPrefix}status`}>Status</label>
            <select
              className="form-input"
              id={`${idPrefix}status`}
              name="status"
              value={formData.status}
              onChange={handleChange}
            >
              <option value="todo">Todo</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor={`${idPrefix}dueDate`}>Due Date</label>
            <input
              className="form-input"
              type="date"
              id={`${idPrefix}dueDate`}
              name="dueDate"
              value={formData.dueDate}
              onChange={handleChange}
            />
          </div>
        </div>

        <div className="form-actions">
          <Button type="submit">{isEditing ? "Save Changes" : "Add Task"}</Button>
          {isEditing && (
            <Button variant="secondary" onClick={onCancel}>
              Cancel
            </Button>
          )}
        </div>
      </form>
    </section>
  );
}

export default TaskForm;