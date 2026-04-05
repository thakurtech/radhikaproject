'use client';

import { useState } from 'react';
import {
  Search, Filter, Plus, Download, MoreVertical, GraduationCap,
  Phone, Mail, MapPin, TrendingUp, TrendingDown, Eye, Edit2, Trash2, ChevronLeft, ChevronRight
} from 'lucide-react';

const STUDENTS = [
  { id: 1, name: 'Aayush Sharma', roll: 'S2024001', class: 'Grade 10-A', age: 16, gender: 'Male', phone: '+91 98765 43210', email: 'aayush@student.edu', attendance: 94, gpa: 9.4, status: 'Active', city: 'Delhi', avatar: 'AS', color: '#6366f1' },
  { id: 2, name: 'Kavya Reddy', roll: 'S2024002', class: 'Grade 12-B', age: 18, gender: 'Female', phone: '+91 87654 32109', email: 'kavya@student.edu', attendance: 96, gpa: 9.3, status: 'Active', city: 'Hyderabad', avatar: 'KR', color: '#8b5cf6' },
  { id: 3, name: 'Aryan Singh', roll: 'S2024003', class: 'Grade 11-A', age: 17, gender: 'Male', phone: '+91 76543 21098', email: 'aryan@student.edu', attendance: 78, gpa: 8.9, status: 'Active', city: 'Chandigarh', avatar: 'AS', color: '#06b6d4' },
  { id: 4, name: 'Nisha Patel', roll: 'S2024004', class: 'Grade 10-B', age: 16, gender: 'Female', phone: '+91 65432 10987', email: 'nisha@student.edu', attendance: 91, gpa: 9.1, status: 'Active', city: 'Ahmedabad', avatar: 'NP', color: '#10b981' },
  { id: 5, name: 'Rohit Kumar', roll: 'S2024005', class: 'Grade 9-A', age: 15, gender: 'Male', phone: '+91 54321 09876', email: 'rohit@student.edu', attendance: 65, gpa: 7.2, status: 'At Risk', city: 'Lucknow', avatar: 'RK', color: '#f59e0b' },
  { id: 6, name: 'Priya Patel', roll: 'S2024006', class: 'Grade 9-B', age: 15, gender: 'Female', phone: '+91 43210 98765', email: 'priya@student.edu', attendance: 62, gpa: 7.0, status: 'At Risk', city: 'Surat', avatar: 'PP', color: '#f43f5e' },
  { id: 7, name: 'Vikram Nair', roll: 'S2024007', class: 'Grade 12-A', age: 18, gender: 'Male', phone: '+91 32109 87654', email: 'vikram@student.edu', attendance: 88, gpa: 8.5, status: 'Active', city: 'Kochi', avatar: 'VN', color: '#6366f1' },
  { id: 8, name: 'Simran Kaur', roll: 'S2024008', class: 'Grade 11-B', age: 17, gender: 'Female', phone: '+91 21098 76543', email: 'simran@student.edu', attendance: 93, gpa: 8.8, status: 'Active', city: 'Amritsar', avatar: 'SK', color: '#8b5cf6' },
  { id: 9, name: 'Deepak Verma', roll: 'S2024009', class: 'Grade 8-A', age: 14, gender: 'Male', phone: '+91 10987 65432', email: 'deepak@student.edu', attendance: 82, gpa: 8.1, status: 'Active', city: 'Jaipur', avatar: 'DV', color: '#06b6d4' },
  { id: 10, name: 'Anjali Menon', roll: 'S2024010', class: 'Grade 8-B', age: 14, gender: 'Female', phone: '+91 09876 54321', email: 'anjali@student.edu', attendance: 97, gpa: 9.6, status: 'Active', city: 'Bangalore', avatar: 'AM', color: '#10b981' },
];

