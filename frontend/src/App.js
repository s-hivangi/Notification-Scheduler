import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Dashboard from './pages/Dashboard';
import CreateNotification from './pages/CreateNotification';
import MyNotifications from './pages/MyNotifications';
import Analytics from './pages/Analytics';
import Debug from './pages/Debug';
import NotificationDetails from './pages/NotificationDetails';
import './styles/index.css';

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(true);

  return (
    <Router>
      <div className="app-wrapper">
        <Sidebar open={sidebarOpen} toggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className={`main-content ${sidebarOpen ? 'open' : 'closed'}`}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/create" element={<CreateNotification />} />
            <Route path="/notifications" element={<MyNotifications />} />
            <Route path="/notifications/:id" element={<NotificationDetails />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/debug" element={<Debug />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
