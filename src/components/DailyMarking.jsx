import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Clock } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { getTodayClasses } from '../utils/calculations';

const DailyMarking = ({ onClose }) => {
  const { timetable, subjects, addAttendanceLog, updateAttendanceLog, getTodayLogs, updateSubject } = useAppContext();
  const todayClasses = getTodayClasses(timetable);
  const todayLogs = getTodayLogs();
  const [marking, setMarking] = useState(() => {
    const initialMarking = {};
    todayLogs.forEach(log => {
      initialMarking[log.subject] = log.status;
    });
    return initialMarking;
  });
  const [submitted, setSubmitted] = useState(false);

  const handleMark = (subject, status) => {
    setMarking(prev => ({
      ...prev,
      [subject]: prev[subject] === status ? null : status
    }));
  };

  const handleSubmit = () => {
    const today = new Date().toISOString().split('T')[0];
    let updatedSubjects = {};

    // Clear existing logs for today
    todayLogs.forEach(log => {
      updateAttendanceLog(log.id, { status: null });
    });

    // Add new logs and update subjects
    Object.entries(marking).forEach(([subject, status]) => {
      if (status) {
        const existingLog = todayLogs.find(log => log.subject === subject);
        if (existingLog) {
          updateAttendanceLog(existingLog.id, { status, date: today });
        } else {
          addAttendanceLog({
            date: today,
            subject,
            status,
          });
        }

        // Update subject counts
        const subjectObj = subjects.find(s => s.name === subject);
        if (subjectObj) {
          const oldLog = todayLogs.find(log => log.subject === subject);
          const oldStatus = oldLog?.status;

          let newTotal = subjectObj.total || 0;
          let newAttended = subjectObj.attended || 0;

          // Remove old status effect
          if (oldStatus === 'present') newAttended--;
          else if (oldStatus === 'absent') newTotal--;

          // Add new status effect
          if (status === 'present') {
            newAttended++;
            newTotal++;
          } else if (status === 'absent') {
            newTotal++;
          }

          updateSubject(subjectObj.id, {
            total: newTotal,
            attended: newAttended,
          });
        }
      }
    });

    setSubmitted(true);
    setTimeout(onClose, 1500);
  };

  if (submitted) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="card text-center max-w-sm">
          <div className="text-5xl mb-4">✓</div>
          <h3 className="text-2xl font-bold text-green-600 dark:text-green-400">
            Attendance Marked!
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Your attendance for today has been recorded.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
      <div className="card max-w-2xl w-full my-8">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
          Today's Attendance - {new Date().toLocaleDateString()}
        </h3>

        {todayClasses.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-center py-8">
            No classes scheduled for today!
          </p>
        ) : (
          <>
            <div className="space-y-3 max-h-64 overflow-y-auto mb-6">
              {todayClasses.map((slot) => (
                <div key={slot.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <h4 className="font-semibold text-gray-900 dark:text-white">{slot.subject}</h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1 mt-1">
                        <Clock size={14} />
                        {slot.startTime} - {slot.endTime}
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => handleMark(slot.subject, 'present')}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        marking[slot.subject] === 'present'
                          ? 'bg-green-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-green-100 dark:hover:bg-green-900'
                      }`}
                    >
                      <CheckCircle size={18} />
                      Present
                    </button>
                    <button
                      onClick={() => handleMark(slot.subject, 'absent')}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        marking[slot.subject] === 'absent'
                          ? 'bg-red-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-red-100 dark:hover:bg-red-900'
                      }`}
                    >
                      <XCircle size={18} />
                      Absent
                    </button>
                    <button
                      onClick={() => handleMark(slot.subject, 'cancelled')}
                      className={`flex-1 py-2 px-3 rounded-lg flex items-center justify-center gap-2 transition-colors ${
                        marking[slot.subject] === 'cancelled'
                          ? 'bg-gray-500 text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      <Clock size={18} />
                      Cancel
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="flex-1 btn-primary"
              >
                Submit Attendance
              </button>
              <button
                onClick={onClose}
                className="flex-1 btn-secondary"
              >
                Cancel
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default DailyMarking;
