import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateAttendancePercentage, calculateClassesNeeded, calculateClassesCanSkip } from '../utils/calculations';
import CircularProgress from '../components/CircularProgress/CircularProgress';
import DailyMarking from '../components/DailyMarking';
import './Home.css';

const Home = () => {
  const { subjects, settings, streak, attendanceLogs } = useAppContext();
  const [showDailyMarking, setShowDailyMarking] = useState(false);

  // Calculate overall attendance
  const overallAttendance = useMemo(() => {
    if (subjects.length === 0) return 0;
    const totalClasses = subjects.reduce((acc, s) => acc + (s.total || 0), 0);
    const attendedClasses = subjects.reduce((acc, s) => acc + (s.attended || 0), 0);
    return totalClasses === 0 ? 0 : Math.round((attendedClasses / totalClasses) * 100);
  }, [subjects]);

  // Get motivational quote
  const getQuote = () => {
    const quotes = [
      "Perfect attendance is like a perfect day—you've got to fight for it!",
      "Every class attended is a step towards success.",
      "Your future depends on what you do today. Attend your classes!",
      "Attendance is not about being present—it's about being productive.",
      "Success starts with showing up. You've got this!",
      "Education is the most powerful weapon. Show up and learn.",
      "Consistency builds character and grades. Keep attending!",
      "Your education is an investment in yourself.",
      "Classes are treasure chests of knowledge. Don't miss them!",
      "Discipline is choosing between what you want now and what you want most.",
      "The only way to do great work is to love what you do.",
      "Don't watch life pass you by in class—be present in the moment.",
      "Success is not final, failure is not fatal. Attend and keep learning.",
      "Your dedication today will be your success tomorrow.",
      "Attendance builds habits that last a lifetime.",
      "Small steps daily lead to big achievements.",
      "Be the reason someone believes in the power of education.",
      "Your presence matters more than you think.",
      "Excellence is not a skill, it's a habit. Form the habit of attending.",
      "The future is created by what you do today. Attend your classes!"
    ];
    const today = new Date().toDateString();
    const hash = today.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return quotes[hash % quotes.length];
  };

  // Get low attendance subjects
  const lowAttendanceSubjects = useMemo(() => {
    return subjects.filter(s => calculateAttendancePercentage(s.attended || 0, s.total || 0) < settings.targetAttendance);
  }, [subjects, settings.targetAttendance]);

  const allHealthy = lowAttendanceSubjects.length === 0 && subjects.length > 0;

  return (
    <div className="home-page page-transition">
      {showDailyMarking && <DailyMarking onClose={() => setShowDailyMarking(false)} />}

      <div className="home-container">
        {/* Hero Section */}
        <div className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">Keep Your Attendance On Track</h1>
            <p className="hero-subtitle">Monitor your performance and stay ahead with smart insights</p>
          </div>
          <button className="btn-mark-attendance" onClick={() => setShowDailyMarking(true)}>
            📝 Mark Today's Attendance
          </button>
        </div>

        {/* Main Metrics Grid */}
        <div className="metrics-grid">
          {/* Overall Attendance */}
          <div className="glass-card metric-card">
            <h2 className="metric-title">Overall Attendance</h2>
            <div className="metric-content">
              <CircularProgress percentage={overallAttendance} size={180} />
              <p className="metric-description">
                {subjects.reduce((acc, s) => acc + (s.attended || 0), 0)} / {subjects.reduce((acc, s) => acc + (s.total || 0), 0)} classes attended
              </p>
            </div>
          </div>

          {/* Streak Card */}
          <div className="glass-card metric-card">
            <h2 className="metric-title">🔥 Your Streak</h2>
            <div className="streak-display">
              <div className="streak-current">
                <span className="streak-number">{streak.current}</span>
                <span className="streak-text">Current Streak</span>
              </div>
              <div className="streak-divider"></div>
              <div className="streak-longest">
                <span className="streak-number">{streak.longest}</span>
                <span className="streak-text">Best Streak</span>
              </div>
            </div>
          </div>

          {/* Status Card */}
          <div className={`glass-card metric-card status-card ${allHealthy ? 'healthy' : 'warning'}`}>
            <h2 className="metric-title">{allHealthy ? '✅ All Healthy' : '⚠️ Action Needed'}</h2>
            <p className="status-message">
              {allHealthy
                ? `All your subjects have attendance above ${settings.targetAttendance}%!`
                : `${lowAttendanceSubjects.length} subject(s) need attention`}
            </p>
          </div>
        </div>

        {/* Motivational Quote */}
        <div className="glass-card motivational-card">
          <div className="quote-icon">💡</div>
          <p className="quote-text">{getQuote()}</p>
        </div>

        {/* Subjects Overview */}
        {subjects.length > 0 && (
          <div className="subjects-section">
            <h2 className="section-title">Your Subjects</h2>
            <div className="subjects-grid">
              {subjects.map((subject) => {
                const percentage = calculateAttendancePercentage(subject.attended || 0, subject.total || 0);
                const needed = calculateClassesNeeded(subject.attended || 0, subject.total || 0, settings.targetAttendance);
                const canSkip = calculateClassesCanSkip(subject.attended || 0, subject.total || 0, settings.targetAttendance);
                const statusEmoji = percentage === 100 ? '🔥' : percentage >= 75 ? '✅' : '⚠️';
                
                return (
                  <div key={subject.id} className="glass-card subject-preview">
                    <div className="subject-header">
                      <h3 className="subject-name">{subject.name}</h3>
                      <span className="subject-emoji">{statusEmoji}</span>
                    </div>
                    
                    <div className="attendance-bar">
                      <div 
                        className="attendance-fill"
                        style={{ width: `${Math.min(percentage, 100)}%` }}
                      ></div>
                    </div>
                    
                    <div className="subject-stats">
                      <span className="percentage">{percentage}%</span>
                      <span className="attended">{subject.attended}/{subject.total}</span>
                    </div>

                    <p className="subject-hint">
                      {needed > 0 ? (
                        <span className="hint-warning">🛏️ Need {needed} more</span>
                      ) : canSkip > 0 ? (
                        <span className="hint-safe">✨ Can skip {canSkip}</span>
                      ) : (
                        <span className="hint-track">On track!</span>
                      )}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Empty State */}
        {subjects.length === 0 && (
          <div className="empty-state">
            <div className="empty-icon">📚</div>
            <h2>No Subjects Yet</h2>
            <p>Add your first subject to start tracking attendance</p>
            <a href="/subjects" className="btn-primary">
              Add Subject
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
