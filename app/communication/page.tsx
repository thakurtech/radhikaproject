'use client';

import { useState, useEffect } from 'react';
import { MessageSquare, Plus, Bell, AlertCircle, Clock, Send, Users, Trash2 } from 'lucide-react';
import { useUser } from '../components/UserProvider';

export default function CommunicationPage() {
  const { user } = useUser();
  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';
  const isTeacher = user?.role === 'teacher';
  const canPost = isAdmin || isTeacher;

  const [notifications, setNotifications] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ title: '', message: '', type: 'announcement', targetRole: 'all' });

  useEffect(() => {
    fetch('/api/notifications').then(r => r.json()).then(d => setNotifications(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handlePost = async () => {
    if (!form.title || !form.message) return;
    setCreating(true);
    try {
      const res = await fetch('/api/notifications', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      if (res.ok) { setShowModal(false); setForm({ title: '', message: '', type: 'announcement', targetRole: 'all' });
        const d = await fetch('/api/notifications').then(r => r.json()); setNotifications(d);
      } else { const d = await res.json(); alert(d.error); }
    } catch (e) { alert('Network error'); }
    finally { setCreating(false); }
  };

  const typeIcon = (t: string) => {
    switch(t) {
      case 'alert': return { icon: AlertCircle, color: '#f43f5e', bg: 'rgba(244,63,94,0.1)' };
      case 'reminder': return { icon: Clock, color: '#f59e0b', bg: 'rgba(245,158,11,0.1)' };
      case 'message': return { icon: Send, color: '#06b6d4', bg: 'rgba(6,182,212,0.1)' };
      default: return { icon: Bell, color: '#6366f1', bg: 'rgba(99,102,241,0.1)' };
    }
  };

  const fmtDate = (d: string) => {
    const diff = (Date.now() - new Date(d).getTime()) / 1000;
    if (diff < 60) return 'Just now';
    if (diff < 3600) return `${Math.floor(diff/60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff/3600)}h ago`;
    return new Date(d).toLocaleDateString(undefined, { month: 'short', day: 'numeric' });
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Communication</h1>
          <p className="page-subtitle">Announcements, alerts, and school-wide notifications</p>
        </div>
        {canPost && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Post Announcement</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : notifications.length === 0 ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><MessageSquare size={30} color="var(--primary)" /></div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>No Announcements</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>
            {canPost ? 'Post your first announcement to notify students and teachers.' : 'No announcements have been posted yet.'}
          </div>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {notifications.map(n => {
            const ti = typeIcon(n.type);
            const Icon = ti.icon;
            return (
              <div key={n._id} className="card card-body" style={{ padding: '18px 24px' }}>
                <div style={{ display: 'flex', gap: 16, alignItems: 'flex-start' }}>
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: ti.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Icon size={20} color={ti.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div className="flex items-center gap-2" style={{ marginBottom: 4, flexWrap: 'wrap' }}>
                      <span style={{ fontWeight: 700, fontSize: '0.95rem', color: 'var(--text-primary)' }}>{n.title}</span>
                      <span className="badge badge-neutral" style={{ fontSize: '0.7rem', textTransform: 'capitalize' }}>{n.type}</span>
                      {n.targetRole !== 'all' && <span className="badge badge-primary" style={{ fontSize: '0.7rem' }}>For: {n.targetRole}s</span>}
                    </div>
                    <div style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.6 }}>{n.message}</div>
                    <div style={{ marginTop: 8, fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                      {n.createdBy?.name || 'Admin'} • {fmtDate(n.createdAt)}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Post Announcement</span><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div className="form-group mb-4"><label className="form-label">Title *</label><input className="form-input" placeholder="e.g. Holiday Notice" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} /></div>
              <div className="form-group mb-4"><label className="form-label">Message *</label><textarea className="form-input" rows={4} placeholder="Write your announcement..." value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4"><label className="form-label">Type</label><select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option value="announcement">Announcement</option><option value="alert">Alert</option><option value="reminder">Reminder</option><option value="message">Message</option></select></div>
                <div className="form-group mb-4"><label className="form-label">Target Audience</label><select className="form-input" value={form.targetRole} onChange={e => setForm({ ...form, targetRole: e.target.value })}><option value="all">Everyone</option><option value="student">Students Only</option><option value="teacher">Teachers Only</option><option value="parent">Parents Only</option></select></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handlePost} disabled={creating || !form.title || !form.message}>{creating ? 'Posting...' : 'Post Announcement'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
