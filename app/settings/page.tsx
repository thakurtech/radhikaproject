'use client';

import { useState } from 'react';
import {
  Settings, School, User, Bell, Shield, CreditCard,
  Globe, Moon, Palette, Save, ChevronRight, Check
} from 'lucide-react';

const TABS = [
  { id: 'school', label: 'School Profile', icon: School },
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
  { id: 'billing', label: 'Billing', icon: CreditCard },
  { id: 'appearance', label: 'Appearance', icon: Palette },
];

function Toggle({ on }: { on?: boolean }) {
  const [state, setState] = useState(on || false);
  return (
    <div onClick={() => setState(!state)} style={{
      width: 44, height: 24, borderRadius: 12,
      background: state ? 'var(--primary)' : 'var(--border-strong)',
      position: 'relative', cursor: 'pointer',
      transition: 'background 0.2s ease', flexShrink: 0
    }}>
      <div style={{
        width: 18, height: 18, borderRadius: '50%', background: 'white',
        position: 'absolute', top: 3, left: state ? 23 : 3,
        transition: 'left 0.2s ease',
        boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
      }} />
    </div>
  );
}

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState('school');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your school profile, account, and system preferences</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary" onClick={handleSave}>
            {saved ? <><Check size={15} /> Saved!</> : <><Save size={15} /> Save Changes</>}
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '220px 1fr', gap: 24 }}>
        {/* Sidebar */}
        <div className="card" style={{ height: 'fit-content' }}>
          <div className="card-body" style={{ padding: '8px' }}>
            {TABS.map(tab => (
              <button key={tab.id} onClick={() => setActiveTab(tab.id)}
                className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
                style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: activeTab === tab.id ? 'var(--primary-subtle)' : 'transparent' }}
              >
                <tab.icon size={16} />
                {tab.label}
                <ChevronRight size={14} style={{ marginLeft: 'auto', opacity: 0.4 }} />
              </button>
            ))}
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'school' && (
            <div className="card card-body">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>School Profile</h3>
              <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <School size={36} color="white" />
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>Springfield High School</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>Est. 1985 · CBSE Affiliated · School Code: SPR2024</div>
                  <button className="btn btn-secondary btn-sm mt-2">Change Logo</button>
                </div>
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                {[
                  { label: 'School Name', value: 'Springfield High School', type: 'text' },
                  { label: 'Principal Name', value: 'Dr. Priya Sharma', type: 'text' },
                  { label: 'Email', value: 'admin@springfield.edu', type: 'email' },
                  { label: 'Phone', value: '+91 11 2345 6789', type: 'tel' },
                  { label: 'Board Affiliation', value: 'CBSE', type: 'text' },
                  { label: 'School Code', value: 'SPR2024', type: 'text' },
                ].map(field => (
                  <div key={field.label} className="form-group">
                    <label className="form-label">{field.label}</label>
                    <input className="form-input" type={field.type} defaultValue={field.value} />
                  </div>
                ))}
              </div>
              <div className="form-group mt-3">
                <label className="form-label">Address</label>
                <textarea className="form-input" defaultValue="123 Education Lane, New Delhi, India — 110001" style={{ height: 'auto', padding: '12px 14px' }} rows={2} />
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="card card-body">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Notification Preferences</h3>
              {[
                { label: 'Attendance Alerts', desc: 'Get notified when a student\'s attendance drops below threshold', on: true },
                { label: 'Fee Reminders', desc: 'Automated reminders for pending fee payments', on: true },
                { label: 'Exam Notifications', desc: 'Alerts for upcoming exams and result publications', on: false },
                { label: 'New Enrollment', desc: 'Notify when a new student is enrolled', on: true },
                { label: 'Parent Messages', desc: 'Real-time notifications for parent messages', on: true },
                { label: 'AI Insights', desc: 'Weekly AI-generated performance summaries', on: false },
                { label: 'System Updates', desc: 'Get notified about EduVerse platform updates', on: true },
              ].map(item => (
                <div key={item.label} className="flex items-center justify-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{item.label}</div>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                  </div>
                  <Toggle on={item.on} />
                </div>
              ))}
            </div>
          )}

          {activeTab === 'billing' && (
            <div className="card card-body">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Billing & Subscription</h3>
              <div style={{
                background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
                borderRadius: 'var(--radius-xl)',
                padding: '24px',
                marginBottom: 24,
                color: 'white'
              }}>
                <div style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: 8 }}>Current Plan</div>
                <div style={{ fontSize: '1.75rem', fontWeight: 900, marginBottom: 4 }}>Professional</div>
                <div style={{ fontSize: '0.875rem', opacity: 0.8 }}>₹12,999/month · Up to 2,500 students · All AI features</div>
                <div style={{ marginTop: 16, padding: '8px 16px', background: 'rgba(255,255,255,0.15)', borderRadius: 'var(--radius-sm)', display: 'inline-block', fontSize: '0.8rem' }}>
                  ✓ Renews Jun 15, 2026
                </div>
              </div>
              <div className="grid-3" style={{ gap: 12, marginBottom: 24 }}>
                {[
                  { label: 'Students Used', value: '2,847', max: '2,500', pct: 113 },
                  { label: 'Storage Used', value: '142 GB', max: '500 GB', pct: 28 },
                  { label: 'AI Queries', value: '48/day', max: '100/day', pct: 48 },
                ].map(u => (
                  <div key={u.label} style={{ background: 'var(--bg-subtle)', borderRadius: 10, padding: '14px' }}>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 600, textTransform: 'uppercase' }}>{u.label}</div>
                    <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>{u.value} <span style={{ fontWeight: 400, color: 'var(--text-muted)', fontSize: '0.75rem' }}>/ {u.max}</span></div>
                    <div className="progress-bar"><div className={`progress-fill ${u.pct > 100 ? 'danger' : 'primary'}`} style={{ width: `${Math.min(u.pct, 100)}%` }} /></div>
                  </div>
                ))}
              </div>
              {[
                { date: 'Jan 15, 2026', desc: 'Professional Plan', amount: '₹12,999', status: 'Paid' },
                { date: 'Dec 15, 2025', desc: 'Professional Plan', amount: '₹12,999', status: 'Paid' },
                { date: 'Nov 15, 2025', desc: 'Professional Plan', amount: '₹12,999', status: 'Paid' },
              ].map(inv => (
                <div key={inv.date} className="flex items-center gap-4" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 600, fontSize: '0.85rem' }}>{inv.desc}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{inv.date}</div>
                  </div>
                  <span className="badge badge-success">{inv.status}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{inv.amount}</span>
                </div>
              ))}
            </div>
          )}

          {activeTab === 'security' && (
            <div className="card card-body">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Security & Privacy</h3>
              <div className="form-group mb-4">
                <label className="form-label">Current Password</label>
                <input className="form-input" type="password" placeholder="Enter current password" />
              </div>
              <div className="form-group mb-4">
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Enter new password" />
              </div>
              <div className="form-group mb-5">
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Confirm new password" />
              </div>
              <div className="divider" />
              <div style={{ marginTop: 20 }}>
                <div style={{ fontWeight: 700, marginBottom: 16, fontSize: '0.9rem' }}>Two-Factor Authentication</div>
                {[
                  { label: '2FA Authentication', desc: 'Require a code in addition to password', on: false },
                  { label: 'Login Notifications', desc: 'Email alerts for new login attempts', on: true },
                  { label: 'Session Timeout', desc: 'Auto-logout after 30 minutes of inactivity', on: true },
                ].map(item => (
                  <div key={item.label} className="flex items-center justify-between" style={{ padding: '12px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                    <div>
                      <div style={{ fontWeight: 600, fontSize: '0.875rem' }}>{item.label}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>{item.desc}</div>
                    </div>
                    <Toggle on={item.on} />
                  </div>
                ))}
              </div>
            </div>
          )}

          {(activeTab === 'account' || activeTab === 'appearance') && (
            <div className="card card-body" style={{ textAlign: 'center', padding: 60 }}>
              <Settings size={48} style={{ margin: '0 auto 16px', color: 'var(--text-muted)', opacity: 0.4 }} />
              <div style={{ fontWeight: 700, color: 'var(--text-primary)', marginBottom: 8 }}>
                {activeTab === 'account' ? 'Account Settings' : 'Appearance Settings'}
              </div>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>
                This section is being configured. More options coming soon.
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
