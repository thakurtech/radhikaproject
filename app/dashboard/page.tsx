'use client';

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp,
  TrendingDown, BarChart3, Bell, Calendar, BookOpen,
  ArrowRight, Sparkles, ChevronRight, AlertCircle, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, PieChart, Pie, Cell
} from 'recharts';

/* ── Data ──────────────────────────────────────────────────────── */
const attendanceData = [
  { day: 'Mon', present: 92, absent: 8 },
  { day: 'Tue', present: 88, absent: 12 },
  { day: 'Wed', present: 94, absent: 6 },
  { day: 'Thu', present: 91, absent: 9 },
  { day: 'Fri', present: 86, absent: 14 },
  { day: 'Sat', present: 78, absent: 22 },
];

const revenueData = [
  { month: 'Aug', collected: 480000, pending: 120000 },
  { month: 'Sep', collected: 620000, pending: 80000 },
  { month: 'Oct', collected: 550000, pending: 95000 },
  { month: 'Nov', collected: 710000, pending: 65000 },
  { month: 'Dec', collected: 590000, pending: 110000 },
  { month: 'Jan', collected: 780000, pending: 45000 },
];

const gradeDistribution = [
  { name: 'A+', value: 18, color: '#6366f1' },
  { name: 'A',  value: 28, color: '#8b5cf6' },
  { name: 'B',  value: 32, color: '#06b6d4' },
  { name: 'C',  value: 15, color: '#10b981' },
  { name: 'D',  value: 7,  color: '#f59e0b' },
];

const recentActivity = [
  { icon: GraduationCap, color: '#6366f1', bg: 'rgba(99,102,241,0.1)',   text: 'New student enrolled: Arjun Mehta (Grade 10)',         time: '5 min ago' },
  { icon: ClipboardCheck, color: '#10b981', bg: 'rgba(16,185,129,0.1)', text: 'Attendance marked for Class 9-A (42/45 present)',      time: '12 min ago' },
  { icon: DollarSign,     color: '#f59e0b', bg: 'rgba(245,158,11,0.1)', text: 'Fee payment received: ₹18,500 from Sharma family',     time: '28 min ago' },
  { icon: AlertCircle,    color: '#f43f5e', bg: 'rgba(244,63,94,0.1)',  text: 'Low attendance alert: Priya Patel (65% this month)',   time: '1h ago' },
  { icon: Award,          color: '#8b5cf6', bg: 'rgba(139,92,246,0.1)', text: 'Exam results published for Grade 12 Board Exams',      time: '2h ago' },
];

const upcomingEvents = [
  { title: 'Annual Sports Day',         date: 'Apr 10', type: 'Event',   color: '#10b981' },
  { title: 'Parent-Teacher Meeting',    date: 'Apr 12', type: 'Meeting', color: '#6366f1' },
  { title: 'Mid-term Exams Begin',      date: 'Apr 15', type: 'Exam',    color: '#f43f5e' },
  { title: 'Science Exhibition',        date: 'Apr 18', type: 'Event',   color: '#f59e0b' },
  { title: 'Board Exam Registration',   date: 'Apr 22', type: 'Admin',   color: '#8b5cf6' },
];

const topStudents = [
  { name: 'Aayush Sharma', class: 'Grade 10-A', score: 94.2, trend: 'up' },
  { name: 'Kavya Reddy',   class: 'Grade 12-B', score: 93.8, trend: 'up' },
  { name: 'Aryan Singh',   class: 'Grade 11-A', score: 92.1, trend: 'down' },
  { name: 'Nisha Patel',   class: 'Grade 10-B', score: 91.5, trend: 'up' },
];

