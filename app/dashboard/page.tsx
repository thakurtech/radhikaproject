'use client';

import Link from 'next/link';
import { useState, useRef, useCallback, useEffect } from 'react';
import {
  Users, GraduationCap, ClipboardCheck, DollarSign, TrendingUp,
  TrendingDown, BarChart3, Bell, Calendar, BookOpen,
  ArrowRight, Sparkles, ChevronRight, AlertCircle, Award, Plus
} from 'lucide-react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell
} from 'recharts';
import { useUser } from '../components/UserProvider';

const CHART_COLORS = ['#6366f1', '#8b5cf6', '#06b6d4', '#10b981', '#f59e0b', '#f43f5e', '#ec4899'];

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

/* ── Empty State Component ── */
function EmptyState({ icon: Icon, title, description, action }: { icon: any; title: string; description: string; action?: { label: string; href: string } }) {
  return (
    <div style={{ padding: '2.5rem 1.5rem', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 12 }}>
      <div style={{ width: 48, height: 48, borderRadius: 12, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Icon size={22} color="var(--primary)" />
      </div>
      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-primary)' }}>{title}</div>
      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', maxWidth: 280 }}>{description}</div>
      {action && (
        <Link href={action.href} className="btn btn-primary btn-sm" style={{ marginTop: 4 }}>
          <Plus size={14} /> {action.label}
        </Link>
      )}
    </div>
  );
}

/* ── Dashboard Page ─────────────────────────────────────────────── */
export default function DashboardPage() {
  const { user, loading: authLoading } = useUser();
  const [activeTab, setActiveTab] = useState('overview');
  const [dbStats, setDbStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';
  const isTeacher = user?.role === 'teacher';
  const isStudent = user?.role === 'student';

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

  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' });

  const getGreeting = () => {
    const h = new Date().getHours();
    if (h < 12) return 'Good Morning';
    if (h < 17) return 'Good Afternoon';
    return 'Good Evening';
  };

  /* ── Admin Stats ── */
  const adminStats = [
    { label: 'Total Students',  value: loading ? '...' : dbStats?.totalStudents || '0', icon: GraduationCap, color: 'blue',    detail: 'Total enrolled' },
    { label: "Avg Attendance",  value: loading ? '...' : `${dbStats?.avgAttendance || 0}%`, icon: ClipboardCheck, color: 'emerald', detail: 'Across all courses' },
    { label: 'Fee Collection',  value: loading ? '...' : `₹${((dbStats?.totalCollected || 0)/100000).toFixed(1)}L`, icon: DollarSign,    color: 'amber',   detail: 'Current academic year' },
    { label: 'Total Teachers',  value: loading ? '...' : dbStats?.totalTeachers || '0',   icon: Users,         color: 'violet',  detail: 'Active faculty members' },
  ];

  /* ── Teacher Stats ── */
  const teacherStats = [
    { label: 'Total Students',  value: loading ? '...' : dbStats?.totalStudents || '0', icon: GraduationCap, color: 'blue', detail: 'Across all classes' },
    { label: 'Avg Attendance',  value: loading ? '...' : `${dbStats?.avgAttendance || 0}%`, icon: ClipboardCheck, color: 'emerald', detail: 'School-wide' },
    { label: 'Departments',     value: loading ? '...' : dbStats?.departmentBreakdown?.length || '0', icon: BookOpen, color: 'violet', detail: 'Active depts' },
    { label: 'Total Faculty',   value: loading ? '...' : dbStats?.totalTeachers || '0', icon: Users, color: 'amber', detail: 'Colleagues' },
  ];

  /* ── Student Stats ── */
  const studentStats = [
    { label: 'My Attendance',    value: loading ? '...' : `${dbStats?.avgAttendance || 0}%`, icon: ClipboardCheck, color: 'emerald', detail: 'This semester' },
    { label: 'Total Students',   value: loading ? '...' : dbStats?.totalStudents || '0', icon: GraduationCap, color: 'blue', detail: 'In your school' },
    { label: 'Total Teachers',   value: loading ? '...' : dbStats?.totalTeachers || '0', icon: Users, color: 'violet', detail: 'Faculty members' },
    { label: 'Total Courses',    value: loading ? '...' : dbStats?.courseBreakdown?.length || '0', icon: BookOpen, color: 'amber', detail: 'Available programs' },
  ];

  const stats = isAdmin ? adminStats : isTeacher ? teacherStats : studentStats;

  /* ── Quick Actions (Role-Specific) ── */
  const adminQuickActions = [
    { label: 'Mark Attendance', icon: ClipboardCheck, href: '/attendance', color: '#10b981' },
    { label: 'Add Student',     icon: GraduationCap,  href: '/students',   color: '#6366f1' },
    { label: 'View Results',    icon: BarChart3,       href: '/results',    color: '#8b5cf6' },
    { label: 'Collect Fees',    icon: DollarSign,      href: '/finance',    color: '#f59e0b' },
    { label: 'Send Notice',     icon: Bell,            href: '/communication', color: '#06b6d4' },
  ];

  const teacherQuickActions = [
    { label: 'Mark Attendance', icon: ClipboardCheck, href: '/attendance', color: '#10b981' },
    { label: 'View Students',   icon: GraduationCap,  href: '/students',   color: '#6366f1' },
    { label: 'View Results',    icon: BarChart3,       href: '/results',    color: '#8b5cf6' },
  ];

  const studentQuickActions = [
    { label: 'View Attendance', icon: ClipboardCheck, href: '/attendance', color: '#10b981' },
    { label: 'My Results',      icon: BarChart3,       href: '/results',    color: '#8b5cf6' },
    { label: 'View Teachers',   icon: Users,           href: '/teachers',   color: '#6366f1' },
  ];

  const quickActions = isAdmin ? adminQuickActions : isTeacher ? teacherQuickActions : studentQuickActions;

  return (
    <>
      {/* ── Page Header ── */}
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">{getGreeting()}, {user?.name?.split(' ')[0] || 'User'}! 👋</h1>
          <p className="page-subtitle">
            {isAdmin
              ? `Here's what's happening at your school today — ${today}`
              : isTeacher
              ? `Welcome back — ${today}`
              : `Your student dashboard — ${today}`}
          </p>
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
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(105deg, transparent 30%, rgba(255,255,255,0.08) 50%, transparent 70%)', animation: 'shimmer-banner 3s ease infinite', pointerEvents: 'none' }} />
        <div style={{ width: 42, height: 42, borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, boxShadow: '0 0 0 1px rgba(255,255,255,0.25) inset', animation: 'logo-float 3s ease-in-out infinite' }}>
          <Sparkles size={20} />
        </div>
        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: '0.72rem', opacity: 0.75, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>Dashboard Overview</div>
          <div style={{ fontSize: '0.92rem', fontWeight: 600, marginTop: 3 }}>
            {loading
              ? 'Loading your school data...'
              : `You have ${dbStats?.totalStudents || 0} students, ${dbStats?.totalTeachers || 0} teachers, and ${dbStats?.courseBreakdown?.length || 0} active courses.`}
          </div>
        </div>
        <Link href="/ai-assistant" className="btn btn-sm" style={{ background: 'rgba(255,255,255,0.18)', color: 'white', border: '1px solid rgba(255,255,255,0.3)', whiteSpace: 'nowrap', backdropFilter: 'blur(8px)', position: 'relative' }}>
          Ask EduAI <ArrowRight size={13} />
        </Link>
        <style>{`
          @keyframes shimmer-banner {
            0%   { transform: translateX(-100%); }
            100% { transform: translateX(250%); }
          }
        `}</style>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid-4 mb-6">
        {stats.map((stat) => (
          <TiltCard key={stat.label}>
            <div className={`stat-card ${stat.color}`}>
              <div className="flex items-center justify-between">
                <div className={`stat-icon ${stat.color}`}><stat.icon size={20} /></div>
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

      {/* ══════════ ADMIN: Course, Year, Department Breakdown ══════════ */}
      {isAdmin && dbStats && (
        <div className="grid-3 mb-6">
          {/* Course-wise Student Distribution */}
          <TiltCard>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Students by Course</span>
                <span className="badge badge-primary">Live Data</span>
              </div>
              <div className="card-body">
                {dbStats.courseBreakdown?.length > 0 ? (
                  <ResponsiveContainer width="100%" height={200}>
                    <BarChart data={dbStats.courseBreakdown} barSize={20}>
                      <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" vertical={false} />
                      <XAxis dataKey="courseName" tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <YAxis tick={{ fontSize: 10, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                      <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                      <Bar dataKey="studentCount" name="Students" radius={[6, 6, 0, 0]}>
                        {dbStats.courseBreakdown.map((_: any, i: number) => (
                          <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <EmptyState icon={BookOpen} title="No Courses Yet" description="Create courses in the Academics section to see student distribution." action={{ label: 'Add Course', href: '/academics' }} />
                )}
              </div>
            </div>
          </TiltCard>

          {/* Year-wise Distribution */}
          <TiltCard>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Students by Year</span>
              </div>
              <div className="card-body">
                {dbStats.yearBreakdown?.length > 0 ? (
                  <>
                    <ResponsiveContainer width="100%" height={200}>
                      <PieChart>
                        <Pie data={dbStats.yearBreakdown} cx="50%" cy="50%" innerRadius={50} outerRadius={80} dataKey="count" nameKey="year" strokeWidth={0}>
                          {dbStats.yearBreakdown.map((_: any, i: number) => (
                            <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 12, fontSize: 12 }} />
                      </PieChart>
                    </ResponsiveContainer>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 8 }}>
                      {dbStats.yearBreakdown?.map((y: any, i: number) => (
                        <div key={y.year} className="flex items-center gap-2">
                          <div style={{ width: 10, height: 10, borderRadius: 3, background: CHART_COLORS[i % CHART_COLORS.length] }} />
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{y.year}: {y.count}</span>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <EmptyState icon={GraduationCap} title="No Students Yet" description="Enroll students to see year-wise distribution." action={{ label: 'Add Student', href: '/students' }} />
                )}
              </div>
            </div>
          </TiltCard>

          {/* Department Distribution */}
          <TiltCard>
            <div className="card">
              <div className="card-header">
                <span className="card-title">Faculty by Department</span>
              </div>
              <div className="card-body" style={{ padding: '16px 20px' }}>
                {dbStats.departmentBreakdown?.length > 0 ? (
                  dbStats.departmentBreakdown.map((dept: any, i: number) => (
                    <div key={dept.department} style={{ marginBottom: 12 }}>
                      <div className="flex items-center justify-between" style={{ marginBottom: 4 }}>
                        <span style={{ fontSize: '0.825rem', fontWeight: 600, color: 'var(--text-primary)' }}>{dept.department}</span>
                        <span style={{ fontSize: '0.78rem', fontWeight: 700, color: CHART_COLORS[i % CHART_COLORS.length] }}>{dept.count}</span>
                      </div>
                      <div className="progress-bar" style={{ height: 6, borderRadius: 3 }}>
                        <div style={{
                          width: `${(dept.count / Math.max(...dbStats.departmentBreakdown.map((d: any) => d.count), 1)) * 100}%`,
                          height: '100%',
                          background: CHART_COLORS[i % CHART_COLORS.length],
                          borderRadius: 3,
                          transition: 'width 0.5s ease'
                        }} />
                      </div>
                    </div>
                  ))
                ) : (
                  <EmptyState icon={Users} title="No Teachers Yet" description="Add teachers to see department distribution." action={{ label: 'Add Teacher', href: '/teachers' }} />
                )}
              </div>
            </div>
          </TiltCard>
        </div>
      )}

      {/* ══════════ ADMIN: Course-wise Attendance Table ══════════ */}
      {isAdmin && dbStats?.courseBreakdown?.length > 0 && (
        <div className="card mb-6">
          <div className="card-header">
            <span className="card-title">Course-wise Attendance Overview</span>
            <Link href="/attendance" className="btn btn-ghost btn-sm" style={{ fontSize: '0.78rem' }}>
              View Details <ChevronRight size={13} />
            </Link>
          </div>
          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Course / Program</th>
                  <th>Enrolled Students</th>
                  <th>Avg. Attendance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {dbStats.courseBreakdown.map((c: any) => (
                  <tr key={c.courseId}>
                    <td><span style={{ fontWeight: 600 }}>{c.courseName}</span></td>
                    <td style={{ fontWeight: 600 }}>{c.studentCount}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className="progress-bar" style={{ width: 80 }}>
                          <div className={`progress-fill ${c.avgAttendance >= 85 ? 'success' : c.avgAttendance >= 70 ? 'warning' : 'danger'}`}
                            style={{ width: `${c.avgAttendance}%` }} />
                        </div>
                        <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{c.avgAttendance}%</span>
                      </div>
                    </td>
                    <td>
                      <span className={`badge ${c.avgAttendance >= 85 ? 'badge-success' : c.avgAttendance >= 70 ? 'badge-warning' : 'badge-danger'}`}>
                        {c.avgAttendance >= 85 ? 'Good' : c.avgAttendance >= 70 ? 'Needs Attention' : 'Critical'}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Quick Actions ── */}
      <div className="flex gap-3 mt-5" style={{ flexWrap: 'wrap' }}>
        {quickActions.map((action) => (
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
