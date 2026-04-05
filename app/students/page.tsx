'use client';

import { useState, useEffect } from 'react';
import {
  Search, Filter, Plus, Download, MoreVertical, GraduationCap,
  Phone, Mail, MapPin, TrendingUp, TrendingDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight, LoaderCircle
} from 'lucide-react';

export default function StudentsPage() {
  const [students, setStudents] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Filters
  const [search, setSearch] = useState('');
  const [filterCourse, setFilterCourse] = useState('all');
  const [selected, setSelected] = useState<string[]>([]);
  const [viewStudent, setViewStudent] = useState<any>(null);

  // Add Modal State
  const [showAddModal, setShowAddModal] = useState(false);
  const [adding, setAdding] = useState(false);
  const [formError, setFormError] = useState('');
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    enrollmentNumber: '',
    courseId: '',
    currentYear: 1
  });

  const fetchData = async () => {
    try {
      const [stuRes, curRes] = await Promise.all([
        fetch('/api/students'),
        fetch('/api/courses')
      ]);
      const stuData = await stuRes.json();
      const curData = await curRes.json();
      setStudents(Array.isArray(stuData) ? stuData : []);
      setCourses(Array.isArray(curData) ? curData : []);
      if (Array.isArray(curData) && curData.length > 0) {
        setFormData(prev => ({ ...prev, courseId: curData[0]._id }));
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAdding(true);
    setFormError('');
    try {
      const res = await fetch('/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      
      setShowAddModal(false);
      setFormData(prev => ({ ...prev, firstName: '', lastName: '', email: '', enrollmentNumber: '' }));
      fetchData(); // refresh list
    } catch (err: any) {
      setFormError(err.message || 'Something went wrong');
    } finally {
      setAdding(false);
    }
  };

  const filtered = students.filter(s => {
    const fullName = `${s.firstName} ${s.lastName}`.toLowerCase();
    const matchSearch = fullName.includes(search.toLowerCase()) || (s.enrollmentNumber || '').toLowerCase().includes(search.toLowerCase());
    const matchCourse = filterCourse === 'all' || s.courseId?._id === filterCourse;
    return matchSearch && matchCourse;
  });

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  // Helper colors based on index
  const getAvatarColor = (idx: number) => {
    const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];
    return colors[idx % colors.length];
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{students.length} students enrolled</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setShowAddModal(true)}>
            <Plus size={15} /> Add Student
          </button>
        </div>
      </div>

      {loading ? (
        <div style={{ display: 'flex', justifyContent: 'center', padding: '100px 0' }}>
          <LoaderCircle className="animate-spin" size={40} color="var(--primary)" />
        </div>
      ) : (
        <>
          {/* FILTERS */}
          <div className="card mb-5">
            <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
              <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input
                  className="form-input"
                  style={{ paddingLeft: 36 }}
                  placeholder="Search by name or enrollment number..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                />
              </div>
              <select className="form-select" style={{ width: 220 }} value={filterCourse} onChange={e => setFilterCourse(e.target.value)}>
                <option value="all">All Courses</option>
                {courses.map(c => (
                  <option key={c._id} value={c._id}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* TABLE */}
          <div className="card">
            <div className="table-container">
              <table>
                <thead>
                  <tr>
                    <th style={{ width: 40 }}>
                      <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(s => s._id) : [])} />
                    </th>
                    <th>Student</th>
                    <th>Enrollment No.</th>
                    <th>Course</th>
                    <th>Year</th>
                    <th>Attendance</th>
                    <th style={{ width: 80 }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.length === 0 ? (
                    <tr>
                      <td colSpan={7} style={{ textAlign: 'center', padding: '40px 0', color: 'var(--text-muted)' }}>No students found.</td>
                    </tr>
                  ) : filtered.map((student, idx) => (
                    <tr key={student._id}>
                      <td><input type="checkbox" checked={selected.includes(student._id)} onChange={() => toggleSelect(student._id)} /></td>
                      <td>
                        <div className="flex items-center gap-3">
                          <div className="avatar avatar-sm" style={{ background: getAvatarColor(idx), width: 34, height: 34 }}>
                            {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                          </div>
                          <div>
                            <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{student.firstName} {student.lastName}</div>
                          </div>
                        </div>
                      </td>
                      <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{student.enrollmentNumber}</td>
                      <td>
                        <span className="badge badge-primary">{student.courseId?.name || 'N/A'}</span>
                      </td>
                      <td style={{ fontSize: '0.825rem', fontWeight: 600 }}>Year {student.currentYear}</td>
                      <td>
                        <div className="flex items-center gap-2">
                          <div className="progress-bar" style={{ width: 60 }}>
                            <div className={`progress-fill ${student.overallAttendance >= 85 ? 'success' : student.overallAttendance >= 70 ? 'warning' : 'danger'}`}
                              style={{ width: `${student.overallAttendance}%` }} />
                          </div>
                          <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{student.overallAttendance}%</span>
                        </div>
                      </td>
                      <td>
                        <div className="flex items-center gap-1">
                          <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setViewStudent(student)}><Eye size={14} /></button>
                          <button className="btn btn-ghost btn-icon btn-sm"><Edit2 size={14} /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {/* NEW STUDENT MODAL */}
      {showAddModal && (
        <div className="modal-overlay" onClick={() => !adding && setShowAddModal(false)}>
          <form className="modal" style={{ maxWidth: 500 }} onClick={e => e.stopPropagation()} onSubmit={handleAddSubmit}>
             <div className="modal-header">
                <div className="modal-title">Add New Student</div>
                <button type="button" className="btn btn-ghost btn-icon" onClick={() => setShowAddModal(false)}>✕</button>
             </div>
             
             {formError && (
               <div style={{ background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', padding: '10px 14px', borderRadius: 8, fontSize: '0.85rem', marginBottom: 16 }}>
                 {formError}
               </div>
             )}

             <div className="grid-2" style={{ gap: 16, marginBottom: 16 }}>
                <div className="form-group">
                  <label className="form-label">First Name</label>
                  <input className="form-input" required value={formData.firstName} onChange={e=>setFormData({...formData, firstName: e.target.value})} />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input className="form-input" required value={formData.lastName} onChange={e=>setFormData({...formData, lastName: e.target.value})} />
                </div>
             </div>

             <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Student Email (for Login)</label>
                <input className="form-input" type="email" required value={formData.email} onChange={e=>setFormData({...formData, email: e.target.value})} />
             </div>

             <div className="form-group" style={{ marginBottom: 16 }}>
                <label className="form-label">Enrollment / Roll Number</label>
                <input className="form-input" required value={formData.enrollmentNumber} onChange={e=>setFormData({...formData, enrollmentNumber: e.target.value})} />
             </div>

             <div className="grid-2" style={{ gap: 16, marginBottom: 24 }}>
                <div className="form-group">
                  <label className="form-label">Course / Program</label>
                  <select className="form-select" required value={formData.courseId} onChange={e=>setFormData({...formData, courseId: e.target.value})}>
                    {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label">Current Year</label>
                  <input className="form-input" type="number" min="1" max="5" required value={formData.currentYear} onChange={e=>setFormData({...formData, currentYear: Number(e.target.value)})} />
                </div>
             </div>

             <div className="flex gap-2 justify-end">
                <button type="button" className="btn btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary" disabled={adding}>
                  {adding ? <LoaderCircle size={16} className="animate-spin" /> : 'Create Student'}
                </button>
             </div>
          </form>
        </div>
      )}

      {/* STUDENT DETAIL VIEW MODAL */}
      {viewStudent && (
        <div className="modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="modal" style={{ maxWidth: 460 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="avatar" style={{ background: '#6366f1', width: 48, height: 48, fontSize: '1.1rem' }}>
                  {viewStudent.firstName.charAt(0)}{viewStudent.lastName.charAt(0)}
                </div>
                <div>
                  <div className="modal-title">{viewStudent.firstName} {viewStudent.lastName}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewStudent.enrollmentNumber} · {viewStudent.courseId?.name}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewStudent(null)}>✕</button>
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Attendance</div>
                <span className="badge badge-primary" style={{ fontSize: '0.85rem' }}>{viewStudent.overallAttendance}%</span>
              </div>
              <div style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '14px 16px' }}>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>Current Year</div>
                <span className="badge badge-neutral" style={{ fontSize: '0.85rem' }}>Year {viewStudent.currentYear}</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button className="btn btn-secondary" style={{ flex: 1 }} onClick={() => setViewStudent(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
