const delay = (ms = 10) => new Promise((resolve) => setTimeout(resolve, ms));

const initialBooks = [
  {
    id: 1,
    title: "To Kill a Mockingbird",
    author: "Harper Lee",
    year: 1960,
    genre: "fiction",
    read: true,
    rating: 5,
  },
  {
    id: 2,
    title: "1984",
    author: "George Orwell",
    year: 1949,
    genre: "fiction",
    read: true,
    rating: 4,
  },
  {
    id: 3,
    title: "A Brief History of Time",
    author: "Stephen Hawking",
    year: 1988,
    genre: "science",
    read: false,
    rating: null,
  },
  {
    id: 4,
    title: "Sapiens: A Brief History of Humankind",
    author: "Yuval Noah Harari",
    year: 2011,
    genre: "history",
    read: true,
    rating: 5,
  },
  {
    id: 5,
    title: "The Hobbit",
    author: "J.R.R. Tolkien",
    year: 1937,
    genre: "fantasy",
    read: false,
    rating: null,
  },
  {
    id: 6,
    title: "Educated",
    author: "Tara Westover",
    year: 2018,
    genre: "non-fiction",
    read: true,
    rating: 4,
  },
];

let books = initialBooks.map((book) => ({ ...book }));
let nextId = 7;

export async function getAllBooks() {
  await delay();
  return books.map((book) => ({ ...book }));
}

export async function getBookById(id) {
  await delay();
  const book = books.find((b) => b.id === id);
  return book ? { ...book } : null;
}

export async function findDuplicateBook(title, author, excludeId = null) {
  await delay();
  const normalizedTitle = title.trim().toLowerCase();
  const normalizedAuthor = author.trim().toLowerCase();

  const duplicate = books.find(
    (b) =>
      b.id !== excludeId &&
      b.title.trim().toLowerCase() === normalizedTitle &&
      b.author.trim().toLowerCase() === normalizedAuthor
  );

  return duplicate ? { ...duplicate } : null;
}

export async function createBook(bookData) {
  await delay();
  const newBook = {
    id: nextId++,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    year: bookData.year,
    genre: bookData.genre,
    read: Boolean(bookData.read),
    rating: bookData.read ? (bookData.rating ?? null) : null,
  };

  books = [...books, newBook];
  return { ...newBook };
}

export async function replaceBook(id, bookData) {
  await delay();
  const index = books.findIndex((b) => b.id === id);
  if (index === -1) {
    return null;
  }

  const replacedBook = {
    id,
    title: bookData.title.trim(),
    author: bookData.author.trim(),
    year: bookData.year,
    genre: bookData.genre,
    read: Boolean(bookData.read),
    rating: bookData.read ? (bookData.rating ?? null) : null,
  };

  books = books.map((b) => (b.id === id ? replacedBook : b));
  return { ...replacedBook };
}

export async function updateBook(id, partialData) {
  await delay();
  const existingBook = books.find((b) => b.id === id);
  if (!existingBook) {
    return null;
  }

  const nextRead = partialData.read !== undefined ? Boolean(partialData.read) : existingBook.read;
  let nextRating;
  if (!nextRead) {
    nextRating = null;
  } else if (partialData.rating !== undefined) {
    nextRating = partialData.rating;
  } else {
    nextRating = existingBook.rating;
  }

  const updatedBook = {
    id,
    title: partialData.title !== undefined ? partialData.title.trim() : existingBook.title,
    author: partialData.author !== undefined ? partialData.author.trim() : existingBook.author,
    year: partialData.year !== undefined ? partialData.year : existingBook.year,
    genre: partialData.genre !== undefined ? partialData.genre : existingBook.genre,
    read: nextRead,
    rating: nextRating,
  };

  books = books.map((b) => (b.id === id ? updatedBook : b));
  return { ...updatedBook };
}

export async function deleteBook(id) {
  await delay();
  const exists = books.some((b) => b.id === id);
  if (!exists) {
    return false;
  }

  books = books.filter((b) => b.id !== id);
  return true;
}

export async function resetBooks() {
  await delay();
  books = initialBooks.map((book) => ({ ...book }));
  nextId = 7;
}
