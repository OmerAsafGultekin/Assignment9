export default function BookList({
  books,
  loading,
  error,
  onEdit,
  onToggleRead,
  onRate,
  onDelete,
}) {
  if (loading) {
    return <div className="status-message loading">Loading books...</div>;
  }

  if (error) {
    return (
      <div className="status-message error" role="alert">
        {error}
      </div>
    );
  }

  if (!books || books.length === 0) {
    return <div className="status-message empty">No books found.</div>;
  }

  return (
    <div className="book-list">
      {books.map((book) => (
        <article key={book.id} className="book-card">
          <div className="book-card-header">
            <h3 className="book-title">{book.title}</h3>
            <span className="book-genre">{book.genre}</span>
          </div>
          <p className="book-author">
            by {book.author} ({book.year})
          </p>
          <div className="book-card-meta">
            <span className={`status-badge ${book.read ? "read" : "unread"}`}>
              {book.read ? "Read" : "Unread"}
            </span>
            <span className="book-rating">
              {book.rating !== null && book.rating !== undefined
                ? `Rating: ${book.rating}/5`
                : "Unrated"}
            </span>
          </div>

          <div className="book-card-actions">
            <button
              type="button"
              onClick={() => onToggleRead(book)}
              title={book.read ? "Mark as unread" : "Mark as read"}
            >
              {book.read ? "Mark Unread" : "Mark Read"}
            </button>

            {book.read && (
              <div className="rating-control">
                <label htmlFor={`rating-${book.id}`}>Rating:</label>
                <select
                  id={`rating-${book.id}`}
                  value={book.rating ?? ""}
                  onChange={(e) => {
                    const val =
                      e.target.value === "" ? null : Number(e.target.value);
                    onRate(book.id, val);
                  }}
                >
                  <option value="">None</option>
                  <option value="1">1 Star</option>
                  <option value="2">2 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="5">5 Stars</option>
                </select>
              </div>
            )}

            <button type="button" onClick={() => onEdit(book)}>
              Edit
            </button>

            <button
              type="button"
              className="danger"
              onClick={() => onDelete(book.id)}
            >
              Delete
            </button>
          </div>
        </article>
      ))}
    </div>
  );
}
