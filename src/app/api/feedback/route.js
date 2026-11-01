
import db, { initializeDatabase } from "@/lib/db";

// GET: Retrieve all feedback
export async function GET() {
  try {
    await initializeDatabase();

    const result = await db.execute(`
      SELECT * FROM feedback
      ORDER BY id DESC
    `);

    return Response.json(result.rows, { status: 200 });

  } catch (error) {
    console.error("Error fetching feedback:", error);

    return Response.json(
      { error: "Failed to retrieve feedback." },
      { status: 500 }
    );
  }
}

// POST: Submit new feedback
export async function POST(request) {
  try {
    await initializeDatabase();

    const body = await request.json();
    const { name, message, rating } = body;

    // Server-side validation
    if (
      typeof name !== "string" ||
      typeof message !== "string" ||
      typeof rating !== "number"
    ) {
      return Response.json(
        { error: "Invalid feedback data." },
        { status: 400 }
      );
    }

    const cleanName = name.trim();
    const cleanMessage = message.trim();

    if (!cleanName || !cleanMessage) {
      return Response.json(
        { error: "Name and message are required." },
        { status: 400 }
      );
    }

    if (cleanName.length > 50) {
      return Response.json(
        { error: "Name must not exceed 50 characters." },
        { status: 400 }
      );
    }

    if (cleanMessage.length > 500) {
      return Response.json(
        { error: "Message must not exceed 500 characters." },
        { status: 400 }
      );
    }

    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      return Response.json(
        { error: "Rating must be between 1 and 5." },
        { status: 400 }
      );
    }

    // Save feedback in Turso
    const result = await db.execute({
      sql: `
        INSERT INTO feedback (name, message, rating)
        VALUES (?, ?, ?)
      `,
      args: [cleanName, cleanMessage, rating],
    });

    // Retrieve the newly created entry
    const newFeedback = await db.execute({
      sql: "SELECT * FROM feedback WHERE id = ?",
      args: [result.lastInsertRowid],
    });

    return Response.json(newFeedback.rows[0], { status: 201 });

  } catch (error) {
    console.error("Error submitting feedback:", error);

    return Response.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
