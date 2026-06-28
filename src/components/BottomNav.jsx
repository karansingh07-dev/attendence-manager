import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Home, Calendar, BookOpen, TrendingUp, Settings } from 'lucide-react';
import './BottomNav.css';

const BottomNav = () => {
  const location = useLocation();

  const navItems = [
    { path: '/', icon: Home, label: 'Home' },
    { path: '/timetable', icon: Calendar, label: 'Timetable' },
    { path: '/subjects', icon: BookOpen, label: 'Subjects' },
    { path: '/stats', icon: TrendingUp, label: 'Stats' },
    { path: '/settings', icon: Settings, label: 'Settings' },
  ];

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav-container">
        {navItems.map(({ path, icon: Icon, label }) => {
          const isActive = location.pathname === path;
          return (
            <Link
              key={path}
              to={path}
              className={`nav-item ${isActive ? 'active' : ''}`}
              title={label}
            >
              <Icon size={24} className="nav-icon" />
              <span className="nav-label">{label}</span>
              {isActive && <span className="nav-indicator"></span>}
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
