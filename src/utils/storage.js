// Storage utilities for localStorage operations

const STORAGE_KEYS = {
  TIMETABLE: 'attendance_timetable',
  SUBJECTS: 'attendance_subjects',
  ATTENDANCE_LOGS: 'attendance_logs',
  SETTINGS: 'attendance_settings',
  STREAK: 'attendance_streak',
  ONBOARDING: 'attendance_onboarding',
};

export const storageUtils = {
  // Timetable operations
  getTimetable: () => {
    const data = localStorage.getItem(STORAGE_KEYS.TIMETABLE);
    return data ? JSON.parse(data) : getDefaultTimetable();
  },

  setTimetable: (timetable) => {
    localStorage.setItem(STORAGE_KEYS.TIMETABLE, JSON.stringify(timetable));
  },

  // Subjects operations
  getSubjects: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SUBJECTS);
    return data ? JSON.parse(data) : [];
  },

  setSubjects: (subjects) => {
    localStorage.setItem(STORAGE_KEYS.SUBJECTS, JSON.stringify(subjects));
  },

  // Attendance logs operations
  getAttendanceLogs: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ATTENDANCE_LOGS);
    return data ? JSON.parse(data) : [];
  },

  setAttendanceLogs: (logs) => {
    localStorage.setItem(STORAGE_KEYS.ATTENDANCE_LOGS, JSON.stringify(logs));
  },

  // Settings operations
  getSettings: () => {
    const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
    return data ? JSON.parse(data) : getDefaultSettings();
  },

  setSettings: (settings) => {
    localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(settings));
  },

  // Streak operations
  getStreak: () => {
    const data = localStorage.getItem(STORAGE_KEYS.STREAK);
    return data ? JSON.parse(data) : getDefaultStreak();
  },

  setStreak: (streak) => {
    localStorage.setItem(STORAGE_KEYS.STREAK, JSON.stringify(streak));
  },

  // Onboarding operations
  getOnboardingStatus: () => {
    const data = localStorage.getItem(STORAGE_KEYS.ONBOARDING);
    return data ? JSON.parse(data) : false;
  },

  setOnboardingStatus: (status) => {
    localStorage.setItem(STORAGE_KEYS.ONBOARDING, JSON.stringify(status));
  },

  // Clear all data
  clearAll: () => {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  },
};

const getDefaultTimetable = () => ({
  Monday: [],
  Tuesday: [],
  Wednesday: [],
  Thursday: [],
  Friday: [],
  Saturday: [],
});

const getDefaultSettings = () => ({
  targetAttendance: 75,
  darkMode: true,
  notificationsEnabled: false,
  reminderTime: '08:00',
});

const getDefaultStreak = () => ({
  current: 0,
  longest: 0,
  lastDate: null,
});
