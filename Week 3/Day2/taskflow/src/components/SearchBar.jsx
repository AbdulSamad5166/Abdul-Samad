import "./SearchBar.css";

function SearchBar({ value, onChange }) {
  return (
    <div className="search-bar">
      <label className="search-label" htmlFor="search">
        Search
      </label>
      <input
        className="search-input"
        type="search"
        id="search"
        placeholder="Search tasks by title..."
        value={value}
        onChange={(event) => onChange(event.target.value)}
      />
    </div>
  );
}

export default SearchBar;