'use client';

import { useState, useRef, useEffect } from 'react';
import {
  Sparkles, Send, Bot, User, BookOpen, GraduationCap, DollarSign,
  ClipboardCheck, BarChart3, MessageSquare, RefreshCw, Download,
  Mic, Paperclip, ChevronRight, Plus, Zap
} from 'lucide-react';

let idCounter = 10;

const INITIAL_MESSAGES = [
  {
    id: 1, role: 'bot',
    text: "👋 Hello! I'm **EduAI**, your intelligent school assistant connected to your live database.\n\nI can help you with:\n• **Student analytics** — attendance, grades, performance\n• **Fee management** — pending fees, payment status\n• **Staff info** — teacher and faculty data\n• **Attendance** — today's roll call status\n\nWhat would you like to know today?",
    time: '10:00 AM'
  }
];

const QUICK_PROMPTS = [
  { icon: ClipboardCheck, text: "How is today's attendance?", color: 'var(--accent-emerald)' },
  { icon: GraduationCap, text: "How many students do we have?", color: 'var(--primary)' },
  { icon: DollarSign, text: "Show fee collection status", color: 'var(--accent-amber)' },
  { icon: BarChart3, text: "How many teachers do we have?", color: 'var(--accent-violet)' },
  { icon: MessageSquare, text: "Hello!", color: 'var(--accent-cyan)' },
  { icon: BookOpen, text: "What's the revenue status?", color: 'var(--accent-rose)' },
];

function formatText(text: string) {
  return text
    .split('\n')
    .map((line, i) => {
      if (line.startsWith('**') && line.endsWith('**')) {
        return <div key={i} style={{ fontWeight: 700, marginBottom: 4 }}>{line.replace(/\*\*/g, '')}</div>;
      }
      if (line.startsWith('• ')) {
        return <div key={i} style={{ paddingLeft: 12, marginBottom: 2 }}>• {line.slice(2).replace(/\*\*(.*?)\*\*/g, '$1')}</div>;
      }
      if (line.match(/^\d\./)) {
        return <div key={i} style={{ paddingLeft: 12, marginBottom: 6 }}>{line.replace(/\*\*(.*?)\*\*/g, '$1')}</div>;
      }
      const formatted = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      return <div key={i} style={{ marginBottom: line ? 4 : 8 }} dangerouslySetInnerHTML={{ __html: formatted || '&nbsp;' }} />;
    });
}

