import React from 'react';
import { Trash2 } from 'lucide-react';
import { calculateAttendancePercentage, getStatusBarColor, getStatusColor } from '../utils/calculations';

const SubjectCard = ({ subject, onEdit, onDelete }) => {
  const percentage = calculateAttendancePercentage(subject.attended || 0, subject.total || 0);
  const statusColor = getStatusColor(percentage);
  const barColor = getStatusBarColor(percentage);

  return (
    <div className="card space-y-3">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <h3 className="font-semibold text-gray-900 dark:text-white text-lg">{subject.name}</h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            {subject.attended || 0} / {subject.total || 0} classes attended
          </p>
        </div>
        <button
          onClick={() => onDelete(subject.id)}
          className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
        >
          <Trash2 size={18} />
        </button>
      </div>

      <div className="space-y-2">
        <div className="flex justify-between items-center">
          <span className={`text-2xl font-bold ${statusColor}`}>{percentage}%</span>
          <button
            onClick={() => onEdit(subject)}
            className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
          >
            Edit
          </button>
        </div>

        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
          <div
            className={`h-full ${barColor} transition-all duration-300`}
            style={{ width: `${Math.min(percentage, 100)}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default SubjectCard;
