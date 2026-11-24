import { useState, useEffect } from "react";
import { fetchBooks } from "./api/books.js";
import BookList from "./components/BookList.jsx";
import FilterBar from "./components/FilterBar.jsx";

export default function App() {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    q: "",
    genre: "",
    read: "",
    sort: "id",
    order: "asc",
  });

  useEffect(() => {
    const controller = new AbortController();
    setLoading(true);
    setError(null);

    fetchBooks(filters, controller.signal)
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
  }, [filters]);

  return (
    <div className="app-container">
      <header>
        <h1>Reading List</h1>
      </header>
      <main>
        <FilterBar filters={filters} onFilterChange={setFilters} />
        <BookList books={books} loading={loading} error={error} />
      </main>
    </div>
  );
}
