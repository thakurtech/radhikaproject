'use client';

import { Bus, MapPin } from 'lucide-react';

export default function TransportPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Transport</h1>
          <p className="page-subtitle">Bus routes, fleet management, and student transport tracking</p>
        </div>
      </div>

      <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
        <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
          <Bus size={30} color="var(--primary)" />
        </div>
        <div style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-primary)', marginBottom: 8 }}>Transport Module</div>
        <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 450, margin: '0 auto' }}>
          Bus routes, fleet management, driver assignments, and student transport tracking will be managed here. Plan routes, assign vehicles, and monitor real-time locations.
        </div>
      </div>
    </>
  );
}
