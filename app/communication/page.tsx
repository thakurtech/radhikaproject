'use client';

import { MessageSquare, Send, Bell, Plus } from 'lucide-react';

export default function CommunicationPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Communication</h1>
          <p className="page-subtitle">Announcements, messages, and notifications hub</p>
        </div>
      </div>

      <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <MessageSquare size={30} color="var(--primary)" />
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>No Messages Yet</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto' }}>
          School announcements, parent notifications, and internal messaging will appear here. This hub centralizes all communication between administrators, teachers, students, and parents.
        </div>
      </div>
    </>
  );
}
