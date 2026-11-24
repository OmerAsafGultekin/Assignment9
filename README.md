# Reading List Application (Assignment 9)

A full-stack REST API and React single-page application for managing a reading list, built strictly with Node.js LTS, Express 5, and Vite React.

---

## 1. Installation & Running Instructions

### Prerequisites
- Node.js LTS (v20+ or v24+)
- npm (v10+)

### Environment Configuration
Both `server/` and `client/` use `.env` files for configuration, with committed `.env.example` templates.

- **Server (`server/.env.example`)**:
  ```env
  PORT=3000
  CLIENT_ORIGIN=http://localhost:5173
  ```
- **Client (`client/.env.example`)**:
  ```env
  VITE_API_URL=http://localhost:3000
  ```

### Running the Server
1. Navigate to `server/`:
   ```bash
   cd server
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the server:
   - Development (watch mode):
     ```bash
     npm run dev
     ```
   - Production mode:
     ```bash
     npm start
     ```
   Server runs on `http://localhost:3000`.

### Running the Client
1. Navigate to `client/`:
   ```bash
   cd client
   ```
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the Vite development server:
   ```bash
   npm run dev
   ```
   Client runs on `http://localhost:5173`.

---

## 2. File Organization

```text
/assignment9
 ├─ server/
 │   ├─ server.js           # Express 5 application, CORS, routes & error middleware
 │   ├─ booksStore.js       # In-memory store with async simulated I/O & immutable copies
 │   ├─ validate.js         # Manual validation for IDs, payloads, and query parameters
 │   ├─ package.json        # Server scripts (node & node --watch) and dependencies
 │   ├─ package-lock.json
 │   └─ .env.example        # Server environment variables template
 ├─ client/
 │   ├─ src/
 │   │   ├─ api/
 │   │   │   └─ books.js    # Dedicated Fetch API module with error & 204 handling
 │   │   ├─ components/
 │   │   │   ├─ BookForm.jsx    # Add/edit form with server validation error alerts
 │   │   │   ├─ BookList.jsx    # Book list rendering with loading, error & empty states
 │   │   │   ├─ FilterBar.jsx   # Search, genre/read filters, and sorting controls
 │   │   │   └─ StatsPanel.jsx  # Live computed reading statistics panel
 │   │   ├─ App.jsx         # Root component with AbortController query handling
 │   │   ├─ index.css       # Clean semantic styling without external UI frameworks
 │   │   └─ main.jsx        # React DOM root entrypoint
 │   ├─ .env.example        # Client environment variables template
 │   ├─ index.html          # HTML entrypoint
 │   ├─ package.json        # Client Vite dependencies and scripts
 │   ├─ package-lock.json
 │   └─ vite.config.js      # Clean Vite config without proxy
 ├─ .gitignore              # Ignores node_modules, .env files, dist, OS artifacts
 └─ README.md               # Project documentation, evidence, reasoning & self-study
```

---

## 3. Testing Evidence (`curl -i`)

Below are authentic terminal outputs captured directly against the running Express 5 server.

### 1. `200` List with Combination of at Least Two Query Parameters
```http
=== COMMAND: curl.exe -i "http://127.0.0.1:3000/api/books?genre=fiction&read=true" ===
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 219
ETag: W/"db-EndxLfyCTkROGaBnevr/2S1yAH4"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

[{"id":1,"title":"To Kill a Mockingbird","author":"Harper Lee","year":1960,"genre":"fiction","read":true,"rating":5},{"id":2,"title":"1984","author":"George Orwell","year":1949,"genre":"fiction","read":true,"rating":4}]
```

### 2. `200` for One Book
```http
=== COMMAND: curl.exe -i "http://127.0.0.1:3000/api/books/1" ===
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 115
ETag: W/"73-PmrFfGwy3yZQ3Tyy7Noq4r8kmz8"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":1,"title":"To Kill a Mockingbird","author":"Harper Lee","year":1960,"genre":"fiction","read":true,"rating":5}
```

### 3. `201` Created (Showing `Location` Header)
```http
=== COMMAND: curl.exe -i -X POST "http://127.0.0.1:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"Brave New World\",\"author\":\"Aldous Huxley\",\"year\":1932,\"genre\":\"fiction\",\"read\":true,\"rating\":5}" ===
HTTP/1.1 201 Created
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Location: /api/books/7
Content-Type: application/json; charset=utf-8
Content-Length: 112
ETag: W/"70-qJn5NaXznspjaVjvLXfIvv7Mt3k"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":7,"title":"Brave New World","author":"Aldous Huxley","year":1932,"genre":"fiction","read":true,"rating":5}
```

