'use client';

import { useState } from 'react';
import { Library, Search, Plus, Book, Clock, User, ArrowUpDown, BookOpen } from 'lucide-react';

const BOOKS = [
  { id: 1, title: 'Mathematics for Grade 10', author: 'Dr. R.D. Sharma', category: 'Textbook', copies: 5, available: 3, isbn: '978-81-219-0521-8' },
  { id: 2, title: 'Physics Concepts', author: 'H.C. Verma', category: 'Textbook', copies: 8, available: 5, isbn: '978-81-219-0052-7' },
  { id: 3, title: 'The Alchemist', author: 'Paulo Coelho', category: 'Fiction', copies: 3, available: 2, isbn: '978-0-06-112008-4' },
  { id: 4, title: 'Wings of Fire', author: 'A.P.J. Abdul Kalam', category: 'Biography', copies: 4, available: 4, isbn: '978-81-7371-146-3' },
  { id: 5, title: 'Organic Chemistry', author: 'O.P. Tandon', category: 'Reference', copies: 6, available: 1, isbn: '978-81-8055-716-4' },
  { id: 6, title: 'English Grammar', author: 'Wren & Martin', category: 'Textbook', copies: 10, available: 7, isbn: '978-81-219-0521-9' },
];

const BORROWINGS = [
  { id: 1, student: 'Aayush Sharma', class: 'Grade 10-A', book: 'Physics Concepts', borrowed: 'Apr 1', due: 'Apr 15', status: 'On Time' },
  { id: 2, student: 'Kavya Reddy', class: 'Grade 12-B', book: 'Organic Chemistry', borrowed: 'Mar 20', due: 'Apr 3', status: 'Overdue' },
  { id: 3, student: 'Aryan Singh', class: 'Grade 11-A', book: 'The Alchemist', borrowed: 'Apr 2', due: 'Apr 16', status: 'On Time' },
  { id: 4, student: 'Nisha Patel', class: 'Grade 10-B', book: 'English Grammar', borrowed: 'Mar 28', due: 'Apr 11', status: 'On Time' },
];

export default function LibraryPage() {
  const [search, setSearch] = useState('');
  const [activeTab, setActiveTab] = useState('catalog');

  const filtered = BOOKS.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) || b.author.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Library</h1>
          <p className="page-subtitle">Book catalog, borrowings, and digital resources</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Book</button>
        </div>
      </div>

      <div className="grid-4 mb-5">
        {[
          { label: 'Total Books', value: '3,240', color: 'blue', icon: Book },
          { label: 'Books Issued', value: '284', color: 'violet', icon: BookOpen },
          { label: 'Available', value: '2,956', color: 'emerald', icon: Library },
          { label: 'Overdue', value: '12', color: 'rose', icon: Clock },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pill-tabs mb-5">
        {['catalog', 'borrowings', 'members'].map(t => (
          <button key={t} className={`pill-tab ${activeTab === t ? 'active' : ''}`} onClick={() => setActiveTab(t)}>
            {t.charAt(0).toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'catalog' && (
        <>
          <div className="card mb-5">
            <div className="card-body" style={{ display: 'flex', gap: 12 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={15} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input className="form-input" style={{ paddingLeft: 36 }} placeholder="Search by title or author..." value={search} onChange={e => setSearch(e.target.value)} />
              </div>
              <select className="form-select" style={{ width: 160 }}>
                <option>All Categories</option>
                <option>Textbook</option>
                <option>Fiction</option>
                <option>Biography</option>
                <option>Reference</option>
              </select>
            </div>
          </div>
          <div className="grid-3">
            {filtered.map(book => (
              <div key={book.id} className="card card-body">
                <div style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
                  <div style={{ width: 52, height: 68, borderRadius: 8, background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Book size={22} color="white" />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)', marginBottom: 2, lineHeight: 1.3 }}>{book.title}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 6 }}>{book.author}</div>
                    <span className="badge badge-primary">{book.category}</span>
                  </div>
                </div>
                <div className="grid-2" style={{ gap: 8, marginBottom: 12 }}>
                  <div style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>{book.copies}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Total</div>
                  </div>
                  <div style={{ background: book.available > 0 ? 'var(--success-light)' : 'var(--danger-light)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontWeight: 800, color: book.available > 0 ? 'var(--success)' : 'var(--danger)', fontSize: '1.1rem' }}>{book.available}</div>
                    <div style={{ fontSize: '0.65rem', color: book.available > 0 ? '#065f46' : '#991b1b', textTransform: 'uppercase', fontWeight: 600 }}>Available</div>
                  </div>
                </div>
                <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 12 }}>ISBN: {book.isbn}</div>
                <button className="btn btn-primary btn-sm w-full" style={{ justifyContent: 'center' }} disabled={book.available === 0}>
                  {book.available > 0 ? 'Issue Book' : 'All Issued'}
                </button>
              </div>
            ))}
          </div>
        </>
      )}

      {activeTab === 'borrowings' && (
        <div className="card">
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Student</th><th>Class</th><th>Book</th><th>Borrowed</th><th>Due Date</th><th>Status</th><th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {BORROWINGS.map(b => (
                  <tr key={b.id}>
                    <td style={{ fontWeight: 600 }}>{b.student}</td>
                    <td><span className="badge badge-primary">{b.class}</span></td>
                    <td style={{ fontSize: '0.875rem' }}>{b.book}</td>
                    <td style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>{b.borrowed}</td>
                    <td style={{ fontSize: '0.825rem', fontWeight: 600 }}>{b.due}</td>
                    <td><span className={`badge ${b.status === 'On Time' ? 'badge-success' : 'badge-danger'}`}>{b.status}</span></td>
                    <td>
                      <button className="btn btn-secondary btn-sm">Return</button>
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
