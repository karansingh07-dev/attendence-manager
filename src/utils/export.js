// Export and import utilities

export const exportAsJSON = (data, filename = 'attendance_backup.json') => {
  const dataStr = JSON.stringify(data, null, 2);
  const dataBlob = new Blob([dataStr], { type: 'application/json' });
  const url = URL.createObjectURL(dataBlob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};

export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target.result);
        resolve(data);
      } catch (error) {
        reject(new Error('Invalid JSON file'));
      }
    };
    reader.onerror = () => {
      reject(new Error('Failed to read file'));
    };
    reader.readAsText(file);
  });
};

export const exportAsCSV = (subjects, logs, filename = 'attendance_report.csv') => {
  let csv = 'Subject,Total Classes,Classes Attended,Percentage\n';
  
  subjects.forEach(subject => {
    const attended = subject.attended || 0;
    const total = subject.total || 0;
    const percentage = total === 0 ? 0 : Math.round((attended / total) * 100);
    csv += `${subject.name},${total},${attended},${percentage}%\n`;
  });
  
  csv += '\n\nAttendance Logs\n';
  csv += 'Date,Subject,Status\n';
  
  logs.forEach(log => {
    csv += `${log.date},${log.subject},${log.status}\n`;
  });
  
  const blob = new Blob([csv], { type: 'text/csv' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
};
