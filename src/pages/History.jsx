import React, { useState } from 'react';
import { Edit2, Trash2, X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { formatDate } from '../utils/calculations';

const History = () => {
  const { attendanceLogs, subjects, updateAttendanceLog, deleteAttendanceLog } = useAppContext();
  const [editingLog, setEditingLog] = useState(null);
  const [editStatus, setEditStatus] = useState('');
  const [filterSubject, setFilterSubject] = useState('all');

  const sortedLogs = [...attendanceLogs].sort((a, b) => new Date(b.date) - new Date(a.date));

  const filteredLogs = filterSubject === 'all'
    ? sortedLogs
    : sortedLogs.filter(log => log.subject === filterSubject);

  const handleEdit = (log) => {
    setEditingLog(log);
    setEditStatus(log.status);
  };

  const handleSaveEdit = () => {
    updateAttendanceLog(editingLog.id, { status: editStatus });
    setEditingLog(null);
    setEditStatus('');
  };

  const handleDelete = (logId) => {
    if (confirm('Are you sure you want to delete this record?')) {
      deleteAttendanceLog(logId);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'present':
        return 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 border border-green-300 dark:border-green-700';
      case 'absent':
        return 'bg-red-100 dark:bg-red-900 text-red-800 dark:text-red-200 border border-red-300 dark:border-red-700';
      case 'cancelled':
        return 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 border border-gray-300 dark:border-gray-600';
      default:
        return 'bg-gray-100 dark:bg-gray-700';
    }
  };

  const getStatusEmoji = (status) => {
    switch (status) {
      case 'present':
        return '✓';
      case 'absent':
        return '✕';
      case 'cancelled':
        return '⊘';
      default:
        return '—';
    }
  };

  return (
    <div className="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Attendance History</h1>

        {/* Edit Modal */}
        {editingLog && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="card max-w-sm w-full">
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Edit Record</h3>
                <button
                  onClick={() => setEditingLog(null)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Date: {formatDate(editingLog.date)}
                  </label>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subject: {editingLog.subject}
                  </label>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Status
                  </label>
                  <select
                    value={editStatus}
                    onChange={(e) => setEditStatus(e.target.value)}
                    className="input-field"
                  >
                    <option value="present">Present</option>
                    <option value="absent">Absent</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={handleSaveEdit}
                    className="flex-1 btn-primary"
                  >
                    Save
                  </button>
                  <button
                    onClick={() => setEditingLog(null)}
                    className="flex-1 btn-secondary"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Filter */}
        <div className="card">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Filter by Subject
          </label>
          <select
            value={filterSubject}
            onChange={(e) => setFilterSubject(e.target.value)}
            className="input-field"
          >
            <option value="all">All Subjects</option>
            {subjects.map(subject => (
              <option key={subject.id} value={subject.name}>
                {subject.name}
              </option>
            ))}
          </select>
        </div>

        {/* Logs */}
        {filteredLogs.length === 0 ? (
          <div className="card text-center py-12">
            <p className="text-gray-600 dark:text-gray-400 text-lg">
              No attendance records yet. Mark your first attendance to see history.
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filteredLogs.map((log) => (
              <div
                key={log.id}
                className="card flex justify-between items-center"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{log.subject}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {formatDate(log.date)}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className={`px-3 py-1 rounded-lg font-medium text-sm ${getStatusColor(log.status)}`}>
                    {getStatusEmoji(log.status)} {log.status?.charAt(0).toUpperCase() + log.status?.slice(1) || 'Not marked'}
                  </div>
                  <button
                    onClick={() => handleEdit(log)}
                    className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                  >
                    <Edit2 size={18} />
                  </button>
                  <button
                    onClick={() => handleDelete(log.id)}
                    className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Summary */}
        {attendanceLogs.length > 0 && (
          <div className="card">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Summary</h2>
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3 bg-green-50 dark:bg-green-900 rounded-lg border border-green-200 dark:border-green-700 text-center">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {attendanceLogs.filter(l => l.status === 'present').length}
                </div>
                <p className="text-xs text-green-800 dark:text-green-200 mt-1">Present</p>
              </div>
              <div className="p-3 bg-red-50 dark:bg-red-900 rounded-lg border border-red-200 dark:border-red-700 text-center">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {attendanceLogs.filter(l => l.status === 'absent').length}
                </div>
                <p className="text-xs text-red-800 dark:text-red-200 mt-1">Absent</p>
              </div>
              <div className="p-3 bg-gray-100 dark:bg-gray-700 rounded-lg border border-gray-300 dark:border-gray-600 text-center">
                <div className="text-2xl font-bold text-gray-600 dark:text-gray-400">
                  {attendanceLogs.filter(l => l.status === 'cancelled').length}
                </div>
                <p className="text-xs text-gray-700 dark:text-gray-300 mt-1">Cancelled</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default History;
