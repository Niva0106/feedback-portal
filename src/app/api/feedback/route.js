
import db from "@/lib/db";

// Ensure this route runs in Node.js.
export const runtime = "nodejs";

// GET: Retrieve all feedback
export async function GET() {
  try {
    const feedback = db.prepare(`
      SELECT * FROM feedback
      ORDER BY id DESC
    `).all();

    return Response.json(feedback, { status: 200 });

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

    // Save feedback in SQLite
    const result = db.prepare(`
      INSERT INTO feedback (name, message, rating)
      VALUES (?, ?, ?)
    `).run(cleanName, cleanMessage, rating);

    // Retrieve the newly created entry
    const newFeedback = db.prepare(`
      SELECT * FROM feedback WHERE id = ?
    `).get(result.lastInsertRowid);

    return Response.json(newFeedback, { status: 201 });

  } catch (error) {
    console.error("Error submitting feedback:", error);

    return Response.json(
      { error: "Failed to submit feedback." },
      { status: 500 }
    );
  }
}
