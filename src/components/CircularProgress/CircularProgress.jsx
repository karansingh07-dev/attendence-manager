import React, { useEffect, useState } from 'react';
import './CircularProgress.css';

const CircularProgress = ({ percentage, size = 200 }) => {
  const [displayValue, setDisplayValue] = useState(0);
  const circumference = 2 * Math.PI * (size / 2 - 20);
  const offset = circumference - (displayValue / 100) * circumference;

  useEffect(() => {
    const interval = setInterval(() => {
      setDisplayValue((prev) => {
        if (prev < percentage) {
          return Math.min(prev + 2, percentage);
        }
        return prev;
      });
    }, 30);

    return () => clearInterval(interval);
  }, [percentage]);

  const getColor = (percent) => {
    if (percent >= 75) return 'var(--success)';
    if (percent >= 60) return 'var(--warning)';
    return 'var(--danger)';
  };

  return (
    <div className="circular-progress-container" style={{ width: size, height: size }}>
      <svg
        className="circular-progress-svg"
        viewBox={`0 0 ${size} ${size}`}
        style={{ transform: 'rotate(-90deg)' }}
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 20}
          fill="none"
          stroke="var(--bg-tertiary)"
          strokeWidth="10"
        />

        {/* Progress circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={size / 2 - 20}
          fill="none"
          stroke={getColor(displayValue)}
          strokeWidth="10"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
          className="progress-ring"
          style={{
            filter: `drop-shadow(0 0 10px ${getColor(displayValue)})`,
          }}
        />
      </svg>

      {/* Center text */}
      <div className="circular-progress-text">
        <span className="progress-percentage">{displayValue}%</span>
        <span className="progress-label">Attendance</span>
      </div>
    </div>
  );
};

export default CircularProgress;
