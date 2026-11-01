
import db from "@/lib/db";

export const runtime = "nodejs";

// PUT: Update existing feedback
export async function PUT(request, { params }) {
  try {
    const { id } = await params;
    const feedbackId = Number(id);

    if (!Number.isInteger(feedbackId) || feedbackId <= 0) {
      return Response.json(
        { error: "Invalid feedback ID." },
        { status: 400 }
      );
    }

    // Check whether feedback exists
    const existingFeedback = db.prepare(
      "SELECT * FROM feedback WHERE id = ?"
    ).get(feedbackId);

    if (!existingFeedback) {
      return Response.json(
        { error: "Feedback not found." },
        { status: 404 }
      );
    }

    const body = await request.json();
    const { name, message, rating } = body;

    // Validate input types
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

    // Validate input values
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

    // Update database record
    db.prepare(`
      UPDATE feedback
      SET name = ?, message = ?, rating = ?
      WHERE id = ?
    `).run(cleanName, cleanMessage, rating, feedbackId);

    const updatedFeedback = db.prepare(
      "SELECT * FROM feedback WHERE id = ?"
    ).get(feedbackId);

    return Response.json(updatedFeedback, { status: 200 });

  } catch (error) {
    console.error("Error updating feedback:", error);

    return Response.json(
      { error: "Failed to update feedback." },
      { status: 500 }
    );
  }
}

// DELETE: Remove existing feedback
export async function DELETE(request, { params }) {
  try {
    const { id } = await params;
    const feedbackId = Number(id);

    if (!Number.isInteger(feedbackId) || feedbackId <= 0) {
      return Response.json(
        { error: "Invalid feedback ID." },
        { status: 400 }
      );
    }

    const result = db.prepare(
      "DELETE FROM feedback WHERE id = ?"
    ).run(feedbackId);

    if (result.changes === 0) {
      return Response.json(
        { error: "Feedback not found." },
        { status: 404 }
      );
    }

    return Response.json(
      { message: "Feedback deleted successfully." },
      { status: 200 }
    );

  } catch (error) {
    console.error("Error deleting feedback:", error);

    return Response.json(
      { error: "Failed to delete feedback." },
      { status: 500 }
    );
  }
}
