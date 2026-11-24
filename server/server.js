import express from "express";
import cors from "cors";
import { getAllBooks, getBookById } from "./booksStore.js";
import { validateId, validateQueryParams } from "./validate.js";

const app = express();
const PORT = process.env.PORT || 3000;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
  })
);

app.use(express.json());

app.get("/api/books", async (req, res) => {
  const validation = validateQueryParams(req.query);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  const { genre, read, q, sort, order, limit, page } = validation.params;
  const allBooks = await getAllBooks();

  let filtered = allBooks;

  if (genre !== undefined) {
    filtered = filtered.filter((book) => book.genre === genre);
  }

  if (read !== undefined) {
    filtered = filtered.filter((book) => book.read === read);
  }

  if (q !== undefined && q !== "") {
    const queryLower = q.toLowerCase();
    filtered = filtered.filter(
      (book) =>
        book.title.toLowerCase().includes(queryLower) ||
        book.author.toLowerCase().includes(queryLower)
    );
  }

  const sorted = [...filtered].sort((a, b) => {
    if (sort === "title") {
      const cmp = a.title.localeCompare(b.title);
      return order === "desc" ? -cmp : cmp;
    }
    if (sort === "author") {
      const cmp = a.author.localeCompare(b.author);
      return order === "desc" ? -cmp : cmp;
    }
    if (sort === "year") {
      return order === "desc" ? b.year - a.year : a.year - b.year;
    }
    if (sort === "rating") {
      return order === "desc"
        ? (b.rating ?? 0) - (a.rating ?? 0)
        : (a.rating ?? 0) - (b.rating ?? 0);
    }
    return order === "desc" ? b.id - a.id : a.id - b.id;
  });

  const offset = (page - 1) * limit;
  const paginated = sorted.slice(offset, offset + limit);

  return res.status(200).json(paginated);
});

app.get("/api/books/:id", async (req, res) => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.isValid) {
    return res.status(400).json({ error: idValidation.error });
  }

  const book = await getBookById(idValidation.id);
  if (!book) {
    return res.status(404).json({ error: "Book not found" });
  }

  return res.status(200).json(book);
});

app.get("/api/stats", async (req, res) => {
  const books = await getAllBooks();
  const total = books.length;
  let readCount = 0;
  let unreadCount = 0;
  let ratingSum = 0;
  let ratedCount = 0;
  const byGenre = {};

  for (const book of books) {
    if (book.read) {
      readCount++;
    } else {
      unreadCount++;
    }

    if (book.rating !== null && book.rating !== undefined) {
      ratingSum += book.rating;
      ratedCount++;
    }

    byGenre[book.genre] = (byGenre[book.genre] || 0) + 1;
  }

  const averageRating =
    ratedCount > 0 ? Math.round((ratingSum / ratedCount) * 10) / 10 : null;

  return res.status(200).json({
    total,
    read: readCount,
    unread: unreadCount,
    averageRating,
    byGenre,
  });
});

app.listen(PORT, () => {
  console.log(`Server listening on port ${PORT}`);
});

export default app;
