'use client';

import { useState } from 'react';
import { Send, Bell, MessageSquare, Users, Plus, Search, Paperclip, Smile } from 'lucide-react';

let msgId = 100;

const ANNOUNCEMENTS = [
  { id: 1, title: 'Annual Sports Day – April 10', type: 'Event', audience: 'All', date: 'Apr 5, 2026', text: 'All students must report to the main ground by 8 AM. Participation certificates will be awarded.', author: 'Principal', priority: 'high' },
  { id: 2, title: 'Mid-term Exam Schedule Released', type: 'Academic', audience: 'Students', date: 'Apr 4, 2026', text: 'Mid-term exams begin April 15. Please download the time table from the student portal.', author: 'Academic Head', priority: 'high' },
  { id: 3, title: 'Parent-Teacher Meeting – April 12', type: 'Meeting', audience: 'Parents', date: 'Apr 3, 2026', text: 'Parents are requested to attend the PTM at their scheduled slot. Please bring the report card.', author: 'Admin', priority: 'normal' },
  { id: 4, title: 'Library Extended Hours', type: 'General', audience: 'All', date: 'Apr 2, 2026', text: 'The library will remain open until 7 PM during exam weeks. Silence must be maintained.', author: 'Librarian', priority: 'normal' },
];

const MESSAGES = [
  { id: 1, from: 'Mrs. Sharma (Parent)', subject: 'Regarding Aayush\'s attendance', preview: 'I wanted to discuss my son\'s recent attendance issue...', time: '10:30 AM', unread: true, avatar: 'MS', color: '#6366f1' },
  { id: 2, from: 'Dr. Meera (Teacher)', subject: 'Grade 10 Math remedial plan', preview: 'Sharing the plan for underperforming students in...', time: '9:15 AM', unread: true, avatar: 'DM', color: '#8b5cf6' },
  { id: 3, from: 'Rohit Kumar (Student)', subject: 'Leave application for Apr 8', preview: 'Requesting leave for my sister\'s wedding on...', time: 'Yesterday', unread: false, avatar: 'RK', color: '#06b6d4' },
  { id: 4, from: 'Transport Dept.', subject: 'Bus Route 4 delay tomorrow', preview: 'Due to road construction, Bus 4 will be 20 min...', time: 'Yesterday', unread: false, avatar: 'TD', color: '#10b981' },
];

const CHAT_MESSAGES = [
  { id: 1, from: 'them', name: 'Mrs. Sharma', text: 'Hello! I wanted to discuss my son Aayush\'s recent attendance. He was absent last week due to illness.', time: '10:28 AM' },
  { id: 2, from: 'me', text: 'Hello Mrs. Sharma! Thank you for reaching out. I can see his attendance dropped to 91% this month.', time: '10:30 AM' },
  { id: 3, from: 'them', name: 'Mrs. Sharma', text: 'Yes, he had a fever for 3 days. I have the medical certificate. When can I submit it?', time: '10:31 AM' },
  { id: 4, from: 'me', text: 'You can submit it to the front office anytime between 8 AM - 4 PM. We\'ll update his attendance accordingly.', time: '10:33 AM' },
];

