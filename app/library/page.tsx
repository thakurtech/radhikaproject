'use client';

import { useState, useEffect } from 'react';
import { BookOpen, Plus, Search, Trash2, BookMarked } from 'lucide-react';
import { useUser } from '../components/UserProvider';

export default function LibraryPage() {
  const { user } = useUser();
  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';

  const [books, setBooks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', author: '', isbn: '', category: 'General', totalCopies: '1' });

  useEffect(() => { fetchBooks(); }, []);

  const fetchBooks = async () => {
    try {
      const res = await fetch('/api/library');
      const data = await res.json();
      setBooks(Array.isArray(data) ? data : []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  const handleAdd = async () => {
    if (!form.title || !form.author) return;
    setCreating(true);
    try {
      const res = await fetch('/api/library', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, totalCopies: Number(form.totalCopies) })
      });
      if (res.ok) { setShowModal(false); setForm({ title: '', author: '', isbn: '', category: 'General', totalCopies: '1' }); fetchBooks(); }
      else { const d = await res.json(); alert(d.error); }
    } catch (e) { alert('Network error'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this book?')) return;
    await fetch(`/api/library/${id}`, { method: 'DELETE' });
    setBooks(books.filter(b => b._id !== id));
  };

  const filtered = books.filter(b =>
    b.title.toLowerCase().includes(search.toLowerCase()) ||
    b.author.toLowerCase().includes(search.toLowerCase()) ||
    b.category?.toLowerCase().includes(search.toLowerCase())
  );

  const categories = [...new Set(books.map(b => b.category || 'General'))];

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Library</h1>
          <p className="page-subtitle">Book catalog and inventory — {books.length} books</p>
        </div>
        {isAdmin && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Add Book</button>
          </div>
        )}
      </div>

      {/* Search */}
      <div className="card mb-6" style={{ padding: '12px 20px' }}>
        <div className="flex items-center gap-2">
          <Search size={16} color="var(--text-muted)" />
          <input className="form-input" placeholder="Search by title, author, or category..." value={search} onChange={e => setSearch(e.target.value)} style={{ border: 'none', padding: '4px 0', background: 'transparent' }} />
        </div>
      </div>

      {loading ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : books.length === 0 ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <BookOpen size={30} color="var(--primary)" />
          </div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>Library is Empty</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>Start building your catalog by adding books.</div>
        </div>
      ) : (
        <>
          {/* Category tags */}
          <div className="flex gap-2 mb-4" style={{ flexWrap: 'wrap' }}>
            {categories.map(cat => (
              <button key={cat} className="badge badge-primary" style={{ cursor: 'pointer', padding: '4px 12px' }} onClick={() => setSearch(cat)}>
                {cat} ({books.filter(b => (b.category || 'General') === cat).length})
              </button>
            ))}
          </div>

          <div className="card">
            <div className="table-container">
              <table>
                <thead><tr><th>Title</th><th>Author</th><th>Category</th><th>ISBN</th><th>Copies</th><th>Available</th>{isAdmin && <th>Actions</th>}</tr></thead>
                <tbody>
                  {filtered.map(b => (
                    <tr key={b._id}>
                      <td>
                        <div className="flex items-center gap-3">
                          <div style={{ width: 36, height: 36, borderRadius: 10, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                            <BookMarked size={16} color="var(--primary)" />
                          </div>
                          <span style={{ fontWeight: 600 }}>{b.title}</span>
                        </div>
                      </td>
                      <td>{b.author}</td>
                      <td><span className="badge badge-neutral">{b.category || 'General'}</span></td>
                      <td style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>{b.isbn || '—'}</td>
                      <td style={{ fontWeight: 600 }}>{b.totalCopies}</td>
                      <td>
                        <span className={`badge ${b.availableCopies > 0 ? 'badge-success' : 'badge-danger'}`}>
                          {b.availableCopies > 0 ? `${b.availableCopies} Available` : 'All Borrowed'}
                        </span>
                      </td>
                      {isAdmin && <td><button className="btn btn-ghost btn-sm" style={{ color: '#f43f5e' }} onClick={() => handleDelete(b._id)}><Trash2 size={14} /></button></td>}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Add Book</span><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group mb-4"><label className="form-label">Title *</label><input className="form-input" placeholder="e.g. Introduction to Algorithms" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group mb-4"><label className="form-label">Author *</label><input className="form-input" placeholder="e.g. Thomas H. Cormen" value={form.author} onChange={e => setForm({ ...form, author: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4"><label className="form-label">ISBN</label><input className="form-input" placeholder="e.g. 978-0262033848" value={form.isbn} onChange={e => setForm({ ...form, isbn: e.target.value })} /></div>
                <div className="form-group mb-4"><label className="form-label">Category</label><input className="form-input" placeholder="e.g. Computer Science" value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} /></div>
              </div>
              <div className="form-group mb-4"><label className="form-label">Total Copies</label><input className="form-input" type="number" min={1} value={form.totalCopies} onChange={e => setForm({ ...form, totalCopies: e.target.value })} /></div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={creating || !form.title || !form.author}>{creating ? 'Adding...' : 'Add Book'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
