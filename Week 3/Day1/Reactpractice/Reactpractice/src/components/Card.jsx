import Button from "./Button";

function Card({ name, role, city }) {
  return (
    <div className="card">
      <h2>{name}</h2>
      <p>Role: {role}</p>
      <p>City: {city}</p>
      <Button text="View Profile" color="#2563eb" />
    </div>
  );
}

export default Card;