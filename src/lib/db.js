
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

// Store the database in a data folder at the project root.
const dataDirectory = path.join(process.cwd(), "data");

if (!fs.existsSync(dataDirectory)) {
  fs.mkdirSync(dataDirectory, { recursive: true });
}

const databasePath = path.join(dataDirectory, "feedback.db");

// Reuse the database connection during Next.js development.
const globalForDatabase = globalThis;

const db =
  globalForDatabase.feedbackDb ||
  new Database(databasePath);

if (process.env.NODE_ENV !== "production") {
  globalForDatabase.feedbackDb = db;
}

// Create the feedback table if it doesn't exist.
db.exec(`
  CREATE TABLE IF NOT EXISTS feedback (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    message TEXT NOT NULL,
    rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
    created_at TEXT DEFAULT CURRENT_TIMESTAMP
  )
`);

// Add sample feedback if the table is empty.
const feedbackCount = db
  .prepare("SELECT COUNT(*) AS count FROM feedback")
  .get();

if (feedbackCount.count === 0) {
  db.prepare(`
    INSERT INTO feedback (name, message, rating)
    VALUES (?, ?, ?)
  `).run(
    "nivedithan@mulearn",
    "Excited to be part of the μLearn community!",
    5
  );
}

export default db;
