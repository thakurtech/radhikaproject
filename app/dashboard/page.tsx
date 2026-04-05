'use client';

import Link from 'next/link';
import { useState } from 'react';
import {
  Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp,
  TrendingDown, BarChart3, Bell, Calendar, BookOpen, Bus,
  ArrowRight, Sparkles, ChevronRight, Star, AlertCircle, CheckCircle2,
  Clock, Award
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell
} from 'recharts';

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
  { name: 'A', value: 28, color: '#8b5cf6' },
  { name: 'B', value: 32, color: '#06b6d4' },
  { name: 'C', value: 15, color: '#10b981' },
  { name: 'D', value: 7, color: '#f59e0b' },
];

const recentActivity = [
  { icon: GraduationCap, color: 'var(--primary)', bg: 'rgba(99,102,241,0.1)', text: 'New student enrolled: Arjun Mehta (Grade 10)', time: '5 min ago' },
  { icon: ClipboardCheck, color: 'var(--accent-emerald)', bg: 'rgba(16,185,129,0.1)', text: 'Attendance marked for Class 9-A (42/45 present)', time: '12 min ago' },
  { icon: DollarSign, color: 'var(--accent-amber)', bg: 'rgba(245,158,11,0.1)', text: 'Fee payment received: ₹18,500 from Sharma family', time: '28 min ago' },
  { icon: AlertCircle, color: 'var(--accent-rose)', bg: 'rgba(244,63,94,0.1)', text: 'Low attendance alert: Priya Patel (65% this month)', time: '1h ago' },
  { icon: Award, color: 'var(--accent-violet)', bg: 'rgba(139,92,246,0.1)', text: 'Exam results published for Grade 12 Board Exams', time: '2h ago' },
];

const upcomingEvents = [
  { title: 'Annual Sports Day', date: 'Apr 10', type: 'Event', color: 'var(--accent-emerald)' },
  { title: 'Parent-Teacher Meeting', date: 'Apr 12', type: 'Meeting', color: 'var(--primary)' },
  { title: 'Mid-term Exams Begin', date: 'Apr 15', type: 'Exam', color: 'var(--accent-rose)' },
  { title: 'Science Exhibition', date: 'Apr 18', type: 'Event', color: 'var(--accent-amber)' },
  { title: 'Board Exam Registration', date: 'Apr 22', type: 'Admin', color: 'var(--accent-violet)' },
];

