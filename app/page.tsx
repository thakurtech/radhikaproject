'use client';

import Link from 'next/link';
import {
  School, Sparkles, ArrowRight, CheckCircle2, Users, GraduationCap,
  BarChart3, DollarSign, MessageSquare, ClipboardCheck, Bus, Library,
  Shield, Zap, Globe, Star, ChevronRight, Bot
} from 'lucide-react';

const features = [
  {
    icon: GraduationCap,
    color: 'var(--primary)',
    bgColor: 'rgba(99,102,241,0.1)',
    title: 'Student Management',
    desc: 'Complete student lifecycle management from enrollment to graduation with AI-powered insights.'
  },
  {
    icon: ClipboardCheck,
    color: 'var(--accent-emerald)',
    bgColor: 'rgba(16,185,129,0.1)',
    title: 'Smart Attendance',
    desc: 'Real-time attendance tracking with AI anomaly detection and automated parent notifications.'
  },
  {
    icon: BarChart3,
    color: 'var(--accent-violet)',
    bgColor: 'rgba(139,92,246,0.1)',
    title: 'AI Grade Analytics',
    desc: 'Intelligent grade prediction, performance analytics, and personalized learning recommendations.'
  },
  {
    icon: DollarSign,
    color: 'var(--accent-amber)',
    bgColor: 'rgba(245,158,11,0.1)',
    title: 'Finance & Fees',
    desc: 'Automated fee management, invoice generation, and real-time payment tracking dashboard.'
  },
  {
    icon: MessageSquare,
    color: 'var(--accent-cyan)',
    bgColor: 'rgba(6,182,212,0.1)',
    title: 'Communication Hub',
    desc: 'Unified messaging for parents, teachers, and students with bulk notifications and alerts.'
  },
  {
    icon: Bot,
    color: 'var(--accent-rose)',
    bgColor: 'rgba(244,63,94,0.1)',
    title: 'EduAI Chatbot',
    desc: 'Powerful AI assistant for instant answers, report generation, and data-driven decisions.'
  },
  {
    icon: Bus,
    color: 'var(--accent-orange)',
    bgColor: 'rgba(249,115,22,0.1)',
    title: 'Transport & GPS',
    desc: 'Live bus tracking, route management, and student transport safety monitoring.'
  },
  {
    icon: Library,
    color: 'var(--primary)',
    bgColor: 'rgba(99,102,241,0.1)',
    title: 'Library System',
    desc: 'Digital catalog management, borrowing system, and e-resource access for students.'
  },
  {
    icon: Shield,
    color: 'var(--accent-emerald)',
    bgColor: 'rgba(16,185,129,0.1)',
    title: 'Secure & Compliant',
    desc: 'Bank-grade security with role-based access control and full audit trail compliance.'
  },
];

const pricingPlans = [
  {
    name: 'Starter',
    price: '₹4,999',
    period: '/month',
    description: 'Perfect for small schools',
    features: [
      'Up to 500 students',
      'Basic ERP modules',
      'Attendance & Grades',
      'Email support',
      '5 admin accounts',
      'Basic analytics',
    ],
    featured: false,
    cta: 'Get Started'
  },
  {
    name: 'Professional',
    price: '₹12,999',
    period: '/month',
    description: 'For growing institutions',
    features: [
      'Up to 2,500 students',
      'All ERP modules',
      'AI Assistant included',
      'Priority support 24/7',
      'Unlimited admin accounts',
      'Advanced AI analytics',
    ],
    featured: true,
    cta: 'Start Free Trial'
  },
  {
    name: 'Enterprise',
    price: 'Custom',
    period: '',
    description: 'For large universities',
    features: [
      'Unlimited students',
      'Custom integrations',
      'Dedicated AI training',
      'SLA guarantee',
      'On-premise option',
      'White-label solution',
    ],
    featured: false,
    cta: 'Contact Sales'
  }
];

const testimonials = [
  {
    name: 'Dr. Priya Sharma',
    role: 'Principal, DPS Noida',
    text: 'EduVerse transformed our school operations. Attendance tracking alone saves us 2 hours daily.',
    rating: 5
  },
  {
    name: 'Rajesh Kumar',
    role: 'Director, Wisdom Academy',
    text: 'The AI chatbot is incredible. Parents love getting instant answers at any time of day.',
    rating: 5
  },
  {
    name: 'Anita Patel',
    role: 'Admin, St. Mary\'s College',
    text: 'Fee collection jumped 40% after switching to EduVerse\'s automated reminder system.',
    rating: 5
  }
];

