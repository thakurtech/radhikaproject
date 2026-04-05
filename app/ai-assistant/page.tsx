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
    text: "👋 Hello! I'm **EduAI**, your intelligent school assistant powered by advanced AI.\n\nI can help you with:\n• **Student analytics** — attendance, grades, performance\n• **Fee management** — pending fees, payment status\n• **Academic planning** — timetables, exam schedules\n• **Reports** — generate any school report instantly\n• **Insights** — AI-powered predictions and recommendations\n\nWhat would you like to know today?",
    time: '10:00 AM'
  }
];

const QUICK_PROMPTS = [
  { icon: ClipboardCheck, text: "Who has attendance below 75%?", color: 'var(--accent-emerald)' },
  { icon: GraduationCap, text: "Show top 5 performing students", color: 'var(--primary)' },
  { icon: DollarSign, text: "List overdue fee payments", color: 'var(--accent-amber)' },
  { icon: BarChart3, text: "Generate monthly performance report", color: 'var(--accent-violet)' },
  { icon: MessageSquare, text: "Draft parent notification about exams", color: 'var(--accent-cyan)' },
  { icon: BookOpen, text: "Show today's timetable summary", color: 'var(--accent-rose)' },
];

const AI_RESPONSES: Record<string, string> = {
  attendance: "📊 **Students with attendance below 75%:**\n\n1. **Rohit Kumar** (Grade 9-A) — 65% attendance, 12 absences\n2. **Priya Patel** (Grade 9-B) — 62% attendance, 14 absences\n3. **Deepak Verma** (Grade 8-A) — 68% attendance, 10 absences\n\n⚠️ All three are at risk of failing this semester due to low attendance.\n\n**Recommended Action:** Send automated parent alerts and schedule counselling sessions.\n\nShall I draft the parent notification messages?",
  top: "🏆 **Top 5 Performing Students (Current Semester):**\n\n| Rank | Student | Class | Score | Trend |\n|------|---------|-------|-------|-------|\n| 1 | Aayush Sharma | Grade 10-A | 92.4% | ↑ +2.1% |\n| 2 | Anjali Menon | Grade 8-B | 91.6% | ↑ +1.8% |\n| 3 | Kavya Reddy | Grade 12-B | 90.8% | ↑ +0.9% |\n| 4 | Simran Kaur | Grade 11-B | 88.4% | → same |\n| 5 | Aryan Singh | Grade 11-A | 87.2% | ↓ -0.5% |\n\n💡 **AI Insight:** Aayush Sharma shows fastest improvement. Consider nominating for district excellence award.",
  fee: "💰 **Overdue Fee Payments:**\n\n1. **Priya Patel** (Grade 9-B)\n   - Amount: ₹38,000\n   - Due since: Dec 15, 2025 (21 days overdue)\n   - Parent Contact: +91 43210 98765\n\n2. **Vikram Nair** (Grade 12-A)\n   - Amount: ₹52,000\n   - Due since: Jan 15, 2026\n   - Parent Contact: +91 32109 87654\n\n**Total Overdue: ₹90,000**\n\nShall I send automated reminders to these parents via SMS and email?",
  report: "📈 **Monthly Performance Report — March 2026**\n\n**School Overview:**\n- Total Students: 2,847\n- Average Attendance: 84.6% ↓ from 87.2%\n- Average Score: 82.3% ↑ from 80.1%\n- Fee Collection Rate: 91.1%\n\n**Academic Highlights:**\n- Best improvement: English (+8.2%)\n- Most consistent: Math (82.1%)\n- Needs attention: Grade 9 (attendance issues)\n\n**Report generated and ready for download.** Would you like me to email it to the principal?",
  default: "I understand your query! Let me analyze the school data...\n\nBased on current records, I found relevant information.\n\n**Key Insights:**\n• Current semester shows 4.2% overall improvement in academic performance\n• 89% of students are on track with curriculum requirements\n• 3 classes need immediate teacher attention (Grade 9-A, 9-B, 8-A)\n\nWould you like me to dive deeper into any specific aspect? I can generate detailed reports, send notifications, or provide recommendations.",
};

function getResponse(input: string): string {
  const lower = input.toLowerCase();
  if (lower.includes('attendance') || lower.includes('absent')) return AI_RESPONSES.attendance;
  if (lower.includes('top') || lower.includes('perform') || lower.includes('best')) return AI_RESPONSES.top;
  if (lower.includes('fee') || lower.includes('overdue') || lower.includes('payment')) return AI_RESPONSES.fee;
  if (lower.includes('report') || lower.includes('generate') || lower.includes('monthly')) return AI_RESPONSES.report;
  return AI_RESPONSES.default;
}

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
      if (line.startsWith('| ')) {
        return null; // skip table lines for simplicity
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

  const sendMessage = (text?: string) => {
    const msgText = text || input;
    if (!msgText.trim() || loading) return;

    const userMsg = { id: ++idCounter, role: 'user' as const, text: msgText, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    setTimeout(() => {
      const botMsg = {
        id: ++idCounter,
        role: 'bot' as const,
        text: getResponse(msgText),
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages(prev => [...prev, botMsg]);
      setLoading(false);
    }, 1200);
  };

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">EduAI Assistant</h1>
          <p className="page-subtitle">Ask anything about your school — powered by advanced AI</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm" onClick={() => setMessages(INITIAL_MESSAGES)}>
            <RefreshCw size={14} /> New Chat
          </button>
          <button className="btn btn-primary btn-sm"><Download size={14} /> Export Chat</button>
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
                AI-powered · School context active
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
              <button className="btn btn-ghost btn-icon"><Paperclip size={18} color="var(--text-muted)" /></button>
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
              <button className="btn btn-ghost btn-icon"><Mic size={18} color="var(--text-muted)" /></button>
              <button
                className="btn btn-primary btn-icon" style={{ width: 44, height: 44, borderRadius: '50%', flexShrink: 0 }}
                onClick={() => sendMessage()} disabled={loading}
              >
                <Send size={18} />
              </button>
            </div>
            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: 8, textAlign: 'center' }}>
              EduAI has access to all school data · Responses are AI-generated summaries
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
                { label: 'Real-time Analytics', desc: 'Live data queries' },
                { label: 'Report Generation', desc: 'PDF & Excel export' },
                { label: 'Predictive Alerts', desc: 'Early warning system' },
                { label: 'Multi-language', desc: 'Hindi, English + more' },
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

          {/* Usage */}
          <div className="card">
            <div className="card-header"><span className="card-title">Usage Today</span></div>
            <div className="card-body">
              <div style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>48</div>
              <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', marginBottom: 12 }}>queries processed</div>
              <div className="progress-bar mb-2"><div className="progress-fill primary" style={{ width: '48%' }} /></div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>48 / 100 daily limit</div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
