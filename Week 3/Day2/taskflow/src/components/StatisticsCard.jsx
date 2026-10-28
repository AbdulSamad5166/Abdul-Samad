import "./StatisticsCard.css";

function StatisticsCard({ title, value, color }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: color }}>
      <p className="stat-card-title">{title}</p>
      <h2 className="stat-card-value">{value}</h2>
    </div>
  );
}

export default StatisticsCard;