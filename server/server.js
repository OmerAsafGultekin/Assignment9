import express from "express";
import cors from "cors";
import {
  getAllBooks,
  getBookById,
  findDuplicateBook,
  createBook,
  replaceBook,
  updateBook,
  deleteBook,
} from "./booksStore.js";
import {
  validateId,
  validateQueryParams,
  validateBookPayload,
  validatePatchPayload,
} from "./validate.js";

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
      const aRated = a.rating !== null && a.rating !== undefined;
      const bRated = b.rating !== null && b.rating !== undefined;

      if (aRated && !bRated) return -1;
      if (!aRated && bRated) return 1;
      if (!aRated && !bRated) return a.id - b.id;

      const diff = order === "desc" ? b.rating - a.rating : a.rating - b.rating;
      return diff !== 0 ? diff : a.id - b.id;
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

app.post("/api/books", async (req, res) => {
  const validation = validateBookPayload(req.body);
  if (!validation.isValid) {
    return res.status(400).json({ error: validation.error });
  }

  const { title, author } = validation.data;
  const duplicate = await findDuplicateBook(title, author);
  if (duplicate) {
    return res.status(409).json({
      error: "A book with the same title and author already exists",
    });
  }

  const newBook = await createBook(validation.data);
  res.setHeader("Location", `/api/books/${newBook.id}`);
  return res.status(201).json(newBook);
});

app.put("/api/books/:id", async (req, res) => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.isValid) {
    return res.status(400).json({ error: idValidation.error });
  }

  const existingBook = await getBookById(idValidation.id);
  if (!existingBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  const payloadValidation = validateBookPayload(req.body);
  if (!payloadValidation.isValid) {
    return res.status(400).json({ error: payloadValidation.error });
  }

  const { title, author } = payloadValidation.data;
  const duplicate = await findDuplicateBook(title, author, idValidation.id);
  if (duplicate) {
    return res.status(409).json({
      error: "A book with the same title and author already exists",
    });
  }

  const replacedBook = await replaceBook(idValidation.id, payloadValidation.data);
  return res.status(200).json(replacedBook);
});

app.patch("/api/books/:id", async (req, res) => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.isValid) {
    return res.status(400).json({ error: idValidation.error });
  }

  const existingBook = await getBookById(idValidation.id);
  if (!existingBook) {
    return res.status(404).json({ error: "Book not found" });
  }

  const patchValidation = validatePatchPayload(existingBook, req.body);
  if (!patchValidation.isValid) {
    return res.status(400).json({ error: patchValidation.error });
  }

  const { title, author } = patchValidation.data;
  const duplicate = await findDuplicateBook(title, author, idValidation.id);
  if (duplicate) {
    return res.status(409).json({
      error: "A book with the same title and author already exists",
    });
  }

  const updatedBook = await updateBook(idValidation.id, patchValidation.data);
  return res.status(200).json(updatedBook);
});

app.delete("/api/books/:id", async (req, res) => {
  const idValidation = validateId(req.params.id);
  if (!idValidation.isValid) {
    return res.status(400).json({ error: idValidation.error });
  }

  const deleted = await deleteBook(idValidation.id);
  if (!deleted) {
    return res.status(404).json({ error: "Book not found" });
  }

  return res.status(204).end();
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