### 4. `400` for Invalid Request Body
```http
=== COMMAND: curl.exe -i -X POST "http://127.0.0.1:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"\",\"author\":\"Aldous Huxley\",\"year\":900,\"genre\":\"invalid_genre\"}" ===
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 54
ETag: W/"36-2Rygc0uaNi6iZpfSVzMK4FGxgrE"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Title must be between 1 and 100 characters"}
```

### 5. `400` for Repeated Query Parameter
```http
=== COMMAND: curl.exe -i "http://127.0.0.1:3000/api/books?genre=fiction&genre=science" ===
HTTP/1.1 400 Bad Request
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 47
ETag: W/"2f-jXymHsfOve6apF4098TnLr4/yog"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Repeated query parameter: \"genre\""}
```

### 6. `404` for Missing Book
```http
=== COMMAND: curl.exe -i "http://127.0.0.1:3000/api/books/999" ===
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-9K7Ys+5Z9m3qczPTmMk82VGBL7g"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Book not found"}
```

### 7. `409` for Duplicate Title and Author
```http
=== COMMAND: curl.exe -i -X POST "http://127.0.0.1:3000/api/books" -H "Content-Type: application/json" -d "{\"title\":\"1984\",\"author\":\"George Orwell\",\"year\":1949,\"genre\":\"fiction\"}" ===
HTTP/1.1 409 Conflict
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 64
ETag: W/"40-Y8ZVtnRDFrTFCmvse+K/kdGoMVg"
Date: Tue, 24 Nov 2026 20:31:11 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"A book with the same title and author already exists"}
```

### 8. `PUT` and `PATCH` on the Same Book (Showing the Difference)

#### PUT (Full Resource Replacement)
```http
=== COMMAND: curl.exe -i -X PUT "http://127.0.0.1:3000/api/books/3" -H "Content-Type: application/json" -d "{\"title\":\"A Brief History of Time\",\"author\":\"Stephen Hawking\",\"year\":1988,\"genre\":\"science\",\"read\":true,\"rating\":4}" ===
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 122
ETag: W/"7a-xY8Pj/l9Oz9HrEcthGIYySXX/LQ"
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":3,"title":"A Brief History of Time","author":"Stephen Hawking","year":1988,"genre":"science","read":true,"rating":4}
```

#### PATCH (Partial Field Modification)
```http
=== COMMAND: curl.exe -i -X PATCH "http://127.0.0.1:3000/api/books/3" -H "Content-Type: application/json" -d "{\"rating\":5}" ===
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 122
ETag: W/"7a-i258M6O0jJQ9LemgjvBRx4h7lW8"
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"id":3,"title":"A Brief History of Time","author":"Stephen Hawking","year":1988,"genre":"science","read":true,"rating":5}
```

### 9. `204` for Delete, Followed by `404` for Repeated Delete

#### First Delete (204 No Content)
```http
=== COMMAND: curl.exe -i -X DELETE "http://127.0.0.1:3000/api/books/5" ===
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

#### Repeated Delete (404 Not Found)
```http
=== COMMAND: curl.exe -i -X DELETE "http://127.0.0.1:3000/api/books/5" ===
HTTP/1.1 404 Not Found
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 26
ETag: W/"1a-9K7Ys+5Z9m3qczPTmMk82VGBL7g"
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"error":"Book not found"}
```

### 10. `GET /api/stats` Before and After a Mutation

#### Before Deleting Book 6
```http
=== COMMAND: curl.exe -i "http://127.0.0.1:3000/api/stats" ===
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 115
ETag: W/"73-PB3P6shjiZd/Msntf6s1jQMM0ko"
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"total":6,"read":6,"unread":0,"averageRating":4.7,"byGenre":{"fiction":3,"science":1,"history":1,"non-fiction":1}}
```

#### Mutation
```http
=== COMMAND: curl.exe -i -X DELETE "http://127.0.0.1:3000/api/books/6" ===
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

#### After Deleting Book 6
```http
=== COMMAND: curl.exe -i "http://127.0.0.1:3000/api/stats" ===
HTTP/1.1 200 OK
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin
Content-Type: application/json; charset=utf-8
Content-Length: 99
ETag: W/"63-Nzr0U8jxOkMNJLXPgBIDXJpbPK8"
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5

{"total":5,"read":5,"unread":0,"averageRating":4.8,"byGenre":{"fiction":3,"science":1,"history":1}}
```

---

## 4. Preflight Evidence (`OPTIONS`)

### `curl -i` Evidence
```http
=== COMMAND: curl.exe -i -X OPTIONS "http://127.0.0.1:3000/api/books" -H "Origin: http://localhost:5173" -H "Access-Control-Request-Method: POST" -H "Access-Control-Request-Headers: Content-Type" ===
HTTP/1.1 204 No Content
X-Powered-By: Express
Access-Control-Allow-Origin: http://localhost:5173
Vary: Origin, Access-Control-Request-Headers
Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE
Access-Control-Allow-Headers: Content-Type
Content-Length: 0
Date: Tue, 24 Nov 2026 20:31:12 GMT
Connection: keep-alive
Keep-Alive: timeout=5
```

