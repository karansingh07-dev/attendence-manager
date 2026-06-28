// Calculations for attendance management

export const calculateAttendancePercentage = (attended, total) => {
  if (total === 0) return 0;
  return Math.round((attended / total) * 100);
};

export const calculateClassesNeeded = (attended, total, target = 75) => {
  if (total === 0) return 0;
  const currentPercentage = (attended / total) * 100;
  
  if (currentPercentage >= target) {
    return 0;
  }
  
  // Formula: (attended + x) / (total + x) = target/100
  // (attended + x) = (total + x) * (target/100)
  // attended + x = total * target/100 + x * target/100
  // x - x * target/100 = total * target/100 - attended
  // x(1 - target/100) = total * target/100 - attended
  // x = (total * target/100 - attended) / (1 - target/100)
  
  const needed = Math.ceil(
    (total * (target / 100) - attended) / (1 - target / 100)
  );
  
  return Math.max(0, needed);
};

export const calculateClassesCanSkip = (attended, total, target = 75) => {
  if (total === 0) return 0;
  const currentPercentage = (attended / total) * 100;
  
  if (currentPercentage < target) {
    return 0;
  }
  
  // Formula: attended / (total + x) = target/100
  // attended * 100 = (total + x) * target
  // attended * 100 = total * target + x * target
  // x * target = attended * 100 - total * target
  // x = (attended * 100 - total * target) / target
  
  const canSkip = Math.floor(
    (attended * 100 - total * target) / target
  );
  
  return Math.max(0, canSkip);
};

export const getTodayClasses = (timetable) => {
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const today = new Date().getDay();
  const dayName = days[today];
  
  return timetable[dayName] || [];
};

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

export const getStatusColor = (percentage) => {
  if (percentage >= 75) return 'text-green-600';
  if (percentage >= 60) return 'text-yellow-600';
  return 'text-red-600';
};

export const getStatusBgColor = (percentage) => {
  if (percentage >= 75) return 'bg-green-100';
  if (percentage >= 60) return 'bg-yellow-100';
  return 'bg-red-100';
};

export const getStatusBarColor = (percentage) => {
  if (percentage >= 75) return 'bg-green-500';
  if (percentage >= 60) return 'bg-yellow-500';
  return 'bg-red-500';
};
