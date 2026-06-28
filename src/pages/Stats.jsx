import React, { useState, useMemo } from 'react';
import { useAppContext } from '../context/AppContext';
import { calculateAttendancePercentage } from '../utils/calculations';
import './Stats.css';

const Stats = () => {
  const { subjects, attendanceLogs, streak, settings } = useAppContext();
  const [selectedMonth, setSelectedMonth] = useState(new Date().toISOString().split('T')[0].slice(0, 7));

  // Generate calendar heatmap data
  const getHeatmapData = () => {
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]) - 1;
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const data = [];
    for (let i = 0; i < firstDay; i++) {
      data.push(null);
    }

    for (let day = 1; day <= daysInMonth; day++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      const dayLogs = attendanceLogs.filter(log => log.date === dateStr);

      if (dayLogs.length === 0) {
        data.push(null);
      } else {
        const presentCount = dayLogs.filter(log => log.status === 'present').length;
        const percentage = (presentCount / dayLogs.length) * 100;
        data.push(percentage);
      }
    }

    return data;
  };

  const getHeatmapColor = (percentage) => {
    if (percentage === null) return 'heatmap-empty';
    if (percentage === 100) return 'heatmap-perfect';
    if (percentage >= 75) return 'heatmap-good';
    if (percentage >= 50) return 'heatmap-medium';
    return 'heatmap-low';
  };

  const heatmapData = useMemo(() => getHeatmapData(), [selectedMonth, attendanceLogs]);

  // Monthly summary
  const getMonthlyStats = () => {
    const year = parseInt(selectedMonth.split('-')[0]);
    const month = parseInt(selectedMonth.split('-')[1]) - 1;
    const monthLogs = attendanceLogs.filter(log => {
      const logDate = new Date(log.date);
      return logDate.getFullYear() === year && logDate.getMonth() === month;
    });

    return {
      total: monthLogs.length,
      present: monthLogs.filter(log => log.status === 'present').length,
      absent: monthLogs.filter(log => log.status === 'absent').length,
      cancelled: monthLogs.filter(log => log.status === 'cancelled').length,
    };
  };

  const monthlyStats = useMemo(() => getMonthlyStats(), [selectedMonth, attendanceLogs]);

  // Subject performance
  const subjectPerformance = useMemo(() => {
    return subjects
      .map(subject => ({
        name: subject.name,
        percentage: calculateAttendancePercentage(subject.attended || 0, subject.total || 0),
        total: subject.total,
        attended: subject.attended,
      }))
      .sort((a, b) => b.percentage - a.percentage);
  }, [subjects]);

  const formatMonth = (monthStr) => {
    const date = new Date(monthStr + '-01');
    return date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  };

  return (
    <div className="stats-page page-transition">
      <div className="stats-container">
        <h1 className="stats-title">📊 Attendance Statistics</h1>

        {/* Streak Section */}
        <div className="glass-card stats-card">
          <h2 className="card-title">🔥 Your Streak</h2>
          <div className="streak-container">
            <div className="streak-item">
              <div className="streak-number current">{streak.current}</div>
              <p className="streak-label">Current Streak</p>
            </div>
            <div className="streak-separator"></div>
            <div className="streak-item">
              <div className="streak-number longest">{streak.longest}</div>
              <p className="streak-label">Longest Streak</p>
            </div>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="glass-card stats-card">
          <div className="card-header">
            <h2 className="card-title">📅 Monthly Summary</h2>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="month-select"
            >
              {Array.from({ length: 12 }, (_, i) => {
                const date = new Date();
                date.setMonth(date.getMonth() - i);
                const monthStr = date.toISOString().split('T')[0].slice(0, 7);
                return (
                  <option key={monthStr} value={monthStr}>
                    {formatMonth(monthStr)}
                  </option>
                );
              })}
            </select>
          </div>

          <div className="summary-stats">
            <div className="summary-stat">
              <span className="stat-label">Total Classes</span>
              <span className="stat-value">{monthlyStats.total}</span>
            </div>
            <div className="summary-stat present">
              <span className="stat-label">Present</span>
              <span className="stat-value">{monthlyStats.present}</span>
            </div>
            <div className="summary-stat absent">
              <span className="stat-label">Absent</span>
              <span className="stat-value">{monthlyStats.absent}</span>
            </div>
            <div className="summary-stat cancelled">
              <span className="stat-label">Cancelled</span>
              <span className="stat-value">{monthlyStats.cancelled}</span>
            </div>
          </div>

          {/* Heatmap */}
          <div className="heatmap-section">
            <h3 className="heatmap-title">{formatMonth(selectedMonth)} Overview</h3>
            <div className="heatmap-legend">
              <div className="legend-item">
                <div className="legend-square heatmap-perfect"></div>
                <span>100%</span>
              </div>
              <div className="legend-item">
                <div className="legend-square heatmap-good"></div>
                <span>75-99%</span>
              </div>
              <div className="legend-item">
                <div className="legend-square heatmap-medium"></div>
                <span>50-74%</span>
              </div>
              <div className="legend-item">
                <div className="legend-square heatmap-low"></div>
                <span>&lt;50%</span>
              </div>
              <div className="legend-item">
                <div className="legend-square heatmap-empty"></div>
                <span>No Data</span>
              </div>
            </div>
            <div className="heatmap-grid">
              {heatmapData.map((percentage, index) => (
                <div
                  key={index}
                  className={`heatmap-cell ${getHeatmapColor(percentage)}`}
                  title={percentage !== null ? `${percentage}%` : 'No data'}
                ></div>
              ))}
            </div>
          </div>
        </div>

        {/* Subject Performance */}
        {subjectPerformance.length > 0 && (
          <div className="glass-card stats-card">
            <h2 className="card-title">📚 Subject Performance</h2>
            <div className="subject-list">
              {subjectPerformance.map((subject, index) => {
                const statusColor =
                  subject.percentage >= 75 ? 'good' : subject.percentage >= 60 ? 'medium' : 'low';
                return (
                  <div key={index} className="subject-row">
                    <div className="subject-info">
                      <h4 className="subject-name">{subject.name}</h4>
                      <p className="subject-meta">
                        {subject.attended} / {subject.total} classes
                      </p>
                    </div>
                    <div className="subject-bar">
                      <div className={`bar-fill ${statusColor}`}>
                        <span className="percentage">{subject.percentage}%</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Stats;
