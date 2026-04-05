'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, GraduationCap, ClipboardCheck,
  BookOpen, BarChart3, DollarSign, MessageSquare, Library,
  Bus, Bot, Settings, ChevronRight, Bell, Search,
  Sparkles, HelpCircle, School, Sun, Moon
} from 'lucide-react';

const navSections = [
  {
    label: 'Overview',
    items: [
      { label: 'Dashboard', icon: LayoutDashboard, href: '/dashboard' },
      { label: 'AI Assistant', icon: Bot, href: '/ai-assistant', badge: 'AI' },
    ]
  },
  {
    label: 'People',
    items: [
      { label: 'Students', icon: GraduationCap, href: '/students' },
      { label: 'Teachers', icon: Users, href: '/teachers' },
    ]
  },
  {
    label: 'Academics',
    items: [
      { label: 'Attendance', icon: ClipboardCheck, href: '/attendance' },
      { label: 'Academics', icon: BookOpen, href: '/academics' },
      { label: 'Results & Grades', icon: BarChart3, href: '/results' },
    ]
  },
  {
    label: 'Operations',
    items: [
      { label: 'Finance', icon: DollarSign, href: '/finance' },
      { label: 'Communication', icon: MessageSquare, href: '/communication' },
      { label: 'Library', icon: Library, href: '/library' },
      { label: 'Transport', icon: Bus, href: '/transport' },
    ]
  },
  {
    label: 'System',
    items: [
      { label: 'Settings', icon: Settings, href: '/settings' },
    ]
  }
];

/* ── Theme hook ─────────────────────────────────────── */
function useTheme() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');

  // On mount: read stored preference or system preference
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
        {navSections.map((section) => (
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
          <div className="user-avatar">SA</div>
          <div>
            <div className="user-info-name">Springfield High</div>
            <div className="user-info-role">Super Admin</div>
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
  return (
    <header className="topbar">
      <div className="topbar-search">
        <Search size={16} className="topbar-search-icon" />
        <input
          type="text"
          placeholder="Search students, teachers, classes…"
        />
      </div>

      <div className="topbar-actions">
        {/* Theme Toggle */}
        <button
          className="topbar-btn theme-toggle-btn"
          onClick={onToggleTheme}
          aria-label={theme === 'light' ? 'Switch to dark mode' : 'Switch to light mode'}
          title={theme === 'light' ? 'Dark mode' : 'Light mode'}
          style={{ position: 'relative' }}
        >
          <span
            className="theme-toggle-track"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: 4,
              padding: '4px 8px',
              borderRadius: 'var(--radius-full)',
              background: theme === 'dark'
                ? 'rgba(99,102,241,0.15)'
                : 'var(--bg-subtle)',
              border: `1px solid ${theme === 'dark' ? 'rgba(99,102,241,0.3)' : 'var(--border)'}`,
              fontSize: '0.72rem',
              fontWeight: 600,
              color: theme === 'dark' ? 'var(--primary-light)' : 'var(--text-secondary)',
              cursor: 'pointer',
              transition: 'all 0.25s ease',
              whiteSpace: 'nowrap',
            }}
          >
            {theme === 'light' ? (
              <>
                <Moon size={13} />
                Dark
              </>
            ) : (
              <>
                <Sun size={13} />
                Light
              </>
            )}
          </span>
        </button>

        <button className="topbar-btn" aria-label="Help">
          <HelpCircle size={18} />
        </button>

        <button
          className="topbar-btn"
          aria-label="Notifications"
          style={{ position: 'relative' }}
        >
          <Bell size={18} />
          <span className="topbar-notif-dot" />
        </button>

        <div
          style={{
            width: 34,
            height: 34,
            borderRadius: '50%',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            fontSize: '0.75rem',
            fontWeight: 700,
            cursor: 'pointer',
            flexShrink: 0,
          }}
        >
          SA
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
    {
      id: 0,
      role: 'bot',
      text: "Hi! I'm EduAI, your school assistant. Ask me about students, attendance, grades, or anything school-related! 🎓",
    },
  ]);
  const [input, setInput] = useState('');

  const botResponses = [
    'I found 3 students with attendance below 75% this week. Would you like to send alerts to their parents?',
    'The average grade across all classes this semester is 78.4%. Math classes show the highest improvement at +12%.',
    'There are 5 pending fee payments totaling ₹45,000. I can generate a reminder notice for you.',
    'Based on current trends, the top performer in Grade 10 is Aayush Sharma with a 94.2% overall score.',
    "Tomorrow's timetable has no conflicts. All 48 scheduled classes have assigned teachers.",
    'I can help you generate a report card, track attendance, manage fees, or answer any school-related query!',
  ];

  const sendMessage = () => {
    if (!input.trim()) return;
    const userMsg = { id: ++chatIdCounter, role: 'user', text: input };
    const botMsg = {
      id: ++chatIdCounter,
      role: 'bot',
      text: botResponses[Math.floor(Math.random() * botResponses.length)],
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setTimeout(() => setMessages((prev) => [...prev, botMsg]), 800);
  };

  const handleKey = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') sendMessage();
  };

  return (
    <>
      {open && (
        <div className="ai-chat-panel">
          <div className="ai-chat-header">
            <div className="ai-chat-avatar">
              <Sparkles size={18} color="white" />
            </div>
            <div>
              <div className="ai-chat-name">EduAI Assistant</div>
              <div className="ai-chat-status">
                <span className="ai-status-dot" />
                Online & Ready
              </div>
            </div>
            <button className="ai-chat-close" onClick={() => setOpen(false)}>
              ✕
            </button>
          </div>
          <div className="ai-chat-messages">
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ${msg.role}`}>
                {msg.role === 'bot' && (
                  <div
                    style={{
                      width: 28,
                      height: 28,
                      borderRadius: '50%',
                      background:
                        'linear-gradient(135deg, var(--primary), var(--accent-violet))',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      flexShrink: 0,
                    }}
                  >
                    <Sparkles size={13} color="white" />
                  </div>
                )}
                <div className="ai-message-bubble">{msg.text}</div>
              </div>
            ))}
          </div>
          <div className="ai-chat-input-area">
            <input
              className="ai-chat-input"
              placeholder="Ask about students, grades, fees…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKey}
            />
            <button className="ai-chat-send" onClick={sendMessage}>
              <ChevronRight size={16} />
            </button>
          </div>
        </div>
      )}
      <button
        className="ai-fab"
        onClick={() => setOpen(!open)}
        aria-label="AI Assistant"
      >
        <span className="ai-fab-pulse" />
        {open ? (
          <span
            style={{ fontSize: '1.1rem', fontWeight: 700, zIndex: 1 }}
          >
            ✕
          </span>
        ) : (
          <Sparkles
            size={22}
            style={{ zIndex: 1, position: 'relative' }}
          />
        )}
      </button>
    </>
  );
}

/* ── Root Layout ────────────────────────────────────── */
export default function AppLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { theme, toggle } = useTheme();

  // No app shell on landing / auth
  if (pathname === '/' || pathname === '/login' || pathname === '/signup') {
    return <>{children}</>;
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
