# 📧 Notification Scheduler

A priority-based notification scheduling system built with **React Frontend** and **Express.js Backend**. This system allows users to schedule SMS notifications with intelligent priority management using a Min Heap data structure.

## 🎯 Project Overview

The Notification Scheduler is a complete application for managing time-based SMS notifications with intelligent queuing:

- **User schedules message** → **Stored in Database** → **Added to Min Heap** → **Backend scheduler checks time** → **When time matches** → **Twilio API called** → **SMS sent**

## 🏗️ Project Structure

```
Notification-Scheduler/
├── frontend/                 # React frontend application
│   ├── public/
│   ├── src/
│   │   ├── components/      # React components
│   │   ├── pages/           # Page components (Dashboard)
│   │   ├── services/        # API service layer
│   │   ├── styles/          # CSS styling
│   │   ├── App.js
│   │   └── index.js
│   ├── package.json
│   ├── .env                 # Environment variables
│   └── README.md            # Frontend specific docs
│
└── backend/                 # Express.js backend
    ├── config/              # Database configuration
    ├── controllers/         # Request handlers
    ├── models/              # Mongoose schemas
    ├── routes/              # API routes
    ├── services/            # Business logic (SMS service)
    ├── scheduler/           # Min Heap and worker
    ├── middleware/          # Express middleware
    ├── utils/               # Utilities (logger, validators, etc.)
    ├── app.js              # Express app
    ├── server.js           # Server entry point
    ├── package.json
    └── README.md           # Backend specific docs
```

## ✨ Features

### Frontend Features
- ✅ Create new notifications with form validation
- ✅ Schedule notifications for future delivery
- ✅ Set priority levels (1-3 scale)
- ✅ Choose notification types (system, reminder, marketing)
- ✅ View all scheduled notifications
- ✅ Edit pending notifications
- ✅ Delete notifications
- ✅ Real-time status updates (pending, sent, failed)
- ✅ View Min Heap snapshot (debug feature)
- ✅ Auto-refresh every 10 seconds
- ✅ Responsive design (mobile, tablet, desktop)
- ✅ Beautiful gradient UI with animations

### Backend Features
- ✅ Express.js REST API
- ✅ MongoDB database integration
- ✅ Min Heap priority queue implementation
- ✅ Scheduled worker for SMS delivery
- ✅ Twilio SMS integration
- ✅ Automatic retry mechanism
- ✅ Priority score calculation
- ✅ Error handling and logging
- ✅ CORS enabled for frontend
- ✅ Security middleware (Helmet)

## 🚀 Quick Start

### Prerequisites
- **Node.js** (v16.0.0 or higher)
- **npm** or **yarn**
- **MongoDB** (local or Atlas)
- **Twilio account** (for SMS)

### Installation

1. **Clone or download the project**
   ```bash
   cd Notification-Scheduler
   ```

2. **Setup Backend**
   ```bash
   cd backend
   npm install
   
   # Create .env file with:
   # PORT=5000
   # MONGODB_URI=mongodb://localhost:27017/notification-scheduler
   # TWILIO_ACCOUNT_SID=your_account_sid
   # TWILIO_AUTH_TOKEN=your_auth_token
   # TWILIO_PHONE_NUMBER=+1234567890
   
   npm run dev
   ```

3. **Setup Frontend (in new terminal)**
   ```bash
   cd frontend
   npm install
   npm start
   ```

4. **Open in browser**
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:5000

## 📖 Usage Guide

### Schedule a Notification

1. Fill in the notification form:
   - **Message**: What you want to send (max 1600 characters)
   - **Phone Number**: Recipient (E.164 format: +14155552671)
   - **Scheduled Time**: When to send it
   - **Importance**: Priority level (1=Low, 2=Medium, 3=High)
   - **Type**: Category (reminder, system, marketing)

2. Click "Schedule Notification"

3. Notification appears in the list below

### View & Manage Notifications

- **Status Indicators**: See if notification is pending, sent, or failed
- **Edit**: Modify message or importance of pending notifications
- **Delete**: Remove notifications from the system
- **Auto-Refresh**: Automatically updates list every 10 seconds