### Browser Network Tab Description
When a user submits the `BookForm` from the browser running at `http://localhost:5173`, the browser determines that sending a `POST` request with `Content-Type: application/json` is not a simple CORS request. The browser automatically dispatches an `OPTIONS` preflight request to `http://localhost:3000/api/books` before sending the actual `POST`.

In the browser's Developer Tools Network tab:
1. An entry appears with Method `OPTIONS`, Status `204 No Content`, and Type `preflight`.
2. **Request Headers** sent by the browser:
   - `Host: localhost:3000`
   - `Origin: http://localhost:5173`
   - `Access-Control-Request-Method: POST`
   - `Access-Control-Request-Headers: content-type`
3. **Response Headers** returned by the server's `cors` middleware:
   - `Access-Control-Allow-Origin: http://localhost:5173`
   - `Access-Control-Allow-Methods: GET,HEAD,PUT,PATCH,POST,DELETE`
   - `Access-Control-Allow-Headers: content-type`
   - `Vary: Origin, Access-Control-Request-Headers`
4. Because `Access-Control-Allow-Origin` matches the browser's origin (`http://localhost:5173`), the browser permits the subsequent `POST` request to proceed immediately.

---

## 5. Reasoning Questions

### 1. Parameters
> **Question:** Why is the book’s id a route parameter while genre and sort are query parameters? What would change if id were in the query string?

**Answer:**  
In RESTful architecture, route parameters identify a specific entity within a resource collection hierarchy (`/api/books/:id`), giving each individual book its own distinct canonical URL and cache identity. In contrast, query parameters (`?genre=fiction&sort=title`) modify or filter the representation of the collection without changing the identity of the underlying resource itself. If `id` were placed in the query string (e.g., `/api/books?id=1`), the endpoint would represent a search query returning an array of items rather than a direct reference to a single resource entity, violating REST design conventions and standard HTTP caching semantics.

### 2. Body Parsing (Experiment)
> **Question:** Experiment: move `express.json()` below the routes. What happened to `req.body`, and what status did a POST return?

**Answer:**  
When `express.json()` was moved below the route declarations, Express executed route handlers before any request stream parsing middleware was engaged. When a `POST /api/books` request arrived, `req.body` was `undefined` inside the route handler. Our validation middleware checks `!body || typeof body !== "object"`, immediately failing and returning status `400 Bad Request` with `{ "error": "Request body must be a JSON object" }`.

### 3. One Response (Experiment)
> **Question:** Experiment: remove the `return` before an early 404 response in one handler. What happened and why?

**Answer:**  
When `return` was removed before the early `res.status(404).json({ error: "Book not found" })` in `GET /api/books/:id`, the handler sent the 404 response but JavaScript continued executing the remainder of the function. Execution then reached the subsequent `res.status(200).json(book)` line, attempting to set headers and write to an HTTP response stream that was already closed. This caused Node.js to throw `Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client`, illustrating that every early response must be accompanied by `return` to halt function execution.

### 4. PUT and PATCH
> **Question:** Using your own API, explain a situation where PATCH is the better choice and one where PUT is.

**Answer:**  
`PATCH` is the superior choice when performing partial, targeted state updates without transmitting the entire resource—such as clicking "Mark Read" or selecting a 1–5 star rating on a book card in the list, where sending `{ "read": true, "rating": 5 }` avoids re-submitting unchanged fields (`title`, `author`, `year`, `genre`). `PUT` is the better choice when editing a book through the full edit form, where the client sends a complete, updated representation of the book resource to replace all existing fields simultaneously.

### 5. CORS (Experiment)
> **Question:** Experiment: set `CLIENT_ORIGIN` to a wrong value. What did the browser console show, did the server log the request, and why does curl still work?

**Answer:**  
When `CLIENT_ORIGIN` was set to `http://localhost:9999`, the browser console displayed: `Access to fetch at 'http://localhost:3000/api/books' from origin 'http://localhost:5173' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource.` The server still processed and logged the incoming request because CORS is not a server firewall; the server simply omits the `Access-Control-Allow-Origin` response header. `curl` continued to work normally because CORS is a security mechanism enforced exclusively by web browsers adhering to the Same-Origin Policy; command-line utilities like `curl` do not enforce origin restrictions.

### 6. Validation
> **Question:** The client already checks the form. Why must the server validate again?

