import { useState, useEffect } from "react";

export default function BookForm({ initialBook, onSubmit, onCancel, submitting }) {
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [year, setYear] = useState(new Date().getFullYear());
  const [genre, setGenre] = useState("fiction");
  const [read, setRead] = useState(false);
  const [rating, setRating] = useState("");
  const [error, setError] = useState(null);

  useEffect(() => {
    if (initialBook) {
      setTitle(initialBook.title || "");
      setAuthor(initialBook.author || "");
      setYear(initialBook.year || new Date().getFullYear());
      setGenre(initialBook.genre || "fiction");
      setRead(Boolean(initialBook.read));
      setRating(
        initialBook.rating !== null && initialBook.rating !== undefined
          ? String(initialBook.rating)
          : ""
      );
    } else {
      setTitle("");
      setAuthor("");
      setYear(new Date().getFullYear());
      setGenre("fiction");
      setRead(false);
      setRating("");
    }
    setError(null);
  }, [initialBook]);

  const handleReadChange = (e) => {
    const isChecked = e.target.checked;
    setRead(isChecked);
    if (!isChecked) {
      setRating("");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    const parsedYear = Number.parseInt(year, 10);
    const parsedRating =
      read && rating !== "" ? Number.parseInt(rating, 10) : null;

    const payload = {
      title,
      author,
      year: isNaN(parsedYear) ? year : parsedYear,
      genre,
      read,
      rating: parsedRating,
    };

    try {
      await onSubmit(payload);
      if (!initialBook) {
        setTitle("");
        setAuthor("");
        setYear(new Date().getFullYear());
        setGenre("fiction");
        setRead(false);
        setRating("");
      }
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form className="book-form" onSubmit={handleSubmit}>
      <h2>{initialBook ? "Edit Book" : "Add a New Book"}</h2>

      {error && (
        <div className="status-message error" role="alert">
          {error}
        </div>
      )}

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="form-title">Title</label>
          <input
            id="form-title"
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="form-author">Author</label>
          <input
            id="form-author"
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
            disabled={submitting}
          />
        </div>
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="form-year">Year</label>
          <input
            id="form-year"
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            disabled={submitting}
          />
        </div>

        <div className="form-group">
          <label htmlFor="form-genre">Genre</label>
          <select
            id="form-genre"
            value={genre}
            onChange={(e) => setGenre(e.target.value)}
            disabled={submitting}
          >
            <option value="fiction">Fiction</option>
            <option value="non-fiction">Non-Fiction</option>
            <option value="science">Science</option>
            <option value="history">History</option>
            <option value="fantasy">Fantasy</option>
            <option value="other">Other</option>
          </select>
        </div>
      </div>

      <div className="form-row">
        <div className="form-group checkbox-group">
          <label htmlFor="form-read">
            <input
              id="form-read"
              type="checkbox"
              checked={read}
              onChange={handleReadChange}
              disabled={submitting}
            />
            <span>Mark as Read</span>
          </label>
        </div>

        {read && (
          <div className="form-group">
            <label htmlFor="form-rating">Rating (1–5)</label>
            <select
              id="form-rating"
              value={rating}
              onChange={(e) => setRating(e.target.value)}
              disabled={submitting}
            >
              <option value="">No rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>
          </div>
        )}
      </div>

      <div className="form-actions">
        <button type="submit" className="primary" disabled={submitting}>
          {submitting ? "Saving..." : initialBook ? "Save Changes" : "Add Book"}
        </button>
        {initialBook && (
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        )}
      </div>
    </form>
  );
}
