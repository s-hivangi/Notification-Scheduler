# Notification Scheduler Frontend

Professional dark-themed multi-page notification scheduling application built with React 18.

## 🎨 Features

### Pages
- **Dashboard** - Overview with statistics (Total, Pending, Sent, Failed)
- **Create Notification** - Schedule new SMS notifications
- **My Notifications** - Browse all notifications with filtering
- **Notification Details** - View full notification information
- **Analytics** - Statistics and metrics dashboard
- **Debug Tools** - System inspection and heap viewer

### Design
- Professional dark theme (#0f0f0f background)
- Responsive sidebar navigation
- Mobile-friendly responsive design
- Smooth animations and transitions
- Status badges (Pending, Sent, Failed)
- Real-time data updates (10s auto-refresh)

### Tech Stack
- React 18.2.0 - UI framework
- React Router v6.20.0 - Multi-page routing
- Axios 1.6.0 - HTTP client
- date-fns 2.30.0 - Date formatting

## 🚀 Quick Start

### Prerequisites
- Node.js 14+ 
- Backend running on `http://localhost:5000`
- MongoDB (local or Atlas)

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start development server
npm start
```

Opens at `http://localhost:3000`

### Build

```bash
# Create production build
npm run build
```

## 📁 Project Structure

```
frontend/
├── public/
│   ├── index.html
│   └── manifest.json
├── src/
│   ├── components/
│   │   ├── Sidebar.js          - Navigation sidebar
│   │   ├── PageHeader.js       - Page title header
│   │   ├── StatCard.js         - Statistics card
│   │   ├── NotificationForm.js - Create form
│   │   ├── Header.js           - Legacy header
│   │   ├── NotificationList.js - List view
│   │   └── HeapViewer.js       - Heap display
│   ├── pages/
│   │   ├── Dashboard.js        - Home page
│   │   ├── CreateNotification.js
│   │   ├── MyNotifications.js
│   │   ├── NotificationDetails.js
│   │   ├── Analytics.js
│   │   └── Debug.js
│   ├── services/
│   │   └── notificationApi.js  - API client
│   ├── styles/
│   │   └── index.css           - Dark theme styles
│   ├── App.js                  - Router config
│   └── index.js
├── package.json
├── README.md                   - This file
└── .env

```

## 🎨 Theme & Colors

```
Background:       #0f0f0f (Black)
Card Surface:     #1a1a1a (Dark Gray)
Hover Surface:    #242424 (Lighter Gray)
Border:           #333 (Subtle Gray)
Text Primary:     #ffffff (White)
Text Secondary:   #e0e0e0 (Light Gray)
Text Muted:       #999 (Dark Gray)

Accent Blue:      #42a5f5 (Primary)
Success Green:    #4caf50 (Sent/Success)
Warning Orange:   #ff9800 (Pending)
Danger Red:       #f44336 (Failed/Error)
```

## 🔌 API Integration

All API calls go through `src/services/notificationApi.js`

### Endpoints Used
- `GET /api/notifications` - Get all notifications
- `POST /api/notifications` - Create notification
- `GET /api/notifications/:id` - Get by ID
- `PATCH /api/notifications/:id` - Update notification
- `DELETE /api/notifications/:id` - Delete notification
- `GET /api/notifications/debug/heap` - Get heap snapshot

### Base URL
Default: `http://localhost:5000/api/notifications`

Configurable via `.env`:
```env
REACT_APP_API_URL=http://localhost:5000/api/notifications
```

## 📱 Responsive Design

- **Desktop** (1024px+): Full sidebar + 2-column grid
- **Tablet** (768px-1023px): Collapsed sidebar + 1-column grid
- **Mobile** (<768px): Hamburger menu + single column

## 🔄 Data Flow

1. User interacts with form/buttons
2. Frontend sends API request to backend
3. Backend processes and stores in MongoDB
4. Frontend receives response and updates UI
5. Dashboard auto-refreshes every 10 seconds

## 📋 Notification Object

```javascript
{
  _id: "507f1f77bcf86cd799439011",
  message: "Your message here",
  phone: "+919876543210",
  scheduledTime: "2024-04-25T10:30:00Z",
  priority: 2,
  type: "reminder",
  status: "pending",
  retryCount: 0,
  createdAt: "2024-04-21T14:00:00Z",
  updatedAt: "2024-04-21T14:00:00Z"
}
```

## 🎯 Phone Number Format

- Format: E.164 international
- Default prefix: +91 (India)
- Example: +919876543210

## 🧭 Navigation

### Sidebar Navigation (Responsive)
- **Dashboard** - Overview and recent activity
- **Create** - New notification form
- **Notifications** - Browse all with filters
- **Analytics** - Statistics dashboard
- **Debug** - Developer tools

### Keyboard Routes
- `/` - Dashboard
- `/create` - Create Notification
- `/notifications` - My Notifications
- `/notifications/:id` - Notification Details
- `/analytics` - Analytics
- `/debug` - Debug Tools

## ⚙️ Environment Variables

Create `.env` file in frontend root:

```env
# Backend API URL
REACT_APP_API_URL=http://localhost:5000/api/notifications

# App environment
REACT_APP_ENV=development
```

## 🐛 Debugging

### Debug Page Features
- Min Heap Inspector - View priority queue
- System Information - API status, versions
- Real-time heap snapshot
- Backend health check

Access via sidebar or `/debug` route

## 📊 Performance

- Auto-refresh: 10 seconds (configurable)
- API timeout: 5 seconds
- Lazy pagination: First 5 items on dashboard
- CSS optimized: No external fonts

## 🔒 Security

- ✓ No credentials stored in frontend
- ✓ API base URL configurable
- ✓ Error messages sanitized
- ✓ No user authentication required (yet)

## 🧪 Testing

```bash
# Run tests
npm test

# Build for production
npm run build

# Eject webpack (one-way operation)
npm run eject
```

## 📦 Dependencies

See `package.json` for complete list:

| Package | Version | Purpose |
|---------|---------|---------|
| react | 18.2.0 | UI framework |
| react-router-dom | 6.20.0 | Routing |
| axios | 1.6.0 | HTTP client |
| date-fns | 2.30.0 | Date formatting |

## 🚨 Common Issues

### API calls failing?
- Check backend is running: `http://localhost:5000/health`
- Verify MongoDB is connected
- Check `.env` for correct `REACT_APP_API_URL`

### Styles not loading?
- Clear browser cache (Ctrl+Shift+Del)
- Restart dev server: `npm start`
- Check CSS file path: `src/styles/index.css`

### Components not found?
- Run `npm install` in frontend folder
- Verify all page files exist in `src/pages/`
- Check import paths (case-sensitive on Linux/Mac)

## 🤝 Integration with Backend

**Backend must be running:**

```bash
cd ../backend
npm run dev
```

Backend should be available at `http://localhost:5000`

**Database Connection:**
- Local MongoDB: `mongodb://localhost:27017/notification-scheduler`
- MongoDB Atlas: Set `MONGODB_URI` in backend `.env`

## 📝 Component Documentation

### Dashboard.js
- Fetches all notifications
- Calculates stats (total, pending, sent, failed)
- Shows recent 5 notifications
- Auto-refresh every 10s

### CreateNotification.js
- Wraps NotificationForm
- Redirects to /notifications on success
- Validates form data

### MyNotifications.js
- Shows all notifications in grid
- Filter buttons: All, Pending, Sent, Failed
- Delete with confirmation
- View detail navigation

### NotificationDetails.js
- Displays full notification info
- All metadata visible
- Back navigation

### Analytics.js
- Overall statistics
- Success metrics
- Type breakdown with mini charts

### Debug.js
- Heap inspector with real-time data
- System information display
- Backend health status

## 🎯 Future Enhancements

Possible additions (not included):
- [ ] User authentication/login
- [ ] Notification templates
- [ ] Scheduled reports
- [ ] Export to CSV
- [ ] Dark mode toggle
- [ ] Notification webhooks
- [ ] Mobile app (React Native)

## 📞 Support

For issues:
1. Check the Debug page (`/debug`)
2. View browser console (F12)
3. Check backend logs
4. Verify database connection

## 📄 License

© 2024 Notification Scheduler. All rights reserved.

---

**Frontend Version:** 1.0.0  
**Last Updated:** April 2024  
**React Router:** v6  
**React:** 18.2.0
