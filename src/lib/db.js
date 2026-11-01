
import { createClient } from "@libsql/client";

// Connect to the Turso database
const db = createClient({
  url: process.env.TURSO_DATABASE_URL,
  authToken: process.env.TURSO_AUTH_TOKEN,
});

// Create the feedback table if it doesn't exist
export async function initializeDatabase() {
  await db.execute(`
    CREATE TABLE IF NOT EXISTS feedback (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      message TEXT NOT NULL,
      rating INTEGER NOT NULL CHECK (rating BETWEEN 1 AND 5),
      created_at TEXT DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Add sample feedback if the table is empty
  const result = await db.execute(
    "SELECT COUNT(*) AS count FROM feedback"
  );

  const count = Number(result.rows[0].count);

  if (count === 0) {
    await db.execute({
      sql: `
        INSERT INTO feedback (name, message, rating)
        VALUES (?, ?, ?)
      `,
      args: [
        "nivedithan@mulearn",
        "Excited to be part of the μLearn community!",
        5,
      ],
    });
  }
}

export default db;
