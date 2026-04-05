'use client';

import { useState, useEffect } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2,
  AlertCircle, Download, Plus, Filter, Search, Eye, Send,
  CreditCard, Wallet, BarChart3, X
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';
import { useUser } from '../components/UserProvider';
import { useRouter } from 'next/navigation';

const revenueMonthly = [
  { month: 'Aug', total: 800000, collected: 680000, pending: 120000 },
  { month: 'Sep', total: 820000, collected: 750000, pending: 70000 },
  { month: 'Oct', total: 810000, collected: 720000, pending: 90000 },
  { month: 'Nov', total: 830000, collected: 790000, pending: 40000 },
  { month: 'Dec', total: 800000, collected: 710000, pending: 90000 },
  { month: 'Jan', total: 840000, collected: 810000, pending: 30000 },
];

const feeCategories = [
  { name: 'Tuition', value: 60, color: '#6366f1' },
  { name: 'Transport', value: 18, color: '#8b5cf6' },
  { name: 'Hostel', value: 14, color: '#06b6d4' },
  { name: 'Other', value: 8, color: '#10b981' },
];

export default function FinancePage() {
  const { user, loading } = useUser();
  const router = useRouter();

  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const [payments, setPayments] = useState<any[]>([]);
  const [stats, setStats] = useState({ totalCollected: 0, pendingAmount: 0, overdueAmount: 0 });
  const [fetching, setFetching] = useState(true);

  // Modal / Form state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [students, setStudents] = useState<any[]>([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [amount, setAmount] = useState('');
  const [status, setStatus] = useState('paid');
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [formLoading, setFormLoading] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user || user.role === 'teacher') {
        router.push('/dashboard');
      } else {
        fetchData();
        fetchStudents();
      }
    }
  }, [user, loading, router]);

  const fetchData = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/finance');
      if (res.ok) {
        const data = await res.json();
        setPayments(data.payments || []);
        if (data.stats) setStats(data.stats);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setFetching(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await fetch('/api/students');
      if (res.ok) {
         const data = await res.json();
         setStudents(data.students || []);
      }
    } catch (e) {}
  };

  const handleCreateInvoice = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const res = await fetch('/api/finance', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ studentId: selectedStudent, amount, status, date })
      });

      if (res.ok) {
        setIsModalOpen(false);
        setAmount('');
        setStatus('paid');
        setSelectedStudent('');
        fetchData(); // Refresh UI
      } else {
        alert('Failed to generate invoice');
      }
    } catch (error) {
      alert('Network error');
    } finally {
      setFormLoading(false);
    }
  };

  const filtered = payments.filter(inv => {
    const m = inv.studentName.toLowerCase().includes(search.toLowerCase());
    const s = statusFilter === 'all' || inv.status === statusFilter;
    return m && s;
  });

  const totalRevenue = stats.totalCollected + stats.pendingAmount + stats.overdueAmount;
  const collectionRate = totalRevenue === 0 ? 0 : ((stats.totalCollected / totalRevenue) * 100).toFixed(1);

  if (loading || !user) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading Finance...</div>;

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Finance & Fees</h1>
          <p className="page-subtitle">Fee management, invoicing, and revenue analytics</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export</button>
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> Create Invoice
          </button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Revenue', value: `₹${(totalRevenue || 0).toLocaleString()}`, sub: 'All recorded invoices', color: 'blue', icon: Wallet, trend: '+0%' },
          { label: 'Collected', value: `₹${(stats.totalCollected || 0).toLocaleString()}`, sub: `${collectionRate}% collection rate`, color: 'emerald', icon: CheckCircle2, trend: '+0%' },
          { label: 'Pending', value: `₹${(stats.pendingAmount || 0).toLocaleString()}`, sub: 'Awaiting payment', color: 'amber', icon: Clock, trend: '-0%' },
          { label: 'Overdue', value: `₹${(stats.overdueAmount || 0).toLocaleString()}`, sub: 'Past due date', color: 'rose', icon: AlertCircle, trend: '+0%' },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.color}`}>
            <div className="flex items-center justify-between">
              <div className={`stat-icon ${s.color}`}><s.icon size={18} /></div>
              <span className="badge badge-success" style={{ fontSize: '0.68rem' }}>{s.trend}</span>
            </div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* CHARTS */}
      <div className="grid-2 mb-6">
        <div className="card">
          <div className="card-header">
            <span className="card-title">Revenue Trend</span>
            <span className="badge badge-primary">6 Months (Static Demo)</span>
          </div>
          <div className="card-body">
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={revenueMonthly}>
                <defs>
                  <linearGradient id="gc" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="gp" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent-rose)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent-rose)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border-subtle)" />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={(v: number) => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(v) => [`₹${(Number(v ?? 0)/1000).toFixed(0)}K`, '']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
                <Area type="monotone" dataKey="collected" stroke="var(--primary)" strokeWidth={2} fill="url(#gc)" name="Collected" />
                <Area type="monotone" dataKey="pending" stroke="var(--accent-rose)" strokeWidth={2} fill="url(#gp)" name="Pending" />
              </AreaChart>
            </ResponsiveContainer>
            <div className="flex items-center gap-4 mt-2">
              <div className="flex items-center gap-2"><div style={{ width: 12, height: 3, background: 'var(--primary)', borderRadius: 2 }} /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Collected</span></div>
              <div className="flex items-center gap-2"><div style={{ width: 12, height: 3, background: 'var(--accent-rose)', borderRadius: 2 }} /><span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Pending</span></div>
            </div>
          </div>
        </div>

        <div className="card">
          <div className="card-header">
            <span className="card-title">Fee Categories</span>
          </div>
          <div className="card-body" style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
            <PieChart width={160} height={160}>
              <Pie data={feeCategories} cx={75} cy={75} innerRadius={48} outerRadius={72} dataKey="value" strokeWidth={0}>
                {feeCategories.map((e, i) => <Cell key={i} fill={e.color} />)}
              </Pie>
            </PieChart>
            <div style={{ flex: 1 }}>
              {feeCategories.map(cat => (
                <div key={cat.name} className="flex items-center gap-3" style={{ marginBottom: 12 }}>
                  <div style={{ width: 12, height: 12, borderRadius: 3, background: cat.color, flexShrink: 0 }} />
                  <span style={{ flex: 1, fontSize: '0.875rem', color: 'var(--text-secondary)' }}>{cat.name}</span>
                  <span style={{ fontWeight: 700, fontSize: '0.875rem' }}>{cat.value}%</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* INVOICES TABLE */}
      <div className="card">
        <div className="card-header">
          <span className="card-title">Recent Invoices</span>
          <div className="flex items-center gap-3">
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)', pointerEvents: 'none' }} />
              <input className="form-input" style={{ height: 34, paddingLeft: 32, width: 200, borderRadius: 'var(--radius-full)' }} placeholder="Search invoices..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <select className="form-select" style={{ width: 130, height: 34 }} value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
              <option value="all">All Status</option>
              <option value="paid">Paid</option>
              <option value="pending">Pending</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice Ref</th>
                <th>Student</th>
                <th>Amount</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fetching ? (
                 <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading payments...</td></tr>
              ) : filtered.length === 0 ? (
                 <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No payment records found.</td></tr>
              ) : filtered.map(inv => (
                <tr key={inv._id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.825rem' }}>#{inv._id.substring(0, 8).toUpperCase()}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.studentName} <span style={{fontSize: '0.75rem', color:'var(--text-muted)', fontWeight:400}}>({inv.enrollmentNumber})</span></td>
                  <td style={{ fontWeight: 600 }}>₹{inv.amount.toLocaleString('en-IN')}</td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{new Date(inv.date).toLocaleDateString()}</td>
                  <td>
                    <span style={{textTransform:'capitalize'}} className={`badge ${inv.status === 'paid' ? 'badge-success' : inv.status === 'pending' ? 'badge-warning' : 'badge-danger'}`}>
                      {inv.status}
                    </span>
                  </td>
                  <td>
                    <div className="flex items-center gap-1">
                      <button className="btn btn-ghost btn-icon btn-sm"><Eye size={14} /></button>
                      <button className="btn btn-ghost btn-icon btn-sm"><Send size={14} /></button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE INVOICE MODAL */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Create Invoice</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <form onSubmit={handleCreateInvoice} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                
                <div className="form-group">
                  <label className="form-label">Select Student</label>
                  <select 
                    className="form-select" 
                    required 
                    value={selectedStudent} 
                    onChange={e => setSelectedStudent(e.target.value)}
                  >
                    <option value="">-- Choose Student --</option>
                    {students.map(s => (
                      <option key={s._id} value={s._id}>{s.firstName} {s.lastName} ({s.enrollmentNumber})</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Amount (₹)</label>
                  <input 
                    type="number" 
                    className="form-input" 
                    required 
                    min="1"
                    value={amount} 
                    onChange={e => setAmount(e.target.value)} 
                    placeholder="50000"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Payment Status</label>
                  <select className="form-select" value={status} onChange={e => setStatus(e.target.value)}>
                    <option value="paid">Paid</option>
                    <option value="pending">Pending (Unpaid)</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Invoice Date</label>
                  <input 
                    type="date" 
                    className="form-input" 
                    required
                    value={date} 
                    onChange={e => setDate(e.target.value)} 
                  />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>Cancel</button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Creating...' : 'Generate Invoice'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Quick Payment Methods */}
      <div className="flex gap-4 mt-5" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Record Cash Payment', icon: Wallet, color: 'var(--accent-emerald)', act: () => setIsModalOpen(true) },
          { label: 'Generate Fee Slip', icon: CreditCard, color: 'var(--primary)' },
        ].map(a => (
          <button key={a.label} onClick={a.act} className="btn btn-secondary" style={{ gap: 8 }}>
            <a.icon size={16} style={{ color: a.color }} />
            {a.label}
          </button>
        ))}
      </div>
    </>
  );
}
