export default function FilterBar({ filters, onFilterChange }) {
  const handleChange = (field, value) => {
    onFilterChange({
      ...filters,
      [field]: value,
    });
  };

  return (
    <div className="filter-bar">
      <div className="filter-group">
        <label htmlFor="search-input">Search:</label>
        <input
          id="search-input"
          type="text"
          placeholder="Search title or author..."
          value={filters.q}
          onChange={(e) => handleChange("q", e.target.value)}
        />
      </div>

      <div className="filter-group">
        <label htmlFor="genre-select">Genre:</label>
        <select
          id="genre-select"
          value={filters.genre}
          onChange={(e) => handleChange("genre", e.target.value)}
        >
          <option value="">All Genres</option>
          <option value="fiction">Fiction</option>
          <option value="non-fiction">Non-Fiction</option>
          <option value="science">Science</option>
          <option value="history">History</option>
          <option value="fantasy">Fantasy</option>
          <option value="other">Other</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="read-select">Status:</label>
        <select
          id="read-select"
          value={filters.read}
          onChange={(e) => handleChange("read", e.target.value)}
        >
          <option value="">All</option>
          <option value="true">Read</option>
          <option value="false">Unread</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="sort-select">Sort by:</label>
        <select
          id="sort-select"
          value={filters.sort}
          onChange={(e) => handleChange("sort", e.target.value)}
        >
          <option value="id">ID</option>
          <option value="title">Title</option>
          <option value="author">Author</option>
          <option value="year">Year</option>
          <option value="rating">Rating</option>
        </select>
      </div>

      <div className="filter-group">
        <label htmlFor="order-select">Order:</label>
        <select
          id="order-select"
          value={filters.order}
          onChange={(e) => handleChange("order", e.target.value)}
        >
          <option value="asc">Ascending</option>
          <option value="desc">Descending</option>
        </select>
      </div>
    </div>
  );
}
