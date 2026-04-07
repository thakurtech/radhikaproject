'use client';

import { useState, useEffect } from 'react';
import { ClipboardCheck, Plus, Calendar, Clock, MapPin, Award, Trash2 } from 'lucide-react';
import { useUser } from '../components/UserProvider';

export default function ExamsPage() {
  const { user } = useUser();
  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';
  const isTeacher = user?.role === 'teacher';
  const canManage = isAdmin || isTeacher;

  const [exams, setExams] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', courseId: '', examDate: '', startTime: '09:00', endTime: '12:00', maxMarks: '100', room: '', description: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [eRes, cRes] = await Promise.all([fetch('/api/exams'), fetch('/api/courses')]);
      setExams(Array.isArray(await eRes.json().then(d => (setExams(d), d))) ? exams : []);
      const cData = await cRes.json();
      setCourses(Array.isArray(cData) ? cData : []);
      if (cData.length > 0) setForm(p => ({ ...p, courseId: cData[0]._id }));
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  // Fix the double-set issue
  useEffect(() => {
    const load = async () => {
      try {
        const [eRes, cRes] = await Promise.all([fetch('/api/exams'), fetch('/api/courses')]);
        const eData = await eRes.json();
        const cData = await cRes.json();
        setExams(Array.isArray(eData) ? eData : []);
        setCourses(Array.isArray(cData) ? cData : []);
        if (Array.isArray(cData) && cData.length > 0) setForm(p => ({ ...p, courseId: cData[0]._id }));
      } catch (e) { console.error(e); }
      finally { setLoading(false); }
    };
    load();
  }, []);

  const handleCreate = async () => {
    if (!form.title || !form.courseId || !form.examDate) return;
    setCreating(true);
    try {
      const res = await fetch('/api/exams', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, maxMarks: Number(form.maxMarks) })
      });
      if (res.ok) { setShowModal(false); setForm({ title: '', courseId: courses[0]?._id || '', examDate: '', startTime: '09:00', endTime: '12:00', maxMarks: '100', room: '', description: '' }); const d = await fetch('/api/exams').then(r => r.json()); setExams(d); }
      else { const d = await res.json(); alert(d.error); }
    } catch (e) { alert('Network error'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this exam?')) return;
    await fetch(`/api/exams/${id}`, { method: 'DELETE' });
    setExams(exams.filter(e => e._id !== id));
  };

  const fmtDate = (d: string) => new Date(d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  const isPast = (d: string) => new Date(d) < new Date();

  // Group by upcoming / past
  const upcoming = exams.filter(e => !isPast(e.examDate));
  const past = exams.filter(e => isPast(e.examDate));

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Exams & Tests</h1>
          <p className="page-subtitle">Schedule and manage examinations</p>
        </div>
        {canManage && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Schedule Exam</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : exams.length === 0 ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <ClipboardCheck size={30} color="var(--primary)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>No Exams Scheduled</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
            {canManage ? 'Schedule your first exam using the button above.' : 'No exams have been scheduled yet.'}
          </div>
        </div>
      ) : (
        <>
          {upcoming.length > 0 && (
            <>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: 12 }}>Upcoming Exams</h2>
              <div className="card mb-6">
                <div className="table-container">
                  <table>
                    <thead><tr><th>Exam</th><th>Course</th><th>Date</th><th>Time</th><th>Room</th><th>Max Marks</th>{canManage && <th>Actions</th>}</tr></thead>
                    <tbody>
                      {upcoming.map(e => (
                        <tr key={e._id}>
                          <td><span style={{ fontWeight: 600 }}>{e.title}</span></td>
                          <td>{e.courseId?.name || '—'}</td>
                          <td><span className="flex items-center gap-1"><Calendar size={13} /> {fmtDate(e.examDate)}</span></td>
                          <td><span className="flex items-center gap-1"><Clock size={13} /> {e.startTime} — {e.endTime}</span></td>
                          <td>{e.room || '—'}</td>
                          <td><span className="flex items-center gap-1"><Award size={13} /> {e.maxMarks}</span></td>
                          {canManage && <td><button className="btn btn-ghost btn-sm" style={{ color: '#f43f5e' }} onClick={() => handleDelete(e._id)}><Trash2 size={14} /></button></td>}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
          {past.length > 0 && (
            <>
              <h2 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--text-muted)', marginBottom: 12 }}>Past Exams</h2>
              <div className="card" style={{ opacity: 0.7 }}>
                <div className="table-container">
                  <table>
                    <thead><tr><th>Exam</th><th>Course</th><th>Date</th><th>Max Marks</th></tr></thead>
                    <tbody>
                      {past.map(e => (
                        <tr key={e._id}>
                          <td>{e.title}</td>
                          <td>{e.courseId?.name || '—'}</td>
                          <td>{fmtDate(e.examDate)}</td>
                          <td>{e.maxMarks}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </>
          )}
        </>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Schedule Exam</span>
              <button className="modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-4"><label className="form-label">Exam Title *</label><input className="form-input" placeholder="e.g. Mid-term Mathematics" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group mb-4"><label className="form-label">Course *</label><select className="form-input" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>{courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}</select></div>
              <div className="form-group mb-4"><label className="form-label">Exam Date *</label><input className="form-input" type="date" value={form.examDate} onChange={e => setForm({ ...form, examDate: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4"><label className="form-label">Start Time *</label><input className="form-input" type="time" value={form.startTime} onChange={e => setForm({ ...form, startTime: e.target.value })} /></div>
                <div className="form-group mb-4"><label className="form-label">End Time *</label><input className="form-input" type="time" value={form.endTime} onChange={e => setForm({ ...form, endTime: e.target.value })} /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4"><label className="form-label">Room</label><input className="form-input" placeholder="e.g. Hall A" value={form.room} onChange={e => setForm({ ...form, room: e.target.value })} /></div>
                <div className="form-group mb-4"><label className="form-label">Max Marks</label><input className="form-input" type="number" min={1} value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={creating || !form.title || !form.courseId || !form.examDate}>{creating ? 'Scheduling...' : 'Schedule Exam'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
