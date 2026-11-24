export default function BookList({ books, loading, error }) {
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
        </article>
      ))}
    </div>
  );
}
