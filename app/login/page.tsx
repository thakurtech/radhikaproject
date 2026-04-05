'use client';

import Link from 'next/link';
import { useState } from 'react';
import { School, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, Users, BookOpen, Shield } from 'lucide-react';

export default function LoginPage() {
  const [showPwd, setShowPwd] = useState(false);
  const [role, setRole] = useState('admin');

  const roles = [
    { id: 'admin', label: 'Admin', icon: Shield },
    { id: 'teacher', label: 'Teacher', icon: Users },
    { id: 'student', label: 'Student', icon: GraduationCap },
    { id: 'parent', label: 'Parent', icon: BookOpen },
  ];

  return (
    <div className="auth-page">
      {/* LEFT */}
      <div className="auth-left">
        <div className="auth-left-content">
          <div style={{ marginBottom: 40 }}>
            <div className="sidebar-logo-icon" style={{ width: 56, height: 56, margin: '0 auto 16px' }}>
              <School size={28} color="white" />
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: 'white', letterSpacing: '-0.02em', marginBottom: 8 }}>EduVerse</div>
            <div style={{ fontSize: '0.9rem', color: 'rgba(255,255,255,0.7)', lineHeight: 1.6 }}>
              The most advanced AI-powered<br />School ERP platform
            </div>
          </div>

          {[
            { icon: Sparkles, text: 'AI-powered insights and analytics' },
            { icon: GraduationCap, text: 'Complete student lifecycle management' },
            { icon: Users, text: 'Multi-role access for all stakeholders' },
            { icon: BookOpen, text: 'Integrated ERP for all school functions' },
          ].map(item => (
            <div key={item.text} className="flex items-center gap-3" style={{ marginBottom: 14 }}>
              <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <item.icon size={16} color="white" />
              </div>
              <span style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.85)' }}>{item.text}</span>
            </div>
          ))}

          <div style={{ marginTop: 48, padding: '20px', background: 'rgba(255,255,255,0.1)', borderRadius: 'var(--radius-xl)', backdropFilter: 'blur(10px)' }}>
            <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.825rem', lineHeight: 1.7 }}>
              "EduVerse completely transformed our school's operations. What used to take hours now takes minutes with AI."
            </div>
            <div style={{ marginTop: 12, display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{ width: 32, height: 32, borderRadius: '50%', background: 'rgba(255,255,255,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>PS</div>
              <div>
                <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white' }}>Dr. Priya Sharma</div>
                <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.6)' }}>Principal, DPS Noida</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* RIGHT */}
      <div className="auth-right">
        <div className="auth-form-container">
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}>
              <School size={18} color="white" />
            </div>
            <span className="sidebar-logo-text">EduVerse</span>
          </div>

          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your school's ERP dashboard</p>

          {/* Role Selector */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 8, marginBottom: 24 }}>
            {roles.map(r => (
              <button key={r.id} onClick={() => setRole(r.id)} style={{
                padding: '10px 8px',
                borderRadius: 'var(--radius-sm)',
                border: `2px solid ${role === r.id ? 'var(--primary)' : 'var(--border)'}`,
                background: role === r.id ? 'var(--primary-subtle)' : 'transparent',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4
              }}>
                <r.icon size={16} color={role === r.id ? 'var(--primary)' : 'var(--text-muted)'} />
                <span style={{ fontSize: '0.7rem', fontWeight: 600, color: role === r.id ? 'var(--primary)' : 'var(--text-muted)' }}>{r.label}</span>
              </button>
            ))}
          </div>

          <div className="form-group mb-4">
            <label className="form-label">Email Address</label>
            <input className="form-input" type="email" placeholder="admin@school.edu" defaultValue="admin@springfield.edu" />
          </div>

          <div className="form-group mb-5">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <a href="#" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</a>
            </label>
            <div style={{ position: 'relative' }}>
              <input className="form-input" type={showPwd ? 'text' : 'password'} placeholder="••••••••" defaultValue="password123" style={{ paddingRight: 44 }} />
              <button onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <Link href="/dashboard" className="btn btn-primary w-full btn-lg" style={{ justifyContent: 'center', marginBottom: 16 }}>
            Sign In <ArrowRight size={18} />
          </Link>

          <div style={{ textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
            Don't have an account?{' '}
            <Link href="/signup" style={{ color: 'var(--primary)', fontWeight: 600 }}>Contact us</Link>
          </div>

          <div className="divider" />

          <div style={{
            padding: '14px 16px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Demo Credentials</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              📧 admin@springfield.edu<br />
              🔑 password123
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
