# Reading List Application (Assignment 9)

A full-stack REST API and React single-page application for managing a reading list, built strictly with Node.js LTS, Express 5, and Vite React.

## Project Structure

```text
/assignment9
 ├─ server/
 │   ├─ server.js
 │   ├─ booksStore.js
 │   ├─ validate.js
 │   ├─ package.json
 │   └─ package-lock.json
 ├─ client/
 │   ├─ src/
 │   │   ├─ api/books.js
 │   │   ├─ components/
 │   │   ├─ App.jsx
 │   │   └─ main.jsx
 │   ├─ .env.example
 │   ├─ index.html
 │   └─ package.json
 ├─ .gitignore
 └─ README.md
```

## Features

- RESTful API with Express 5 (pure ES modules).
- In-memory data store with simulated asynchronous delays and immutable data handling.
- Strict input validation for query parameters, route parameters, and request bodies.
- CORS configuration restricted strictly to the client's origin.
- React frontend with function components and hooks, with all networking isolated in a dedicated API module.
