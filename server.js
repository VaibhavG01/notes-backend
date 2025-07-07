const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const mysql = require("mysql2");

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MySQL connection
const db = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "", // your password
  database: "notes_app",
});

// Test DB connection
db.connect((err) => {
  if (err) {
    console.error("DB connection failed:", err);
  } else {
    console.log("MySQL connected!");
  }
});

// Routes

// Get all notes
app.get("/notes", (req, res) => {
  db.query("SELECT * FROM notes ORDER BY id DESC", (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json(result);
  });
});

// Add a new note
app.post("/notes", (req, res) => {
  const { title, content } = req.body;
  db.query(
    "INSERT INTO notes (title, content) VALUES (?, ?)",
    [title, content],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Note created", id: result.insertId });
    }
  );
});

// Update a note
app.put("/notes/:id", (req, res) => {
  const { id } = req.params;
  const { title, content } = req.body;
  db.query(
    "UPDATE notes SET title=?, content=? WHERE id=?",
    [title, content, id],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({ message: "Note updated" });
    }
  );
});

// Delete a note
app.delete("/notes/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM notes WHERE id=?", [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Note deleted" });
  });
});

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
