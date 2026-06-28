import React, { useState } from 'react';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import TimeSlotForm from '../components/TimeSlotForm';

const Timetable = () => {
  const { timetable, addTimeSlot, updateTimeSlot, deleteTimeSlot } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [selectedDay, setSelectedDay] = useState('Monday');
  const [editingSlot, setEditingSlot] = useState(null);

  const days = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  const handleSave = (slot) => {
    if (editingSlot?.id) {
      updateTimeSlot(selectedDay, editingSlot.id, slot);
    } else {
      addTimeSlot(selectedDay, slot);
    }
    setShowForm(false);
    setEditingSlot(null);
  };

  const handleEdit = (slot) => {
    setEditingSlot(slot);
    setShowForm(true);
  };

  const handleDelete = (slotId) => {
    deleteTimeSlot(selectedDay, slotId);
  };

  return (
    <div className="pb-24 pt-4 px-4 bg-gray-50 dark:bg-gray-900 min-h-screen">
      {showForm && (
        <TimeSlotForm
          slot={editingSlot}
          onSave={handleSave}
          onCancel={() => {
            setShowForm(false);
            setEditingSlot(null);
          }}
        />
      )}

      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Weekly Timetable</h1>

        {/* Day Selector */}
        <div className="flex gap-2 overflow-x-auto pb-2">
          {days.map(day => (
            <button
              key={day}
              onClick={() => setSelectedDay(day)}
              className={`px-4 py-2 rounded-lg whitespace-nowrap font-medium transition-colors ${
                selectedDay === day
                  ? 'bg-blue-600 text-white'
                  : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border border-gray-200 dark:border-gray-700 hover:border-blue-600'
              }`}
            >
              {day}
            </button>
          ))}
        </div>

        {/* Time Slots */}
        <div className="card">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
              {selectedDay}'s Classes
            </h2>
            <button
              onClick={() => {
                setEditingSlot(null);
                setShowForm(true);
              }}
              className="flex items-center gap-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus size={18} />
              Add Slot
            </button>
          </div>

          {timetable[selectedDay]?.length === 0 ? (
            <p className="text-gray-600 dark:text-gray-400 text-center py-8">
              No classes scheduled for {selectedDay}
            </p>
          ) : (
            <div className="space-y-3">
              {timetable[selectedDay]?.map(slot => (
                <div
                  key={slot.id}
                  className="flex justify-between items-center p-4 border border-gray-200 dark:border-gray-700 rounded-lg hover:shadow-md transition-shadow"
                >
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">{slot.subject}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                      {slot.startTime} - {slot.endTime}
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(slot)}
                      className="p-2 text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-900 rounded-lg transition-colors"
                    >
                      <Edit2 size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(slot.id)}
                      className="p-2 text-red-600 hover:bg-red-50 dark:hover:bg-red-900 rounded-lg transition-colors"
                    >
                      <Trash2 size={18} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Full Week Overview */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Week Overview</h2>
          <div className="space-y-3">
            {days.map(day => {
              const daySlots = timetable[day] || [];
              return (
                <div key={day} className="p-3 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <h3 className="font-semibold text-gray-900 dark:text-white mb-2">{day}</h3>
                  {daySlots.length === 0 ? (
                    <p className="text-sm text-gray-500 dark:text-gray-400">No classes</p>
                  ) : (
                    <div className="space-y-1">
                      {daySlots.map(slot => (
                        <div key={slot.id} className="text-sm text-gray-600 dark:text-gray-400">
                          {slot.startTime} - {slot.endTime}: <span className="font-medium text-gray-900 dark:text-white">{slot.subject}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Timetable;
