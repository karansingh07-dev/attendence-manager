import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '../../context/AppContext';
import './Navbar.css';

const Navbar = () => {
  const { settings, updateSettings } = useAppContext();
  const [greeting, setGreeting] = useState('');

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');
  }, []);

  useEffect(() => {
    const isDark = settings.darkMode;
    if (isDark) {
      document.documentElement.classList.remove('light-mode');
    } else {
      document.documentElement.classList.add('light-mode');
    }
  }, [settings.darkMode]);

  const toggleTheme = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <nav className="navbar">
      <div className="navbar-container">
        <div className="navbar-brand">
          <div className="brand-icon">📚</div>
          <h1 className="brand-name gradient-text">Attendance</h1>
        </div>

        <div className="navbar-greeting">
          <p className="greeting-text">{greeting}, Student 👋</p>
        </div>

        <button
          onClick={toggleTheme}
          className="theme-toggle"
          title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
        >
          {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </button>
      </div>
    </nav>
  );
};

export default Navbar;
