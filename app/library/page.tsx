'use client';

import { BookOpen, Search } from 'lucide-react';

export default function LibraryPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Library</h1>
          <p className="page-subtitle">Book catalog, borrowing records, and inventory management</p>
        </div>
      </div>

      <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <BookOpen size={30} color="var(--primary)" />
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>Library Module</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto' }}>
          The digital library catalog, book borrowing system, and inventory tracking will be available here. Add books, manage check-outs, and track overdue returns.
        </div>
      </div>
    </>
  );
}
