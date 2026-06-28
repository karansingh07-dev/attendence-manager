import React, { createContext, useContext, useState, useEffect } from 'react';
import { storageUtils } from '../utils/storage';

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [timetable, setTimetable] = useState(storageUtils.getTimetable());
  const [subjects, setSubjects] = useState(storageUtils.getSubjects());
  const [attendanceLogs, setAttendanceLogs] = useState(storageUtils.getAttendanceLogs());
  const [settings, setSettings] = useState(storageUtils.getSettings());
  const [streak, setStreak] = useState(storageUtils.getStreak());
  const [onboardingComplete, setOnboardingComplete] = useState(storageUtils.getOnboardingStatus());

  // Save to localStorage whenever state changes
  useEffect(() => {
    storageUtils.setTimetable(timetable);
  }, [timetable]);

  useEffect(() => {
    storageUtils.setSubjects(subjects);
  }, [subjects]);

  useEffect(() => {
    storageUtils.setAttendanceLogs(attendanceLogs);
  }, [attendanceLogs]);

  useEffect(() => {
    storageUtils.setSettings(settings);
    // Apply theme immediately
    const isDark = settings.darkMode;
    if (!isDark) {
      document.documentElement.classList.add('light-mode');
    } else {
      document.documentElement.classList.remove('light-mode');
    }
  }, [settings]);

  useEffect(() => {
    storageUtils.setStreak(streak);
  }, [streak]);

  useEffect(() => {
    storageUtils.setOnboardingStatus(onboardingComplete);
  }, [onboardingComplete]);

  // Timetable operations
  const addTimeSlot = (day, slot) => {
    setTimetable(prev => ({
      ...prev,
      [day]: [...(prev[day] || []), { ...slot, id: Date.now() }]
    }));
  };

  const updateTimeSlot = (day, slotId, updatedSlot) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].map(slot => slot.id === slotId ? { ...slot, ...updatedSlot } : slot)
    }));
  };

  const deleteTimeSlot = (day, slotId) => {
    setTimetable(prev => ({
      ...prev,
      [day]: prev[day].filter(slot => slot.id !== slotId)
    }));
  };

  // Subject operations
  const addSubject = (subject) => {
    const newSubject = {
      ...subject,
      id: Date.now(),
      total: 0,
      attended: 0,
      color: subject.color || getRandomGradientColor(),
    };
    setSubjects(prev => [...prev, newSubject]);
  };

  const updateSubject = (subjectId, updates) => {
    setSubjects(prev => 
      prev.map(subject => subject.id === subjectId ? { ...subject, ...updates } : subject)
    );
  };

  const deleteSubject = (subjectId) => {
    setSubjects(prev => prev.filter(subject => subject.id !== subjectId));
  };

  // Attendance logging
  const addAttendanceLog = (log) => {
    setAttendanceLogs(prev => [...prev, { ...log, id: Date.now() }]);
    updateStreak();
  };

  const updateAttendanceLog = (logId, updates) => {
    setAttendanceLogs(prev =>
      prev.map(log => log.id === logId ? { ...log, ...updates } : log)
    );
    updateStreak();
  };

  const deleteAttendanceLog = (logId) => {
    setAttendanceLogs(prev => prev.filter(log => log.id !== logId));
    updateStreak();
  };

  // Settings operations
  const updateSettings = (newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  // Streak tracking
  const updateStreak = () => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayLogsPresent = attendanceLogs.filter(log => {
      const logDate = new Date(log.date);
      logDate.setHours(0, 0, 0, 0);
      return logDate.getTime() === today.getTime() && log.status === 'present';
    });

    if (todayLogsPresent.length > 0) {
      setStreak(prev => {
        const lastDate = prev.lastDate ? new Date(prev.lastDate) : null;
        if (!lastDate) {
          return { current: 1, longest: 1, lastDate: new Date().toISOString() };
        }
        lastDate.setHours(0, 0, 0, 0);
        const oneDayBefore = new Date(today);
        oneDayBefore.setDate(oneDayBefore.getDate() - 1);
        if (lastDate.getTime() === oneDayBefore.getTime()) {
          const newCurrent = prev.current + 1;
          return {
            current: newCurrent,
            longest: Math.max(prev.longest, newCurrent),
            lastDate: new Date().toISOString(),
          };
        }
        return { current: 1, longest: prev.longest, lastDate: new Date().toISOString() };
      });
    }
  };

  // Utility functions
  const getSubjectById = (subjectId) => {
    return subjects.find(s => s.id === subjectId);
  };

  const getTodayLogs = () => {
    const today = new Date().toISOString().split('T')[0];
    return attendanceLogs.filter(log => log.date === today);
  };

  const importData = (data) => {
    if (data.timetable) setTimetable(data.timetable);
    if (data.subjects) setSubjects(data.subjects);
    if (data.attendanceLogs) setAttendanceLogs(data.attendanceLogs);
    if (data.settings) setSettings(data.settings);
  };

  const exportData = () => {
    return {
      timetable,
      subjects,
      attendanceLogs,
      settings,
      streak,
    };
  };

  const clearAllData = () => {
    setTimetable({
      Monday: [],
      Tuesday: [],
      Wednesday: [],
      Thursday: [],
      Friday: [],
      Saturday: [],
    });
    setSubjects([]);
    setAttendanceLogs([]);
    setSettings({ targetAttendance: 75, darkMode: true });
    setStreak({ current: 0, longest: 0, lastDate: null });
    storageUtils.clearAll();
  };

  const completeOnboarding = () => {
    setOnboardingComplete(true);
  };

  const getRandomGradientColor = () => {
    const gradients = [
      'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
      'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
      'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
      'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    ];
    return gradients[Math.floor(Math.random() * gradients.length)];
  };

  const value = {
    // State
    timetable,
    subjects,
    attendanceLogs,
    settings,
    streak,
    onboardingComplete,

    // Timetable actions
    addTimeSlot,
    updateTimeSlot,
    deleteTimeSlot,

    // Subject actions
    addSubject,
    updateSubject,
    deleteSubject,
    getSubjectById,

    // Attendance actions
    addAttendanceLog,
    updateAttendanceLog,
    deleteAttendanceLog,
    getTodayLogs,

    // Settings actions
    updateSettings,

    // Streak actions
    updateStreak,

    // Data management
    importData,
    exportData,
    clearAllData,
    completeOnboarding,
    getRandomGradientColor,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider');
  }
  return context;
};
