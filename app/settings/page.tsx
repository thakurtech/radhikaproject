'use client';

import { useState, useEffect } from 'react';
import {
  Settings, School, User, Bell, Shield, CreditCard,
  Globe, Moon, Palette, Save, ChevronRight, Check, LogOut
} from 'lucide-react';
import { useUser } from '../components/UserProvider';
import { useRouter } from 'next/navigation';

const TABS = [
  { id: 'account', label: 'Account', icon: User },
  { id: 'notifications', label: 'Notifications', icon: Bell },
  { id: 'security', label: 'Security', icon: Shield },
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
  const { user, loading } = useUser();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('account');
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch (e) {
      console.error('Logout failed:', e);
    }
  };

  if (loading) {
    return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>Loading settings...</div>;
  }

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Settings</h1>
          <p className="page-subtitle">Manage your account and system preferences</p>
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
            <div style={{ borderTop: '1px solid var(--border-subtle)', margin: '8px 0' }} />
            <button
              className="nav-item"
              onClick={handleLogout}
              style={{ width: '100%', justifyContent: 'flex-start', border: 'none', background: 'transparent', color: 'var(--danger)' }}
            >
              <LogOut size={16} />
              Sign Out
            </button>
          </div>
        </div>

        {/* Content */}
        <div>
          {activeTab === 'account' && (
            <div className="card card-body">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Account Information</h3>
              <div style={{ display: 'flex', gap: 20, marginBottom: 24, alignItems: 'center' }}>
                <div style={{
                  width: 80, height: 80, borderRadius: 'var(--radius-lg)',
                  background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
                  fontSize: '1.5rem', fontWeight: 800, color: 'white'
                }}>
                  {user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || '??'}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-primary)' }}>{user?.name || 'Unknown'}</div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)' }}>
                    {user?.email} · <span style={{ textTransform: 'capitalize' }}>{user?.role?.replace('_', ' ')}</span>
                  </div>
                </div>
              </div>
              <div className="grid-2" style={{ gap: 16 }}>
                {[
                  { label: 'Full Name', value: user?.name || '', type: 'text' },
                  { label: 'Email', value: user?.email || '', type: 'email' },
                  { label: 'Role', value: user?.role?.replace('_', ' ') || '', type: 'text', disabled: true },
                  { label: 'School ID', value: user?.schoolId || 'Platform Admin', type: 'text', disabled: true },
                ].map(field => (
                  <div key={field.label} className="form-group">
                    <label className="form-label">{field.label}</label>
                    <input
                      className="form-input"
                      type={field.type}
                      defaultValue={field.value}
                      disabled={field.disabled}
                      style={field.disabled ? { opacity: 0.6 } : {}}
                    />
                  </div>
                ))}
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

          {activeTab === 'appearance' && (
            <div className="card card-body">
              <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: 20 }}>Appearance Settings</h3>
              <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', marginBottom: 20 }}>
                Customize how EduVerse looks on your device.
              </div>
              <div className="flex items-center justify-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Dark Mode</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Use dark theme across the application</div>
                </div>
                <Toggle on={true} />
              </div>
              <div className="flex items-center justify-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Compact Mode</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Reduce spacing for more content on screen</div>
                </div>
                <Toggle on={false} />
              </div>
              <div className="flex items-center justify-between" style={{ padding: '14px 0', borderBottom: '1px solid var(--border-subtle)' }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)' }}>Animations</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Enable smooth transitions and hover effects</div>
                </div>
                <Toggle on={true} />
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
