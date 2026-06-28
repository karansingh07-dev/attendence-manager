import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
} from 'recharts';
import { calculateAttendancePercentage, getStatusBarColor } from '../utils/calculations';

const AttendanceChart = ({ subjects }) => {
  const data = subjects.map(subject => ({
    name: subject.name.slice(0, 10),
    percentage: calculateAttendancePercentage(subject.attended || 0, subject.total || 0),
    fullName: subject.name,
  }));

  const getColor = (percentage) => {
    if (percentage >= 75) return '#22c55e';
    if (percentage >= 60) return '#eab308';
    return '#ef4444';
  };

  return (
    <div className="card">
      <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Attendance Overview</h3>
      {data.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-400 text-center py-8">No subjects yet</p>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis domain={[0, 100]} />
            <Tooltip 
              formatter={(value) => `${value}%`}
              labelFormatter={(label) => {
                const subject = data.find(d => d.name === label);
                return subject ? subject.fullName : label;
              }}
            />
            <Legend />
            <Bar dataKey="percentage" name="Attendance %" fill="#3b82f6" radius={[8, 8, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.percentage)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default AttendanceChart;
