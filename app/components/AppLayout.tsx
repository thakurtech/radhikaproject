'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, ClipboardCheck,
  BookOpen, BarChart3, DollarSign, MessageSquare, Library,
  Bus, Bot, Settings, ChevronRight, Bell, Search,
  Sparkles, HelpCircle, School, Sun, Moon, Link2
} from 'lucide-react';
import { UserProvider, useUser } from './UserProvider';

/* ── Dynamic Navigation by Role ───────────────────────────── */
function getNavSections(role: string) {
  const sections = [];

  // Super Admin exclusivity
  if (role === 'super_admin') {
    sections.push({
      label: 'Platform',
      items: [
        { label: 'Institutions', icon: Link2, href: '/institutions' },
        { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      ]
    });
  }

  // Everyone gets Overview (Admins also get dashboard)
  if (role !== 'super_admin') {
     sections.push({
       label: 'Overview',
       items: [
         { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
         { label: 'AI Assistant', icon: Bot, href: '/ai-assistant', badge: 'AI' },
       ]
     });
  }

  // People & Academics are for ALL roles currently handled
  sections.push({
    label: 'People',
    items: [
      { label: 'Students', icon: GraduationCap, href: '/students' },
      { label: 'Teachers', icon: Users, href: '/teachers' },
    ]
  });

  sections.push({
    label: 'Academics',
    items: [
      { label: 'Attendance', icon: ClipboardCheck, href: '/attendance' },
      { label: 'Academics', icon: BookOpen, href: '/academics' },
      { label: 'Results & Grades', icon: BarChart3, href: '/results' },
    ]
  });

  // Finance and Operations only for Admins
  if (role === 'super_admin' || role === 'school_admin') {
    sections.push({
      label: 'Operations',
      items: [
        { label: 'Finance', icon: DollarSign, href: '/finance' },
        { label: 'Communication', icon: MessageSquare, href: '/communication' },
        { label: 'Library', icon: Library, href: '/library' },
        { label: 'Transport', icon: Bus, href: '/transport' },
      ]
    });

    sections.push({
      label: 'System',
      items: [
        { label: 'Settings', icon: Settings, href: '/settings' },
      ]
    });
  }

  return sections;
}

/* ── Theme hook ─────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  useEffect(() => {
    const stored = localStorage.getItem('eduverse-theme') as 'light' | 'dark' | null;
    if (stored) {
      setTheme(stored);
      document.documentElement.setAttribute('data-theme', stored);
    } else {
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      const initial = prefersDark ? 'dark' : 'light';
      setTheme(initial);
      document.documentElement.setAttribute('data-theme', initial);
    }
  }, []);

  const toggle = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('eduverse-theme', next);
  };

  return { theme, toggle };
}

/* ── Sidebar ────────────────────────────────────────── */
function Sidebar() {
  const pathname = usePathname();
  const { user } = useUser();
  
  if (!user) return null; // Wait for user to render nav

  const sections = getNavSections(user.role);

  const getInitials = (name?: string) => {
    if (!name) return 'U';
    const split = name.split(' ');
    if (split.length > 1) return split[0][0] + split[1][0];
    return split[0][0];
  };

  const getRoleDisplay = () => {
    if (user.role === 'super_admin') return 'Super Admin';
    if (user.role === 'school_admin') return 'School Admin';
    return user.role.charAt(0).toUpperCase() + user.role.slice(1);
  };

  return (
    <aside className="sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <School size={20} color="white" />
        </div>
        <div>
          <div className="sidebar-logo-text">EduVerse</div>
          <div className="sidebar-logo-sub">School ERP</div>
        </div>
      </div>

      <nav className="sidebar-nav">
        {sections.map((section) => (
          <div className="sidebar-section" key={section.label}>
            <div className="sidebar-section-label">{section.label}</div>
            {section.items.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={`nav-item ${
                  pathname === item.href || pathname.startsWith(item.href + '/')
                    ? 'active'
                    : ''
                }`}
              >
                <item.icon size={18} />
                <span>{item.label}</span>
                {item.badge && (
                  <span className="nav-badge">{item.badge}</span>
                )}
              </Link>
            ))}
          </div>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="user-avatar">{getInitials(user.name)}</div>
          <div>
            <div className="user-info-name" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', maxWidth: '100px' }}>
              {user.name}
            </div>
            <div className="user-info-role">{getRoleDisplay()}</div>
          </div>
          <ChevronRight
            size={14}
            style={{ marginLeft: 'auto', color: 'var(--text-muted)' }}
          />
        </div>
      </div>
    </aside>
  );
}

/* ── Topbar ─────────────────────────────────────────── */
function Topbar({ theme, onToggleTheme }: { theme: 'light' | 'dark'; onToggleTheme: () => void }) {
  const { user } = useUser();
  const router = useRouter();

  const handleLogout = async () => {
    await fetch('/api/auth/logout', { method: 'POST' });
    router.push('/login');
    // Hard refresh to clear contexts
    setTimeout(() => window.location.reload(), 200);
  };

  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input type="text" placeholder="Search students, teachers, classes…" />
      </div>

      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button
          className="topbar-btn theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
        >
          <span
            className="theme-toggle-track"
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 4, padding: '4px 8px', borderRadius: 'var(--radius-full)',
              background: theme === 'dark' ? 'rgba(99,102,241,0.15)' : 'var(--bg-subtle)',
              border: `1px solid ${theme === 'dark' ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
              fontSize: '0.72rem', fontWeight: 600,
              color: theme === 'dark' ? 'var(--primary-light)' : 'var(--text-secondary)',
              cursor: 'pointer', transition: 'all 0.25s ease', whiteSpace: 'nowrap',
            }}
          >
            {theme === 'light' ? <><Moon size={13} />Dark</> : <><Sun size={13} />Light</>}
          </span>
        </button>

        <button className="topbar-btn" aria-label="Help"><HelpCircle size={18} /></button>
        <button className="topbar-btn" aria-label="Notifications" style={{ position: 'relative' }}>
          <Bell size={18} /><span className="topbar-notif-dot" />
        </button>

        <div
          title="Logout"
          onClick={handleLogout}
          style={{
            width: 34, height: 34, borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: 'white', fontSize: '0.75rem', fontWeight: 700,
            cursor: 'pointer', flexShrink: 0,
          }}
        >
          {user ? user.name.charAt(0) : 'U'}
        </div>
      </div>
    </header>
  );
}

/* ── AI Chat Widget ─────────────────────────────────── */
let chatIdCounter = 0;

function AIChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    { id: 0, role: 'bot', text: "Hi! I'm EduAI, your school assistant. Ask me about students, attendance, grades, or anything school-related! 🎓" },
  ]);
  const [input, setInput] = useState('');

  const send = async () => {
    if (!input.trim()) return;
    const userMsg = input;
    setMessages(p => [...p, { id: ++chatIdCounter, role: 'user', text: userMsg }]);
    setInput('');
    
    // Add "typing..." indicator
    const typingId = ++chatIdCounter;
    setMessages(p => [...p, { id: typingId, role: 'bot', text: "Analyzing database..." }]);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: userMsg })
      });
      const data = await res.json();
      
      // Replace typing indicator with actual reply
      setMessages(p => p.map(msg => msg.id === typingId ? { ...msg, text: data.reply || "No response." } : msg));
    } catch(e) {
      setMessages(p => p.map(msg => msg.id === typingId ? { ...msg, text: "Connection to EduAI lost. Try again." } : msg));
    }
  };

  return (
    <>
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-chat-avatar"><Sparkles size={18} color="white" /></div>
            <div>
              <div className="ai-chat-name">EduAI Assistant</div>
              <div className="ai-chat-status"><span className="ai-status-dot" /> Online</div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)}>✕</button>
          </div>
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ${msg.role}`}>
                <div className="ai-message-bubble">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="ai-chat-input-area">
            <input className="ai-chat-input" placeholder="Type here…" value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === 'Enter' && send()} />
            <button className="ai-chat-send" onClick={send}><ChevronRight size={16} /></button>
          </div>
        </div>
      )}
      <button className="ai-fab" onClick={() => setOpen(!open)}>
        {open ? <span style={{ fontSize: '1.1rem', fontWeight: 700 }}>✕</span> : <Sparkles size={22} />}
      </button>
    </>
  );
}

/* ── Inner Layout (Consumes Context) ────────────────── */
function AppLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();
  const { user, loading } = useUser();
  
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return <>{children}</>;
  }

  // Show a branded loading screen while checking authentication
  if (loading) {
    return (
      <div style={{
        height: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        background: 'var(--bg-base)', gap: 16
      }}>
        <div style={{
          width: 48, height: 48, borderRadius: 12,
          background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          animation: 'fab-pulse 1.5s ease infinite'
        }}>
          <School size={24} color="white" />
        </div>
        <div style={{ fontSize: '0.875rem', color: 'var(--text-muted)', fontWeight: 500 }}>
          Loading EduVerse...
        </div>
      </div>
    );
  }

  // If not loading and no user, the UserProvider will redirect to /login
  if (!user) {
    return null;
  }

  return (
    <div className="app-layout">
      <Sidebar />
      <div className="main-content">
        <Topbar theme={theme} onToggleTheme={toggle} />
        <main className="page-content">{children}</main>
      </div>
      <AIChatWidget />
    </div>
  );
}

/* ── Root Layout (Provides Context) ─────────────────── */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <UserProvider>
      <AppLayoutInner>{children}</AppLayoutInner>
    </UserProvider>
  );
}
