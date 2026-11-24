import { useState, useEffect } from "react";
import {
  fetchBooks,
  createBook,
  updateBook,
  patchBook,
  deleteBook,
  fetchStats,
} from "./api/books.js";
import BookList from "./components/BookList.jsx";
import FilterBar from "./components/FilterBar.jsx";
import BookForm from "./components/BookForm.jsx";
import StatsPanel from "./components/StatsPanel.jsx";

export default function App() {
  const [books, setBooks] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingBook, setEditingBook] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [filters, setFilters] = useState({
    q: "",
    genre: "",
    read: "",
    sort: "id",
    order: "asc",
  });

  const loadBooks = (signal) => {
    setLoading(true);
    setError(null);
    return fetchBooks(filters, signal)
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
  };

  const loadStats = (signal) => {
    return fetchStats(signal)
      .then((data) => setStats(data))
      .catch((err) => {
        if (err.name !== "AbortError") {
          console.error("Failed to load stats:", err.message);
        }
      });
  };

  useEffect(() => {
    const controller = new AbortController();
    loadBooks(controller.signal);
    loadStats(controller.signal);

    return () => {
      controller.abort();
    };
  }, [filters]);

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingBook) {
        const updated = await updateBook(editingBook.id, formData);
        setBooks((prev) =>
          prev.map((b) => (b.id === updated.id ? updated : b))
        );
        setEditingBook(null);
      } else {
        const created = await createBook(formData);
        setBooks((prev) => [created, ...prev]);
      }
      loadStats();
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleRead = async (book) => {
    try {
      const nextRead = !book.read;
      const payload = nextRead ? { read: true } : { read: false, rating: null };
      const updated = await patchBook(book.id, payload);
      setBooks((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      loadStats();
    } catch (err) {
      alert(`Failed to update read status: ${err.message}`);
    }
  };

  const handleRateBook = async (id, rating) => {
    try {
      const updated = await patchBook(id, { rating });
      setBooks((prev) =>
        prev.map((b) => (b.id === updated.id ? updated : b))
      );
      loadStats();
    } catch (err) {
      alert(`Failed to update rating: ${err.message}`);
    }
  };

  const handleDeleteBook = async (id) => {
    try {
      await deleteBook(id);
      setBooks((prev) => prev.filter((b) => b.id !== id));
      if (editingBook && editingBook.id === id) {
        setEditingBook(null);
      }
      loadStats();
    } catch (err) {
      alert(`Failed to delete book: ${err.message}`);
    }
  };

  const handleEditBook = (book) => {
    setEditingBook(book);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleCancelEdit = () => {
    setEditingBook(null);
  };

  return (
    <div className="app-container">
      <header>
        <h1>Reading List</h1>
      </header>
      <main>
        <StatsPanel stats={stats} />
        <BookForm
          initialBook={editingBook}
          onSubmit={handleFormSubmit}
          onCancel={handleCancelEdit}
          submitting={submitting}
        />
        <FilterBar filters={filters} onFilterChange={setFilters} />
        <BookList
          books={books}
          loading={loading}
          error={error}
          onEdit={handleEditBook}
          onToggleRead={handleToggleRead}
          onRate={handleRateBook}
          onDelete={handleDeleteBook}
        />
      </main>
    </div>
  );
}