const topStudents = [
  { name: 'Aayush Sharma', class: 'Grade 10-A', score: 94.2, trend: 'up' },
  { name: 'Kavya Reddy', class: 'Grade 12-B', score: 93.8, trend: 'up' },
  { name: 'Aryan Singh', class: 'Grade 11-A', score: 92.1, trend: 'down' },
  { name: 'Nisha Patel', class: 'Grade 10-B', score: 91.5, trend: 'up' },
];

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <>
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

      {/* AI INSIGHT BANNER */}
      <div style={{
        background: 'linear-gradient(135deg, var(--primary) 0%, var(--accent-violet) 100%)',
        borderRadius: 'var(--radius-xl)',
        padding: '18px 24px',
        display: 'flex',
        alignItems: 'center',
        gap: 16,
        marginBottom: 24,
        color: 'white'
      }}>
        <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
          <Sparkles size={20} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: '0.8rem', opacity: 0.8, fontWeight: 500 }}>AI Insight</div>
          <div style={{ fontSize: '0.9rem', fontWeight: 600, marginTop: 2 }}>
            Attendance is 3.2% lower than last week. Grade 8 has the most absences. Consider sending reminders to 24 parents.
          </div>
        </div>
        <button className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap' }}>
          Take Action <ArrowRight size={13} />
        </button>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Students', value: '2,847', change: '+124', up: true, icon: GraduationCap, color: 'blue', detail: 'vs last month' },
          { label: 'Today\'s Attendance', value: '86.4%', change: '-3.2%', up: false, icon: ClipboardCheck, color: 'emerald', detail: 'of 2,847 students' },
          { label: 'Fee Collection', value: '₹7.8L', change: '+18%', up: true, icon: DollarSign, color: 'amber', detail: 'this month' },
          { label: 'Active Teachers', value: '142', change: '+3', up: true, icon: Users, color: 'violet', detail: 'currently on campus' },
        ].map((stat) => (
          <div key={stat.label} className={`stat-card ${stat.color}`}>
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
        ))}
      </div>

      {/* CHARTS ROW */}
      <div className="grid-2 mb-6">
        {/* Attendance Chart */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Weekly Attendance</span>
            <span className="badge badge-success">This Week</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={attendanceData} barSize={24}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="day" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <Tooltip
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
                <Bar dataKey="present" fill="var(--primary)" radius={[4,4,0,0]} />
                <Bar dataKey="absent" fill="var(--danger-light)" radius={[4,4,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Revenue chart */}
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
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip
                  formatter={(v) => [`₹${(Number(v ?? 0)/1000).toFixed(0)}K`, '']}
                  contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }}
                />
                <Area type="monotone" dataKey="collected" stroke="var(--primary)" strokeWidth={2} fill="url(#collected)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* BOTTOM SECTION */}
      <div className="grid-3 mb-6">
        {/* Grade Distribution */}
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
                <Pie data={gradeDistribution} cx={55} cy={55} innerRadius={38} outerRadius={55} dataKey="value" strokeWidth={0}>
                  {gradeDistribution.map((entry, i) => (
                    <Cell key={i} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
              <div style={{ flex: 1 }}>
                {gradeDistribution.map(g => (
                  <div key={g.name} className="flex items-center gap-2 mb-2">
                    <div style={{ width: 10, height: 10, borderRadius: 2, background: g.color, flexShrink: 0 }} />
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', flex: 1 }}>Grade {g.name}</span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{g.value}%</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Top Students */}
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
                <div style={{ width: 26, height: 26, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.65rem', fontWeight: 800, flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{s.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.class}</div>
                </div>
                <div className="flex items-center gap-1">
                  <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>{s.score}%</span>
                  {s.trend === 'up' ? <TrendingUp size={13} color="var(--success)" /> : <TrendingDown size={13} color="var(--danger)" />}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Upcoming Events */}
        <div className="card">
          <div className="card-header">
            <span className="card-title">Upcoming Events</span>
            <span className="badge badge-neutral">April 2026</span>
          </div>
          <div className="card-body" style={{ padding: '12px 20px' }}>
            {upcomingEvents.map((event, i) => (
              <div key={event.title} className="flex items-center gap-3" style={{ padding: '8px 0', borderBottom: i < upcomingEvents.length - 1 ? '1px solid var(--border-subtle)' : 'none' }}>
                <div style={{ width: 36, height: 36, borderRadius: 8, background: `${event.color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Calendar size={15} color={event.color} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{event.title}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{event.type}</div>
                </div>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: event.color, whiteSpace: 'nowrap', flexShrink: 0 }}>{event.date}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Activity</span>
          <button className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem' }}>View All</button>
        </div>
        <div className="card-body" style={{ padding: '8px 20px' }}>
          {recentActivity.map((item, i) => (
            <div key={i} className="notification-item">
              <div className="notif-icon" style={{ background: item.bg, color: item.color }}>
                <item.icon size={16} />
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)' }}>{item.text}</div>
              </div>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', flexShrink: 0 }}>{item.time}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="flex gap-3 mt-5" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Mark Attendance', icon: ClipboardCheck, href: '/attendance', color: 'var(--accent-emerald)' },
          { label: 'Add Student', icon: GraduationCap, href: '/students', color: 'var(--primary)' },
          { label: 'Generate Report', icon: BarChart3, href: '/results', color: 'var(--accent-violet)' },
          { label: 'Collect Fees', icon: DollarSign, href: '/finance', color: 'var(--accent-amber)' },
          { label: 'Send Notice', icon: Bell, href: '/communication', color: 'var(--accent-cyan)' },
        ].map((action) => (
          <Link key={action.label} href={action.href} className="btn btn-secondary" style={{ gap: 8 }}>
            <action.icon size={16} style={{ color: action.color }} />
            {action.label}
          </Link>
        ))}
      </div>
    </>
  );
}
