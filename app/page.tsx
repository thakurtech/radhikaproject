'use client';

import Link from 'next/link';
import { useState, useEffect } from 'react';
import {
  Sparkles, ArrowRight, GraduationCap, ClipboardCheck, BarChart3,
  DollarSign, MessageSquare, Shield, Zap, Globe, Check, Star,
  BookOpen, Bus, ChevronRight, TrendingUp
} from 'lucide-react';

/* Animated counter hook */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCount(Math.floor(eased * end));
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

const FEATURES = [
  { icon: GraduationCap, title: 'Smart Student Profiles', desc: 'AI-enriched profiles tracking academic journey, attendance, behaviour, and growth trajectories in real time.', color: '#6366f1', glow: 'rgba(99,102,241,0.3)' },
  { icon: ClipboardCheck, title: 'Instant Attendance', desc: 'One-click daily marking with automated parent alerts, trend analytics, and predictive absence detection.', color: '#10b981', glow: 'rgba(16,185,129,0.3)' },
  { icon: BarChart3, title: 'AI Grade Analytics', desc: 'Real-time performance dashboards with radar charts, predictive scoring, and personalised improvement plans.', color: '#8b5cf6', glow: 'rgba(139,92,246,0.3)' },
  { icon: DollarSign, title: 'Fee Management', desc: 'Automated invoicing, payment tracking, bulk reminders, and revenue analytics in one unified dashboard.', color: '#f59e0b', glow: 'rgba(245,158,11,0.3)' },
  { icon: MessageSquare, title: 'Communication Hub', desc: 'Real-time parent-teacher chat, bulk SMS, email blasts, and announcement boards with delivery receipts.', color: '#06b6d4', glow: 'rgba(6,182,212,0.3)' },
  { icon: Sparkles, title: 'EduAI Assistant', desc: 'Ask anything — student data, fee status, attendance trends. Powered by advanced LLM with school context.', color: '#f43f5e', glow: 'rgba(244,63,94,0.3)' },
];

const TESTIMONIALS = [
  { name: 'Dr. Priya Sharma', role: 'Principal, DPS Noida', text: 'EduVerse transformed our school. The AI assistant saves us 3 hours every day. Reports that took a week are ready in seconds.', rating: 5, avatar: 'PS', bg: '#6366f1' },
  { name: 'Rakesh Verma', role: 'Admin, Ryan International', text: 'The glassmorphism UI is stunning — our teachers actually enjoy using it. Fee collection improved 23% in the first month.', rating: 5, avatar: 'RV', bg: '#8b5cf6' },
  { name: 'Sunita Menon', role: 'Director, Orchids Schools', text: 'We manage 8 branches from one dashboard. The analytics are incredibly detailed and the AI insights are spot-on.', rating: 5, avatar: 'SM', bg: '#10b981' },
];

const PRICING = [
  {
    name: 'Starter', price: 4999, period: '/month', desc: 'Perfect for small schools',
    features: ['Up to 500 students', 'Core ERP modules', 'Basic analytics', 'Email support', '5GB storage'],
    cta: 'Get Started', highlight: false
  },
  {
    name: 'Professional', price: 12999, period: '/month', desc: 'Most popular for growing schools',
    features: ['Up to 2,500 students', 'All ERP modules', 'AI Assistant (EduAI)', 'Advanced analytics', 'Priority support', '50GB storage', 'Custom branding'],
    cta: 'Start Free Trial', highlight: true
  },
  {
    name: 'Enterprise', price: null, period: '', desc: 'For large institutions & chains',
    features: ['Unlimited students', 'Multi-campus management', 'Custom AI training', 'Dedicated manager', 'SLA guarantee', 'Unlimited storage', 'API access'],
    cta: 'Contact Sales', highlight: false
  },
];