### Debug with Heap Viewer

- Click "Min Heap Snapshot" to expand
- See all notifications ordered by priority
- Top item will be sent first

## 📞 Phone Number Format

The system uses **E.164 international format**:
- Required: `+` prefix + country code + number
- Examples:
  - USA: `+14155552671`
  - UK: `+442071838750`
  - India: `+919876543210`

## 🔄 System Flow

```
┌─────────────┐
│   User      │
│  Schedules  │
│  Message    │
└──────┬──────┘
       │
       ▼
┌─────────────────────┐
│  Stored in MongoDB  │
│   (Notification)    │
└──────┬──────────────┘
       │
       ▼
┌──────────────────┐
│  Added to Min    │
│  Heap (Priority  │
│   Queue)         │
└──────┬───────────┘
       │
       ▼
┌────────────────────────┐
│  Backend Scheduler     │
│  Checks Time Interval  │
│  Every Second          │
└──────┬─────────────────┘
       │
       ▼ (When scheduled time matches)
┌────────────────────────┐
│  Top Item from Min     │
│  Heap Popped           │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│  Twilio API Called     │
│  Send SMS              │
└──────┬─────────────────┘
       │
       ▼
┌────────────────────────┐
│  Status Updated        │
│  (sent/failed)         │
│  Notification Removed  │
│  from Heap             │
└────────────────────────┘
```

## 🏛️ Architecture

### Frontend Architecture
```
┌─────────────────────────────────────┐
│         React Application           │
├─────────────────────────────────────┤
│  Components Layer                   │
│  ├── Header                         │
│  ├── NotificationForm               │
│  ├── NotificationList               │
│  └── HeapViewer                     │
├─────────────────────────────────────┤
│  Services Layer                     │
│  └── notificationApi.js             │
├─────────────────────────────────────┤
│  Styles                             │
│  └── App.css (responsive design)    │
└─────────────────────────────────────┘
         │
         │ Axios HTTP Requests
         │
         ▼
┌─────────────────────────────────────┐
│     Backend REST API                │
│  (http://localhost:5000)            │
└─────────────────────────────────────┘
```

### Backend Architecture
```
┌─────────────────────────────────────┐
│      Express.js Server              │
├─────────────────────────────────────┤
│  Routes: /api/notifications         │
│  └── POST, GET, PATCH, DELETE       │
├─────────────────────────────────────┤
│  Controllers                        │
│  └── notificationController.js      │
├─────────────────────────────────────┤
│  Services                           │
│  ├── smsService.js (Twilio)         │
│  └── priorityCalculator.js          │
├─────────────────────────────────────┤
│  Models                             │
│  └── Notification.js (Mongoose)     │
├─────────────────────────────────────┤
│  Scheduler                          │
│  ├── MinHeap.js (data structure)    │
│  ├── heapStore.js (state)           │
│  └── worker.js (process loop)       │
├─────────────────────────────────────┤
│  Middleware                         │
│  └── errorHandler.js                │
└─────────────────────────────────────┘
         │
         │ Mongoose
         │
         ▼
┌─────────────────────────────────────┐
│       MongoDB Database              │
│   (notifications collection)        │
└─────────────────────────────────────┘
```

## 📊 Data Model

### Notification Schema
```javascript
{
  _id: ObjectId,
  message: String,                // Max 1600 characters
  phone: String,                  // E.164 format
  scheduledTime: Date,            // When to send
  importance: Number,             // 1-3 (affects priority)
  type: String,                   // 'system', 'reminder', 'marketing'
  retryCount: Number,             // Automatic retry counter
  priorityScore: Number,          // Calculated score for heap
  status: String,                 // 'pending', 'sent', 'failed'
  createdAt: Date,
  updatedAt: Date
}
```

## 🔧 API Endpoints

### Create Notification
```http
POST /api/notifications
Content-Type: application/json

{
  "message": "Hello World",
  "phone": "+14155552671",
  "scheduledTime": "2024-04-22T10:00:00Z",
  "importance": 2,
  "type": "reminder"
}
```

