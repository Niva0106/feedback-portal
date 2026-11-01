# FeedbackHub

A full-stack feedback portal built with Next.js for the μLearn Web Development Challenge.

### Features
- Submit feedback with name, message, and rating.
- View submitted feedback.
- Edit and delete feedback.
- Client-side and server-side validation.
- Persistent database storage.

### Tech Stack
Next.js · React · JavaScript · Tailwind CSS · Turso · Vercel

### API Routes
- `GET /api/feedback` – Fetch feedback
- `POST /api/feedback` – Submit feedback
- `PUT /api/feedback/[id]` – Edit feedback
- `DELETE /api/feedback/[id]` – Delete feedback

### Run Locally
```bash
npm install
npm run dev
```

Configure `TURSO_DATABASE_URL` and `TURSO_AUTH_TOKEN` in `.env.local` before running.

### Live Demo
https://feedback-portal-murex.vercel.app

Built for the μLearn Foundation Web Development Challenge.
