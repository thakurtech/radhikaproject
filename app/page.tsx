'use client';

import Link from 'next/link';
import { useState, useEffect, useRef, useCallback } from 'react';
import {
  Sparkles, ArrowRight, GraduationCap, ClipboardCheck, BarChart3,
  DollarSign, MessageSquare, Shield, Zap, Globe, Check, Star,
  BookOpen, Bus, ChevronRight, TrendingUp, Menu, X, Bot, Users
} from 'lucide-react';

/* ── Animated counter ────────────────────────────────── */
function useCounter(end: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    if (!start) return;
    let startTime: number;
    const step = (ts: number) => {
      if (!startTime) startTime = ts;
      const p = Math.min((ts - startTime) / duration, 1);
      setCount(Math.floor((1 - Math.pow(1 - p, 3)) * end));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [start, end, duration]);
  return count;
}

/* ── Intersection observer for scroll animations ─────── */
function useInView(threshold = 0.15) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setInView(true); }, { threshold });
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

/* ── 3D Tilt Card ────────────────────────────────────── */
function TiltCard({ children, className, style }: { children: React.ReactNode; className?: string; style?: React.CSSProperties }) {
  const cardRef = useRef<HTMLDivElement>(null);

  const handleMove = (e: React.MouseEvent) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    el.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale3d(1.03,1.03,1.03)`;
  };

  const handleLeave = () => {
    if (cardRef.current) cardRef.current.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale3d(1,1,1)';
  };

  return (
    <div ref={cardRef} className={className} style={{ ...style, transition: 'transform 0.4s cubic-bezier(0.03,0.98,0.52,0.99)' }}
      onMouseMove={handleMove} onMouseLeave={handleLeave}
    >
      {children}
    </div>
  );
}

/* ── DATA ────────────────────────────────────────────── */
const FEATURES = [
  { icon: GraduationCap, title: 'Smart Student Profiles', desc: 'AI-enriched profiles tracking academic journey, attendance, behaviour, and growth trajectories in real time.', color: '#818cf8' },
  { icon: ClipboardCheck, title: 'Instant Attendance', desc: 'One-click daily marking with automated parent alerts, trend analytics, and predictive absence detection.', color: '#34d399' },
  { icon: BarChart3, title: 'AI Grade Analytics', desc: 'Real-time performance dashboards with radar charts, predictive scoring, and personalised improvement plans.', color: '#a78bfa' },
  { icon: DollarSign, title: 'Fee Management', desc: 'Automated invoicing, payment tracking, bulk reminders, and revenue analytics in one unified dashboard.', color: '#fbbf24' },
  { icon: MessageSquare, title: 'Communication Hub', desc: 'Real-time parent-teacher chat, bulk SMS, email blasts, and announcement boards with delivery receipts.', color: '#22d3ee' },
  { icon: Bot, title: 'EduAI Assistant', desc: 'Ask anything — student data, fee status, attendance trends. Powered by advanced LLM with school context.', color: '#f472b6' },
];

const TESTIMONIALS = [
  { name: 'Dr. Priya Sharma', role: 'Principal, DPS Noida', text: 'EduVerse transformed our school. The AI assistant saves us 3 hours every day. Reports that took a week are ready in seconds.', avatar: 'PS', gradient: 'linear-gradient(135deg, #818cf8, #6366f1)' },
  { name: 'Rakesh Verma', role: 'Admin, Ryan International', text: 'The UI is stunning — our teachers actually enjoy using it. Fee collection improved 23% in the first month.', avatar: 'RV', gradient: 'linear-gradient(135deg, #a78bfa, #8b5cf6)' },
  { name: 'Sunita Menon', role: 'Director, Orchids Schools', text: 'We manage 8 branches from one dashboard. The analytics are incredibly detailed and the AI insights are spot-on.', avatar: 'SM', gradient: 'linear-gradient(135deg, #34d399, #10b981)' },
];

const PRICING = [
  { name: 'Starter', price: 4999, desc: 'Perfect for small schools', features: ['Up to 500 students', 'Core ERP modules', 'Basic analytics', 'Email support', '5GB storage'], highlight: false },
  { name: 'Professional', price: 12999, desc: 'Most popular for growing schools', features: ['Up to 2,500 students', 'All ERP modules', 'AI Assistant (EduAI)', 'Advanced analytics', 'Priority support', '50GB storage', 'Custom branding'], highlight: true },
  { name: 'Enterprise', price: null, desc: 'For large institutions & chains', features: ['Unlimited students', 'Multi-campus management', 'Custom AI training', 'Dedicated manager', 'SLA guarantee', 'API access'], highlight: false },
];

/* ── MAIN COMPONENT ──────────────────────────────────── */
export default function LandingPage() {
  const [countersStarted, setCountersStarted] = useState(false);
  const [mobileNav, setMobileNav] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => { setTimeout(() => setCountersStarted(true), 600); }, []);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    setMousePos({ x: (e.clientX / window.innerWidth - 0.5) * 2, y: (e.clientY / window.innerHeight - 0.5) * 2 });
  }, []);

  const schools = useCounter(500, 2200, countersStarted);
  const students = useCounter(250000, 2500, countersStarted);
  const satisfaction = useCounter(98, 1800, countersStarted);

  const featuresView = useInView();
  const pricingView = useInView();
  const testimonialsView = useInView();
  const aiView = useInView();

  return (
    <div className="lp" onMouseMove={handleMouseMove}>

      {/* ── ANIMATED BACKGROUND ──────────────────────────── */}
      <div className="lp-bg">
        <svg className="lp-noise" xmlns="http://www.w3.org/2000/svg">
          <filter id="noiseFilter">
            <feTurbulence type="fractalNoise" baseFrequency="0.65" numOctaves="3" stitchTiles="stitch" />
          </filter>
          <rect width="100%" height="100%" filter="url(#noiseFilter)" />
        </svg>
        <div className="lp-orb lp-orb-1" style={{ transform: `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)` }} />
        <div className="lp-orb lp-orb-2" style={{ transform: `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)` }} />
        <div className="lp-orb lp-orb-3" style={{ transform: `translate(${mousePos.x * 12}px, ${mousePos.y * 12}px)` }} />
        <div className="lp-orb lp-orb-4" style={{ transform: `translate(${mousePos.x * -10}px, ${mousePos.y * 15}px)` }} />
        <div className="lp-orb lp-orb-5" style={{ transform: `translate(${mousePos.x * 15}px, ${mousePos.y * -10}px)` }} />
        <div className="lp-grid-overlay" />
        <div className="lp-stars">
          {Array.from({ length: 60 }).map((_, i) => (
            <div key={i} className="lp-star" style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
              animationDuration: `${3 + Math.random() * 5}s`,
              width: `${1 + Math.random() * 2}px`,
              height: `${1 + Math.random() * 2}px`,
              boxShadow: `0 0 ${4 + Math.random() * 6}px ${Math.random() > 0.5 ? '#c4b5fd' : '#93c5fd'}`,
            }} />
          ))}
        </div>
        <div className="lp-aurora" />
      </div>

      {/* ── NAVBAR ───────────────────────────────────────── */}
      <nav className="lp-nav">
        <div className="lp-nav-pill">
          <div className="lp-nav-inner">
            <div className="lp-logo">
              <div className="lp-logo-icon">
                <Globe size={18} className="lp-logo-globe" />
                <Sparkles size={8} className="lp-logo-sparkles" />
              </div>
              <span className="lp-logo-text">EduVerse</span>
            </div>

            <div className="lp-nav-links">
              {['Features', 'Pricing', 'Testimonials'].map(item => (
                <a key={item} href={`#${item.toLowerCase()}`} className="lp-nav-link">{item}</a>
              ))}
            </div>

            <div className="lp-nav-actions">
              <Link href="/login" className="lp-nav-link lp-nav-signin">Sign In</Link>
              <Link href="/login" className="lp-btn lp-btn-primary lp-btn-sm">
                Get Started <ArrowRight size={14} />
              </Link>
            </div>

            <button className="lp-mobile-toggle" onClick={() => setMobileNav(!mobileNav)}>
              {mobileNav ? <X size={22} /> : <Menu size={22} />}
            </button>
          </div>
        </div>

        {mobileNav && (
          <div className="lp-mobile-menu">
            {['Features', 'Pricing', 'Testimonials'].map(item => (
              <a key={item} href={`#${item.toLowerCase()}`} className="lp-mobile-link" onClick={() => setMobileNav(false)}>{item}</a>
            ))}
            <Link href="/login" className="lp-mobile-link" onClick={() => setMobileNav(false)}>Sign In</Link>
            <Link href="/login" className="lp-btn lp-btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={() => setMobileNav(false)}>Start Free Trial</Link>
          </div>
        )}
      </nav>

      {/* ── HERO ────────────────────────────────────────── */}
      <section className="lp-hero">
        <div className="lp-hero-content" style={{ transform: `translate(${mousePos.x * -6}px, ${mousePos.y * -6}px)` }}>
          <div className="lp-badge">
            <div className="lp-badge-dot" />
            Powered by AI · Trusted by {schools}+ Schools
          </div>

          <h1 className="lp-hero-h1">
            <span className="lp-hero-line">The Future of</span>
            <span className="lp-hero-gradient">School Management</span>
            <span className="lp-hero-line">is Here.</span>
          </h1>

          <p className="lp-hero-sub">
            EduVerse is the all-in-one AI-powered ERP for schools and colleges.
            Manage everything from admissions to alumni — smarter, faster, and beautifully.
          </p>

          <div className="lp-hero-ctas">
            <Link href="/login" className="lp-btn lp-btn-primary lp-btn-lg">
              <Sparkles size={18} /> Explore Dashboard
            </Link>
            <a href="#features" className="lp-btn lp-btn-ghost lp-btn-lg">
              See Features <ArrowRight size={16} />
            </a>
          </div>
        </div>

        {/* Floating 3D Cards */}
        <div className="lp-hero-cards">
          {[
            { icon: GraduationCap, label: 'Students', value: '2,847', sub: '+124 today', color: '#818cf8', delay: '0s' },
            { icon: ClipboardCheck, label: 'Attendance', value: '86.4%', sub: 'Avg today', color: '#34d399', delay: '0.3s' },
            { icon: DollarSign, label: 'Revenue', value: '₹7.8L', sub: 'This month', color: '#fbbf24', delay: '0.6s' },
            { icon: BarChart3, label: 'Avg Score', value: '82.3%', sub: 'All classes', color: '#a78bfa', delay: '0.9s' },
          ].map((card, i) => (
            <TiltCard key={i} className={`lp-float-card lp-float-card-${i + 1}`} style={{ animationDelay: card.delay }}>
              <div className="lp-float-card-icon" style={{ color: card.color, background: `${card.color}18` }}>
                <card.icon size={16} />
              </div>
              <div className="lp-float-card-label">{card.label}</div>
              <div className="lp-float-card-value" style={{ color: card.color }}>{card.value}</div>
              <div className="lp-float-card-sub">{card.sub}</div>
            </TiltCard>
          ))}
        </div>

        {/* Stats Bar */}
        <div className="lp-stats-bar">
          {[
            { value: `${schools}+`, label: 'Schools' },
            { value: `${Math.floor(students / 1000)}K+`, label: 'Students' },
            { value: `${satisfaction}%`, label: 'Satisfaction' },
            { value: '99.9%', label: 'Uptime' },
          ].map((stat, i) => (
            <div key={stat.label} className="lp-stat-item">
              <div className="lp-stat-value">{stat.value}</div>
              <div className="lp-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ────────────────────────────────────── */}
      <section id="features" className="lp-section" ref={featuresView.ref}>
        <div className={`lp-section-inner lp-animate ${featuresView.inView ? 'lp-visible' : ''}`}>
          <div className="lp-section-header">
            <div className="lp-pill"><Zap size={13} /> Everything You Need</div>
            <h2 className="lp-section-title">All-in-One School Intelligence</h2>
            <p className="lp-section-sub">Every module you need, beautifully integrated. Powered by AI for insights you've never had before.</p>
          </div>

          <div className="lp-features-grid">
            {FEATURES.map((f, i) => (
              <TiltCard key={f.title} className="lp-feature-card" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="lp-feature-icon" style={{ color: f.color, background: `${f.color}15`, borderColor: `${f.color}30` }}>
                  <f.icon size={24} />
                </div>
                <h3 className="lp-feature-title">{f.title}</h3>
                <p className="lp-feature-desc">{f.desc}</p>
                <div className="lp-feature-link" style={{ color: f.color }}>
                  Learn more <ChevronRight size={14} />
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── AI HIGHLIGHT ────────────────────────────────── */}
      <section className="lp-section" ref={aiView.ref}>
        <div className={`lp-section-inner lp-animate ${aiView.inView ? 'lp-visible' : ''}`}>
          <div className="lp-ai-block">
            <div className="lp-ai-bg-orb lp-ai-bg-orb-1" />
            <div className="lp-ai-bg-orb lp-ai-bg-orb-2" />

            <div className="lp-ai-content">
              <div className="lp-ai-left">
                <div className="lp-pill"><Sparkles size={12} /> Powered by AI</div>
                <h2 className="lp-ai-title">
                  Meet EduAI,<br />
                  <span className="lp-gradient-text">your school brain.</span>
                </h2>
                <p className="lp-ai-desc">
                  Ask anything in plain English. Get instant answers, generate reports, send notifications, and uncover insights you'd never find manually.
                </p>
                <div className="lp-ai-prompts">
                  {["Who has attendance below 75%?", "Show fee defaulters this month", "Generate Grade 10 report cards", "Predict at-risk students"].map(q => (
                    <div key={q} className="lp-ai-prompt">
                      <div className="lp-ai-check"><Check size={12} /></div>
                      {q}
                    </div>
                  ))}
                </div>
                <Link href="/login" className="lp-btn lp-btn-primary" style={{ marginTop: 28 }}>
                  <Sparkles size={16} /> Try EduAI Free
                </Link>
              </div>

              <div className="lp-ai-right">
                <TiltCard className="lp-ai-chat">
                  <div className="lp-ai-chat-head">
                    <div className="lp-ai-chat-avatar"><Sparkles size={16} color="white" /></div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>EduAI Assistant</div>
                      <div style={{ fontSize: '0.68rem', opacity: 0.7 }}>● Online</div>
                    </div>
                  </div>
                  <div className="lp-ai-chat-body">
                    <div className="lp-chat-msg lp-chat-user">Who has attendance below 75% this month?</div>
                    <div className="lp-chat-msg lp-chat-bot">
                      Found 3 students below 75%:<br /><br />
                      1. Rohit Kumar (9A) — 65%<br />
                      2. Priya Patel (9B) — 62%<br />
                      3. Deepak Verma (8A) — 68%<br /><br />
                      ⚠️ Shall I send parent alerts?
                    </div>
                  </div>
                </TiltCard>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── PRICING ─────────────────────────────────────── */}
      <section id="pricing" className="lp-section" ref={pricingView.ref}>
        <div className={`lp-section-inner lp-animate ${pricingView.inView ? 'lp-visible' : ''}`}>
          <div className="lp-section-header">
            <h2 className="lp-section-title">Simple, Transparent Pricing</h2>
            <p className="lp-section-sub">Start free. Scale effortlessly. No surprises.</p>
          </div>

          <div className="lp-pricing-grid">
            {PRICING.map(plan => (
              <TiltCard key={plan.name} className={`lp-pricing-card ${plan.highlight ? 'lp-pricing-featured' : ''}`}>
                {plan.highlight && <div className="lp-pricing-badge">✦ Most Popular</div>}
                <div className="lp-pricing-name">{plan.name}</div>
                <div className="lp-pricing-desc">{plan.desc}</div>
                <div className="lp-pricing-price">
                  {plan.price ? (
                    <><span className="lp-pricing-amount">₹{plan.price.toLocaleString()}</span><span className="lp-pricing-period">/month</span></>
                  ) : (
                    <span className="lp-pricing-amount">Custom</span>
                  )}
                </div>
                <div className="lp-pricing-features">
                  {plan.features.map(f => (
                    <div key={f} className="lp-pricing-feature">
                      <Check size={14} color={plan.highlight ? '#818cf8' : '#34d399'} />
                      {f}
                    </div>
                  ))}
                </div>
                <Link href="/login" className={`lp-btn ${plan.highlight ? 'lp-btn-primary' : 'lp-btn-outline'}`} style={{ width: '100%', justifyContent: 'center' }}>
                  {plan.highlight ? 'Start Free Trial' : plan.price ? 'Get Started' : 'Contact Sales'}
                </Link>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ────────────────────────────────── */}
      <section id="testimonials" className="lp-section" ref={testimonialsView.ref}>
        <div className={`lp-section-inner lp-animate ${testimonialsView.inView ? 'lp-visible' : ''}`}>
          <div className="lp-section-header">
            <h2 className="lp-section-title">Loved by School Leaders</h2>
          </div>

          <div className="lp-testimonials-grid">
            {TESTIMONIALS.map(t => (
              <TiltCard key={t.name} className="lp-testimonial-card">
                <div className="lp-testimonial-stars">
                  {Array(5).fill(0).map((_, i) => <Star key={i} size={14} fill="#fbbf24" color="#fbbf24" />)}
                </div>
                <p className="lp-testimonial-text">"{t.text}"</p>
                <div className="lp-testimonial-author">
                  <div className="lp-testimonial-avatar" style={{ background: t.gradient }}>{t.avatar}</div>
                  <div>
                    <div className="lp-testimonial-name">{t.name}</div>
                    <div className="lp-testimonial-role">{t.role}</div>
                  </div>
                </div>
              </TiltCard>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ─────────────────────────────────────────── */}
      <section className="lp-cta-section">
        <div className="lp-cta-inner">
          <h2 className="lp-cta-title">Ready to Transform Your School?</h2>
          <p className="lp-cta-sub">Join 500+ schools already using EduVerse. Start your 30-day free trial today.</p>
          <div className="lp-hero-ctas">
            <Link href="/login" className="lp-btn lp-btn-white lp-btn-lg">
              <Sparkles size={18} /> Start Free Trial
            </Link>
            <a href="#" className="lp-btn lp-btn-ghost-white lp-btn-lg">
              Schedule Demo <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </section>

      {/* ── FOOTER ──────────────────────────────────────── */}
      <footer className="lp-footer">
        <div className="lp-footer-brand">EduVerse</div>
        <div className="lp-footer-copy">© 2026 EduVerse Inc. Built for the future of education.</div>
      </footer>

      <style>{`
        .lp {
          --lp-bg: #06070e;
          --lp-surface: rgba(255,255,255,0.04);
          --lp-surface-2: rgba(255,255,255,0.07);
          --lp-border: rgba(255,255,255,0.08);
          --lp-border-bright: rgba(255,255,255,0.14);
          --lp-text: #f1f5f9;
          --lp-text-2: #94a3b8;
          --lp-text-3: #64748b;
          --lp-accent: #a855f7;
          --lp-accent-2: #3b82f6;
          min-height: 100vh;
          background: var(--lp-bg);
          color: var(--lp-text);
          font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          position: relative;
          overflow-x: hidden;
        }

        /* ── Background ───────────────────────────────────── */
        .lp-bg {
          position: fixed; inset: 0; z-index: 0; pointer-events: none;
          background: 
            radial-gradient(ellipse 140% 100% at 50% -20%, rgba(124,58,237,0.3) 0%, transparent 60%),
            radial-gradient(ellipse 120% 80% at 80% 20%, rgba(37,99,235,0.2) 0%, transparent 60%),
            radial-gradient(ellipse 100% 100% at 10% 100%, rgba(236,72,153,0.15) 0%, transparent 60%),
            linear-gradient(135deg, #09090b 0%, #030712 100%);
          background-size: 150% 150%;
          animation: stripe-bg 12s ease-in-out infinite alternate;
        }
        @keyframes stripe-bg {
          0% { background-position: 0% 0%; }
          100% { background-position: 100% 100%; }
        }
        .lp-noise {
          position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0;
          pointer-events: none; mix-blend-mode: overlay; opacity: 0.2;
        }
        .lp-orb {
          position: absolute; border-radius: 50%; filter: blur(140px); opacity: 0.8;
          transition: transform 0.5s cubic-bezier(0.25, 0.46, 0.45, 0.94);
          mix-blend-mode: screen;
        }
        .lp-orb-1 {
          width: 1000px; height: 1000px; top: -30%; left: -20%;
          background: radial-gradient(circle, rgba(124,58,237,0.5), transparent 65%);
          animation: orb-drift-1 16s ease-in-out infinite alternate;
        }
        .lp-orb-2 {
          width: 800px; height: 800px; top: 10%; right: -15%;
          background: radial-gradient(circle, rgba(37,99,235,0.45), transparent 65%);
          animation: orb-drift-2 20s ease-in-out infinite alternate;
        }
        .lp-orb-3 {
          width: 900px; height: 900px; bottom: -25%; left: 15%;
          background: radial-gradient(circle, rgba(236,72,153,0.4), transparent 60%);
          animation: orb-drift-3 18s ease-in-out infinite alternate;
        }
        .lp-orb-4 {
          width: 600px; height: 600px; top: 50%; left: -10%;
          background: radial-gradient(circle, rgba(14,165,233,0.35), transparent 60%);
          animation: orb-drift-4 24s ease-in-out infinite alternate;
        }
        .lp-orb-5 {
          width: 550px; height: 550px; top: 0%; right: 20%;
          background: radial-gradient(circle, rgba(20,184,166,0.3), transparent 60%);
          animation: orb-drift-5 22s ease-in-out infinite alternate;
        }
        .lp-grid-overlay {
          position: absolute; inset: 0;
          background-image:
            linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px);
          background-size: 80px 80px;
          mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent);
          -webkit-mask-image: radial-gradient(ellipse 70% 60% at 50% 40%, black, transparent);
        }
        .lp-stars { position: absolute; inset: 0; }
        .lp-star {
          position: absolute; border-radius: 50%;
          background: white;
          animation: star-twinkle 4s ease-in-out infinite alternate;
        }
        @keyframes star-twinkle {
          0%, 100% { opacity: 0.05; transform: scale(0.6); }
          50% { opacity: 0.95; transform: scale(1.6); }
        }
        .lp-aurora {
          position: absolute; inset: 0;
          background: conic-gradient(from 180deg at 50% 50%,
            rgba(124,58,237,0.06) 0deg, rgba(37,99,235,0.04) 60deg,
            transparent 120deg, rgba(236,72,153,0.05) 200deg,
            rgba(20,184,166,0.04) 280deg, rgba(124,58,237,0.06) 360deg);
          animation: aurora-rotate 30s linear infinite;
          filter: blur(60px);
        }
        @keyframes aurora-rotate { to { transform: rotate(360deg); } }
        @keyframes orb-drift-1 { to { transform: translate(100px, 60px) scale(1.2); } }
        @keyframes orb-drift-2 { to { transform: translate(-80px, 90px) scale(0.85); } }
        @keyframes orb-drift-3 { to { transform: translate(60px, -70px) scale(1.15); } }
        @keyframes orb-drift-4 { to { transform: translate(70px, -50px) scale(1.25); } }
        @keyframes orb-drift-5 { to { transform: translate(-50px, 60px) scale(0.9); } }

        /* ── Navbar ───────────────────────────────────── */
        .lp-nav {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          padding: 14px 24px 0; display: flex; justify-content: center;
        }
        .lp-nav-pill {
          position: relative;
          background: rgba(9,9,11,0.65);
          backdrop-filter: blur(24px) saturate(200%);
          -webkit-backdrop-filter: blur(24px) saturate(200%);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 16px; padding: 0 6px;
          box-shadow: 0 4px 30px rgba(0,0,0,0.4), 0 0 0 1px rgba(168,85,247,0.1) inset, 0 0 80px -20px rgba(168,85,247,0.15);
          max-width: 1000px; width: 100%;
        }
        .lp-nav-pill::before {
          content: ''; position: absolute; inset: -1px; border-radius: 17px; z-index: -1;
          background: linear-gradient(135deg, rgba(168,85,247,0.3), rgba(59,130,246,0.15), rgba(236,72,153,0.2));
          mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          -webkit-mask: linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0);
          mask-composite: exclude; -webkit-mask-composite: xor; padding: 1px;
        }
        .lp-nav-inner {
          padding: 0 16px; height: 56px;
          display: flex; align-items: center; gap: 8px;
        }
        .lp-logo { display: flex; align-items: center; gap: 10px; flex-shrink: 0; }
        .lp-logo-icon {
          position: relative;
          width: 38px; height: 38px; border-radius: 12px;
          background: linear-gradient(135deg, rgba(168,85,247,0.25), rgba(59,130,246,0.15));
          border: 1px solid rgba(255,255,255,0.25);
          display: flex; align-items: center; justify-content: center;
          box-shadow: 0 4px 16px rgba(168,85,247,0.3), inset 0 2px 10px rgba(255,255,255,0.2);
          overflow: hidden;
        }
        .lp-logo-icon::before {
          content: ''; position: absolute; inset: 0;
          background: conic-gradient(from 0deg, transparent 0deg, rgba(255,255,255,0.4) 90deg, transparent 180deg);
          animation: logo-glow-spin 4s linear infinite;
        }
        @keyframes logo-glow-spin { 100% { transform: rotate(360deg); } }
        .lp-logo-globe { color: #e0e7ff; z-index: 1; }
        .lp-logo-sparkles { color: #fbcfe8; position: absolute; top: 6px; right: 6px; z-index: 2; animation: star-twinkle 2s infinite alternate; }
        .lp-logo-text {
          font-size: 1.15rem; font-weight: 800; letter-spacing: -0.02em;
          background: linear-gradient(135deg, #ffffff, #c4b5fd);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          text-transform: uppercase;
        }
        .lp-nav-links { display: flex; gap: 6px; margin-left: auto; margin-right: auto; }
        .lp-nav-link {
          font-size: 0.84rem; font-weight: 500; color: var(--lp-text-3);
          text-decoration: none; transition: all 0.25s ease;
          padding: 7px 14px; border-radius: 8px;
        }
        .lp-nav-link:hover { color: var(--lp-text); background: rgba(255,255,255,0.06); }
        .lp-nav-signin { color: var(--lp-text-2); }
        .lp-nav-actions { display: flex; align-items: center; gap: 4px; flex-shrink: 0; }
        .lp-mobile-toggle {
          display: none; margin-left: auto; background: none; border: none;
          color: var(--lp-text); cursor: pointer; padding: 4px;
        }
        .lp-mobile-menu {
          padding: 16px 24px 24px; display: flex; flex-direction: column; gap: 12px;
          position: fixed; top: 70px; left: 16px; right: 16px;
          background: rgba(9,9,11,0.9); backdrop-filter: blur(24px);
          -webkit-backdrop-filter: blur(24px);
          border-radius: 16px; border: 1px solid var(--lp-border);
          box-shadow: 0 16px 48px rgba(0,0,0,0.5);
        }
        .lp-mobile-link {
          font-size: 1rem; font-weight: 500; color: var(--lp-text-2);
          text-decoration: none; padding: 10px 0;
        }

        /* ── Buttons ──────────────────────────────────── */
        .lp-btn {
          display: inline-flex; align-items: center; gap: 8;
          font-weight: 600; border-radius: 12px; text-decoration: none;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          cursor: pointer; border: none; font-size: 0.9rem;
          padding: 12px 24px;
        }
        .lp-btn-sm { padding: 8px 18px; font-size: 0.85rem; border-radius: 10px; }
        .lp-btn-lg { padding: 16px 32px; font-size: 1rem; border-radius: 14px; }
        .lp-btn-primary {
          background: linear-gradient(135deg, #8b5cf6, #3b82f6);
          color: white;
          box-shadow: 0 4px 20px rgba(139,92,246,0.4), 0 0 0 1px rgba(255,255,255,0.15) inset;
        }
        .lp-btn-primary:hover {
          transform: translateY(-2px) scale(1.03);
          box-shadow: 0 8px 32px rgba(139,92,246,0.5), 0 0 0 1px rgba(255,255,255,0.2) inset;
        }
        .lp-btn-ghost {
          background: var(--lp-surface-2); color: var(--lp-text);
          border: 1px solid var(--lp-border-bright);
        }
        .lp-btn-ghost:hover { background: rgba(255,255,255,0.1); transform: translateY(-2px); }
        .lp-btn-outline {
          background: transparent; color: var(--lp-text);
          border: 1px solid var(--lp-border-bright);
        }
        .lp-btn-outline:hover { background: var(--lp-surface-2); transform: translateY(-2px); }
        .lp-btn-white {
          background: white; color: #312e81;
          box-shadow: 0 4px 20px rgba(255,255,255,0.2);
        }
        .lp-btn-white:hover { transform: translateY(-2px) scale(1.03); box-shadow: 0 8px 32px rgba(255,255,255,0.3); }
        .lp-btn-ghost-white {
          background: rgba(255,255,255,0.12); color: white;
          border: 1px solid rgba(255,255,255,0.25); backdrop-filter: blur(8px);
        }
        .lp-btn-ghost-white:hover { background: rgba(255,255,255,0.2); transform: translateY(-2px); }

        /* ── Hero ─────────────────────────────────────── */
        .lp-hero {
          position: relative; z-index: 1; min-height: 100vh;
          display: flex; flex-direction: column; align-items: center; justify-content: center;
          text-align: center; padding: 120px 24px 80px;
        }
        .lp-hero-content {
          max-width: 800px;
          transition: transform 0.6s cubic-bezier(0.25, 0.46, 0.45, 0.94);
        }
        .lp-badge {
          display: inline-flex; align-items: center; gap: 8;
          background: var(--lp-surface-2); border: 1px solid var(--lp-border-bright);
          border-radius: 100px; padding: 6px 18px; margin-bottom: 32;
          font-size: 0.82rem; font-weight: 600; color: var(--lp-accent);
        }
        .lp-badge-dot {
          width: 8px; height: 8px; border-radius: 50%;
          background: #34d399; box-shadow: 0 0 8px rgba(52,211,153,0.6);
          animation: blink 1.5s ease infinite;
        }
        @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0.3; } }

        .lp-hero-h1 {
          font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 900;
          line-height: 1.08; letter-spacing: -0.04em; margin-bottom: 28px;
        }
        .lp-hero-line { display: block; color: var(--lp-text); }
        .lp-hero-gradient {
          display: block;
          background: linear-gradient(135deg, #818cf8 0%, #c084fc 35%, #22d3ee 70%, #34d399 100%);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          background-clip: text;
          background-size: 300% 300%;
          animation: gradient-flow 6s ease infinite;
        }
        @keyframes gradient-flow {
          0%,100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }

        .lp-hero-sub {
          font-size: 1.1rem; color: var(--lp-text-2); line-height: 1.7;
          max-width: 560px; margin: 0 auto 40px;
        }
        .lp-hero-ctas { display: flex; gap: 14; justify-content: center; flex-wrap: wrap; }

        /* Floating Cards */
        .lp-hero-cards { position: absolute; inset: 0; pointer-events: none; z-index: 2; }
        .lp-float-card {
          position: absolute; pointer-events: auto;
          background: rgba(255,255,255,0.05); backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 16px; padding: 16px 20px; min-width: 150px;
          box-shadow: 0 8px 32px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.08);
          animation: float-in 1s ease forwards, float-bob 4s ease-in-out infinite alternate;
          opacity: 0;
        }
        .lp-float-card-1 { top: 18%; left: 4%; }
        .lp-float-card-2 { top: 22%; right: 4%; }
        .lp-float-card-3 { bottom: 25%; left: 5%; }
        .lp-float-card-4 { bottom: 22%; right: 4%; }
        .lp-float-card-icon { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; margin-bottom: 6px; }
        .lp-float-card-label { font-size: 0.68rem; font-weight: 600; color: var(--lp-text-3); text-transform: uppercase; letter-spacing: 0.06em; }
        .lp-float-card-value { font-size: 1.3rem; font-weight: 800; letter-spacing: -0.02em; }
        .lp-float-card-sub { font-size: 0.7rem; color: var(--lp-text-3); }

        @keyframes float-in { to { opacity: 1; } }
        @keyframes float-bob { from { transform: translateY(0); } to { transform: translateY(-10px); } }

        /* Stats Bar */
        .lp-stats-bar {
          position: absolute; bottom: 40px; left: 50%; transform: translateX(-50%);
          display: flex; gap: 0;
          background: var(--lp-surface); border: 1px solid var(--lp-border-bright);
          border-radius: 20px; padding: 6px; backdrop-filter: blur(20px);
            -webkit-backdrop-filter: blur(20px);
        }
        .lp-stat-item { padding: 14px 32px; text-align: center; }
        .lp-stat-item:not(:last-child) { border-right: 1px solid var(--lp-border); }
        .lp-stat-value {
          font-size: 1.4rem; font-weight: 900; letter-spacing: -0.03em;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-stat-label { font-size: 0.7rem; color: var(--lp-text-3); font-weight: 600; text-transform: uppercase; letter-spacing: 0.06em; }

        /* ── Sections ─────────────────────────────────── */
        .lp-section { position: relative; z-index: 1; padding: 100px 24px; }
        .lp-section-inner { max-width: 1200px; margin: 0 auto; }
        .lp-section-header { text-align: center; margin-bottom: 64px; }
        .lp-section-title { font-size: clamp(1.8rem, 4vw, 2.5rem); font-weight: 900; letter-spacing: -0.03em; margin-bottom: 12px; }
        .lp-section-sub { font-size: 1rem; color: var(--lp-text-2); max-width: 500px; margin: 0 auto; line-height: 1.7; }
        .lp-pill {
          display: inline-flex; align-items: center; gap: 6;
          background: rgba(99,102,241,0.1); border: 1px solid rgba(99,102,241,0.2);
          border-radius: 100px; padding: 5px 14px; margin-bottom: 20px;
          font-size: 0.78rem; font-weight: 600; color: var(--lp-accent);
        }
        .lp-gradient-text {
          background: linear-gradient(135deg, #818cf8, #c084fc);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }

        /* Scroll Animation (Premium scale and blur reveal) */
        .lp-animate { 
          opacity: 0; 
          transform: translateY(40px) scale(0.96); 
          filter: blur(8px);
          transition: all 1s cubic-bezier(0.16, 1, 0.3, 1); 
        }
        .lp-visible { 
          opacity: 1; 
          transform: translateY(0) scale(1); 
          filter: blur(0px);
        }

        /* ── Features ─────────────────────────────────── */
        .lp-features-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lp-feature-card {
          background: var(--lp-surface); border: 1px solid var(--lp-border);
          border-radius: 20px; padding: 28px 24px;
          transition: all 0.35s ease;
        }
        .lp-feature-card:hover {
          background: var(--lp-surface-2); border-color: var(--lp-border-bright);
          box-shadow: 0 16px 48px rgba(0,0,0,0.3);
        }
        .lp-feature-icon {
          width: 52px; height: 52px; border-radius: 14px;
          display: flex; align-items: center; justify-content: center;
          margin-bottom: 18px; border: 1px solid;
        }
        .lp-feature-title { font-weight: 700; font-size: 1rem; margin-bottom: 8px; color: var(--lp-text); }
        .lp-feature-desc { font-size: 0.875rem; color: var(--lp-text-2); line-height: 1.65; }
        .lp-feature-link {
          margin-top: 16px; display: flex; align-items: center; gap: 4;
          font-size: 0.8rem; font-weight: 600;
        }

        /* ── AI Block ─────────────────────────────────── */
        .lp-ai-block {
          position: relative; overflow: hidden;
          background: linear-gradient(135deg, rgba(99,102,241,0.08), rgba(139,92,246,0.05));
          border: 1px solid rgba(99,102,241,0.15); border-radius: 28px;
          padding: 60px 48px;
        }
        .lp-ai-bg-orb { position: absolute; border-radius: 50%; pointer-events: none; filter: blur(80px); }
        .lp-ai-bg-orb-1 { width: 350px; height: 350px; top: -100px; right: -100px; background: rgba(139,92,246,0.15); }
        .lp-ai-bg-orb-2 { width: 250px; height: 250px; bottom: -60px; left: -60px; background: rgba(20,184,166,0.1); }
        .lp-ai-content { position: relative; z-index: 1; display: flex; align-items: center; gap: 48; }
        .lp-ai-left { flex: 1; }
        .lp-ai-right { flex: 1; }
        .lp-ai-title { font-size: 2.2rem; font-weight: 900; letter-spacing: -0.03em; margin-bottom: 16px; line-height: 1.1; }
        .lp-ai-desc { font-size: 0.95rem; color: var(--lp-text-2); line-height: 1.7; margin-bottom: 24px; }
        .lp-ai-prompts { display: flex; flex-direction: column; gap: 8; }
        .lp-ai-prompt { display: flex; align-items: center; gap: 8; font-size: 0.85rem; color: var(--lp-text-2); }
        .lp-ai-check {
          width: 20px; height: 20px; border-radius: 4px;
          background: rgba(99,102,241,0.1); display: flex; align-items: center; justify-content: center;
          color: var(--lp-accent); flex-shrink: 0;
        }
        .lp-ai-chat {
          background: var(--lp-surface); border: 1px solid var(--lp-border-bright);
          border-radius: 20px; overflow: hidden;
          box-shadow: 0 24px 64px rgba(0,0,0,0.4);
        }
        .lp-ai-chat-head {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
          padding: 14px 20px; display: flex; align-items: center; gap: 10; color: white;
        }
        .lp-ai-chat-avatar {
          width: 36px; height: 36px; border-radius: 50%;
          background: rgba(255,255,255,0.2); display: flex; align-items: center; justify-content: center;
        }
        .lp-ai-chat-body { padding: 20px; display: flex; flex-direction: column; gap: 12; }
        .lp-chat-msg { padding: 12px 16px; border-radius: 14px; font-size: 0.82rem; line-height: 1.6; max-width: 85%; }
        .lp-chat-user {
          align-self: flex-end; background: linear-gradient(135deg, #6366f1, #8b5cf6);
          color: white; border-bottom-right-radius: 4px;
          box-shadow: 0 4px 12px rgba(99,102,241,0.3);
        }
        .lp-chat-bot {
          align-self: flex-start; background: var(--lp-surface-2);
          color: var(--lp-text); border-bottom-left-radius: 4px;
          border: 1px solid var(--lp-border);
        }

        /* ── Pricing ──────────────────────────────────── */
        .lp-pricing-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lp-pricing-card {
          background: var(--lp-surface); border: 1px solid var(--lp-border);
          border-radius: 24px; padding: 32px 28px; position: relative;
          transition: all 0.35s ease;
        }
        .lp-pricing-card:hover { border-color: var(--lp-border-bright); box-shadow: 0 16px 48px rgba(0,0,0,0.3); }
        .lp-pricing-featured {
          background: linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.06));
          border-color: rgba(99,102,241,0.3); transform: scale(1.02);
        }
        .lp-pricing-badge {
          position: absolute; top: -13px; left: 50%; transform: translateX(-50%);
          background: linear-gradient(135deg, #6366f1, #8b5cf6); color: white;
          padding: 4px 18px; border-radius: 100px; font-size: 0.72rem; font-weight: 700;
          white-space: nowrap; box-shadow: 0 4px 12px rgba(99,102,241,0.4);
        }
        .lp-pricing-name { font-weight: 800; font-size: 1.1rem; margin-bottom: 4px; }
        .lp-pricing-desc { font-size: 0.82rem; color: var(--lp-text-3); margin-bottom: 24px; }
        .lp-pricing-price { margin-bottom: 28px; }
        .lp-pricing-amount { font-size: 2.5rem; font-weight: 900; letter-spacing: -0.04em; }
        .lp-pricing-period { color: var(--lp-text-3); font-size: 0.875rem; }
        .lp-pricing-features { display: flex; flex-direction: column; gap: 10px; margin-bottom: 28px; }
        .lp-pricing-feature { display: flex; align-items: center; gap: 10; font-size: 0.875rem; color: var(--lp-text-2); }

        /* ── Testimonials ─────────────────────────────── */
        .lp-testimonials-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; }
        .lp-testimonial-card {
          background: var(--lp-surface); border: 1px solid var(--lp-border);
          border-radius: 20px; padding: 28px;
          transition: all 0.35s ease;
        }
        .lp-testimonial-card:hover { border-color: var(--lp-border-bright); box-shadow: 0 16px 48px rgba(0,0,0,0.3); }
        .lp-testimonial-stars { display: flex; gap: 4; margin-bottom: 16px; }
        .lp-testimonial-text { font-size: 0.9rem; color: var(--lp-text-2); line-height: 1.7; margin-bottom: 20px; font-style: italic; }
        .lp-testimonial-author { display: flex; align-items: center; gap: 12; }
        .lp-testimonial-avatar {
          width: 40px; height: 40px; border-radius: 50%;
          display: flex; align-items: center; justify-content: center;
          color: white; font-size: 0.75rem; font-weight: 700;
        }
        .lp-testimonial-name { font-weight: 700; font-size: 0.875rem; }
        .lp-testimonial-role { font-size: 0.72rem; color: var(--lp-text-3); }

        /* ── CTA ──────────────────────────────────────── */
        .lp-cta-section {
          position: relative; z-index: 1; margin: 0 24px 80px;
          background: linear-gradient(135deg, #312e81, #6366f1 50%, #0d9488);
          border-radius: 28px; padding: 80px 48px; text-align: center; overflow: hidden;
          box-shadow: 0 32px 80px rgba(99,102,241,0.3);
        }
        .lp-cta-inner { position: relative; z-index: 1; }
        .lp-cta-title { font-size: clamp(1.8rem, 4vw, 2.8rem); font-weight: 900; margin-bottom: 16px; letter-spacing: -0.03em; }
        .lp-cta-sub { color: rgba(255,255,255,0.75); font-size: 1.05rem; margin-bottom: 36px; max-width: 520px; margin-left: auto; margin-right: auto; }

        /* ── Footer ───────────────────────────────────── */
        .lp-footer {
          position: relative; z-index: 1;
          border-top: 1px solid var(--lp-border);
          padding: 40px 24px; text-align: center;
        }
        .lp-footer-brand {
          font-weight: 800; font-size: 1.1rem; margin-bottom: 8px;
          background: linear-gradient(135deg, #818cf8, #a78bfa);
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
        }
        .lp-footer-copy { font-size: 0.825rem; color: var(--lp-text-3); }

        /* ══════════════════════════════════════════════════
           RESPONSIVE
           ══════════════════════════════════════════════════ */

        @media (max-width: 1024px) {
          .lp-features-grid, .lp-pricing-grid, .lp-testimonials-grid {
            grid-template-columns: repeat(2, 1fr);
          }
          .lp-ai-content { flex-direction: column; }
          .lp-ai-block { padding: 40px 32px; }
          .lp-hero-cards { display: none; }
          .lp-stats-bar { position: relative; bottom: auto; left: auto; transform: none; margin-top: 48px; flex-wrap: wrap; justify-content: center; }
          .lp-hero { min-height: auto; padding: 120px 24px 60px; }
        }

        @media (max-width: 768px) {
          .lp-nav-links, .lp-nav-actions { display: none; }
          .lp-mobile-toggle { display: block; }
          .lp-features-grid, .lp-pricing-grid, .lp-testimonials-grid {
            grid-template-columns: 1fr;
          }
          .lp-hero-h1 { font-size: 2.2rem; }
          .lp-hero-sub { font-size: 0.95rem; }
          .lp-section { padding: 60px 16px; }
          .lp-section-title { font-size: 1.6rem; }
          .lp-stats-bar { flex-direction: column; border-radius: 16px; }
          .lp-stat-item { padding: 10px 24px; }
          .lp-stat-item:not(:last-child) { border-right: none; border-bottom: 1px solid var(--lp-border); }
          .lp-ai-block { padding: 32px 20px; }
          .lp-ai-title { font-size: 1.6rem; }
          .lp-cta-section { margin: 0 16px 60px; padding: 48px 24px; border-radius: 20px; }
          .lp-cta-title { font-size: 1.5rem; }
          .lp-hero-ctas { flex-direction: column; align-items: center; }
          .lp-hero-ctas .lp-btn { width: 100%; justify-content: center; }
          .lp-pricing-featured { transform: scale(1); }
        }
      `}</style>
    </div>
  );
}
