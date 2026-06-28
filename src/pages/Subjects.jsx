import React, { useState } from 'react';
import { X } from 'lucide-react';
import { useAppContext } from '../context/AppContext';
import { calculateAttendancePercentage } from '../utils/calculations';
import './Subjects.css';

const Subjects = () => {
  const { subjects, addSubject, updateSubject, deleteSubject } = useAppContext();
  const [showForm, setShowForm] = useState(false);
  const [editingSubject, setEditingSubject] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    total: 0,
    attended: 0,
  });

  const handleOpenForm = () => {
    setFormData({ name: '', total: 0, attended: 0 });
    setEditingSubject(null);
    setShowForm(true);
  };

  const handleEdit = (subject) => {
    setFormData({
      name: subject.name,
      total: subject.total || 0,
      attended: subject.attended || 0,
    });
    setEditingSubject(subject);
    setShowForm(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      alert('Subject name is required');
      return;
    }

    if (editingSubject) {
      updateSubject(editingSubject.id, {
        name: formData.name,
        total: formData.total,
        attended: formData.attended,
      });
    } else {
      addSubject({
        name: formData.name,
        total: formData.total,
        attended: formData.attended,
      });
    }

    setShowForm(false);
    setFormData({ name: '', total: 0, attended: 0 });
  };

  const handleQuickMark = (subjectId, type) => {
    const subject = subjects.find(s => s.id === subjectId);
    if (subject) {
      if (type === 'present') {
        updateSubject(subjectId, {
          attended: (subject.attended || 0) + 1,
          total: (subject.total || 0) + 1,
        });
      } else if (type === 'absent') {
        updateSubject(subjectId, {
          total: (subject.total || 0) + 1,
        });
      }
    }
  };

  return (
    <div className="subjects-page page-transition">
      {showForm && (
        <div className="modal-overlay" onClick={() => setShowForm(false)}>
          <div className="modal-content glass-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3 className="modal-title">
                {editingSubject ? 'Edit Subject' : 'Add New Subject'}
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowForm(false)}
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="form-group">
                <label className="form-label">Subject Name *</label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Mathematics, Physics"
                  className="input-field"
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label">Total Classes</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.total}
                    onChange={(e) => setFormData(prev => ({ ...prev, total: parseInt(e.target.value) || 0 }))}
                    className="input-field"
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Classes Attended</label>
                  <input
                    type="number"
                    min="0"
                    value={formData.attended}
                    onChange={(e) => setFormData(prev => ({ ...prev, attended: parseInt(e.target.value) || 0 }))}
                    className="input-field"
                  />
                </div>
              </div>

              <div className="form-actions">
                <button type="submit" className="btn-primary">
                  {editingSubject ? 'Update' : 'Add'} Subject
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="btn-secondary"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="subjects-container">
        {/* Header */}
        <div className="page-header">
          <div className="header-content">
            <h1 className="page-title">📚 Your Subjects</h1>
            <p className="page-subtitle">Manage and track your subjects</p>
          </div>
          <button className="btn-primary btn-lg" onClick={handleOpenForm}>
            + Add Subject
          </button>
        </div>

        {/* Subjects List */}
        {subjects.length === 0 ? (
          <div className="glass-card empty-state">
            <div className="empty-icon">📖</div>
            <h2>No Subjects Yet</h2>
            <p>Add your first subject to start tracking attendance</p>
            <button className="btn-primary" onClick={handleOpenForm}>
              Add First Subject
            </button>
          </div>
        ) : (
          <>
            <div className="subjects-grid">
              {subjects.map(subject => {
                const percentage = calculateAttendancePercentage(subject.attended || 0, subject.total || 0);
                const isPerfect = percentage === 100 && subject.total > 0;
                
                return (
                  <div key={subject.id} className="glass-card subject-card">
                    <div className="subject-card-header">
                      <div className="subject-info">
                        <h3 className="subject-title">{subject.name}</h3>
                        <p className="subject-meta">{subject.attended}/{subject.total} classes</p>
                      </div>
                      {isPerfect && <span className="perfect-badge">🔥</span>}
                    </div>

                    <div className="subject-progress">
                      <div className="progress-bar">
                        <div
                          className="progress-fill"
                          style={{ width: `${Math.min(percentage, 100)}%` }}
                        ></div>
                      </div>
                      <span className="progress-text">{percentage}%</span>
                    </div>

                    <div className="quick-actions">
                      <button
                        className="quick-btn present"
                        onClick={() => handleQuickMark(subject.id, 'present')}
                        title="Mark present and add class"
                      >
                        ✓ Present
                      </button>
                      <button
                        className="quick-btn absent"
                        onClick={() => handleQuickMark(subject.id, 'absent')}
                        title="Mark absent and add class"
                      >
                        ✗ Absent
                      </button>
                    </div>

                    <div className="subject-actions">
                      <button
                        className="action-btn edit"
                        onClick={() => handleEdit(subject)}
                      >
                        Edit
                      </button>
                      <button
                        className="action-btn delete"
                        onClick={() => {
                          if (window.confirm('Delete this subject?')) {
                            deleteSubject(subject.id);
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Summary Stats */}
            <div className="summary-section">
              <h2 className="section-title">Summary</h2>
              <div className="stats-grid">
                <div className="glass-card stat-card">
                  <div className="stat-icon">📊</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Subjects</p>
                    <p className="stat-value">{subjects.length}</p>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon">✓</div>
                  <div className="stat-content">
                    <p className="stat-label">Classes Attended</p>
                    <p className="stat-value">{subjects.reduce((acc, s) => acc + (s.attended || 0), 0)}</p>
                  </div>
                </div>
                <div className="glass-card stat-card">
                  <div className="stat-icon">📚</div>
                  <div className="stat-content">
                    <p className="stat-label">Total Classes</p>
                    <p className="stat-value">{subjects.reduce((acc, s) => acc + (s.total || 0), 0)}</p>
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Subjects;
