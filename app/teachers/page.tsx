'use client';

import { useState } from 'react';
import {
  Search, Plus, Download, Users, BookOpen, Star, Award,
  Phone, Mail, Calendar, Edit2, ChevronDown
} from 'lucide-react';

const TEACHERS = [
  { id: 1, name: 'Dr. Meera Krishnan', subject: 'Mathematics', department: 'Science', classes: ['Grade 10-A', 'Grade 11-A', 'Grade 12-B'], experience: 12, rating: 4.9, students: 124, phone: '+91 98765 11111', email: 'meera@springfield.edu', status: 'Active', avatar: 'MK', color: '#6366f1', schedule: 'Mon-Fri' },
  { id: 2, name: 'Prof. Suresh Nair', subject: 'Physics', department: 'Science', classes: ['Grade 11-A', 'Grade 12-A'], experience: 8, rating: 4.7, students: 86, phone: '+91 87654 22222', email: 'suresh@springfield.edu', status: 'Active', avatar: 'SN', color: '#8b5cf6', schedule: 'Mon-Fri' },
  { id: 3, name: 'Ms. Divya Joshi', subject: 'English Literature', department: 'Humanities', classes: ['Grade 9-A', 'Grade 9-B', 'Grade 10-B'], experience: 6, rating: 4.8, students: 142, phone: '+91 76543 33333', email: 'divya@springfield.edu', status: 'Active', avatar: 'DJ', color: '#06b6d4', schedule: 'Mon-Fri' },
  { id: 4, name: 'Mr. Rahul Gupta', subject: 'History', department: 'Humanities', classes: ['Grade 8-A', 'Grade 8-B', 'Grade 9-A'], experience: 10, rating: 4.5, students: 138, phone: '+91 65432 44444', email: 'rahul@springfield.edu', status: 'Active', avatar: 'RG', color: '#10b981', schedule: 'Mon-Sat' },
  { id: 5, name: 'Dr. Priya Venkat', subject: 'Chemistry', department: 'Science', classes: ['Grade 11-B', 'Grade 12-A'], experience: 15, rating: 4.9, students: 82, phone: '+91 54321 55555', email: 'priya@springfield.edu', status: 'Active', avatar: 'PV', color: '#f59e0b', schedule: 'Mon-Fri' },
  { id: 6, name: 'Mr. Ankit Sharma', subject: 'Computer Science', department: 'Technology', classes: ['Grade 10-A', 'Grade 11-A', 'Grade 12-B'], experience: 5, rating: 4.6, students: 110, phone: '+91 43210 66666', email: 'ankit@springfield.edu', status: 'On Leave', avatar: 'AS', color: '#f43f5e', schedule: 'Mon-Fri' },
];

const DEPARTMENTS = ['Science', 'Humanities', 'Technology', 'Arts', 'Commerce'];

export default function TeachersPage() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('all');
  const [view, setView] = useState<'grid' | 'list'>('grid');

  const filtered = TEACHERS.filter(t => {
    const m = t.name.toLowerCase().includes(search.toLowerCase()) || t.subject.toLowerCase().includes(search.toLowerCase());
    const d = dept === 'all' || t.department === dept;
    return m && d;
  });

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Teachers</h1>
          <p className="page-subtitle">{TEACHERS.length} faculty members · 5 departments</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export</button>
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Teacher</button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid-4 mb-5">
        {[
          { label: 'Total Faculty', value: '142', color: 'blue', icon: Users },
          { label: 'Avg. Rating', value: '4.7★', color: 'amber', icon: Star },
          { label: 'Departments', value: '8', color: 'violet', icon: BookOpen },
          { label: 'On Leave', value: '4', color: 'rose', icon: Calendar },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="card mb-5">
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search teachers or subjects..." value={search} onChange={e => setSearch(e.target.value)} />
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

      {/* GRID VIEW */}
      {view === 'grid' && (
        <div className="grid-3">
          {filtered.map(teacher => (
            <div key={teacher.id} className="card card-body" style={{ padding: 0, overflow: 'hidden' }}>
              {/* Card top color bar */}
              <div style={{ height: 6, background: teacher.color }} />
              <div style={{ padding: '20px' }}>
                <div className="flex items-start gap-3 mb-4">
                  <div className="avatar" style={{ background: teacher.color, width: 52, height: 52, fontSize: '1.1rem', flexShrink: 0 }}>
                    {teacher.avatar}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem', marginBottom: 2 }}>{teacher.name}</div>
                    <div style={{ fontSize: '0.8rem', color: teacher.color, fontWeight: 600 }}>{teacher.subject}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{teacher.department}</div>
                  </div>
                  <span className={`badge ${teacher.status === 'Active' ? 'badge-success' : 'badge-warning'}`} style={{ flexShrink: 0 }}>{teacher.status}</span>
                </div>

                <div className="grid-2" style={{ marginBottom: 16, gap: 8 }}>
                  {[
                    { label: 'Experience', value: `${teacher.experience}y` },
                    { label: 'Students', value: teacher.students },
                    { label: 'Rating', value: `⭐ ${teacher.rating}` },
                    { label: 'Schedule', value: teacher.schedule },
                  ].map(item => (
                    <div key={item.label} style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '10px 12px' }}>
                      <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: 3 }}>{item.label}</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.value}</div>
                    </div>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Classes</div>
                  <div className="flex flex-wrap gap-1">
                    {teacher.classes.map(cls => <span key={cls} className="badge badge-primary" style={{ fontSize: '0.68rem' }}>{cls}</span>)}
                  </div>
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
                  <th>Subject</th>
                  <th>Department</th>
                  <th>Experience</th>
                  <th>Students</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(t => (
                  <tr key={t.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <div className="avatar avatar-sm" style={{ background: t.color, width: 34, height: 34 }}>{t.avatar}</div>
                        <div>
                          <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{t.name}</div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.email}</div>
                        </div>
                      </div>
                    </td>
                    <td style={{ fontWeight: 600, color: t.color }}>{t.subject}</td>
                    <td><span className="badge badge-neutral">{t.department}</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{t.experience} years</td>
                    <td style={{ fontSize: '0.875rem', fontWeight: 600 }}>{t.students}</td>
                    <td><span style={{ fontWeight: 700, color: 'var(--accent-amber)' }}>⭐ {t.rating}</span></td>
                    <td><span className={`badge ${t.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{t.status}</span></td>
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
  );
}
