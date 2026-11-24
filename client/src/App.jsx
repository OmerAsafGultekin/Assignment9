import { useState, useEffect } from "react";
import { fetchBooks, createBook, updateBook } from "./api/books.js";
import BookList from "./components/BookList.jsx";
import FilterBar from "./components/FilterBar.jsx";
import BookForm from "./components/BookForm.jsx";

export default function App() {
  const [books, setBooks] = useState([]);
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

  useEffect(() => {
    const controller = new AbortController();
    loadBooks(controller.signal);

    return () => {
      controller.abort();
    };
  }, [filters]);

  const handleFormSubmit = async (formData) => {
    setSubmitting(true);
    try {
      if (editingBook) {
        const updated = await updateBook(editingBook.id, formData);
        setBooks((prev) => prev.map((b) => (b.id === updated.id ? updated : b)));
        setEditingBook(null);
      } else {
        const created = await createBook(formData);
        setBooks((prev) => [created, ...prev]);
      }
    } finally {
      setSubmitting(false);
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
        />
      </main>
    </div>
  );
}