export default function AIAssistantPage() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = async (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;

    const userMsg = { id: ++idCounter, role: 'user' as const, text: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: msgText })
      });

      const data = await res.json();
      const reply = data.reply || 'Sorry, I could not process that request.';

      const botMsg = {
        id: ++idCounter,
        role: 'bot' as const,
        text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg = {
        id: ++idCounter,
        role: 'bot' as const,
        text: '⚠️ Something went wrong. Please check your connection and try again.',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">EduAI Assistant</h1>
          <p className="page-subtitle">Ask anything about your school — powered by live database queries</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setMessages(INITIAL_MESSAGES)}>
            <RefreshCw size={14} /> New Chat
          </button>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 280px', gap: 20, height: 'calc(100vh - 200px)' }}>
        {/* MAIN CHAT */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
          {/* Chat header */}
          <div style={{
            padding: '16px 20px',
            background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))',
            display: 'flex', alignItems: 'center', gap: 12, flexShrink: 0
          }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(255,255,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Sparkles size={20} color="white" />
            </div>
            <div>
              <div style={{ color: 'white', fontWeight: 700, fontSize: '0.95rem' }}>EduAI Assistant</div>
              <div style={{ color: 'rgba(255,255,255,0.8)', fontSize: '0.75rem', display: 'flex', alignItems: 'center', gap: 4 }}>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#86efac', animation: 'blink 1.5s ease infinite' }} />
                Connected to live database
              </div>
            </div>
            <div style={{ marginLeft: 'auto', display: 'flex', gap: 8 }}>
              {['Students', 'Finance', 'Attendance'].map(tag => (
                <span key={tag} className="badge" style={{ background: 'rgba(255,255,255,0.2)', color: 'white', fontSize: '0.68rem' }}>{tag}</span>
              ))}
            </div>
          </div>

          {/* Messages */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px', display: 'flex', flexDirection: 'column', gap: 16 }}>
            {messages.map((msg) => (
              <div key={msg.id} className={`ai-message ${msg.role}`} style={{ display: 'flex', gap: 12, flexDirection: msg.role === 'user' ? 'row-reverse' : 'row' }}>
                <div style={{
                  width: 36, height: 36, borderRadius: '50%', flexShrink: 0,
                  background: msg.role === 'bot' ? 'linear-gradient(135deg, var(--primary), var(--accent-violet))' : 'var(--bg-subtle)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center'
                }}>
                  {msg.role === 'bot' ? <Sparkles size={16} color="white" /> : <User size={16} color="var(--text-muted)" />}
                </div>
                <div style={{ maxWidth: '78%' }}>
                  <div style={{
                    padding: '12px 16px',
                    borderRadius: 14,
                    borderBottomLeftRadius: msg.role === 'bot' ? 4 : 14,
                    borderBottomRightRadius: msg.role === 'user' ? 4 : 14,
                    background: msg.role === 'user' ? 'linear-gradient(135deg, var(--primary), var(--primary-dark))' : 'var(--bg-subtle)',
                    color: msg.role === 'user' ? 'white' : 'var(--text-primary)',
                    fontSize: '0.875rem',
                    lineHeight: 1.6,
                    border: msg.role === 'bot' ? '1px solid var(--border-subtle)' : 'none'
                  }}>
                    {formatText(msg.text)}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: 4, textAlign: msg.role === 'user' ? 'right' : 'left', paddingLeft: 4 }}>
                    {msg.time}
                  </div>
                </div>
              </div>
            ))}
            {loading && (
              <div className="ai-message bot" style={{ display: 'flex', gap: 12 }}>
                <div style={{ width: 36, height: 36, borderRadius: '50%', flexShrink: 0, background: 'linear-gradient(135deg, var(--primary), var(--accent-violet))', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Sparkles size={16} color="white" />
                </div>
                <div style={{ padding: '14px 18px', background: 'var(--bg-subtle)', borderRadius: 14, borderBottomLeftRadius: 4 }}>
                  <div className="flex items-center gap-2">
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'blink 0.8s ease infinite' }} />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'blink 0.8s 0.2s ease infinite' }} />
                    <div style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--primary)', animation: 'blink 0.8s 0.4s ease infinite' }} />
                  </div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border-subtle)', flexShrink: 0 }}>
            <div style={{ display: 'flex', gap: 10, alignItems: 'flex-end' }}>
              <div style={{ flex: 1 }}>
                <input
                  className="form-input"
                  style={{ height: 44, borderRadius: 'var(--radius-full)', paddingRight: 50 }}
                  placeholder="Ask EduAI anything about your school..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                  disabled={loading}
                />
              </div>
              <button
                className="btn btn-primary btn-icon" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }}
                onClick={() => sendMessage()} disabled={loading}
              >
                <Send size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              EduAI queries your live school database · Responses are real-time
            </div>
          </div>
        </div>

        {/* SIDEBAR */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16, overflowY: 'auto' }}>
          {/* Quick Prompts */}
          <div className="card">
            <div className="card-header"><span className="card-title">Quick Questions</span></div>
            <div className="card-body" style={{ padding: '8px 12px', display: 'flex', flexDirection: 'column', gap: 6 }}>
              {QUICK_PROMPTS.map(p => (
                <button key={p.text} onClick={() => sendMessage(p.text)} className="btn btn-ghost" style={{
                  justifyContent: 'flex-start', textAlign: 'left', gap: 10, padding: '9px 10px',
                  fontSize: '0.78rem', color: 'var(--text-secondary)', width: '100%'
                }}>
                  <p.icon size={15} color={p.color} style={{ flexShrink: 0 }} />
                  <span style={{ flex: 1, lineHeight: 1.4 }}>{p.text}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Capabilities */}
          <div className="card">
            <div className="card-header"><span className="card-title">AI Capabilities</span></div>
            <div className="card-body" style={{ padding: '12px 16px' }}>
              {[
                { label: 'Live Database Queries', desc: 'Real-time data from MongoDB' },
                { label: 'Student Analytics', desc: 'Enrollment & performance' },
                { label: 'Financial Insights', desc: 'Fee collection & revenue' },
                { label: 'Attendance Tracking', desc: 'Today\'s roll call status' },
              ].map(cap => (
                <div key={cap.label} className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 6, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                    <Zap size={14} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>{cap.label}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{cap.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
