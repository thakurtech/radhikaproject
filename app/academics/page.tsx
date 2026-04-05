'use client';

import { useState } from 'react';
import { BookOpen, Clock, Plus, Calendar, Filter } from 'lucide-react';

const TIMETABLE = {
  'Grade 10-A': [
    { day: 'Monday', periods: ['Math (Dr. Meera)', 'Physics (Prof. Suresh)', 'English (Ms. Divya)', 'Chemistry (Dr. Priya)', 'PE', 'History (Mr. Rahul)', 'Computer (Mr. Ankit)'] },
    { day: 'Tuesday', periods: ['English (Ms. Divya)', 'Math (Dr. Meera)', 'History (Mr. Rahul)', 'Physics (Prof. Suresh)', 'Chemistry (Dr. Priya)', 'Computer (Mr. Ankit)', 'PE'] },
    { day: 'Wednesday', periods: ['Chemistry (Dr. Priya)', 'English (Ms. Divya)', 'Math (Dr. Meera)', 'PE', 'Physics (Prof. Suresh)', 'History (Mr. Rahul)', 'Computer (Mr. Ankit)'] },
    { day: 'Thursday', periods: ['Physics (Prof. Suresh)', 'Chemistry (Dr. Priya)', 'History (Mr. Rahul)', 'Math (Dr. Meera)', 'Computer (Mr. Ankit)', 'English (Ms. Divya)', 'PE'] },
    { day: 'Friday', periods: ['Computer (Mr. Ankit)', 'History (Mr. Rahul)', 'Physics (Prof. Suresh)', 'Chemistry (Dr. Priya)', 'Math (Dr. Meera)', 'PE', 'English (Ms. Divya)'] },
  ]
};

const SUBJECTS = [
  { name: 'Mathematics', teacher: 'Dr. Meera Krishnan', code: 'MATH101', classes: 6, students: 248, color: '#6366f1' },
  { name: 'Physics', teacher: 'Prof. Suresh Nair', code: 'PHY101', classes: 4, students: 186, color: '#8b5cf6' },
  { name: 'Chemistry', teacher: 'Dr. Priya Venkat', code: 'CHEM101', classes: 4, students: 186, color: '#06b6d4' },
  { name: 'English Literature', teacher: 'Ms. Divya Joshi', code: 'ENG101', classes: 6, students: 286, color: '#10b981' },
  { name: 'History', teacher: 'Mr. Rahul Gupta', code: 'HIST101', classes: 5, students: 228, color: '#f59e0b' },
  { name: 'Computer Science', teacher: 'Mr. Ankit Sharma', code: 'CS101', classes: 4, students: 186, color: '#f43f5e' },
];

const PERIOD_TIMES = ['8:00', '9:00', '10:00', '11:00', '12:00', '1:00', '2:00'];

const SUBJECT_COLORS: Record<string, string> = {
  'Math': '#6366f1', 'Physics': '#8b5cf6', 'English': '#06b6d4',
  'Chemistry': '#10b981', 'PE': '#f59e0b', 'History': '#f43f5e', 'Computer': '#a78bfa'
};

