'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { School, Eye, EyeOff, ArrowRight, Sparkles, GraduationCap, Users, BookOpen, Shield, LoaderCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [showPwd, setShowPwd] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || 'Login failed');
      }

      router.push('/dashboard');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        <form className="auth-form-container" onSubmit={handleLogin}>
          <div style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 10 }}>
            <div className="sidebar-logo-icon" style={{ width: 36, height: 36 }}>
              <School size={18} color="white" />
            </div>
            <span className="sidebar-logo-text">EduVerse</span>
          </div>

          <h1 className="auth-form-title">Welcome back</h1>
          <p className="auth-form-subtitle">Sign in to your school's ERP dashboard</p>

          {error && (
            <div style={{ 
              background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)',
              padding: '12px 16px', borderRadius: 'var(--radius-md)', fontSize: '0.85rem', marginBottom: 20
            }}>
              {error}
            </div>
          )}

          <div className="form-group mb-4">
            <label className="form-label">Email Address</label>
            <input 
              className="form-input" 
              type="email" 
              placeholder="admin@sunderdeep.edu" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              autoFocus
            />
          </div>

          <div className="form-group mb-5">
            <label className="form-label" style={{ display: 'flex', justifyContent: 'space-between' }}>
              Password
              <a href="#" style={{ fontSize: '0.78rem', color: 'var(--primary)', fontWeight: 500 }}>Forgot password?</a>
            </label>
            <div style={{ position: 'relative' }}>
              <input 
                className="form-input" 
                type={showPwd ? 'text' : 'password'} 
                placeholder="••••••••" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                style={{ paddingRight: 44 }} 
              />
              <button type="button" onClick={() => setShowPwd(!showPwd)} style={{
                position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer'
              }}>
                {showPwd ? <EyeOff size={16} /> : <Eye size={16} />}
              </button>
            </div>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary w-full btn-lg" style={{ justifyContent: 'center', marginBottom: 16 }}>
            {loading ? <LoaderCircle className="animate-spin" size={18} /> : <>Sign In <ArrowRight size={18} /></>}
          </button>

          <div className="divider" />

          <div style={{
            padding: '14px 16px',
            background: 'var(--bg-subtle)',
            borderRadius: 'var(--radius-md)',
            border: '1px solid var(--border)'
          }}>
            <div style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 6 }}>Sunderdeep Demo Accounts</div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', lineHeight: 1.8 }}>
              Admin: <b>admin@sunderdeep.edu</b> / Admin@123<br />
              Teacher: <b>rahul.sharma@sunderdeep.edu</b> / Teacher@123<br />
              Student: <b>arjun.btech@sunderdeep.edu</b> / Student@123
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
