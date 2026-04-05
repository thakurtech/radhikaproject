'use client';

import { Bus, MapPin, Users, Route, Plus, Navigation } from 'lucide-react';

const ROUTES = [
  { id: 1, name: 'Route 1 – North', driver: 'Ramesh Kumar', bus: 'DL 01 CA 1234', capacity: 45, enrolled: 38, stops: ['City Center', 'Park Street', 'Model Town', 'School'], time: '7:30 AM', status: 'Active' },
  { id: 2, name: 'Route 2 – South', driver: 'Suresh Patel', bus: 'DL 02 CB 5678', capacity: 40, enrolled: 35, stops: ['Gandhi Nagar', 'Lajpat Nagar', 'Green Park', 'School'], time: '7:45 AM', status: 'Active' },
  { id: 3, name: 'Route 3 – East', driver: 'Mohan Singh', bus: 'DL 03 CC 9012', capacity: 50, enrolled: 42, stops: ['Shahdara', 'Preet Vihar', 'Laxmi Nagar', 'School'], time: '7:20 AM', status: 'Active' },
  { id: 4, name: 'Route 4 – West', driver: 'Vijay Sharma', bus: 'DL 04 CD 3456', capacity: 45, enrolled: 28, stops: ['Janakpuri', 'Vikaspuri', 'Tilak Nagar', 'School'], time: '7:50 AM', status: 'Delayed' },
];

export default function TransportPage() {
  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Transport</h1>
          <p className="page-subtitle">Route management, bus tracking, and student assignments</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Add Route</button>
        </div>
      </div>

      <div className="grid-4 mb-5">
        {[
          { label: 'Total Buses', value: '8', color: 'blue', icon: Bus },
          { label: 'Routes', value: '8', color: 'violet', icon: Route },
          { label: 'Students using Bus', value: '824', color: 'emerald', icon: Users },
          { label: 'On Route Now', value: '6', color: 'amber', icon: Navigation },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Map placeholder */}
      <div style={{
        height: 240,
        background: 'linear-gradient(135deg, #1e293b, #0f172a)',
        borderRadius: 'var(--radius-xl)',
        marginBottom: 24,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid var(--border)'
      }}>
        <div style={{ position: 'absolute', inset: 0, opacity: 0.3, background: 'url("data:image/svg+xml,%3Csvg width=\'40\' height=\'40\' viewBox=\'0 0 40 40\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'%236366f1\' fill-opacity=\'0.2\'%3E%3Cpath d=\'M0 0h40v40H0z\'/%3E%3C/g%3E%3C/svg%3E")' }} />
        {[
          { x: 25, y: 40, color: '#6366f1' },
          { x: 55, y: 60, color: '#8b5cf6' },
          { x: 70, y: 35, color: '#10b981' },
          { x: 40, y: 70, color: '#f59e0b' },
        ].map((pin, i) => (
          <div key={i} style={{
            position: 'absolute', left: `${pin.x}%`, top: `${pin.y}%`,
            width: 12, height: 12, borderRadius: '50%',
            background: pin.color, boxShadow: `0 0 0 4px ${pin.color}40`,
            animation: 'fab-pulse 2s ease infinite'
          }} />
        ))}
        <div style={{ position: 'relative', zIndex: 1, textAlign: 'center', color: 'white' }}>
          <Navigation size={32} style={{ margin: '0 auto 8px', opacity: 0.6 }} />
          <div style={{ fontWeight: 600, opacity: 0.8 }}>Live GPS Tracking</div>
          <div style={{ fontSize: '0.8rem', opacity: 0.5 }}>Integrate with GPS provider to show real-time bus locations</div>
        </div>
      </div>

      <div className="grid-2">
        {ROUTES.map(route => (
          <div key={route.id} className="card card-body">
            <div className="flex items-start gap-4 mb-4">
              <div style={{ width: 44, height: 44, borderRadius: 10, background: route.status === 'Active' ? 'rgba(16,185,129,0.1)' : 'rgba(245,158,11,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <Bus size={20} color={route.status === 'Active' ? 'var(--accent-emerald)' : 'var(--accent-amber)'} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 2 }}>{route.name}</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Driver: {route.driver} · {route.bus}</div>
              </div>
              <span className={`badge ${route.status === 'Active' ? 'badge-success' : 'badge-warning'}`}>{route.status}</span>
            </div>

            <div className="grid-3" style={{ gap: 8, marginBottom: 14 }}>
              {[
                { label: 'Capacity', value: route.capacity },
                { label: 'Enrolled', value: route.enrolled },
                { label: 'Departure', value: route.time },
              ].map(item => (
                <div key={item.label} style={{ background: 'var(--bg-subtle)', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                  <div style={{ fontWeight: 800, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{item.value}</div>
                  <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, letterSpacing: '0.04em' }}>{item.label}</div>
                </div>
              ))}
            </div>

            <div style={{ marginBottom: 14 }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 6, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.04em' }}>Route Stops</div>
              <div className="flex items-center gap-2" style={{ flexWrap: 'wrap' }}>
                {route.stops.map((stop, i) => (
                  <div key={stop} className="flex items-center gap-1">
                    <span style={{ fontSize: '0.75rem', color: i === route.stops.length - 1 ? 'var(--primary)' : 'var(--text-secondary)', fontWeight: i === route.stops.length - 1 ? 700 : 400 }}>{stop}</span>
                    {i < route.stops.length - 1 && <span style={{ color: 'var(--text-muted)', fontSize: '0.8rem' }}>→</span>}
                  </div>
                ))}
              </div>
            </div>

            <div className="progress-bar mb-1">
              <div className="progress-fill success" style={{ width: `${(route.enrolled / route.capacity) * 100}%` }} />
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{route.enrolled}/{route.capacity} seats filled</div>
          </div>
        ))}
      </div>
    </>
  );
}
