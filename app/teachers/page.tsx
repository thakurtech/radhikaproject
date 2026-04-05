'use client';

import { useState, useEffect } from 'react';
import {
  Search, Plus, Download, Users, BookOpen, Star, Award,
  Phone, Mail, Calendar, Edit2, ChevronDown, X
} from 'lucide-react';
import { useUser } from '../components/UserProvider';

const DEPARTMENTS = ['Science', 'Humanities', 'Technology', 'Arts', 'Commerce'];

export default function TeachersPage() {
  const { user, loading } = useUser();
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');
  
  const [teachers, setTeachers] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  
  // Form State
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [department, setDepartment] = useState('Science');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const fetchTeachers = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/teachers');
      if (res.ok) {
        const data = await res.json();
        // Decorate with UI mock variables for missing DB fields right now
        const decorated = (data.teachers || []).map((t: any, i: number) => {
           const colors = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e'];
           return {
             ...t,
             avatar: `${t.firstName[0]}${t.lastName[0]}`,
             color: colors[i % colors.length],
             rating: (4 + Math.random()).toFixed(1),
             students: 50 + Math.floor(Math.random() * 100),
             experience: 2 + Math.floor(Math.random() * 15),
             classes: ['Grade A', 'Grade B'],
             status: 'Active'
           };
        });
        setTeachers(decorated);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading && user) {
      fetchTeachers();
    }
  }, [user, loading]);

  const handleCreateTeacher = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const res = await fetch('/api/teachers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ firstName, lastName, department, email, password })
      });

      if (res.ok) {
        alert('Teacher created successfully!');
        setIsModalOpen(false);
        setFirstName('');
        setLastName('');
        setEmail('');
        setPassword('');
        fetchTeachers();
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create teacher');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = teachers.filter(t => {
    const fullName = `${t.firstName} ${t.lastName}`.toLowerCase();
    const m = fullName.includes(search.toLowerCase());
    const d = dept === 'all' || t.department === dept;
    return m && d;
  });

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Teachers</h1>
          <p className="page-subtitle">{teachers.length} faculty members · {new Set(teachers.map(t=>t.department)).size} active departments</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export</button>
          {(user?.role === 'school_admin' || user?.role === 'super_admin') && (
             <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
               <Plus size={15} /> Add Teacher
             </button>
          )}
        </div>
      </div>

      {/* STATS */}
      <div className="grid-4 mb-5">
        {[
          { label: 'Total Faculty', value: teachers.length.toString(), color: 'blue', icon: Users },
          { label: 'Avg. Rating', value: '4.7★', color: 'amber', icon: Star },
          { label: 'Top Department', value: 'Science', color: 'violet', icon: BookOpen },
          { label: 'On Leave', value: '0', color: 'rose', icon: Calendar },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{fetching ? '-' : s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="card mb-5">
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search teachers..." value={search} onChange={e => setSearch(e.target.value)} />
          </div>
          <select className="form-select" style={{ width: 160 }} value={dept} onChange={e => setDept(e.target.value)}>
            <option value="all">All Departments</option>
            {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
          <div className="pill-tabs">
            <button className={`pill-tab ${view === 'grid' ? 'active' : ''}`} onClick={() => setView('grid')}>Grid</button>
            <button className={`pill-tab ${view === 'list' ? 'active' : ''}`} onClick={() => setView('list')}>List</button>
          </div>
        </div>
      </div>

      {/* CONTENT */}
      {fetching ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>Loading teachers...</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--text-muted)' }}>No teachers found.</div>
      ) : (
        <>
          {/* GRID VIEW */}
          {view === 'grid' && (
            <div className="grid-3">
              {filtered.map(t => (
                <div key={t._id} className="card card-body" style={{ padding: 0, overflow: 'hidden' }}>
                  <div style={{ height: 6, background: t.color }} />
                  <div style={{ padding: '20px' }}>
                    <div className="flex items-start gap-3 mb-4">
                      <div className="avatar" style={{ background: t.color, width: 52, height: 52, fontSize: '1.1rem', flexShrink: 0 }}>
                        {t.avatar}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 2 }}>{t.firstName} {t.lastName}</div>
                        <div style={{ fontSize: '0.8rem', color: t.color, fontWeight: 600 }}>{t.department}</div>
                      </div>
                      <span className={`badge badge-success`} style={{ flexShrink: 0 }}>{t.status}</span>
                    </div>

                    <div className="grid-2" style={{ marginBottom: 16, gap: 8 }}>
                      {[
                        { label: 'Experience', value: `${t.experience}y` },
                        { label: 'Students', value: t.students },
                        { label: 'Rating', value: `⭐ ${t.rating}` },
                        { label: 'Classes', value: t.classes.length },
                      ].map(item => (
                        <div key={item.label} style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{item.label}</div>
                          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-2">
                      <button className="btn btn-secondary btn-sm" style={{ flex: 1 }}><Edit2 size={13} /> Edit</button>
                      <button className="btn btn-secondary btn-icon btn-sm"><Mail size={14} /></button>
                      <button className="btn btn-secondary btn-icon btn-sm"><Phone size={14} /></button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* LIST VIEW */}
          {view === 'list' && (
            <div className="card">
              <div className="table-container">
                <table>
                  <thead>
                    <tr>
                      <th>Teacher</th>
                      <th>Department</th>
                      <th>Experience</th>
                      <th>Students</th>
                      <th>Rating</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(t => (
                      <tr key={t._id}>
                        <td>
                          <div className="flex items-center gap-3">
                            <div className="avatar avatar-sm" style={{ background: t.color, width: 34, height: 34 }}>{t.avatar}</div>
                            <div>
                              <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.firstName} {t.lastName}</div>
                            </div>
                          </div>
                        </td>
                        <td style={{ fontWeight: 600, color: t.color }}>{t.department}</td>
                        <td style={{ fontSize: '0.875rem' }}>{t.experience} years</td>
                        <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.students}</td>
                        <td><span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>⭐ {t.rating}</span></td>
                        <td>
                          <div className="flex items-center gap-1">
                            <button className="btn btn-ghost btn-icon btn-sm"><Edit2 size={14} /></button>
                            <button className="btn btn-ghost btn-icon btn-sm"><Mail size={14} /></button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      )}

      {/* CREATE TEACHER MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Hire New Teacher</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateTeacher} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">First Name</label>
                    <input type="text" className="form-input" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                  </div>
                  <div className="form-group" style={{ flex: 1 }}>
                    <label className="form-label">Last Name</label>
                    <input type="text" className="form-input" required value={lastName} onChange={e => setLastName(e.target.value)} />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Department</label>
                  <select className="form-select" required value={department} onChange={e => setDepartment(e.target.value)}>
                    {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Login Email</label>
                  <input type="email" className="form-input" required value={email} onChange={e => setEmail(e.target.value)} />
                  <div className="form-hint">Used for Teacher portal access.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Temporary Password</label>
                  <input type="password" className="form-input" required value={password} onChange={e => setPassword(e.target.value)} />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Creating...' : 'Create Teacher'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