export default function StudentsPage() {
  const [search, setSearch] = useState('');
  const [filterClass, setFilterClass] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selected, setSelected] = useState<number[]>([]);
  const [viewStudent, setViewStudent] = useState<typeof STUDENTS[0] | null>(null);

  const filtered = STUDENTS.filter(s => {
    const matchSearch = s.name.toLowerCase().includes(search.toLowerCase()) || s.roll.includes(search);
    const matchClass = filterClass === 'all' || s.class.includes(filterClass);
    const matchStatus = filterStatus === 'all' || s.status === filterStatus;
    return matchSearch && matchClass && matchStatus;
  });

  const toggleSelect = (id: number) => {
    setSelected(prev => prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Students</h1>
          <p className="page-subtitle">{STUDENTS.length} students enrolled · {STUDENTS.filter(s => s.status === 'Active').length} active</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export</button>
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Student</button>
        </div>
      </div>

      {/* QUICK STATS */}
      <div className="grid-4 mb-5">
        {[
          { label: 'Total Students', value: '2,847', icon: GraduationCap, color: 'blue' },
          { label: 'Avg. Attendance', value: '84.6%', icon: TrendingUp, color: 'emerald' },
          { label: 'At Risk', value: '47', icon: TrendingDown, color: 'rose' },
          { label: 'Avg. GPA', value: '8.4', icon: GraduationCap, color: 'violet' },
        ].map(stat => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
            <div className={`stat-icon ${stat.color}`}><stat.icon size={18} /></div>
            <div className="stat-value">{stat.value}</div>
            <div className="stat-label">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* FILTERS */}
      <div className="card mb-5">
        <div className="card-body" style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
          <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
            <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
            <input
              className="form-input"
              style={{ paddingLeft: 36 }}
              placeholder="Search students by name or roll number..."
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
          </div>
          <select className="form-select" style={{ width: 160 }} value={filterClass} onChange={e => setFilterClass(e.target.value)}>
            <option value="all">All Classes</option>
            <option value="Grade 8">Grade 8</option>
            <option value="Grade 9">Grade 9</option>
            <option value="Grade 10">Grade 10</option>
            <option value="Grade 11">Grade 11</option>
            <option value="Grade 12">Grade 12</option>
          </select>
          <select className="form-select" style={{ width: 140 }} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
            <option value="all">All Status</option>
            <option value="Active">Active</option>
            <option value="At Risk">At Risk</option>
          </select>
          <button className="btn btn-secondary btn-sm"><Filter size={15} /> More Filters</button>
        </div>
      </div>

      {/* TABLE */}
      <div className="card">
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" onChange={e => setSelected(e.target.checked ? filtered.map(s => s.id) : [])} />
                </th>
                <th>Student</th>
                <th>Roll No.</th>
                <th>Class</th>
                <th>Attendance</th>
                <th>GPA</th>
                <th>Status</th>
                <th>Contact</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((student) => (
                <tr key={student.id}>
                  <td><input type="checkbox" checked={selected.includes(student.id)} onChange={() => toggleSelect(student.id)} /></td>
                  <td>
                    <div className="flex items-center gap-3">
                      <div className="avatar avatar-sm" style={{ background: student.color, width: 34, height: 34 }}>
                        {student.avatar}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{student.name}</div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{student.city}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{student.roll}</td>
                  <td>
                    <span className="badge badge-primary">{student.class}</span>
                  </td>
                  <td>
                    <div className="flex items-center gap-2">
                      <div className="progress-bar" style={{ width: 60 }}>
                        <div className={`progress-fill ${student.attendance >= 85 ? 'success' : student.attendance >= 70 ? 'warning' : 'danger'}`}
                          style={{ width: `${student.attendance}%` }} />
                      </div>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{student.attendance}%</span>
                    </div>
                  </td>
                  <td>
                    <span style={{ fontWeight: 700, color: student.gpa >= 9 ? 'var(--success)' : student.gpa >= 8 ? 'var(--primary)' : 'var(--text-primary)' }}>
                      {student.gpa}
                    </span>
                  </td>
                  <td>
                    <span className={`badge ${student.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>
                      {student.status}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.775rem', color: 'var(--text-muted)' }}>{student.phone}</td>
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
        <div style={{ padding: '14px 20px', borderTop: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Showing {filtered.length} of {STUDENTS.length} students</span>
          <div className="flex items-center gap-2">
            <button className="btn btn-secondary btn-sm"><ChevronLeft size={14} /></button>
            <span className="badge badge-primary">Page 1 of 285</span>
            <button className="btn btn-secondary btn-sm"><ChevronRight size={14} /></button>
          </div>
        </div>
      </div>

      {/* STUDENT DETAIL MODAL */}
      {viewStudent && (
        <div className="modal-overlay" onClick={() => setViewStudent(null)}>
          <div className="modal" style={{ maxWidth: 520 }} onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div className="flex items-center gap-3">
                <div className="avatar" style={{ background: viewStudent.color, width: 48, height: 48, fontSize: '1.1rem' }}>
                  {viewStudent.avatar}
                </div>
                <div>
                  <div className="modal-title">{viewStudent.name}</div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{viewStudent.roll} · {viewStudent.class}</div>
                </div>
              </div>
              <button className="btn btn-ghost btn-sm" onClick={() => setViewStudent(null)}>✕</button>
            </div>
            <div className="grid-2" style={{ marginBottom: 16 }}>
              {[
                { label: 'Attendance', value: `${viewStudent.attendance}%`, badge: viewStudent.attendance >= 85 ? 'badge-success' : 'badge-warning' },
                { label: 'GPA', value: viewStudent.gpa, badge: 'badge-primary' },
                { label: 'Status', value: viewStudent.status, badge: viewStudent.status === 'Active' ? 'badge-success' : 'badge-danger' },
                { label: 'Age', value: `${viewStudent.age} years`, badge: 'badge-neutral' },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '14px 16px' }}>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 600 }}>{item.label}</div>
                  <span className={`badge ${item.badge}`} style={{ fontSize: '0.85rem' }}>{item.value}</span>
                </div>
              ))}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 20 }}>
              {[
                { icon: Phone, label: viewStudent.phone },
                { icon: Mail, label: viewStudent.email },
                { icon: MapPin, label: viewStudent.city },
              ].map(({ icon: Icon, label }) => (
                <div key={label} className="flex items-center gap-3" style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                  <Icon size={15} color="var(--text-muted)" />
                  {label}
                </div>
              ))}
            </div>
            <div className="flex gap-2">
              <button className="btn btn-primary" style={{ flex: 1 }}><Edit2 size={15} /> Edit Profile</button>
              <button className="btn btn-secondary"><Mail size={15} /></button>
              <button className="btn btn-secondary"><Phone size={15} /></button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
