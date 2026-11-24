import { useState, useEffect } from "react";
import { fetchBooks } from "./api/books.js";
import BookList from "./components/BookList.jsx";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchBooks({}, controller.signal)
      .then((data) => {
        setBooks(data);
        setLoading(false);
      })
      .catch((err) => {
        if (err.name !== "AbortError") {
          setError(err.message);
          setLoading(false);
        }
      });

    return () => {
      controller.abort();
    };
  }, []);

  return (
    <div className="app-container">
      <header>
        <h1>Reading List</h1>
      </header>
      <main>
        <BookList books={books} loading={loading} error={error} />
      </main>
    </div>
  );
}