### Get All Notifications
```http
GET /api/notifications
```

### Get Single Notification
```http
GET /api/notifications/:id
```

### Update Notification
```http
PATCH /api/notifications/:id
Content-Type: application/json

{
  "message": "Updated message",
  "importance": 3
}
```

### Delete Notification
```http
DELETE /api/notifications/:id
```

### Get Heap Snapshot (Debug)
```http
GET /api/notifications/debug/heap
```

## 🎨 UI Features

- **Responsive Design**: Works on mobile, tablet, and desktop
- **Gradient Background**: Modern purple gradient theme
- **Real-time Updates**: Auto-refresh every 10 seconds
- **Status Indicators**: Color-coded badges for status
- **Priority Visualization**: Color-coded importance levels
- **Smooth Animations**: Fade-in effects on notifications
- **Dark Text**: High contrast for accessibility
- **Responsive Grid**: Adapts layout based on screen size

## 🧠 Priority Algorithm

The system uses a priority score calculated as:
```
priorityScore = importance × urgencyFactor + typeWeight

Where:
- importance: 1-3 (higher = more important)
- urgencyFactor: Increases as scheduled time approaches
- typeWeight: Additional weight based on type (system > reminder > marketing)

Lower priority score = sent first (Min Heap property)
```

## ⚡ Performance

- **Min Heap Operations**: O(log n) add/remove
- **Backend Polling**: 1 second interval
- **Frontend Refresh**: 10 second interval (configurable)
- **Database Queries**: Indexed by priority score
- **Memory**: Heap stores only pending notifications

## 🔒 Security Features

- ✅ Input validation on all fields
- ✅ Phone number format validation (E.164)
- ✅ Message length limits (1600 chars)
- ✅ Helmet.js security headers
- ✅ CORS configured
- ✅ Error handler middleware
- ✅ No sensitive data in logs

## 🐛 Debugging

### Frontend
- Open browser DevTools (F12)
- Check Console for errors
- Check Network tab for API calls
- Use "Min Heap Snapshot" to debug ordering

### Backend
- Check terminal logs where `npm run dev` runs
- Enable verbose logging if needed
- Check MongoDB connection in logs
- Verify Twilio credentials are loaded

## 📝 Logging

- **Frontend**: Console logs (browser console)
- **Backend**: Morgan HTTP logger + custom logger
- **Database**: Mongoose query logs (in dev mode)

## 🛠️ Troubleshooting

| Issue | Solution |
|-------|----------|
| "Connection refused" | Ensure backend is running on port 5000 |
| "Invalid phone format" | Use E.164 format (e.g., +14155552671) |
| "MongoDB connection failed" | Check MONGODB_URI and ensure MongoDB is running |
| "Twilio error" | Verify account SID, auth token, and phone number |
| "Notifications not sending" | Check scheduled time is in future |
| "Heap not updating" | Click Manual Refresh or wait 10 seconds |

## 📚 Documentation

- [Frontend README](./frontend/README.md) - Frontend specific details
- [Backend README](./backend/README.md) - Backend specific details
- [Setup Guide](./SETUP_GUIDE.md) - Detailed installation and usage
- [API Documentation](./API.md) - Full API reference (if created)

## 🚀 Deployment

### Frontend (Vercel/Netlify)
```bash
npm run build
# Deploy the 'build' folder
```

### Backend (Heroku/Railway/AWS)
```bash
npm start
# Ensure environment variables are set
# PORT, MONGODB_URI, TWILIO_* variables
```

## 🤝 Contributing

To contribute to this project:
1. Make changes in a new branch
2. Test thoroughly
3. Submit a pull request
4. Provide clear description of changes

## 📄 License

MIT License - feel free to use this project for any purpose

## 📧 Support

For issues, questions, or suggestions:
1. Check the documentation files
2. Review the code comments
3. Check backend logs and browser console
4. Verify all environment variables are set correctly

---

**Created**: April 2024
**Version**: 1.0.0
**Status**: Ready for use
