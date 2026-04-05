'use client';

import { useState } from 'react';
import { BarChart3, Download, TrendingUp, Award, Sparkles, Filter } from 'lucide-react';
import {
  RadarChart, Radar, PolarGrid, PolarAngleAxis, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip
} from 'recharts';

const RESULTS = [
  { id: 1, name: 'Aayush Sharma', class: 'Grade 10-A', math: 96, physics: 92, chemistry: 89, english: 94, history: 91, total: 92.4, grade: 'A+', rank: 1, avatar: 'AS', color: '#6366f1' },
  { id: 2, name: 'Kavya Reddy', class: 'Grade 12-B', math: 88, physics: 95, chemistry: 96, english: 91, history: 88, total: 91.6, grade: 'A+', rank: 2, avatar: 'KR', color: '#8b5cf6' },
  { id: 3, name: 'Anjali Menon', class: 'Grade 8-B', math: 98, physics: 87, chemistry: 91, english: 98, history: 94, total: 93.6, grade: 'A+', rank: 3, avatar: 'AM', color: '#10b981' },
  { id: 4, name: 'Aryan Singh', class: 'Grade 11-A', math: 82, physics: 88, chemistry: 84, english: 91, history: 87, total: 86.4, grade: 'A', rank: 4, avatar: 'AS', color: '#06b6d4' },
  { id: 5, name: 'Simran Kaur', class: 'Grade 11-B', math: 84, physics: 86, chemistry: 88, english: 85, history: 90, total: 86.6, grade: 'A', rank: 5, avatar: 'SK', color: '#f59e0b' },
  { id: 6, name: 'Nisha Patel', class: 'Grade 10-B', math: 78, physics: 82, chemistry: 80, english: 88, history: 85, total: 82.6, grade: 'B+', rank: 6, avatar: 'NP', color: '#f43f5e' },
  { id: 7, name: 'Vikram Nair', class: 'Grade 12-A', math: 75, physics: 80, chemistry: 77, english: 82, history: 78, total: 78.4, grade: 'B', rank: 7, avatar: 'VN', color: '#6366f1' },
  { id: 8, name: 'Rohit Kumar', class: 'Grade 9-A', math: 65, physics: 70, chemistry: 68, english: 72, history: 69, total: 68.8, grade: 'C', rank: 8, avatar: 'RK', color: '#f59e0b' },
];

const subjectAvgs = [
  { subject: 'Math', avg: 83.3 },
  { subject: 'Physics', avg: 85.0 },
  { subject: 'Chemistry', avg: 84.1 },
  { subject: 'English', avg: 87.6 },
  { subject: 'History', avg: 85.3 },
];

const radarData = [
  { subject: 'Math', A: 94, overall: 80 },
  { subject: 'Physics', A: 92, overall: 82 },
  { subject: 'Chemistry', A: 89, overall: 81 },
  { subject: 'English', A: 94, overall: 85 },
  { subject: 'History', A: 91, overall: 83 },
];

const gradeColors: Record<string, string> = { 'A+': 'badge-success', 'A': 'badge-primary', 'B+': 'badge-info', 'B': 'badge-neutral', 'C': 'badge-warning' };

export default function ResultsPage() {
  const [selectedClass, setSelectedClass] = useState('all');
  const [selectedStudent, setSelectedStudent] = useState<typeof RESULTS[0] | null>(null);

  const filtered = selectedClass === 'all' ? RESULTS : RESULTS.filter(r => r.class === selectedClass);

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Results & Grades</h1>
          <p className="page-subtitle">Academic performance analytics and report cards</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export Report Cards</button>
          <button className="btn btn-primary btn-sm"><BarChart3 size={15} /> Generate Reports</button>
        </div>
      </div>

      {/* STATS */}
      <div className="grid-4 mb-5">
        {[
          { label: 'School Average', value: '82.3%', color: 'blue', icon: TrendingUp },
          { label: 'A+ Students', value: '18%', color: 'emerald', icon: Award },
          { label: 'Failing Students', value: '2.1%', color: 'rose', icon: BarChart3 },
          { label: 'Improvement', value: '+4.2%', color: 'violet', icon: Sparkles },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="grid-2 mb-6">
        {/* Subject Averages */}
        <div className="card">
          <div className="card-header"><span className="card-title">Subject-wise Averages</span></div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={subjectAvgs} barSize={28}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="subject" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} domain={[70, 100]} />
                <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Bar dataKey="avg" fill="var(--primary)" radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Radar - Top Student */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Top Performer vs School Avg</span>
            <span className="badge badge-success">Aayush Sharma</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <RadarChart data={radarData}>
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} />
                <Radar name="Top Student" dataKey="A" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} strokeWidth={2} />
                <Radar name="Average" dataKey="overall" stroke="var(--accent-emerald)" fill="var(--accent-emerald)" fillOpacity={0.15} strokeWidth={2} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* AI INSIGHT */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.2)',
        borderRadius: 'var(--radius-xl)',
        padding: '16px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24
      }}>
        <Sparkles size={20} color="var(--primary)" />
        <div>
          <div style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.9rem' }}>AI Performance Insight</div>
          <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginTop: 2 }}>
            English scores show highest improvement this semester (+8.2%). Math scores dipped 2.1% — consider additional remedial sessions for Grade 9.
            3 students predicted to achieve distinction if current trend continues.
          </div>
        </div>
        <button className="btn btn-primary btn-sm" style={{ whiteSpace: 'nowrap', flexShrink: 0 }}>View Details</button>
      </div>

      {/* RESULTS TABLE */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Student Results</span>
          <div className="flex items-center gap-3">
            <select className="form-select" style={{ width: 160, height: 34 }} value={selectedClass} onChange={e => setSelectedClass(e.target.value)}>
              <option value="all">All Classes</option>
              {['Grade 8-A', 'Grade 9-A', 'Grade 10-A', 'Grade 10-B', 'Grade 11-A', 'Grade 11-B', 'Grade 12-A', 'Grade 12-B'].map(c => <option key={c} value={c}>{c}</option>)}
            </select>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Rank</th>
                <th>Student</th>
                <th>Class</th>
                <th>Math</th>
                <th>Physics</th>
                <th>Chemistry</th>
                <th>English</th>
                <th>History</th>
                <th>Total %</th>
                <th>Grade</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(r => (
                <tr key={r.id} style={{ cursor: 'pointer' }} onClick={() => setSelectedStudent(r)}>
                  <td>
                    <div style={{
                      width: 28, height: 28, borderRadius: '50%',
                      background: r.rank <= 3 ? 'linear-gradient(135deg, var(--primary), var(--accent-violet))' : 'var(--bg-subtle)',
                      color: r.rank <= 3 ? 'white' : 'var(--text-muted)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontSize: '0.72rem', fontWeight: 800
                    }}>{r.rank}</div>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="avatar avatar-sm" style={{ background: r.color, width: 32, height: 32 }}>{r.avatar}</div>
                      <span style={{ fontWeight: 600, fontSize: '0.875rem' }}>{r.name}</span>
                    </div>
                  </td>
                  <td><span className="badge badge-neutral">{r.class}</span></td>
                  {[r.math, r.physics, r.chemistry, r.english, r.history].map((score, i) => (
                    <td key={i} style={{ fontWeight: 600, color: score >= 90 ? 'var(--success)' : score >= 75 ? 'var(--primary)' : score >= 60 ? 'var(--warning)' : 'var(--danger)' }}>
                      {score}
                    </td>
                  ))}
                  <td style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.9rem' }}>{r.total}%</td>
                  <td><span className={`badge ${gradeColors[r.grade] || 'badge-neutral'}`}>{r.grade}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