export default function LandingPage() {
  const [countersStarted, setCountersStarted] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => setCountersStarted(true), 800);
    return () => clearTimeout(timer);
  }, []);

  const schools = useCounter(500, 2200, countersStarted);
  const students = useCounter(250000, 2500, countersStarted);
  const satisfaction = useCounter(98, 1800, countersStarted);
  const uptime = useCounter(99, 1500, countersStarted);

  return (
    <div style={{ minHeight: '100vh', fontFamily: "'Inter', sans-serif", position: 'relative', overflow: 'hidden', background: 'var(--bg-base)' }}>

      {/* ── AURORA BACKGROUND ─────────────────────────────────── */}
      <div style={{
        position: 'fixed', inset: 0, zIndex: 0, pointerEvents: 'none',
        background: `
          radial-gradient(ellipse 80vw 60vh at 10% 10%, rgba(99,102,241,0.25) 0%, transparent 70%),
          radial-gradient(ellipse 60vw 50vh at 85% 15%, rgba(139,92,246,0.20) 0%, transparent 70%),
          radial-gradient(ellipse 70vw 60vh at 50% 80%, rgba(6,182,212,0.15) 0%, transparent 70%),
          radial-gradient(ellipse 50vw 40vh at 20% 70%, rgba(236,72,153,0.12) 0%, transparent 70%)
        `,
        animation: 'aurora-drift 20s ease-in-out infinite alternate'
      }} />

      {/* ── NAV ────────────────────────────────────────────────── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 1000,
        padding: '0 40px', height: 68,
        display: 'flex', alignItems: 'center', gap: 40,
        background: 'rgba(255,255,255,0.7)',
        backdropFilter: 'blur(24px) saturate(180%)',
        WebkitBackdropFilter: 'blur(24px) saturate(180%)',
        borderBottom: '1px solid rgba(255,255,255,0.5)',
        boxShadow: '0 1px 0 rgba(255,255,255,0.8) inset, 0 4px 24px rgba(99,102,241,0.06)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 38, height: 38, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 4px 16px rgba(99,102,241,0.35), 0 0 0 1px rgba(255,255,255,0.2) inset'
          }}>
            <Sparkles size={18} color="white" />
          </div>
          <span style={{ fontSize: '1.1rem', fontWeight: 800, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.02em' }}>EduVerse</span>
        </div>

        <div style={{ display: 'flex', gap: 32, marginLeft: 24 }}>
          {['Features', 'Pricing', 'Testimonials', 'Demo'].map(item => (
            <a key={item} href={`#${item.toLowerCase()}`} style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', position: 'relative', textDecoration: 'none' }}
              onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
              onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
            >{item}</a>
          ))}
        </div>

        <div style={{ marginLeft: 'auto', display: 'flex', gap: 10, alignItems: 'center' }}>
          <Link href="/login" style={{ fontSize: '0.875rem', fontWeight: 500, color: 'var(--text-secondary)', padding: '8px 16px', borderRadius: 8, textDecoration: 'none' }}
            onMouseEnter={e => (e.currentTarget.style.color = '#6366f1')}
            onMouseLeave={e => (e.currentTarget.style.color = 'var(--text-secondary)')}
          >Sign In</Link>
          <Link href="/dashboard" style={{
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            color: 'white', padding: '9px 20px', borderRadius: 10, fontSize: '0.875rem', fontWeight: 600,
            textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 6,
            boxShadow: '0 4px 16px rgba(99,102,241,0.35)',
            transition: 'all 0.2s ease'
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(-1px)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 24px rgba(99,102,241,0.45)'; }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'; (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 16px rgba(99,102,241,0.35)'; }}
          >
            Start Free Trial <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section style={{ position: 'relative', zIndex: 1, minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', textAlign: 'center', padding: '120px 40px 80px' }}>

        {/* Floating 3D cards */}
        {[
          { top: '18%', left: '5%', rotate: '-8deg', delay: '0s', icon: GraduationCap, label: '2,847 Students', value: '+124 today', color: '#6366f1' },
          { top: '25%', right: '4%', rotate: '6deg', delay: '0.5s', icon: ClipboardCheck, label: 'Attendance', value: '86.4%', color: '#10b981' },
          { bottom: '22%', left: '6%', rotate: '5deg', delay: '1s', icon: DollarSign, label: 'Fee Collection', value: '₹7.8L', color: '#f59e0b' },
          { bottom: '25%', right: '5%', rotate: '-6deg', delay: '1.5s', icon: BarChart3, label: 'Avg Score', value: '82.3%', color: '#8b5cf6' },
        ].map((card, i) => (
          <div key={i} style={{
            position: 'absolute',
            top: card.top, bottom: card.bottom, left: card.left, right: card.right,
            background: 'rgba(255,255,255,0.7)',
            backdropFilter: 'blur(20px) saturate(180%)',
            WebkitBackdropFilter: 'blur(20px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.6)',
            borderRadius: 16,
            padding: '14px 18px',
            boxShadow: `0 16px 40px ${card.color}22, 0 4px 12px rgba(0,0,0,0.08), inset 0 1px 0 rgba(255,255,255,0.9)`,
            transform: `rotate(${card.rotate})`,
            animation: `float-card ${3 + i * 0.5}s ease-in-out infinite alternate`,
            animationDelay: card.delay,
            minWidth: 160,
            display: 'flex', flexDirection: 'column', gap: 6
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{ width: 28, height: 28, borderRadius: 8, background: `${card.color}18`, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <card.icon size={14} color={card.color} />
              </div>
              <span style={{ fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>{card.label}</span>
            </div>
            <div style={{ fontSize: '1.2rem', fontWeight: 800, color: card.color, letterSpacing: '-0.02em' }}>{card.value}</div>
          </div>
        ))}

        <div style={{ maxWidth: 780, position: 'relative' }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
            border: '1px solid rgba(99,102,241,0.2)',
            borderRadius: 100, padding: '6px 18px', marginBottom: 32,
            fontSize: '0.8rem', fontWeight: 600, color: '#6366f1',
            boxShadow: '0 4px 16px rgba(99,102,241,0.12)'
          }}>
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#10b981', boxShadow: '0 0 8px rgba(16,185,129,0.6)', animation: 'blink 1.5s ease infinite' }} />
            Powered by Advanced AI · Trusted by {schools}+ Schools
          </div>

          {/* Headline */}
          <h1 style={{
            fontSize: 'clamp(2.8rem, 7vw, 5.5rem)', fontWeight: 900,
            lineHeight: 1.05, letterSpacing: '-0.04em', marginBottom: 24
          }}>
            <span style={{ display: 'block', color: 'var(--text-primary)' }}>The Future of</span>
            <span style={{
              display: 'block',
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 40%, #06b6d4 80%, #10b981 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              backgroundSize: '200% 200%',
              animation: 'gradient-shift 5s ease infinite'
            }}>School Management</span>
            <span style={{ display: 'block', color: 'var(--text-primary)' }}>is Here</span>
          </h1>

          <p style={{ fontSize: '1.15rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 44, maxWidth: 560, margin: '0 auto 44px' }}>
            EduVerse is the all-in-one AI-powered ERP for schools and colleges.
            Manage everything from admissions to alumni — smarter, faster, and beautifully.
          </p>

          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              color: 'white', padding: '14px 32px', borderRadius: 14, fontSize: '1rem', fontWeight: 700,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 32px rgba(99,102,241,0.40), 0 2px 8px rgba(99,102,241,0.2)',
              transition: 'all 0.25s ease'
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px) scale(1.02)'; el.style.boxShadow = '0 16px 48px rgba(99,102,241,0.50)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0) scale(1)'; el.style.boxShadow = '0 8px 32px rgba(99,102,241,0.40)'; }}
            >
              <Sparkles size={18} /> Explore Dashboard
            </Link>
            <a href="#demo" style={{
              background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(12px)',
              color: 'var(--text-primary)', padding: '14px 32px', borderRadius: 14, fontSize: '1rem', fontWeight: 600,
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(99,102,241,0.2)',
              boxShadow: '0 4px 16px rgba(99,102,241,0.08)',
              transition: 'all 0.25s ease'
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-2px)'; el.style.boxShadow = '0 8px 24px rgba(99,102,241,0.12)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 4px 16px rgba(99,102,241,0.08)'; }}
            >
              Get a Demo <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Stats row */}
        <div style={{
          position: 'absolute', bottom: 48, left: '50%', transform: 'translateX(-50%)',
          display: 'flex', gap: 2, background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(20px)',
          borderRadius: 20, padding: '6px', border: '1px solid rgba(255,255,255,0.6)',
          boxShadow: '0 8px 32px rgba(99,102,241,0.10)'
        }}>
          {[
            { value: `${schools}+`, label: 'Schools' },
            { value: `${(students / 1000).toFixed(0)}K+`, label: 'Students' },
            { value: `${satisfaction}%`, label: 'Satisfaction' },
            { value: `${uptime}.9%`, label: 'Uptime' },
          ].map((stat, i) => (
            <div key={stat.label} style={{
              padding: '14px 28px', textAlign: 'center',
              borderRight: i < 3 ? '1px solid rgba(99,102,241,0.1)' : 'none'
            }}>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', letterSpacing: '-0.03em' }}>{stat.value}</div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" style={{ position: 'relative', zIndex: 1, padding: '100px 40px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 72 }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.08)', border: '1px solid rgba(99,102,241,0.15)', borderRadius: 100, padding: '5px 14px', marginBottom: 20, fontSize: '0.78rem', fontWeight: 600, color: '#6366f1' }}>
            <Zap size={13} /> Everything You Need
          </div>
          <h2 style={{ fontSize: '2.75rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 16 }}>
            All-in-One School Intelligence
          </h2>
          <p style={{ fontSize: '1.05rem', color: 'var(--text-secondary)', maxWidth: 520, margin: '0 auto', lineHeight: 1.7 }}>
            Every module you need, beautifully integrated. Powered by AI for insights you've never had before.
          </p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {FEATURES.map((f, i) => (
            <div key={f.title}
              style={{
                background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                border: '1px solid rgba(255,255,255,0.6)',
                borderRadius: 24, padding: '28px 26px',
                boxShadow: `0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.5) inset`,
                transition: 'all 0.35s cubic-bezier(0.34, 1.56, 0.64, 1)',
                cursor: 'default',
                animationDelay: `${i * 0.08}s`
              }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(-8px) scale(1.02)';
                el.style.boxShadow = `0 24px 64px ${f.glow}, 0 8px 24px rgba(0,0,0,0.08), 0 0 0 1px ${f.color}30 inset`;
                el.style.borderColor = `${f.color}40`;
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement;
                el.style.transform = 'translateY(0) scale(1)';
                el.style.boxShadow = '0 8px 32px rgba(0,0,0,0.06), 0 0 0 1px rgba(255,255,255,0.5) inset';
                el.style.borderColor = 'rgba(255,255,255,0.6)';
              }}
            >
              <div style={{
                width: 52, height: 52, borderRadius: 14, marginBottom: 18,
                background: `linear-gradient(135deg, ${f.color}18, ${f.color}08)`,
                border: `1px solid ${f.color}25`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                boxShadow: `0 4px 12px ${f.glow}`
              }}>
                <f.icon size={24} color={f.color} />
              </div>
              <h3 style={{ fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)', marginBottom: 8, letterSpacing: '-0.01em' }}>{f.title}</h3>
              <p style={{ fontSize: '0.875rem', color: 'var(--text-secondary)', lineHeight: 1.65 }}>{f.desc}</p>
              <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', gap: 4, fontSize: '0.8rem', fontWeight: 600, color: f.color }}>
                Learn more <ChevronRight size={14} />
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── AI HIGHLIGHT ──────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1, margin: '0 40px 100px',
        background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(139,92,246,0.08))',
        border: '1px solid rgba(99,102,241,0.20)', borderRadius: 32,
        padding: '72px 64px', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(99,102,241,0.12), inset 0 1px 0 rgba(255,255,255,0.5)'
      }}>
        <div style={{ position: 'absolute', top: -100, right: -100, width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(139,92,246,0.15), transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -80, left: -80, width: 300, height: 300, borderRadius: '50%', background: 'radial-gradient(circle, rgba(6,182,212,0.12), transparent 70%)', pointerEvents: 'none' }} />

        <div style={{ position: 'relative', zIndex: 1, display: 'flex', alignItems: 'center', gap: 64 }}>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.2)', borderRadius: 100, padding: '4px 14px', marginBottom: 20, fontSize: '0.75rem', fontWeight: 700, color: '#6366f1', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              <Sparkles size={12} /> Powered by AI
            </div>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', marginBottom: 16, color: 'var(--text-primary)', lineHeight: 1.1 }}>
              Meet EduAI,<br />
              <span style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>your school brain</span>
            </h2>
            <p style={{ fontSize: '1rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 28, maxWidth: 440 }}>
              Ask anything in plain English. Get instant answers, generate reports, send notifications, and uncover insights you'd never find manually.
            </p>
            {["Who has attendance below 75%?", "Show fee defaulters this month", "Generate Grade 10 report cards", "Predict next week's at-risk students"].map(q => (
              <div key={q} style={{
                display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8,
                fontSize: '0.825rem', color: 'var(--text-secondary)'
              }}>
                <div style={{ width: 20, height: 20, borderRadius: 4, background: 'rgba(99,102,241,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <Check size={12} color="#6366f1" />
                </div>
                {q}
              </div>
            ))}
            <Link href="/ai-assistant" style={{
              display: 'inline-flex', alignItems: 'center', gap: 8, marginTop: 24,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white',
              padding: '12px 24px', borderRadius: 12, fontSize: '0.9rem', fontWeight: 600,
              textDecoration: 'none', boxShadow: '0 8px 24px rgba(99,102,241,0.35)'
            }}>
              <Sparkles size={16} /> Try EduAI Free
            </Link>
          </div>

          {/* Chat mockup */}
          <div style={{
            flex: 1, background: 'rgba(255,255,255,0.7)', backdropFilter: 'blur(24px)',
            borderRadius: 24, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.6)',
            boxShadow: '0 24px 64px rgba(99,102,241,0.15), inset 0 1px 0 rgba(255,255,255,0.9)'
          }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 36, height: 36, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Sparkles size={16} color="white" />
              </div>
              <div style={{ color: 'white' }}>
                <div style={{ fontWeight: 700, fontSize: '0.875rem' }}>EduAI Assistant</div>
                <div style={{ fontSize: '0.68rem', opacity: 0.8 }}>● Online</div>
              </div>
            </div>
            <div style={{ padding: '20px', display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { from: 'user', text: "Who has attendance below 75% this month?" },
                { from: 'bot', text: "Found 3 students with attendance below 75%:\n\n1. Rohit Kumar (Grade 9A) — 65%\n2. Priya Patel (Grade 9B) — 62%\n3. Deepak Verma (Grade 8A) — 68%\n\n⚠️ Shall I send parent alerts?" },
              ].map((msg, i) => (
                <div key={i} style={{ display: 'flex', gap: 10, flexDirection: msg.from === 'user' ? 'row-reverse' : 'row' }}>
                  <div style={{
                    maxWidth: '80%', padding: '10px 14px',
                    borderRadius: 14,
                    borderBottomRightRadius: msg.from === 'user' ? 4 : 14,
                    borderBottomLeftRadius: msg.from === 'bot' ? 4 : 14,
                    background: msg.from === 'user' ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(241,243,255,0.9)',
                    color: msg.from === 'user' ? 'white' : 'var(--text-primary)',
                    fontSize: '0.8rem', lineHeight: 1.6,
                    boxShadow: msg.from === 'user' ? '0 4px 12px rgba(99,102,241,0.3)' : '0 2px 8px rgba(0,0,0,0.05)',
                    whiteSpace: 'pre-line'
                  }}>
                    {msg.text}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ────────────────────────────────────────────── */}
      <section id="pricing" style={{ position: 'relative', zIndex: 1, padding: '100px 40px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 64 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 12 }}>Simple, Transparent Pricing</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '1rem' }}>Start free. Scale effortlessly. No surprises.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {PRICING.map(plan => (
            <div key={plan.name} style={{
              background: plan.highlight ? 'linear-gradient(135deg, rgba(99,102,241,0.15), rgba(139,92,246,0.10))' : 'rgba(255,255,255,0.65)',
              backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              border: plan.highlight ? '2px solid rgba(99,102,241,0.35)' : '1px solid rgba(255,255,255,0.6)',
              borderRadius: 24, padding: '32px 28px',
              boxShadow: plan.highlight ? '0 24px 64px rgba(99,102,241,0.20), inset 0 1px 0 rgba(255,255,255,0.4)' : '0 8px 32px rgba(0,0,0,0.06)',
              transform: plan.highlight ? 'scale(1.03)' : 'scale(1)',
              position: 'relative'
            }}>
              {plan.highlight && (
                <div style={{ position: 'absolute', top: -14, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: 'white', padding: '4px 18px', borderRadius: 100, fontSize: '0.72rem', fontWeight: 700, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(99,102,241,0.4)' }}>
                  ✦ Most Popular
                </div>
              )}
              <div style={{ fontWeight: 800, fontSize: '1.1rem', color: 'var(--text-primary)', marginBottom: 4 }}>{plan.name}</div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: 24 }}>{plan.desc}</div>
              <div style={{ marginBottom: 28 }}>
                {plan.price ? (
                  <>
                    <span style={{ fontSize: '2.8rem', fontWeight: 900, color: 'var(--text-primary)', letterSpacing: '-0.04em' }}>₹{plan.price.toLocaleString()}</span>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{plan.period}</span>
                  </>
                ) : (
                  <span style={{ fontSize: '2rem', fontWeight: 900, color: 'var(--text-primary)' }}>Custom</span>
                )}
              </div>
              <div style={{ marginBottom: 28, display: 'flex', flexDirection: 'column', gap: 10 }}>
                {plan.features.map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                    <div style={{ width: 18, height: 18, borderRadius: 4, background: plan.highlight ? 'rgba(99,102,241,0.12)' : 'rgba(16,185,129,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                      <Check size={11} color={plan.highlight ? '#6366f1' : '#10b981'} />
                    </div>
                    {f}
                  </div>
                ))}
              </div>
              <Link href="/dashboard" style={{
                display: 'block', textAlign: 'center', padding: '13px',
                borderRadius: 12, fontWeight: 700, fontSize: '0.9rem',
                textDecoration: 'none',
                background: plan.highlight ? 'linear-gradient(135deg, #6366f1, #8b5cf6)' : 'rgba(255,255,255,0.8)',
                color: plan.highlight ? 'white' : 'var(--text-primary)',
                border: plan.highlight ? 'none' : '1px solid rgba(99,102,241,0.2)',
                boxShadow: plan.highlight ? '0 8px 24px rgba(99,102,241,0.35)' : 'none',
                transition: 'all 0.2s ease'
              }}>
                {plan.cta}
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ─────────────────────────────────────── */}
      <section id="testimonials" style={{ position: 'relative', zIndex: 1, padding: '80px 40px 100px', maxWidth: 1100, margin: '0 auto' }}>
        <div style={{ textAlign: 'center', marginBottom: 56 }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, letterSpacing: '-0.03em', color: 'var(--text-primary)', marginBottom: 12 }}>Loved by School Leaders</h2>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 20 }}>
          {TESTIMONIALS.map(t => (
            <div key={t.name} style={{
              background: 'rgba(255,255,255,0.65)', backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
              border: '1px solid rgba(255,255,255,0.6)', borderRadius: 24, padding: '28px',
              boxShadow: '0 8px 32px rgba(99,102,241,0.08), inset 0 1px 0 rgba(255,255,255,0.8)',
              transition: 'all 0.3s ease'
            }}
              onMouseEnter={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(-6px)'; el.style.boxShadow = '0 24px 64px rgba(99,102,241,0.15)'; }}
              onMouseLeave={e => { const el = e.currentTarget as HTMLElement; el.style.transform = 'translateY(0)'; el.style.boxShadow = '0 8px 32px rgba(99,102,241,0.08)'; }}
            >
              <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
                {Array(t.rating).fill(0).map((_, i) => <Star key={i} size={14} fill="#f59e0b" color="#f59e0b" />)}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 40, height: 40, borderRadius: '50%', background: t.bg, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '0.75rem', fontWeight: 700, boxShadow: `0 4px 12px ${t.bg}60` }}>
                  {t.avatar}
                </div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.875rem', color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── CTA ────────────────────────────────────────────────── */}
      <section style={{
        position: 'relative', zIndex: 1, margin: '0 40px 80px',
        background: 'linear-gradient(135deg, #6366f1, #8b5cf6 50%, #06b6d4)',
        borderRadius: 32, padding: '80px 64px', textAlign: 'center', overflow: 'hidden',
        boxShadow: '0 32px 80px rgba(99,102,241,0.35)'
      }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 30% 50%, rgba(255,255,255,0.1), transparent 60%), radial-gradient(ellipse at 70% 50%, rgba(255,255,255,0.08), transparent 60%)', pointerEvents: 'none' }} />
        <div style={{ position: 'relative', zIndex: 1 }}>
          <h2 style={{ fontSize: '3rem', fontWeight: 900, color: 'white', marginBottom: 16, letterSpacing: '-0.03em' }}>
            Ready to Transform Your School?
          </h2>
          <p style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem', marginBottom: 40, maxWidth: 520, margin: '0 auto 40px' }}>
            Join 500+ schools already using EduVerse. Start your 30-day free trial today.
          </p>
          <div style={{ display: 'flex', gap: 14, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/dashboard" style={{
              background: 'white', color: '#6366f1', padding: '14px 32px',
              borderRadius: 14, fontWeight: 700, fontSize: '1rem',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              boxShadow: '0 8px 24px rgba(0,0,0,0.15)', transition: 'all 0.2s ease'
            }}>
              <Sparkles size={18} /> Start Free Trial
            </Link>
            <a href="#" style={{
              background: 'rgba(255,255,255,0.15)', color: 'white', padding: '14px 32px',
              borderRadius: 14, fontWeight: 600, fontSize: '1rem',
              textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 8,
              border: '1px solid rgba(255,255,255,0.3)', backdropFilter: 'blur(12px)'
            }}>
              Schedule Demo <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer style={{ position: 'relative', zIndex: 1, borderTop: '1px solid rgba(99,102,241,0.1)', padding: '40px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.825rem' }}>
        <div style={{ marginBottom: 8, fontWeight: 600, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', fontSize: '1.1rem' }}>EduVerse</div>
        © 2026 EduVerse Inc. Built for the future of education.
      </footer>

      <style>{`
        @keyframes float-card {
          from { transform: translateY(0) rotate(var(--r, -8deg)); }
          to   { transform: translateY(-12px) rotate(var(--r, -8deg)); }
        }
        @keyframes gradient-shift {
          0%, 100% { background-position: 0% 50%; }
          50%       { background-position: 100% 50%; }
        }
        @keyframes aurora-drift {
          0%   { transform: scale(1) rotate(0deg); }
          50%  { transform: scale(1.05) rotate(1deg); }
          100% { transform: scale(1.02) rotate(-0.5deg); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.4; }
        }
      `}</style>
    </div>
  );
}
