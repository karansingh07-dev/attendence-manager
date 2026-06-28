# Attendance Manager

A comprehensive web application for college students to track and manage their attendance subject-wise based on their weekly timetable.

## Features

### 📅 Timetable Setup
- Create weekly timetables (Monday to Saturday)
- Multiple time slots per day
- Subject assignment to each slot
- Add, edit, and delete classes
- Persistent storage

### 📚 Subject Management
- Auto-generate subjects from timetable
- Manual subject creation
- Track total and attended classes
- Auto-calculated attendance percentage
- Edit and delete subjects

### ✅ Daily Attendance Marking
- Mark classes as Present/Absent/Cancelled
- Today's classes automatically loaded
- Cancelled classes excluded from calculations
- Same-day duplicate prevention

### 📊 Attendance Dashboard
- Overall attendance percentage
- Per-subject attendance with color coding:
  - 🟢 Green: ≥ 75%
  - 🟡 Yellow: 60–74%
  - 🔴 Red: < 60%
- Progress bars for each subject
- Visual attendance charts

### 🧮 Attendance Calculator
- Calculate classes needed to reach target
- Calculate skippable classes
- Per-subject and overall predictions
- Custom target attendance setting

### 📋 History & Logs
- Full attendance log by date
- Filter by subject
- Edit past records
- Delete records
- Summary statistics

### 🔔 Notifications & Alerts
- Low attendance warnings
- Motivational messages for healthy attendance
- Color-coded status indicators

### 💾 Data Management
- Full localStorage persistence
- Export as JSON (backup)
- Export as CSV (report)
- Import from JSON backup
- Reset all data
- Dark mode toggle

## Tech Stack

- **Frontend**: React 18 with Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router DOM
- **Charts**: Recharts
- **Icons**: Lucide React
- **State Management**: React Context API
- **Storage**: Browser localStorage

## Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone or open the project in VS Code
2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm run dev
```

4. Open your browser and navigate to `http://localhost:3000`

### Building for Production

```bash
npm run build
```

The production-ready files will be in the `dist` directory.

## Usage

### 1. Set Up Your Timetable
- Go to the **Timetable** tab
- Select a day (Monday-Saturday)
- Add time slots with subject names
- Repeat for all days

### 2. Add Subjects
- Go to the **Subjects** tab
- Click "Add Subject"
- Enter subject name and initial class counts
- Or subjects will auto-populate from your timetable

### 3. Mark Daily Attendance
- Go to **Home** tab
- Click "Mark Today's Attendance"
- Select Present/Absent/Cancelled for each class
- Submit to save

### 4. Monitor Your Attendance
- View overall percentage on Home page
- See per-subject breakdown with progress bars
- Check attendance chart for visual overview
- Get alerts for low attendance

### 5. Calculate Attendance
- Use the home dashboard to see how many classes you need to attend or can skip
- Adjust target percentage in Settings if needed

### 6. View History
- Go to **History** tab
- Filter by subject or view all logs
- Edit or delete past records

### 7. Manage Data
- Go to **Settings** tab
- Export data as JSON or CSV
- Import from a previous backup
- Reset all data if needed

## Project Structure

```
attendance-manager/
├── src/
│   ├── components/          # Reusable components
│   │   ├── BottomNav.jsx
│   │   ├── ThemeToggle.jsx
│   │   ├── SubjectCard.jsx
│   │   ├── AttendanceChart.jsx
│   │   ├── TimeSlotForm.jsx
│   │   └── DailyMarking.jsx
│   ├── pages/               # Page components
│   │   ├── Home.jsx
│   │   ├── Timetable.jsx
│   │   ├── Subjects.jsx
│   │   ├── History.jsx
│   │   └── Settings.jsx
│   ├── context/             # Global state management
│   │   └── AppContext.jsx
│   ├── utils/               # Utility functions
│   │   ├── storage.js       # localStorage operations
│   │   ├── calculations.js  # Attendance calculations
│   │   └── export.js        # Export/import utilities
│   ├── styles/              # Global styles
│   │   └── index.css
│   ├── App.jsx              # Main app component
│   └── main.jsx             # Entry point
├── index.html               # HTML template
├── package.json             # Dependencies
├── vite.config.js           # Vite configuration
├── tailwind.config.js       # Tailwind configuration
├── postcss.config.js        # PostCSS configuration
└── README.md                # This file
```

## Color Scheme

### Attendance Status
- **Green (≥75%)**: Healthy attendance - Keep it up!
- **Yellow (60-74%)**: Warning - Start attending more classes
- **Red (<60%)**: Critical - Urgent action needed

## Features in Detail

### localStorage Schema

```javascript
{
  attendance_timetable: {
    Monday: [{ id, startTime, endTime, subject }],
    // ... other days
  },
  attendance_subjects: [
    { id, name, total, attended },
    // ... more subjects
  ],
  attendance_logs: [
    { id, date, subject, status: 'present|absent|cancelled' },
    // ... more logs
  ],
  attendance_settings: {
    targetAttendance: 75,
    darkMode: false
  }
}
```

### Attendance Calculations

- **Percentage**: (attended / total) × 100
- **Classes Needed**: Math to reach target percentage
- **Classes Can Skip**: Math for maximum skippable classes
- **Cancelled Classes**: Not counted in total or attended

## Mobile Responsive

The app is fully responsive and optimized for:
- 📱 Mobile phones (bottom navigation)
- 📱 Tablets
- 💻 Desktop browsers

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Tips for Best Usage

1. **Set up timetable first** - This forms the basis of attendance tracking
2. **Mark attendance daily** - Regular marking ensures accurate records
3. **Set realistic targets** - Adjust the target percentage based on your requirements
4. **Regular backups** - Export your data periodically
5. **Check history** - Review past records to identify patterns

## Future Enhancements

- Push notifications for class reminders
- Multiple timetables for different semesters
- Attendance predictions using AI
- Class notes integration
- GPA calculation
- PDF report generation

## License

This project is open source and available for personal and educational use.

## Support

For issues or feature requests, please create an issue in the repository.

---

**Happy Learning! 📚**

Built with ❤️ for college students everywhere.
