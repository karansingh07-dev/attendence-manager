import React, { useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';
import { useAppContext } from '../context/AppContext';

const ThemeToggle = () => {
  const { settings, updateSettings } = useAppContext();

  useEffect(() => {
    const isDark = settings.darkMode;
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [settings.darkMode]);

  const toggleTheme = () => {
    updateSettings({ darkMode: !settings.darkMode });
  };

  return (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-lg bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-yellow-400 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors"
      title={settings.darkMode ? 'Switch to light mode' : 'Switch to dark mode'}
    >
      {settings.darkMode ? <Sun size={20} /> : <Moon size={20} />}
    </button>
  );
};

export default ThemeToggle;