export default function CommunicationPage() {
  const [activeTab, setActiveTab] = useState('messages');
  const [selectedMsg, setSelectedMsg] = useState<typeof MESSAGES[0] | null>(MESSAGES[0]);
  const [replyText, setReplyText] = useState('');
  const [chatMessages, setChatMessages] = useState(CHAT_MESSAGES);

  const sendReply = () => {
    if (!replyText.trim()) return;
    setChatMessages(prev => [...prev, { id: ++msgId, from: 'me', text: replyText, time: 'Just now' }]);
    setReplyText('');
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Communication</h1>
          <p className="page-subtitle">Announcements, messages, and parent-teacher communication</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm"><Plus size={15} /> New Announcement</button>
        </div>
      </div>

      <div className="grid-4 mb-5">
        {[
          { label: 'Unread Messages', value: '12', color: 'blue', icon: MessageSquare },
          { label: 'Announcements', value: '4', color: 'violet', icon: Bell },
          { label: 'Bulk SMS Sent', value: '2,847', color: 'emerald', icon: Send },
          { label: 'Parent Contacts', value: '1,924', color: 'amber', icon: Users },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="pill-tabs mb-5">
        {['messages', 'announcements', 'bulk-notify'].map(tab => (
          <button key={tab} className={`pill-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
            {tab === 'bulk-notify' ? 'Bulk Notify' : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {activeTab === 'messages' && (
        <div className="card" style={{ display: 'flex', height: 560, overflow: 'hidden' }}>
          {/* Inbox */}
          <div style={{ width: 280, borderRight: '1px solid var(--border)', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--border-subtle)' }}>
              <div style={{ position: 'relative' }}>
                <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
                <input className="form-input" style={{ height: 34, paddingLeft: 32, borderRadius: 'var(--radius-full)', fontSize: '0.8rem' }} placeholder="Search..." />
              </div>
            </div>
            <div style={{ flex: 1, overflowY: 'auto' }}>
              {MESSAGES.map(msg => (
                <div key={msg.id} onClick={() => setSelectedMsg(msg)}
                  style={{
                    padding: '14px 16px', cursor: 'pointer', borderBottom: '1px solid var(--border-subtle)',
                    background: selectedMsg?.id === msg.id ? 'var(--primary-subtle)' : 'transparent',
                    transition: 'background 0.15s ease'
                  }}
                >
                  <div className="flex items-center gap-3">
                    <div className="avatar avatar-sm" style={{ background: msg.color, width: 36, height: 36, flexShrink: 0 }}>{msg.avatar}</div>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div className="flex items-center gap-1 mb-1">
                        <span style={{ fontSize: '0.8rem', fontWeight: msg.unread ? 700 : 500, color: 'var(--text-primary)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.from}</span>
                        <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)', flexShrink: 0 }}>{msg.time}</span>
                      </div>
                      <div style={{ fontSize: '0.75rem', fontWeight: msg.unread ? 600 : 400, color: msg.unread ? 'var(--text-primary)' : 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.subject}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{msg.preview}</div>
                    </div>
                    {msg.unread && <div style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--primary)', flexShrink: 0 }} />}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Chat Pane */}
          {selectedMsg && (
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
              <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 12 }}>
                <div className="avatar avatar-sm" style={{ background: selectedMsg.color, width: 36, height: 36 }}>{selectedMsg.avatar}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.9rem' }}>{selectedMsg.from}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{selectedMsg.subject}</div>
                </div>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
                {chatMessages.map(msg => (
                  <div key={msg.id} style={{ display: 'flex', flexDirection: msg.from === 'me' ? 'row-reverse' : 'row', gap: 10 }}>
                    <div style={{
                      maxWidth: '70%',
                      padding: '10px 14px',
                      borderRadius: 14,
                      borderBottomLeftRadius: msg.from !== 'me' ? 4 : 14,
                      borderBottomRightRadius: msg.from === 'me' ? 4 : 14,
                      background: msg.from === 'me' ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--bg-subtle)',
                      color: msg.from === 'me' ? 'white' : 'var(--text-primary)',
                      fontSize: '0.85rem',
                      lineHeight: 1.5
                    }}>
                      {msg.text}
                      <div style={{ fontSize: '0.65rem', opacity: 0.7, marginTop: 4, textAlign: msg.from === 'me' ? 'right' : 'left' }}>{msg.time}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div style={{ padding: '12px 16px', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 8, alignItems: 'center' }}>
                <button className="btn btn-ghost btn-icon btn-sm"><Paperclip size={15} /></button>
                <input
                  className="form-input" style={{ flex: 1, height: 38, borderRadius: 'var(--radius-full)' }}
                  placeholder="Type a message..."
                  value={replyText}
                  onChange={e => setReplyText(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendReply()}
                />
                <button className="btn btn-primary btn-icon" style={{ width: 38, height: 38, borderRadius: '50%' }} onClick={sendReply}>
                  <Send size={15} />
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {activeTab === 'announcements' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {ANNOUNCEMENTS.map(ann => (
            <div key={ann.id} className="card card-body">
              <div className="flex items-start gap-4">
                <div style={{
                  width: 44, height: 44, borderRadius: 10,
                  background: ann.priority === 'high' ? 'rgba(244,63,94,0.1)' : 'rgba(99,102,241,0.1)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
                }}>
                  <Bell size={20} color={ann.priority === 'high' ? 'var(--accent-rose)' : 'var(--primary)'} />
                </div>
                <div style={{ flex: 1 }}>
                  <div className="flex items-center gap-2 mb-1">
                    <span style={{ fontWeight: 700, color: 'var(--text-primary)', fontSize: '0.95rem' }}>{ann.title}</span>
                    <span className={`badge ${ann.priority === 'high' ? 'badge-danger' : 'badge-neutral'}`}>{ann.priority === 'high' ? 'High Priority' : 'Normal'}</span>
                    <span className="badge badge-primary">{ann.type}</span>
                  </div>
                  <div style={{ fontSize: '0.825rem', color: 'var(--text-secondary)', marginBottom: 8, lineHeight: 1.6 }}>{ann.text}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                    By {ann.author} · To: {ann.audience} · {ann.date}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button className="btn btn-secondary btn-sm"><Send size={13} /> Resend</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {activeTab === 'bulk-notify' && (
        <div className="card card-body">
          <h3 style={{ fontWeight: 700, marginBottom: 20, color: 'var(--text-primary)' }}>Send Bulk Notification</h3>
          <div className="grid-2" style={{ gap: 20 }}>
            <div className="form-group">
              <label className="form-label">Target Audience</label>
              <select className="form-select"><option>All Students</option><option>All Parents</option><option>All Teachers</option><option>Grade 10</option><option>Grade 12</option></select>
            </div>
            <div className="form-group">
              <label className="form-label">Channel</label>
              <select className="form-select"><option>SMS + Email</option><option>SMS Only</option><option>Email Only</option><option>App Push</option></select>
            </div>
          </div>
          <div className="form-group mt-4">
            <label className="form-label">Subject</label>
            <input className="form-input" placeholder="Enter notification subject..." />
          </div>
          <div className="form-group mt-3">
            <label className="form-label">Message</label>
            <textarea className="form-input" rows={5} placeholder="Type your message here..." style={{ height: 'auto', padding: '12px 14px', resize: 'vertical' }} />
          </div>
          <div className="flex items-center gap-3 mt-4">
            <button className="btn btn-primary"><Send size={15} /> Send Now</button>
            <button className="btn btn-secondary">Schedule for Later</button>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>Will be sent to ~2,847 recipients</span>
          </div>
        </div>
      )}
    </>
  );
}
