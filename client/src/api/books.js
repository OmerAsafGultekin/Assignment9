const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

async function request(endpoint, options = {}) {
  const { body, headers = {}, signal, ...customConfig } = options;

  const config = {
    ...customConfig,
    headers: {
      ...headers,
    },
    signal,
  };

  if (body !== undefined) {
    config.headers["Content-Type"] = "application/json";
    config.body = JSON.stringify(body);
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, config);

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const errorData = await response.json();
      if (errorData && errorData.error) {
        errorMessage = errorData.error;
      }
    } catch {
      errorMessage = response.statusText || errorMessage;
    }
    throw new Error(errorMessage);
  }

  if (response.status === 204) {
    return null;
  }

  return response.json();
}

export async function fetchBooks(params = {}, signal) {
  const searchParams = new URLSearchParams();

  for (const [key, value] of Object.entries(params)) {
    if (value === undefined || value === null) {
      continue;
    }

    if (typeof value === "string") {
      const trimmed = value.trim();
      if (trimmed === "" || trimmed.toLowerCase() === "all") {
        continue;
      }
      searchParams.set(key, trimmed);
    } else {
      searchParams.set(key, String(value));
    }
  }

  const queryString = searchParams.toString();
  const endpoint = queryString ? `/api/books?${queryString}` : "/api/books";
  return request(endpoint, { signal });
}

export async function fetchBookById(id, signal) {
  return request(`/api/books/${id}`, { signal });
}

export async function createBook(bookData, signal) {
  return request("/api/books", {
    method: "POST",
    body: bookData,
    signal,
  });
}

export async function updateBook(id, bookData, signal) {
  return request(`/api/books/${id}`, {
    method: "PUT",
    body: bookData,
    signal,
  });
}

export async function patchBook(id, partialData, signal) {
  return request(`/api/books/${id}`, {
    method: "PATCH",
    body: partialData,
    signal,
  });
}

export async function deleteBook(id, signal) {
  return request(`/api/books/${id}`, {
    method: "DELETE",
    signal,
  });
}

export async function fetchStats(signal) {
  return request("/api/stats", { signal });
}
