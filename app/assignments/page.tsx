'use client';

import { useState, useEffect } from 'react';
import {
  FileText, Plus, Clock, CheckCircle, AlertCircle, ChevronDown, ChevronUp,
  Send, Award, Calendar, BookOpen, Users, Trash2, X, Eye
} from 'lucide-react';
import { useUser } from '../components/UserProvider';

export default function AssignmentsPage() {
  const { user } = useUser();
  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';
  const canCreate = isAdmin || isTeacher;

  const [assignments, setAssignments] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Create modal
  const [showCreate, setShowCreate] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', courseId: '', dueDate: '', maxMarks: '100' });

  // Submit modal
  const [submitModal, setSubmitModal] = useState<any>(null);
  const [submitText, setSubmitText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Submissions view
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [submissions, setSubmissions] = useState<any[]>([]);
  const [loadingSubs, setLoadingSubs] = useState(false);

  // Grading
  const [gradingId, setGradingId] = useState<string | null>(null);
  const [gradeVal, setGradeVal] = useState('');
  const [feedbackVal, setFeedbackVal] = useState('');
  const [grading, setGrading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [aRes, cRes] = await Promise.all([
        fetch('/api/assignments'),
        fetch('/api/courses')
      ]);
      const aData = await aRes.json();
      const cData = await cRes.json();
      setAssignments(Array.isArray(aData) ? aData : []);
      setCourses(Array.isArray(cData) ? cData : []);
      if (Array.isArray(cData) && cData.length > 0) {
        setForm(prev => ({ ...prev, courseId: cData[0]._id }));
      }
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleCreate = async () => {
    if (!form.title || !form.courseId || !form.dueDate) return;
    setCreating(true);
    try {
      const res = await fetch('/api/assignments', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, maxMarks: Number(form.maxMarks) })
      });
      if (res.ok) {
        setShowCreate(false);
        setForm({ title: '', description: '', courseId: courses[0]?._id || '', dueDate: '', maxMarks: '100' });
        fetchData();
      } else {
        const d = await res.json();
        alert(d.error || 'Failed');
      }
    } catch (e) { alert('Network error'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this assignment and all submissions?')) return;
    await fetch(`/api/assignments/${id}`, { method: 'DELETE' });
    fetchData();
  };

  const handleSubmit = async () => {
    if (!submitText.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch(`/api/assignments/${submitModal._id}/submissions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ submissionText: submitText })
      });
      const d = await res.json();
      if (res.ok) {
        setSubmitModal(null);
        setSubmitText('');
        fetchData();
      } else {
        alert(d.error || 'Submission failed');
      }
    } catch (e) { alert('Network error'); }
    finally { setSubmitting(false); }
  };

  const loadSubmissions = async (assignmentId: string) => {
    if (expandedId === assignmentId) { setExpandedId(null); return; }
    setExpandedId(assignmentId);
    setLoadingSubs(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submissions`);
      const data = await res.json();
      setSubmissions(Array.isArray(data) ? data : []);
    } catch (e) { setSubmissions([]); }
    finally { setLoadingSubs(false); }
  };

  const handleGrade = async (assignmentId: string, subId: string) => {
    if (!gradeVal) return;
    setGrading(true);
    try {
      const res = await fetch(`/api/assignments/${assignmentId}/submissions/${subId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ grade: Number(gradeVal), feedback: feedbackVal })
      });
      if (res.ok) {
        setGradingId(null);
        setGradeVal('');
        setFeedbackVal('');
        loadSubmissions(assignmentId);
      } else {
        const d = await res.json();
        alert(d.error || 'Grading failed');
      }
    } catch (e) { alert('Network error'); }
    finally { setGrading(false); }
  };

  const isPastDue = (d: string) => new Date() > new Date(d);
  const fmtDate = (d: string) => new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' });

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Assignments</h1>
          <p className="page-subtitle">
            {canCreate ? 'Create, manage, and grade student assignments' : 'View and submit your assignments'}
          </p>
        </div>
        {canCreate && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowCreate(true)}>
              <Plus size={15} /> Create Assignment
            </button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading assignments...</div>
      ) : assignments.length === 0 ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <FileText size={30} color="var(--primary)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No Assignments Yet</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto' }}>
            {canCreate ? 'Create your first assignment by clicking the button above.' : 'No assignments have been posted for your course yet.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {assignments.map((a) => {
            const pastDue = isPastDue(a.dueDate);
            const isExpanded = expandedId === a._id;
            return (
              <div key={a._id} className="card" style={{ overflow: 'hidden' }}>
                <div className="card-body" style={{ padding: '20px 24px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                    <div style={{
                      width: 44, height: 44, borderRadius: 12, flexShrink: 0,
                      background: pastDue ? 'rgba(244,63,94,0.1)' : 'var(--primary-subtle)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center'
                    }}>
                      <FileText size={20} color={pastDue ? '#f43f5e' : 'var(--primary)'} />
                    </div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                        <span style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>{a.title}</span>
                        <span className={`badge ${a.status === 'active' ? 'badge-success' : 'badge-neutral'}`}>
                          {a.status === 'active' ? 'Active' : 'Closed'}
                        </span>
                        {pastDue && <span className="badge badge-danger">Past Due</span>}
                        {isStudent && a.mySubmission && (
                          <span className={`badge ${a.mySubmission.status === 'graded' ? 'badge-primary' : a.mySubmission.isLate ? 'badge-warning' : 'badge-success'}`}>
                            {a.mySubmission.status === 'graded' ? `Graded: ${a.mySubmission.grade}/${a.maxMarks}` : a.mySubmission.isLate ? 'Submitted (Late)' : 'Submitted'}
                          </span>
                        )}
                      </div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {a.description || 'No description provided.'}
                      </div>
                      <div style={{ display: 'flex', gap: 16, marginTop: 10, flexWrap: 'wrap' }}>
                        <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <BookOpen size={13} /> {a.courseId?.name || 'Unknown Course'}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: pastDue ? '#f43f5e' : 'var(--text-muted)' }}>
                          <Calendar size={13} /> Due: {fmtDate(a.dueDate)}
                        </span>
                        <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                          <Award size={13} /> Max: {a.maxMarks} marks
                        </span>
                        {canCreate && (
                          <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                            <Users size={13} /> {a.submissionCount || 0} submitted, {a.gradedCount || 0} graded
                          </span>
                        )}
                      </div>

                      {/* Student's feedback */}
                      {isStudent && a.mySubmission?.status === 'graded' && a.mySubmission.feedback && (
                        <div style={{
                          marginTop: 12, padding: '10px 14px', borderRadius: 10,
                          background: 'var(--primary-subtle)', border: '1px solid var(--border-subtle)'
                        }}>
                          <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--primary)', marginBottom: 4 }}>Teacher Feedback</div>
                          <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{a.mySubmission.feedback}</div>
                        </div>
                      )}
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
                      {isStudent && !a.mySubmission && a.status === 'active' && (
                        <button className="btn btn-primary btn-sm" onClick={() => { setSubmitModal(a); setSubmitText(''); }}>
                          <Send size={13} /> Submit
                        </button>
                      )}
                      {canCreate && (
                        <>
                          <button className="btn btn-secondary btn-sm" onClick={() => loadSubmissions(a._id)}>
                            <Eye size={13} /> {isExpanded ? 'Hide' : 'View'} ({a.submissionCount || 0})
                            {isExpanded ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                          </button>
                          <button className="btn btn-ghost btn-sm" style={{ color: '#f43f5e' }} onClick={() => handleDelete(a._id)}>
                            <Trash2 size={13} />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Expanded Submissions */}
                {isExpanded && canCreate && (
                  <div style={{ borderTop: '1px solid var(--border-subtle)', background: 'var(--bg-subtle)' }}>
                    {loadingSubs ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading submissions...</div>
                    ) : submissions.length === 0 ? (
                      <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>No submissions yet</div>
                    ) : (
                      <div className="table-container">
                        <table>
                          <thead>
                            <tr>
                              <th>Student</th>
                              <th>Enrollment #</th>
                              <th>Submitted</th>
                              <th>Status</th>
                              <th>Grade</th>
                              <th>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {submissions.map((s) => (
                              <tr key={s._id}>
                                <td style={{ fontWeight: 600 }}>{s.studentId?.firstName} {s.studentId?.lastName}</td>
                                <td>{s.studentId?.enrollmentNumber}</td>
                                <td>
                                  <div className="flex items-center gap-1">
                                    {fmtDate(s.submittedAt)}
                                    {s.isLate && <span className="badge badge-warning" style={{ fontSize: '0.65rem' }}>Late</span>}
                                  </div>
                                </td>
                                <td>
                                  <span className={`badge ${s.status === 'graded' ? 'badge-success' : 'badge-primary'}`}>
                                    {s.status === 'graded' ? 'Graded' : 'Pending'}
                                  </span>
                                </td>
                                <td style={{ fontWeight: 700 }}>
                                  {s.grade !== null && s.grade !== undefined ? `${s.grade}/${a.maxMarks}` : '—'}
                                </td>
                                <td>
                                  {gradingId === s._id ? (
                                    <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                                      <input
                                        type="number" className="form-input" placeholder="Marks" min={0} max={a.maxMarks}
                                        style={{ width: 70, padding: '4px 8px', fontSize: '0.8rem' }}
                                        value={gradeVal} onChange={e => setGradeVal(e.target.value)}
                                      />
                                      <input
                                        className="form-input" placeholder="Feedback" style={{ width: 140, padding: '4px 8px', fontSize: '0.8rem' }}
                                        value={feedbackVal} onChange={e => setFeedbackVal(e.target.value)}
                                      />
                                      <button className="btn btn-primary btn-sm" disabled={grading} onClick={() => handleGrade(a._id, s._id)}>
                                        {grading ? '...' : 'Save'}
                                      </button>
                                      <button className="btn btn-ghost btn-sm" onClick={() => setGradingId(null)}>
                                        <X size={13} />
                                      </button>
                                    </div>
                                  ) : (
                                    <button className="btn btn-secondary btn-sm" onClick={() => {
                                      setGradingId(s._id);
                                      setGradeVal(s.grade?.toString() || '');
                                      setFeedbackVal(s.feedback || '');
                                    }}>
                                      <Award size={13} /> {s.status === 'graded' ? 'Re-grade' : 'Grade'}
                                    </button>
                                  )}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Create Assignment Modal */}
      {showCreate && (
        <div className="modal-backdrop" onClick={() => setShowCreate(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Create Assignment</span>
              <button className="modal-close" onClick={() => setShowCreate(false)}>✕</button>
            </div>
            <div className="modal-body">
              <div className="form-group mb-4">
                <label className="form-label">Title *</label>
                <input className="form-input" placeholder="e.g. Data Structures Lab 3" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Description</label>
                <textarea className="form-input" rows={3} placeholder="Instructions, guidelines..." value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">Course *</label>
                <select className="form-input" value={form.courseId} onChange={e => setForm({ ...form, courseId: e.target.value })}>
                  {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
                </select>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4">
                  <label className="form-label">Due Date *</label>
                  <input className="form-input" type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} />
                </div>
                <div className="form-group mb-4">
                  <label className="form-label">Max Marks</label>
                  <input className="form-input" type="number" min={1} value={form.maxMarks} onChange={e => setForm({ ...form, maxMarks: e.target.value })} />
                </div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleCreate} disabled={creating || !form.title || !form.courseId || !form.dueDate}>
                {creating ? 'Creating...' : 'Create Assignment'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Submit Assignment Modal */}
      {submitModal && (
        <div className="modal-backdrop" onClick={() => setSubmitModal(null)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <span className="modal-title">Submit: {submitModal.title}</span>
              <button className="modal-close" onClick={() => setSubmitModal(null)}>✕</button>
            </div>
            <div className="modal-body">
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 16 }}>
                Due: {fmtDate(submitModal.dueDate)} • Max Marks: {submitModal.maxMarks}
                {isPastDue(submitModal.dueDate) && (
                  <span className="badge badge-warning" style={{ marginLeft: 8 }}>Late Submission</span>
                )}
              </div>
              <div className="form-group">
                <label className="form-label">Your Answer *</label>
                <textarea className="form-input" rows={6} placeholder="Type your answer or solution here..." value={submitText} onChange={e => setSubmitText(e.target.value)} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setSubmitModal(null)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleSubmit} disabled={submitting || !submitText.trim()}>
                {submitting ? 'Submitting...' : isPastDue(submitModal.dueDate) ? 'Submit (Late)' : 'Submit'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
