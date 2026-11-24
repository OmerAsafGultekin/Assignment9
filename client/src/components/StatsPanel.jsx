export default function StatsPanel({ stats }) {
  if (!stats) {
    return null;
  }

  const { total, read, unread, averageRating, byGenre } = stats;

  return (
    <section className="stats-panel" aria-label="Reading Statistics">
      <h2>Reading Statistics</h2>
      <div className="stats-grid">
        <div className="stat-card">
          <span className="stat-label">Total Books</span>
          <span className="stat-value">{total}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Read</span>
          <span className="stat-value">{read}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Unread</span>
          <span className="stat-value">{unread}</span>
        </div>
        <div className="stat-card">
          <span className="stat-label">Average Rating</span>
          <span className="stat-value">
            {averageRating !== null ? `${averageRating} / 5` : "N/A"}
          </span>
        </div>
      </div>

      {byGenre && Object.keys(byGenre).length > 0 && (
        <div className="stats-genres">
          <h3>By Genre</h3>
          <div className="genre-badges">
            {Object.entries(byGenre).map(([genre, count]) => (
              <span key={genre} className="genre-count-badge">
                {genre}: <strong>{count}</strong>
              </span>
            ))}
          </div>
        </div>
      )}
    </section>
  );
}