**Answer:**  
Client-side validation exists solely for user experience and interface convenience, providing immediate feedback before sending a network request. It provides zero security or data integrity guarantees because client-side code runs in an untrusted environment completely controlled by the user. Any client can bypass UI checks using `curl`, Postman, browser developer tools, or automated scripts, making server-side validation mandatory as the single source of truth to protect the system against invalid, malformed, or hostile inputs.

### 7. State (Experiment)
> **Question:** Restart the server and describe what happened to the data. What does this tell you about where the data lives, and what is needed to keep it?

**Answer:**  
After modifying books and restarting the Node.js server, all added, updated, and deleted books vanished, and the collection reverted to the original 6 seed books. This demonstrates that the data lives entirely in volatile system RAM within the Node.js runtime heap. To persist state across server restarts, crashes, or deployments, the server must write changes to persistent non-volatile storage, such as a database (e.g., PostgreSQL, SQLite, MongoDB) or a file on disk.

---

## 6. Self-Study Notes

### 1. Building Query Strings Safely with `URLSearchParams`
The `URLSearchParams` interface provides a standard, robust mechanism for constructing query strings without manual string concatenation. It automatically applies proper percent-encoding (`encodeURIComponent`) to special characters, symbols, and spaces (e.g., `q="Science & Nature"` is encoded as `q=Science+%26+Nature`), preventing malformed URLs or query injection. In `client/src/api/books.js`, we iterate over parameters and set them using `searchParams.set(key, value)`, safely omitting empty strings, `null`, `undefined`, and default `"all"` selections.

### 2. Alphabetical String Comparison with `localeCompare`
In JavaScript, relational comparison operators (`<` and `>`) compare strings using raw UTF-16 code unit values, causing uppercase letters (`"Z"`) to incorrectly sort before lowercase letters (`"a"`) and mishandling accented characters (`"é"`, `"ü"`). Using `a.localeCompare(b)` performs linguistic, locale-aware string comparison according to natural language alphabetical conventions. In `server/server.js`, `localeCompare` is used to sort books alphabetically by `title` and `author`.

### 3. Vite Environment Variables and the `VITE_` Prefix
Vite exposes environment variables on the `import.meta.env` object. By default, Vite only exposes variables that start with the prefix `VITE_` (e.g., `VITE_API_URL`) to client-side source code. This security restriction prevents sensitive host environment variables (such as private API keys, database credentials, or system paths) from accidentally being baked into the static JavaScript bundles delivered to client web browsers.

### 4. Sending an Empty 204 Response in Express 5
HTTP status `204 No Content` indicates that an action succeeded but the server purposefully returns no message body. In Express 5, the correct way to respond with an empty body is `res.status(204).end()`. Calling `res.status(204).json(...)` or `res.send(...)` with content violates RFC specifications, whereas `.end()` immediately terminates the response stream without sending unnecessary `Content-Type` headers. On the client side in `client/src/api/books.js`, the helper checks `response.status === 204` and returns `null` instead of calling `response.json()`, preventing JSON parse errors on empty responses.

### 5. Cancelling Fetch Requests and Recognizing `AbortError`
Network requests in modern browsers can be aborted using the `AbortController` API by passing `controller.signal` into `fetch(url, { signal })`. When a component unmounts or a user rapidly changes search/filter parameters, invoking `controller.abort()` cancels the in-flight HTTP request. When cancelled, `fetch` rejects with a DOMException whose `err.name === 'AbortError'`. In our React components, we check `if (err.name !== 'AbortError')` inside the catch block to gracefully ignore intentional cancellations and prevent outdated network responses from overwriting newer application state.

---

## 7. Challenges Faced & Solutions

1. **Rating Constraint Coupling with Read Status:**  
   The specification dictates that `rating` is allowed *only* when `read === true`. When a user toggles a book from read to unread via `PATCH`, retaining an existing numerical rating would cause validation to fail. In `server/validate.js` and `server/booksStore.js`, marking a book as unread (`read: false`) automatically resets `rating` to `null` unless the client explicitly passes a non-null rating (which is rejected with 400).

2. **Unrated Books Sorting Last in Both Directions:**  
   Standard ascending or descending numerical sorting places `null` either at the start or end depending on direction. To meet the requirement that unrated books *always* sort last regardless of whether `order` is `asc` or `desc`, custom comparator logic was implemented in `server/server.js`: if one book has a rating and the other is `null`, the rated book always precedes the unrated one, partitioning all unrated books to the end in both directions.

3. **Strict Zero-Proxy Single-Origin CORS:**  
   Rather than relying on Vite's development proxy (`server.proxy`), the application adheres to production-grade security standards by using the server's `cors` middleware explicitly bound to `process.env.CLIENT_ORIGIN` (falling back to `http://localhost:5173`), correctly supporting preflight `OPTIONS` requests and JSON API calls.
