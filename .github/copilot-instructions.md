# Attendance Manager - Copilot Instructions

## Project Overview
Attendance Manager is a full-featured React web application for college students to track and manage their attendance subject-wise based on their weekly timetable.

## Tech Stack
- React 18 with Vite
- Tailwind CSS for styling
- React Router DOM for navigation
- Recharts for attendance visualization
- localStorage for data persistence
- Lucide React for icons

## Key Features
1. **Timetable Setup** - Create weekly timetables with time slots and subjects
2. **Subject Management** - Track total and attended classes
3. **Daily Attendance Marking** - Mark classes as Present/Absent/Cancelled
4. **Attendance Dashboard** - Visual representation of attendance percentage
5. **Attendance Calculator** - Predict classes that can be skipped/need to attend
6. **History & Logs** - View and edit past attendance records
7. **Notifications** - Alerts for low attendance
8. **Data Management** - Export/Import data, dark mode, custom targets

## Project Structure
```
src/
├── main.jsx                 # Entry point
├── App.jsx                  # Main app component with routing
├── styles/
│   └── index.css           # Global styles and Tailwind imports
├── context/
│   └── AppContext.jsx      # Global state management
├── pages/
│   ├── Home.jsx            # Dashboard/home page
│   ├── Timetable.jsx       # Timetable setup page
│   ├── Subjects.jsx        # Subject management page
│   ├── History.jsx         # Attendance history page
│   └── Settings.jsx        # Settings page
├── components/
│   ├── BottomNav.jsx       # Bottom navigation bar
│   ├── DailyMarking.jsx    # Daily attendance marking
│   ├── AttendanceChart.jsx # Attendance visualization
│   ├── SubjectCard.jsx     # Subject card component
│   ├── TimeSlotForm.jsx    # Time slot form
│   └── ThemeToggle.jsx     # Dark mode toggle
└── utils/
    ├── storage.js          # localStorage utilities
    ├── calculations.js     # Attendance calculations
    └── export.js          # Export/import utilities
```

## Development Setup
1. Install dependencies: `npm install`
2. Start dev server: `npm run dev`
3. Build for production: `npm run build`

## Build Status
- [ ] Project scaffolding complete
- [ ] Dependencies installed
- [ ] Components created
- [ ] localStorage integration done
- [ ] UI fully styled with Tailwind
- [ ] Ready for development