export default function LandingPage() {
  return (
    <div className="landing-page">
      {/* NAV */}
      <nav className="landing-nav">
        <div className="landing-nav-logo">
          <div className="sidebar-logo-icon" style={{ width: 34, height: 34 }}>
            <School size={18} color="white" />
          </div>
          <span className="sidebar-logo-text" style={{ fontSize: '1.15rem' }}>EduVerse</span>
        </div>
        <div className="landing-nav-links">
          <a href="#features" className="landing-nav-link">Features</a>
          <a href="#pricing" className="landing-nav-link">Pricing</a>
          <a href="#testimonials" className="landing-nav-link">Testimonials</a>
          <Link href="/dashboard" className="landing-nav-link">Demo</Link>
        </div>
        <div className="flex items-center gap-2" style={{ marginLeft: 'auto' }}>
          <Link href="/login" className="btn btn-ghost btn-sm">Sign In</Link>
          <Link href="/dashboard" className="btn btn-primary btn-sm">
            Start Free Trial <ArrowRight size={14} />
          </Link>
        </div>
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <div className="hero-badge">
          <Sparkles size={13} />
          Powered by Advanced AI · Trusted by 500+ Schools
        </div>
        <h1 className="hero-title">
          The Future of<br />
          <span>School Management</span><br />
          is Here
        </h1>
        <p className="hero-subtitle">
          EduVerse is the all-in-one AI-powered ERP for schools and colleges.
          Manage everything from admissions to alumni — smarter, faster, and beautifully.
        </p>
        <div className="hero-cta-group">
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            <Sparkles size={18} />
            Explore Dashboard
          </Link>
          <Link href="/login" className="btn btn-secondary btn-lg">
            Get a Demo <ArrowRight size={16} />
          </Link>
        </div>

        <div className="hero-stats">
          {[
            { value: '500+', label: 'Schools Onboarded' },
            { value: '2.4M+', label: 'Students Managed' },
            { value: '99.9%', label: 'Uptime SLA' },
            { value: '4.9★', label: 'Customer Rating' },
          ].map(stat => (
            <div key={stat.label} style={{ textAlign: 'center' }}>
              <div className="hero-stat-value">{stat.value}</div>
              <div className="hero-stat-label">{stat.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURES */}
      <section className="features-section" id="features">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Everything You Need</div>
          <h2 className="section-title">One Platform.<br />Complete Control.</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            From daily attendance to annual reports — EduVerse covers every aspect
            of institutional management with AI at its core.
          </p>
        </div>
        <div className="features-grid">
          {features.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="feature-icon" style={{ background: f.bgColor, color: f.color }}>
                <f.icon size={24} />
              </div>
              <h3 className="feature-title">{f.title}</h3>
              <p className="feature-desc">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* AI HIGHLIGHT */}
      <section style={{
        padding: '80px',
        background: 'linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{
          position: 'absolute', top: '-100px', right: '-100px',
          width: 500, height: 500, borderRadius: '50%',
          background: 'radial-gradient(circle, rgba(139,92,246,0.3) 0%, transparent 70%)'
        }} />
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 700 }}>
          <div className="section-label" style={{ color: '#a5b4fc' }}>Powered by AI</div>
          <h2 className="section-title" style={{ color: 'white' }}>
            Meet EduAI —<br />Your School's Smart Assistant
          </h2>
          <p className="section-subtitle" style={{ color: 'rgba(255,255,255,0.7)', marginBottom: 32 }}>
            Ask anything. Get instant insights. EduAI understands your school's context and delivers
            actionable intelligence — from predicting dropouts to optimizing class schedules.
          </p>
          {[
            'Instant answers to school-related queries',
            'AI-generated reports and analytics',
            'Proactive alerts for attendance and performance issues',
            'Natural language data queries — no SQL needed',
          ].map(item => (
            <div key={item} className="flex items-center gap-2" style={{ marginBottom: 10 }}>
              <CheckCircle2 size={16} color="#86efac" />
              <span style={{ color: 'rgba(255,255,255,0.85)', fontSize: '0.875rem' }}>{item}</span>
            </div>
          ))}
          <div style={{ marginTop: 32 }}>
            <Link href="/ai-assistant" className="btn btn-lg" style={{
              background: 'white',
              color: 'var(--primary)',
              fontWeight: 700
            }}>
              <Bot size={18} />
              Try EduAI Free
            </Link>
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section className="pricing-section" id="pricing">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Simple Pricing</div>
          <h2 className="section-title">Invest in Your School's Future</h2>
          <p className="section-subtitle" style={{ margin: '0 auto' }}>
            Transparent pricing with no hidden fees. Scale as you grow.
          </p>
        </div>
        <div className="pricing-grid">
          {pricingPlans.map((plan) => (
            <div key={plan.name} className={`pricing-card ${plan.featured ? 'featured' : ''}`}>
              {plan.featured && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#fbbf24', color: '#1c1917', fontSize: '0.7rem',
                  fontWeight: 800, padding: '4px 14px', borderRadius: 'var(--radius-full)',
                  letterSpacing: '0.06em', textTransform: 'uppercase', whiteSpace: 'nowrap'
                }}>
                  ⭐ Most Popular
                </div>
              )}
              <div className="pricing-plan-name">{plan.name}</div>
              <div className="pricing-price">
                {plan.price}
                <span style={{ fontSize: '1rem', fontWeight: 400 }}>{plan.period}</span>
              </div>
              <div className="pricing-period">{plan.description}</div>
              <ul className="pricing-features">
                {plan.features.map(feature => (
                  <li key={feature} className="pricing-feature-item">
                    <CheckCircle2 size={15} style={{ flexShrink: 0, color: plan.featured ? 'rgba(255,255,255,0.8)' : 'var(--success)' }} />
                    {feature}
                  </li>
                ))}
              </ul>
              <Link href="/dashboard" className={`btn w-full btn-lg ${plan.featured ? '' : 'btn-primary'}`}
                style={plan.featured ? { background: 'white', color: 'var(--primary)', fontWeight: 700 } : {}}
              >
                {plan.cta} <ArrowRight size={16} />
              </Link>
            </div>
          ))}
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section style={{ padding: '80px', background: 'var(--bg-base)' }} id="testimonials">
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <div className="section-label">Testimonials</div>
          <h2 className="section-title">Loved by Educators Everywhere</h2>
        </div>
        <div className="grid-3">
          {testimonials.map((t) => (
            <div key={t.name} className="card card-body">
              <div className="flex items-center gap-1 mb-3">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} size={14} fill="var(--accent-amber)" color="var(--accent-amber)" />
                ))}
              </div>
              <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
                "{t.text}"
              </p>
              <div className="flex items-center gap-3">
                <div className="user-avatar" style={{
                  width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: 'white', fontSize: '0.75rem', fontWeight: 700, flexShrink: 0
                }}>
                  {t.name[0]}
                </div>
                <div>
                  <div style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)' }}>{t.name}</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{t.role}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{
        padding: '100px 80px',
        background: 'var(--bg-elevated)',
        textAlign: 'center'
      }}>
        <div className="hero-badge" style={{ margin: '0 auto 24px' }}>
          <Zap size={13} />
          Ready to transform your school?
        </div>
        <h2 className="hero-title" style={{ marginBottom: 20 }}>
          Start Your <span>Free Trial</span> Today
        </h2>
        <p className="hero-subtitle" style={{ margin: '0 auto 36px' }}>
          No credit card required. Full access for 30 days.
          Join 500+ institutions already using EduVerse.
        </p>
        <div className="hero-cta-group">
          <Link href="/dashboard" className="btn btn-primary btn-lg">
            <School size={18} />
            Start For Free
          </Link>
          <span style={{ fontSize: '0.875rem', color: 'var(--text-muted)' }}>No credit card required</span>
        </div>
      </section>

      {/* FOOTER */}
      <footer style={{
        padding: '40px 80px',
        background: 'var(--bg-base)',
        borderTop: '1px solid var(--border)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}>
        <div className="flex items-center gap-2">
          <div className="sidebar-logo-icon" style={{ width: 28, height: 28 }}>
            <School size={14} color="white" />
          </div>
          <span style={{ fontWeight: 800, background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            EduVerse
          </span>
        </div>
        <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          © 2026 EduVerse Technologies. All rights reserved.
        </span>
        <div className="flex items-center gap-4" style={{ fontSize: '0.8rem' }}>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Privacy</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Terms</a>
          <a href="#" style={{ color: 'var(--text-muted)' }}>Contact</a>
        </div>
      </footer>
    </div>
  );
}
