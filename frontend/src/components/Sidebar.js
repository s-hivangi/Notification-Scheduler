import React from 'react';
import { NavLink } from 'react-router-dom';

function Sidebar({ open, toggleSidebar }) {
  return (
    <>
      <div className={`sidebar ${open ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <h1 className="sidebar-title">NS</h1>
          <button className="toggle-btn" onClick={toggleSidebar}>
            {open ? '✕' : '☰'}
          </button>
        </div>

        <nav className="sidebar-nav">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">⌂</span>
            <span className="label">Dashboard</span>
          </NavLink>

          <NavLink 
            to="/create" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">+</span>
            <span className="label">Create</span>
          </NavLink>

          <NavLink 
            to="/notifications" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">✉</span>
            <span className="label">Notifications</span>
          </NavLink>

          <NavLink 
            to="/analytics" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">�</span>
            <span className="label">Analytics</span>
          </NavLink>

          <NavLink 
            to="/debug" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span className="icon">⚙</span>
            <span className="label">Debug</span>
          </NavLink>
        </nav>

        <div className="sidebar-footer">
          <div className="user-info">
            <div className="user-avatar">A</div>
            <div className="user-details">
              <p>Admin</p>
              <small>v1.0.0</small>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sidebar;
