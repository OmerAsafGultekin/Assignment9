export const VALID_GENRES = [
  "fiction",
  "non-fiction",
  "science",
  "history",
  "fantasy",
  "other",
];

export const ALLOWED_QUERY_PARAMS = [
  "genre",
  "read",
  "q",
  "sort",
  "order",
  "limit",
  "page",
];

export const ALLOWED_SORT_FIELDS = ["id", "title", "author", "year", "rating"];
export const ALLOWED_ORDER_VALUES = ["asc", "desc"];

export function validateId(idParam) {
  if (typeof idParam !== "string" && typeof idParam !== "number") {
    return { isValid: false, error: "Book ID must be a positive integer" };
  }
  const str = String(idParam).trim();
  if (!/^\d+$/.test(str)) {
    return { isValid: false, error: "Book ID must be a positive integer" };
  }
  const num = Number(str);
  if (!Number.isSafeInteger(num) || num <= 0) {
    return { isValid: false, error: "Book ID must be a positive integer" };
  }
  return { isValid: true, id: num };
}

export function validateBookPayload(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { isValid: false, error: "Request body must be a JSON object" };
  }

  if (typeof body.title !== "string") {
    return { isValid: false, error: "Title must be a string" };
  }
  const trimmedTitle = body.title.trim();
  if (trimmedTitle.length < 1 || trimmedTitle.length > 100) {
    return { isValid: false, error: "Title must be between 1 and 100 characters" };
  }

  if (typeof body.author !== "string") {
    return { isValid: false, error: "Author must be a string" };
  }
  const trimmedAuthor = body.author.trim();
  if (trimmedAuthor.length < 1 || trimmedAuthor.length > 100) {
    return { isValid: false, error: "Author must be between 1 and 100 characters" };
  }

  const currentYear = new Date().getFullYear();
  if (typeof body.year !== "number" || !Number.isInteger(body.year)) {
    return { isValid: false, error: "Year must be an integer" };
  }
  if (body.year < 1000 || body.year > currentYear) {
    return {
      isValid: false,
      error: `Year must be an integer between 1000 and ${currentYear}`,
    };
  }

  if (typeof body.genre !== "string" || !VALID_GENRES.includes(body.genre)) {
    return {
      isValid: false,
      error: `Genre must be one of: ${VALID_GENRES.join(", ")}`,
    };
  }

  let read = false;
  if (body.read !== undefined) {
    if (typeof body.read !== "boolean") {
      return { isValid: false, error: "Read must be a boolean" };
    }
    read = body.read;
  }

  let rating = null;
  if (body.rating !== undefined && body.rating !== null) {
    if (!read) {
      return { isValid: false, error: "Rating is allowed only when read is true" };
    }
    if (
      typeof body.rating !== "number" ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return {
        isValid: false,
        error: "Rating must be an integer between 1 and 5, or null",
      };
    }
    rating = body.rating;
  }

  return {
    isValid: true,
    data: {
      title: trimmedTitle,
      author: trimmedAuthor,
      year: body.year,
      genre: body.genre,
      read,
      rating,
    },
  };
}

export function validatePatchPayload(existingBook, body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    return { isValid: false, error: "Request body must be a JSON object" };
  }

  if (body.title !== undefined) {
    if (typeof body.title !== "string") {
      return { isValid: false, error: "Title must be a string" };
    }
  }

  if (body.author !== undefined) {
    if (typeof body.author !== "string") {
      return { isValid: false, error: "Author must be a string" };
    }
  }

  if (body.year !== undefined) {
    if (typeof body.year !== "number" || !Number.isInteger(body.year)) {
      return { isValid: false, error: "Year must be an integer" };
    }
  }

  if (body.genre !== undefined) {
    if (typeof body.genre !== "string") {
      return { isValid: false, error: "Genre must be a string" };
    }
  }

  if (body.read !== undefined) {
    if (typeof body.read !== "boolean") {
      return { isValid: false, error: "Read must be a boolean" };
    }
  }

  if (body.rating !== undefined && body.rating !== null) {
    if (
      typeof body.rating !== "number" ||
      !Number.isInteger(body.rating) ||
      body.rating < 1 ||
      body.rating > 5
    ) {
      return {
        isValid: false,
        error: "Rating must be an integer between 1 and 5, or null",
      };
    }
  }

  const nextRead = body.read !== undefined ? body.read : existingBook.read;
  let nextRating;
  if (!nextRead) {
    if (body.rating !== undefined && body.rating !== null) {
      return { isValid: false, error: "Rating is allowed only when read is true" };
    }
    nextRating = null;
  } else {
    nextRating = body.rating !== undefined ? body.rating : existingBook.rating;
  }

  const merged = {
    title: body.title !== undefined ? body.title : existingBook.title,
    author: body.author !== undefined ? body.author : existingBook.author,
    year: body.year !== undefined ? body.year : existingBook.year,
    genre: body.genre !== undefined ? body.genre : existingBook.genre,
    read: nextRead,
    rating: nextRating,
  };

  return validateBookPayload(merged);
}

export function validateQueryParams(query) {
  for (const key of Object.keys(query)) {
    if (!ALLOWED_QUERY_PARAMS.includes(key)) {
      return { isValid: false, error: `Invalid query parameter: "${key}"` };
    }
    if (Array.isArray(query[key])) {
      return { isValid: false, error: `Repeated query parameter: "${key}"` };
    }
  }

  const { genre, read, q, sort, order, limit, page } = query;

  if (genre !== undefined && !VALID_GENRES.includes(genre)) {
    return {
      isValid: false,
      error: `Invalid genre parameter. Allowed: ${VALID_GENRES.join(", ")}`,
    };
  }

  if (read !== undefined && read !== "true" && read !== "false") {
    return {
      isValid: false,
      error: 'Invalid read parameter. Must be "true" or "false"',
    };
  }

  if (sort !== undefined && !ALLOWED_SORT_FIELDS.includes(sort)) {
    return {
      isValid: false,
      error: `Invalid sort parameter. Allowed: ${ALLOWED_SORT_FIELDS.join(", ")}`,
    };
  }

  if (order !== undefined && !ALLOWED_ORDER_VALUES.includes(order)) {
    return {
      isValid: false,
      error: 'Invalid order parameter. Must be "asc" or "desc"',
    };
  }

  let parsedLimit = 50;
  if (limit !== undefined) {
    if (!/^\d+$/.test(limit)) {
      return {
        isValid: false,
        error: "Invalid limit parameter. Must be an integer between 1 and 50",
      };
    }
    parsedLimit = Number(limit);
    if (parsedLimit < 1 || parsedLimit > 50) {
      return {
        isValid: false,
        error: "Invalid limit parameter. Must be an integer between 1 and 50",
      };
    }
  }

  let parsedPage = 1;
  if (page !== undefined) {
    if (!/^\d+$/.test(page)) {
      return {
        isValid: false,
        error: "Invalid page parameter. Must be an integer >= 1",
      };
    }
    parsedPage = Number(page);
    if (parsedPage < 1) {
      return {
        isValid: false,
        error: "Invalid page parameter. Must be an integer >= 1",
      };
    }
  }

  return {
    isValid: true,
    params: {
      genre,
      read: read !== undefined ? read === "true" : undefined,
      q: typeof q === "string" ? q.trim() : undefined,
      sort: sort || "id",
      order: order || "asc",
      limit: parsedLimit,
      page: parsedPage,
    },
  };
}
