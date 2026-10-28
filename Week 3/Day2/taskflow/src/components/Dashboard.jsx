import "./Dashboard.css";
import StatisticsCard from "./StatisticsCard";

function Dashboard({ tasks }) {
  const totalTasks = tasks.length;
  const todoTasks = tasks.filter((task) => task.status === "todo").length;
  const inProgressTasks = tasks.filter((task) => task.status === "in-progress").length;
  const completedTasks = tasks.filter((task) => task.status === "completed").length;
  const highPriorityTasks = tasks.filter((task) => task.priority === "high").length;

  return (
    <section className="dashboard">
      <h2 className="dashboard-title">Overview</h2>
      <div className="dashboard-grid">
        <StatisticsCard title="Total Tasks" value={totalTasks} color="#4f46e5" />
        <StatisticsCard title="Todo" value={todoTasks} color="#f59e0b" />
        <StatisticsCard title="In Progress" value={inProgressTasks} color="#3b82f6" />
        <StatisticsCard title="Completed" value={completedTasks} color="#10b981" />
        <StatisticsCard title="High Priority" value={highPriorityTasks} color="#ef4444" />
      </div>
    </section>
  );
}

export default Dashboard;