/* ── 3D Tilt Card ───────────────────────────────────────────────── */
function TiltCard({ children, className = '', style = {} }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLDivElement>(null);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const cx = rect.width / 2;
    const cy = rect.height / 2;
    const rotateX = ((y - cy) / cy) * -6;
    const rotateY = ((x - cx) / cx) * 6;
    el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(6px) scale(1.01)`;
  }, []);

  const handleMouseLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px) scale(1)';
  }, []);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        transition: 'transform 0.15s ease',
        transformStyle: 'preserve-3d',
        willChange: 'transform',
        ...style
      }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}

/* ── Dashboard Page ─────────────────────────────────────────────── */
export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/dashboard/stats')
      .then(res => res.json())
      .then(data => {
        setDbStats(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  }, []);

  const stats = [
    { label: 'Total Students',    value: loading ? '...' : dbStats?.totalStudents || '0', change: '+12%', up: true,  icon: GraduationCap, color: 'blue',    detail: 'Total enrolled' },
    { label: "Avg Attendance",    value: loading ? '...' : `${dbStats?.avgAttendance || 0}%`, change: '+1.2%', up: true, icon: ClipboardCheck, color: 'emerald', detail: 'Across all courses' },
    { label: 'Fee Collection',    value: loading ? '...' : `₹${((dbStats?.totalCollected || 0)/100000).toFixed(1)}L`, change: '+8%', up: true,  icon: DollarSign,    color: 'amber',   detail: 'Current academic year' },
    { label: 'Total Teachers',   value: loading ? '...' : dbStats?.totalTeachers || '0',   change: '+2',   up: true,  icon: Users,         color: 'violet',  detail: 'Active faculty members' },
  ];

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Good Morning, Springfield High! 👋</h1>
          <p className="page-subtitle">Here's what's happening at your school today — Saturday, April 5, 2026</p>
        </div>
        <div className="page-header-actions">
          <div className="pill-tabs">
            {['overview', 'analytics', 'reports'].map(tab => (
              <button key={tab} className={`pill-tab ${activeTab === tab ? 'active' : ''}`} onClick={() => setActiveTab(tab)}>
                {tab.charAt(0).toUpperCase() + tab.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── AI Insight Banner ── */}
      <div style={{
        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
        borderRadius: 'var(--radius-xl)', padding: '18px 24px',
        display: 'flex', alignItems: 'center', gap: 16, marginBottom: 24,
        color: 'white', position: 'relative', overflow: 'hidden',
        boxShadow: '0 8px 32px rgba(99,102,241,0.35), 0 2px 8px rgba(99,102,241,0.2)'
      }}>
        {/* shimmer */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)', animation: 'shimmer-banner 3s ease infinite', pointerEvents: 'none' }} />
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 0 1px rgba(255,255,255,0.25) inset', animation: 'logo-float 3s ease-in-out infinite' }}>
          <Sparkles size={20} />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: '0.72rem', opacity: 0.75, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>AI Insight</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: 3 }}>
            Attendance is 3.2% lower than last week. Grade 8 has the most absences. Consider sending reminders to 24 parents.
          </div>
        </div>
        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap', backdropFilter: 'blur(8px)', position: 'relative' }}>
          Take Action <ArrowRight size={13} />
        </button>
        <style>{`
          @keyframes shimmer-banner {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>

      {/* ── 3D Stat Cards ── */}
      <div className="grid-4 mb-6">
        {stats.map((stat) => (
          <TiltCard key={stat.label}>
            <div className={`stat-card ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div className={`stat-icon ${stat.color}`}><stat.icon size={20} /></div>
                <div className={`stat-change ${stat.up ? 'up' : 'down'}`}>
                  {stat.up ? <TrendingUp size={13} /> : <TrendingDown size={13} />}
                  {stat.change}
                </div>
              </div>
              <div>
                <div className="stat-value">{stat.value}</div>
                <div className="stat-label">{stat.label}</div>
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{stat.detail}</div>
            </div>
          </TiltCard>
        ))}
      </div>

      {/* ── Charts Row ── */}
      <div className="grid-2 mb-6">
        {/* Attendance Chart */}
        <TiltCard>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Weekly Attendance</span>
              <span className="badge badge-success">This Week</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={attendanceData} barSize={22}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: 'var(--shadow-lg)', backdropFilter: 'blur(12px)' }} cursor={{ fill: 'rgba(99,102,241,0.05)' }} />
                  <Bar dataKey="present" fill="url(#presentGrad)" radius={[6,6,0,0]} />
                  <Bar dataKey="absent"  fill="rgba(244,63,94,0.5)" radius={[6,6,0,0]} />
                  <defs>
                    <linearGradient id="presentGrad" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#6366f1" />
                      <stop offset="100%" stopColor="#8b5cf6" />
                    </linearGradient>
                  </defs>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TiltCard>

        {/* Revenue Chart */}
        <TiltCard>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Fee Collection Trend</span>
              <span className="badge badge-primary">6 Months</span>
            </div>
            <div className="card-body">
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={revenueData}>
                  <defs>
                    <linearGradient id="collected" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%"  stopColor="#6366f1" stopOpacity={0.4} />
                      <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v/100000).toFixed(1)}L`} />
                  <Tooltip
                    formatter={(v) => [`₹${(Number(v ?? 0)/1000).toFixed(0)}K`, '']}
                    contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12, boxShadow: 'var(--shadow-lg)', backdropFilter: 'blur(12px)' }}
                  />
                  <Area type="monotone" dataKey="collected" stroke="#6366f1" strokeWidth={2.5} fill="url(#collected)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>
        </TiltCard>
      </div>

      {/* ── Bottom Section ── */}
      <div className="grid-3 mb-6">
        {/* Grade Distribution */}
        <TiltCard>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Grade Distribution</span>
              <Link href="/results" className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem' }}>
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="card-body">
              <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                <PieChart width={120} height={120}>
                  <Pie data={gradeDistribution} cx={55} cy={55} innerRadius={36} outerRadius={54} dataKey="value" strokeWidth={0}>
                    {gradeDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
                  </Pie>
                </PieChart>
                <div style={{ flex: 1 }}>
                  {gradeDistribution.map(g => (
                    <div key={g.name} className="flex items-center gap-2 mb-2">
                      <div style={{ width: 10, height: 10, borderRadius: 3, background: g.color, flexShrink: 0, boxShadow: `0 0 6px ${g.color}80` }} />
                      <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1 }}>Grade {g.name}</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-primary)' }}>{g.value}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </TiltCard>

        {/* Top Students */}
        <TiltCard>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Top Performers</span>
              <Link href="/students" className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem' }}>
                View All <ChevronRight size={13} />
              </Link>
            </div>
            <div className="card-body" style={{ padding: '12px 20px' }}>
              {topStudents.map((s, i) => (
                <div key={s.name} className="flex items-center gap-3" style={{ padding: '10px 0', borderBottom: i < topStudents.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ width: 28, height: 28, borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0, boxShadow: '0 4px 12px rgba(99,102,241,0.35)' }}>
                    {i + 1}
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                    <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.class}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <span style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.score}%</span>
                    {s.trend === 'up' ? <TrendingUp size={13} color="#10b981" /> : <TrendingDown size={13} color="#ef4444" />}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>

        {/* Upcoming Events */}
        <TiltCard>
          <div className="card">
            <div className="card-header">
              <span className="card-title">Upcoming Events</span>
              <span className="badge badge-neutral">April 2026</span>
            </div>
            <div className="card-body" style={{ padding: '12px 20px' }}>
              {upcomingEvents.map((event, i) => (
                <div key={event.title} className="flex items-center gap-3" style={{ padding: '8px 0', borderBottom: i < upcomingEvents.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                  <div style={{ width: 36, height: 36, borderRadius: 10, background: `${event.color}15`, border: `1px solid ${event.color}25`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Calendar size={15} color={event.color} />
                  </div>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{event.type}</div>
                  </div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 700, color: event.color, whiteSpace: 'nowrap', flexShrink: 0, background: `${event.color}12`, padding: '2px 8px', borderRadius: 6 }}>{event.date}</div>
                </div>
              ))}
            </div>
          </div>
        </TiltCard>
      </div>

      {/* ── Recent Activity ── */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem' }}>View All</button>
        </div>
        <div className="card-body" style={{ padding: '8px 20px' }}>
          {recentActivity.map((item, i) => (
            <div key={i} className="notification-item" style={{ transition: 'all 0.2s ease' }}
              onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(4px)'; (e.currentTarget as HTMLElement).style.background = 'var(--bg-subtle)'; }}
              onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateX(0)'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
            >
              <div className="notif-icon" style={{ background: item.bg, color: item.color, boxShadow: `0 4px 12px ${item.color}30` }}>
                <item.icon size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.text}</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0, background: 'var(--bg-subtle)', padding: '2px 8px', borderRadius: 6 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* ── Quick Actions ── */}
      <div className="flex gap-3 mt-5" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Mark Attendance', icon: ClipboardCheck, href: '/attendance', color: '#10b981' },
          { label: 'Add Student',     icon: GraduationCap,  href: '/students',   color: '#6366f1' },
          { label: 'Generate Report', icon: BarChart3,       href: '/results',    color: '#8b5cf6' },
          { label: 'Collect Fees',    icon: DollarSign,      href: '/finance',    color: '#f59e0b' },
          { label: 'Send Notice',     icon: Bell,            href: '/communication', color: '#06b6d4' },
        ].map((action) => (
          <Link key={action.label} href={action.href} className="btn btn-secondary" style={{ gap: 8, transition: 'all 0.2s ease' }}
            onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = `0 8px 20px ${action.color}25`; el.style.borderColor = `${action.color}40`; }}
            onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = ''; el.style.borderColor = ''; }}
          >
            <action.icon size={16} style={{ color: action.color }} />
            {action.label}
          </Link>
        ))}
      </div>
    </>
  );
}
