'use client';

import { useState, useEffect } from 'react';
import {
  BookOpen, Clock, Calendar, Plus, GraduationCap, Edit2, Trash2
} from 'lucide-react';
import { useUser } from '../components/UserProvider';

export default function AcademicsPage() {
  const { user } = useUser();
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [courseName, setCourseName] = useState('');
  const [duration, setDuration] = useState('4');
  const [submitting, setSubmitting] = useState(false);

  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const res = await fetch('/api/courses');
      if (res.ok) {
        const data = await res.json();
        setCourses(Array.isArray(data) ? data : []);
      }
    } catch (e) {
      console.error('Failed to fetch courses:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleAddCourse = async () => {
    if (!courseName.trim() || submitting) return;
    setSubmitting(true);
    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: courseName.trim(), durationYears: Number(duration) })
      });

      if (res.ok) {
        setShowModal(false);
        setCourseName('');
        setDuration('4');
        fetchCourses();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create course');
      }
    } catch (e) {
      alert('Network error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Academics</h1>
          <p className="page-subtitle">Manage courses, programs, and academic structure</p>
        </div>
        {isAdmin && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={15} /> Add Course
            </button>
          </div>
        )}
      </div>

      {/* Course List */}
      {loading ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
          Loading courses...
        </div>
      ) : courses.length > 0 ? (
        <div className="card">
          <div className="card-header">
            <span className="card-title">Courses & Programs</span>
            <span className="badge badge-primary">{courses.length} Total</span>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course Name</th>
                  <th>Duration</th>
                  <th>Created</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((c: any) => (
                  <tr key={c._id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div style={{
                          width: 36, height: 36, borderRadius: 10,
                          background: 'var(--primary-subtle)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                        }}>
                          <GraduationCap size={16} color="var(--primary)" />
                        </div>
                        <span style={{ fontWeight: 600 }}>{c.name}</span>
                      </div>
                    </td>
                    <td>
                      <div className="flex items-center gap-2">
                        <Clock size={14} color="var(--text-muted)" />
                        <span>{c.durationYears} {c.durationYears === 1 ? 'Year' : 'Years'}</span>
                      </div>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>
                      {new Date(c.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="card card-body" style={{ textAlign: 'center', padding: '4rem 2rem' }}>
          <div style={{ width: 56, height: 56, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
            <BookOpen size={26} color="var(--primary)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 8 }}>No Courses Yet</div>
          <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto 20px' }}>
            Courses are the foundation of your academic structure. Add programs like "B.Tech", "MBA", "B.Sc" etc. to start enrolling students.
          </div>
          {isAdmin && (
            <button className="btn btn-primary" onClick={() => setShowModal(true)}>
              <Plus size={15} /> Create First Course
            </button>
          )}
        </div>
      )}

      {/* Add Course Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Add New Course</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-4">
                <label className="form-label">Course / Program Name</label>
                <input
                  className="form-input"
                  placeholder="e.g. B.Tech Computer Science"
                  value={courseName}
                  onChange={e => setCourseName(e.target.value)}
                />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Duration (Years)</label>
                <select className="form-input" value={duration} onChange={e => setDuration(e.target.value)}>
                  {[1, 2, 3, 4, 5].map(y => (
                    <option key={y} value={y}>{y} {y === 1 ? 'Year' : 'Years'}</option>
                  ))}
                </select>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAddCourse} disabled={submitting || !courseName.trim()}>
                {submitting ? 'Creating...' : 'Create Course'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
