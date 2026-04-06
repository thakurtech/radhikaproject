'use client';

import { BarChart3, Download, Search, Filter } from 'lucide-react';

export default function ResultsPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Results & Grades</h1>
          <p className="page-subtitle">View and manage student academic performance</p>
        </div>
      </div>

      <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <BarChart3 size={30} color="var(--primary)" />
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No Results Published</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto' }}>
          Exam results and grade reports will appear here once they are published by administrators. This module supports automated grade calculation, GPA tracking, and report card generation.
        </div>
      </div>
    </>
  );
}
