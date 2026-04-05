'use client';

import { useState } from 'react';
import { CheckCircle2, XCircle, Clock, Save, ChevronLeft, ChevronRight, Users, TrendingUp, AlertCircle } from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line
} from 'recharts';

const CLASSES = ['Grade 8-A', 'Grade 8-B', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'];

const STUDENTS_CLASS = [
  { id: 1, name: 'Aayush Sharma', roll: '01', avatar: 'AS', color: '#6366f1' },
  { id: 2, name: 'Anjali Menon', roll: '02', avatar: 'AM', color: '#10b981' },
  { id: 3, name: 'Aryan Singh', roll: '03', avatar: 'AS', color: '#06b6d4' },
  { id: 4, name: 'Deepak Verma', roll: '04', avatar: 'DV', color: '#8b5cf6' },
  { id: 5, name: 'Kavya Reddy', roll: '05', avatar: 'KR', color: '#f59e0b' },
  { id: 6, name: 'Nisha Patel', roll: '06', avatar: 'NP', color: '#f43f5e' },
  { id: 7, name: 'Priya Patel', roll: '07', avatar: 'PP', color: '#6366f1' },
  { id: 8, name: 'Rohit Kumar', roll: '08', avatar: 'RK', color: '#10b981' },
  { id: 9, name: 'Simran Kaur', roll: '09', avatar: 'SK', color: '#06b6d4' },
  { id: 10, name: 'Vikram Nair', roll: '10', avatar: 'VN', color: '#8b5cf6' },
  { id: 11, name: 'Neha Gupta', roll: '11', avatar: 'NG', color: '#f59e0b' },
  { id: 12, name: 'Raj Patel', roll: '12', avatar: 'RP', color: '#f43f5e' },
];

const weeklyTrend = [
  { day: 'Week 1', present: 89, absent: 11 },
  { day: 'Week 2', present: 92, absent: 8 },
  { day: 'Week 3', present: 88, absent: 12 },
  { day: 'Week 4', present: 85, absent: 15 },
  { day: 'Week 5', present: 91, absent: 9 },
  { day: 'Week 6', present: 94, absent: 6 },
];

const classAttendance = [
  { class: '8-A', pct: 92 }, { class: '8-B', pct: 88 }, { class: '9-A', pct: 91 },
  { class: '9-B', pct: 84 }, { class: '10-A', pct: 95 }, { class: '10-B', pct: 87 },
  { class: '11-A', pct: 89 }, { class: '11-B', pct: 93 }, { class: '12-A', pct: 90 }, { class: '12-B', pct: 86 },
];

type AttendStatus = 'present' | 'absent' | 'late' | null;

export default function AttendancePage() {
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');
  const [attendance, setAttendance] = useState<Record<number, AttendStatus>>({});
  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState('mark');

  const mark = (id: number, status: AttendStatus) => {
    setAttendance(prev => ({ ...prev, [id]: prev[id] === status ? null : status }));
    setSaved(false);
  };

  const markAll = (status: 'present' | 'absent') => {
    const all: Record<number, AttendStatus> = {};
    STUDENTS_CLASS.forEach(s => all[s.id] = status);
    setAttendance(all);
    setSaved(false);
  };

  const presentCount = Object.values(attendance).filter(v => v === 'present').length;
  const absentCount = Object.values(attendance).filter(v => v === 'absent').length;
  const lateCount = Object.values(attendance).filter(v => v === 'late').length;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Attendance</h1>
          <p className="page-subtitle">Mark and track student attendance · Saturday, April 5, 2026</p>
        </div>
        <div className="page-header-actions">
          <div className="pill-tabs">
            {['mark', 'analytics', 'reports'].map(t => (
              <button key={t} className={`pill-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* OVERVIEW STATS */}
      <div className="grid-4 mb-5">
        {[
          { label: 'Present Today', value: '2,458', sub: '86.4%', color: 'emerald', icon: CheckCircle2 },
          { label: 'Absent Today', value: '287', sub: '10.1%', color: 'rose', icon: XCircle },
          { label: 'Late Arrivals', value: '102', sub: '3.5%', color: 'amber', icon: Clock },
          { label: 'Classes Marked', value: '8/10', sub: '80% done', color: 'blue', icon: Users },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {activeTab === 'mark' && (
        <div className="grid-2">
          {/* LEFT: Mark Attendance */}
          <div className="card">
            <div className="card-header">
              <div>
                <div className="card-title">Mark Attendance</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginTop: 2 }}>
                  {presentCount}P · {absentCount}A · {lateCount}L of {STUDENTS_CLASS.length}
                </div>
              </div>
              <select className="form-select" style={{ width: 140 }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
                {CLASSES.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div className="card-body">
              <div className="flex gap-2 mb-4">
                <button className="btn btn-success btn-sm" onClick={() => markAll('present')}>
                  <CheckCircle2 size={14} /> Mark All Present
                </button>
                <button className="btn btn-danger btn-sm" onClick={() => markAll('absent')}>
                  <XCircle size={14} /> Mark All Absent
                </button>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {STUDENTS_CLASS.map(student => {
                  const status = attendance[student.id];
                  return (
                    <div key={student.id} style={{
                      display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px',
                      borderRadius: 'var(--radius-sm)', border: '1.5px solid',
                      borderColor: status === 'present' ? 'var(--success)' : status === 'absent' ? 'var(--danger)' : status === 'late' ? 'var(--warning)' : 'var(--border)',
                      background: status === 'present' ? 'var(--success-light)' : status === 'absent' ? 'var(--danger-light)' : status === 'late' ? 'var(--warning-light)' : 'var(--bg-elevated)',
                      transition: 'all 0.15s ease'
                    }}>
                      <div className="avatar avatar-sm" style={{ background: student.color, width: 32, height: 32, flexShrink: 0 }}>{student.avatar}</div>
                      <span style={{ fontWeight: 500, fontSize: '0.875rem', flex: 1 }}>{student.name}</span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginRight: 8 }}>{student.roll}</span>
                      <div className="flex items-center gap-1">
                        {(['present', 'late', 'absent'] as const).map(s => (
                          <button key={s} onClick={() => mark(student.id, s)} className="btn btn-sm" style={{
                            padding: '4px 10px', fontSize: '0.72rem', fontWeight: 700,
                            background: status === s ? (s === 'present' ? 'var(--success)' : s === 'absent' ? 'var(--danger)' : 'var(--warning)') : 'var(--bg-subtle)',
                            color: status === s ? 'white' : 'var(--text-muted)',
                            borderRadius: 6
                          }}>
                            {s === 'present' ? 'P' : s === 'absent' ? 'A' : 'L'}
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
              <button className="btn btn-primary w-full mt-4" onClick={() => setSaved(true)} style={{ justifyContent: 'center' }}>
                <Save size={16} /> {saved ? '✓ Saved!' : 'Save Attendance'}
              </button>
            </div>
          </div>

          {/* RIGHT: Analytics Preview */}
          <div className="flex-col gap-5" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Weekly Trend</span>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={180}>
                  <LineChart data={weeklyTrend}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[75, 100]} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Line type="monotone" dataKey="present" stroke="var(--primary)" strokeWidth={2.5} dot={{ fill: 'var(--primary)', r: 4 }} />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="card">
              <div className="card-header">
                <span className="card-title">By Class (%)</span>
              </div>
              <div className="card-body">
                <ResponsiveContainer width="100%" height={180}>
                  <BarChart data={classAttendance} barSize={16}>
                    <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                    <XAxis dataKey="class" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                    <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[75, 100]} />
                    <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                    <Bar dataKey="pct" fill="var(--primary)" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Alerts */}
            <div className="card">
              <div className="card-header"><span className="card-title">⚠️ Alerts</span></div>
              <div className="card-body" style={{ padding: '12px 20px' }}>
                {[
                  { name: 'Rohit Kumar', cls: 'Grade 9-A', att: '65%', days: 12 },
                  { name: 'Priya Patel', cls: 'Grade 9-B', att: '62%', days: 14 },
                  { name: 'Deepak Verma', cls: 'Grade 8-A', att: '68%', days: 10 },
                ].map(a => (
                  <div key={a.name} className="flex items-center gap-3" style={{ padding: '10px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <AlertCircle size={16} color="var(--accent-rose)" />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.825rem', fontWeight: 600 }}>{a.name} ({a.cls})</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{a.days} absences this month</div>
                    </div>
                    <span className="badge badge-danger">{a.att}</span>
                  </div>
                ))}
                <button className="btn btn-danger btn-sm w-full mt-3" style={{ justifyContent: 'center' }}>Send Parent Alerts</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === 'analytics' && (
        <div className="card">
          <div className="card-body" style={{ textAlign: 'center', padding: 60, color: 'var(--text-muted)' }}>
            <TrendingUp size={48} style={{ margin: '0 auto 16px', opacity: 0.3 }} />
            <div style={{ fontSize: '1rem', fontWeight: 600 }}>Analytics Dashboard</div>
            <div style={{ fontSize: '0.875rem' }}>Detailed attendance analytics with trends and insights coming here</div>
          </div>
        </div>
      )}
    </>
  );
}
