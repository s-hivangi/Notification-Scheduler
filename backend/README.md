# Notification Scheduler

Priority-based SMS notification scheduler built with Node.js, Express, and MongoDB, using a manually implemented Min Heap as the core data structure.

## Features
- Hand-coded Min Heap (priority queue), no external queue libraries
- Dynamic priority scoring (importance + urgency + type + retry boost)
- Twilio SMS delivery
- Automatic retry with priority escalation
- Crash recovery by reloading pending notifications from MongoDB on startup
- Input validation, centralized error handling, and graceful shutdown

## Project Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   └── notificationController.js
├── middleware/
│   └── errorHandler.js
├── models/
│   └── Notification.js
├── routes/
│   └── notificationRoutes.js
├── scheduler/
│   ├── heapStore.js
│   └── worker.js
├── services/
│   └── smsService.js
├── utils/
│   ├── logger.js
│   ├── MinHeap.js
│   ├── priorityCalculator.js
│   └── validators.js
├── .env.example
├── app.js
├── package.json
├── README.md
└── server.js
```

## Setup

1. Install dependencies:

```bash
npm install
```

2. Configure environment:

```bash
cp .env.example .env
```

Update `.env` with real values for `MONGO_URI` and Twilio credentials.

3. Run:

```bash
npm start
# or
npm run dev
```

## API Endpoints

- `POST /api/notifications` Create and queue a notification
- `GET /api/notifications` List notifications (`?status=pending|sent|failed`)
- `GET /api/notifications/:id` Fetch single notification
- `PATCH /api/notifications/:id` Update and recalculate priority
- `DELETE /api/notifications/:id` Delete and remove from heap
- `GET /api/notifications/debug/heap` Inspect in-memory heap
- `GET /health` Service health check

## Example Request

```bash
curl -X POST http://localhost:5000/api/notifications \
  -H "Content-Type: application/json" \
  -d '{
    "message": "Your appointment is at 3pm",
    "phone": "+14155552671",
    "scheduledTime": "2026-12-31T14:55:00Z",
    "importance": 3,
    "type": "reminder"
  }'
```

## Priority Formula

`priorityScore = (2 * importance) + (3 * urgency) + (2 * typeScore) + (retryCount * 2)`

- `urgency`: `5` (<=1 min), `4` (<=5 min), `3` (<=15 min), `1` (else)
- `typeScore`: `system=5`, `reminder=3`, `marketing=1`


