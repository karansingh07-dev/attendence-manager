import React, { useState } from 'react';
import { Download, Upload, Trash2, Info } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { exportAsJSON, importFromJSON, exportAsCSV } from '../utils/export';
import ThemeToggle from '../components/ThemeToggle';

const Settings = () => {
  const { settings, updateSettings, exportData, importData, clearAllData, subjects, attendanceLogs } = useAppContext();
  const [showClearConfirm, setShowClearConfirm] = useState(false);
  const [showImportConfirm, setShowImportConfirm] = useState(false);
  const [importSuccess, setImportSuccess] = useState(false);

  const handleTargetChange = (e) => {
    const value = parseInt(e.target.value);
    updateSettings({ targetAttendance: Math.max(0, Math.min(100, value)) });
  };

  const handleExportJSON = () => {
    const data = exportData();
    exportAsJSON(data, `attendance_backup_${new Date().toISOString().split('T')[0]}.json`);
  };

  const handleExportCSV = () => {
    exportAsCSV(subjects, attendanceLogs, `attendance_report_${new Date().toISOString().split('T')[0]}.csv`);
  };

  const handleImportClick = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await importFromJSON(file);
      importData(data);
      setImportSuccess(true);
      setTimeout(() => setImportSuccess(false), 3000);
    } catch (error) {
      alert('Error importing file: ' + error.message);
    }

    e.target.value = '';
  };

  const handleClearAllData = () => {
    clearAllData();
    setShowClearConfirm(false);
  };

  return (
    <div className="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Settings</h1>
          <ThemeToggle />
        </div>

        {/* Import Success Message */}
        {importSuccess && (
          <div className="card bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700">
            <p className="text-green-800 dark:text-green-200">✓ Data imported successfully!</p>
          </div>
        )}

        {/* Target Attendance */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Target Attendance</h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Minimum Attendance Percentage: {settings.targetAttendance}%
              </label>
              <input
                type="range"
                min="0"
                max="100"
                value={settings.targetAttendance}
                onChange={handleTargetChange}
                className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-2">
                This will be used to calculate required and skippable classes
              </p>
            </div>
          </div>
        </div>

        {/* Attendance Calculator Info */}
        <div className="card bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700">
          <div className="flex gap-3">
            <Info className="text-blue-600 dark:text-blue-400 flex-shrink-0" size={24} />
            <div>
              <h3 className="font-semibold text-blue-900 dark:text-blue-100">Calculator Info</h3>
              <p className="text-sm text-blue-800 dark:text-blue-200 mt-1">
                The attendance calculator shows how many classes you need to attend to reach your target, or how many you can skip while staying above it.
              </p>
            </div>
          </div>
        </div>

        {/* Data Management */}
        <div className="card">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Data Management</h2>
          <div className="space-y-3">
            <button
              onClick={handleExportJSON}
              className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="text-blue-600 dark:text-blue-400" size={20} />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">Export as JSON</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Backup all your data</p>
              </div>
            </button>

            <button
              onClick={handleExportCSV}
              className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
            >
              <Download className="text-green-600 dark:text-green-400" size={20} />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">Export as CSV</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Generate attendance report</p>
              </div>
            </button>

            <label className="w-full flex items-center gap-3 p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors cursor-pointer">
              <Upload className="text-purple-600 dark:text-purple-400" size={20} />
              <div className="text-left">
                <h3 className="font-medium text-gray-900 dark:text-white">Import from JSON</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Restore from backup</p>
              </div>
              <input
                type="file"
                accept=".json"
                onChange={handleImportClick}
                className="hidden"
              />
            </label>
          </div>
        </div>

        {/* Danger Zone */}
        <div className="card border border-red-200 dark:border-red-700 bg-red-50 dark:bg-red-900">
          <h2 className="text-lg font-semibold text-red-900 dark:text-red-100 mb-4">Danger Zone</h2>

          {showClearConfirm ? (
            <div className="space-y-4">
              <p className="text-red-800 dark:text-red-200">
                ⚠️ This will permanently delete all your data including timetable, subjects, and attendance logs. This action cannot be undone.
              </p>
              <div className="flex gap-3">
                <button
                  onClick={handleClearAllData}
                  className="flex-1 btn-danger"
                >
                  Yes, Delete Everything
                </button>
                <button
                  onClick={() => setShowClearConfirm(false)}
                  className="flex-1 btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowClearConfirm(true)}
              className="w-full flex items-center gap-3 p-4 text-red-600 dark:text-red-400 hover:bg-red-100 dark:hover:bg-red-800 border border-red-300 dark:border-red-600 rounded-lg transition-colors"
            >
              <Trash2 size={20} />
              <div className="text-left">
                <h3 className="font-medium">Delete All Data</h3>
                <p className="text-sm">Remove all timetable, subjects, and logs</p>
              </div>
            </button>
          )}
        </div>

        {/* App Info */}
        <div className="card text-center text-sm text-gray-600 dark:text-gray-400">
          <p>Attendance Manager v1.0.0</p>
          <p className="mt-2">Track your attendance with ease</p>
        </div>
      </div>
    </div>
  );
};

export default Settings;
