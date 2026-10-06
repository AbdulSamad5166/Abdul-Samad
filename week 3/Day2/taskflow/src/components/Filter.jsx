import "./Filter.css";

function Filter({ id, label, value, options, onChange }) {
  return (
    <div className="filter">
      <label className="filter-label" htmlFor={id}>
        {label}
      </label>
      <select
        className="filter-select"
        id={id}
        value={value}
        onChange={(event) => onChange(event.target.value)}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export default Filter;