function getPeriodColor(period: string) {
  const subject = Object.keys(SUBJECT_COLORS).find(s => period.startsWith(s));
  return subject ? SUBJECT_COLORS[subject] : '#94a3b8';
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState('timetable');
  const [selectedClass, setSelectedClass] = useState('Grade 10-A');

  const timetable = TIMETABLE['Grade 10-A'];

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Academics</h1>
          <p className="page-subtitle">Curriculum, timetable, and subject management</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Subject</button>
        </div>
      </div>

      <div className="grid-4 mb-5">
        {[
          { label: 'Subjects', value: '18', color: 'blue', icon: BookOpen },
          { label: 'Classes', value: '10', color: 'violet', icon: Calendar },
          { label: 'Periods/Day', value: '7', color: 'emerald', icon: Clock },
          { label: 'Study Halls', value: '24', color: 'amber', icon: BookOpen },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pill-tabs mb-5">
        {['timetable', 'subjects', 'exams'].map(t => (
          <button key={t} className={`pill-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'timetable' && (
        <>
          <div className="flex items-center gap-3 mb-5">
            <select className="form-select" style={{ width: 180 }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              {['Grade 8-A', 'Grade 8-B', 'Grade 9-A', 'Grade 9-B', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'].map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="card">
            <div style={{ overflowX: 'auto' }}>
              <table style={{ minWidth: 800 }}>
                <thead>
                  <tr>
                    <th style={{ width: 100 }}>Day</th>
                    {PERIOD_TIMES.map((t, i) => (
                      <th key={i} style={{ textAlign: 'center' }}>
                        <div>Period {i + 1}</div>
                        <div style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.68rem' }}>{t}</div>
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {timetable.map((row, ri) => (
                    <tr key={ri}>
                      <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{row.day}</td>
                      {row.periods.map((period, pi) => {
                        const color = getPeriodColor(period);
                        return (
                          <td key={pi} style={{ padding: '8px 6px' }}>
                            <div style={{
                              background: `${color}18`,
                              border: `1.5px solid ${color}40`,
                              borderRadius: 8,
                              padding: '6px 8px',
                              fontSize: '0.72rem',
                              fontWeight: 600,
                              color,
                              textAlign: 'center',
                              lineHeight: 1.4
                            }}>
                              {period.split(' (')[0]}
                              <div style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.65rem' }}>
                                {period.includes('(') ? period.split('(')[1]?.replace(')', '') : ''}
                              </div>
                            </div>
                          </td>
                        );
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {activeTab === 'subjects' && (
        <div className="grid-3">
          {SUBJECTS.map(sub => (
            <div key={sub.name} className="card card-body" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ height: 4, background: sub.color }} />
              <div style={{ padding: '20px' }}>
                <div className="flex items-center gap-3 mb-3">
                  <div style={{ width: 44, height: 44, borderRadius: 10, background: `${sub.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <BookOpen size={20} color={sub.color} />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)' }}>{sub.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{sub.code}</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 12 }}>
                  👨‍🏫 {sub.teacher}
                </div>
                <div className="grid-2" style={{ gap: 8 }}>
                  <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: sub.color }}>{sub.classes}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Classes</div>
                  </div>
                  <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '10px 12px', textAlign: 'center' }}>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: sub.color }}>{sub.students}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>Students</div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'exams' && (
        <div className="card">
          <div className="card-header"><span className="card-title">Upcoming Exams</span><button className="btn btn-primary btn-sm"><Plus size={15} /> Schedule Exam</button></div>
          <div className="table-container">
            <table>
              <thead>
                <tr><th>Exam Name</th><th>Subject</th><th>Class</th><th>Date</th><th>Duration</th><th>Status</th></tr>
              </thead>
              <tbody>
                {[
                  { name: 'Mid-term Math Test', subject: 'Mathematics', class: 'Grade 10-A', date: 'Apr 15, 2026', duration: '3 hours', status: 'Scheduled' },
                  { name: 'Physics Unit Test', subject: 'Physics', class: 'Grade 11-A', date: 'Apr 16, 2026', duration: '2 hours', status: 'Scheduled' },
                  { name: 'English Essay Test', subject: 'English', class: 'Grade 9-B', date: 'Apr 17, 2026', duration: '2 hours', status: 'Scheduled' },
                  { name: 'Chemistry Practical', subject: 'Chemistry', class: 'Grade 12-A', date: 'Apr 18, 2026', duration: '3 hours', status: 'Pending' },
                  { name: 'Board Prep: All Subjects', subject: 'Multiple', class: 'Grade 12', date: 'Apr 22, 2026', duration: '6 hours', status: 'Draft' },
                ].map(exam => (
                  <tr key={exam.name}>
                    <td style={{ fontWeight: 600 }}>{exam.name}</td>
                    <td><span className="badge badge-primary">{exam.subject}</span></td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{exam.class}</td>
                    <td style={{ fontSize: '0.875rem' }}>{exam.date}</td>
                    <td style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>{exam.duration}</td>
                    <td><span className={`badge ${exam.status === 'Scheduled' ? 'badge-success' : exam.status === 'Pending' ? 'badge-warning' : 'badge-neutral'}`}>{exam.status}</span></td>
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
