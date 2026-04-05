'use client';

import { useState } from 'react';
import {
  DollarSign, TrendingUp, TrendingDown, Clock, CheckCircle2,
  AlertCircle, Download, Plus, Filter, Search, Eye, Send,
  CreditCard, Wallet, BarChart3
} from 'lucide-react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, BarChart, Bar
} from 'recharts';

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

const INVOICES = [
  { id: 'INV-2401', student: 'Aayush Sharma', class: 'Grade 10-A', amount: 45000, paid: 45000, due: 0, status: 'Paid', date: 'Jan 5, 2026' },
  { id: 'INV-2402', student: 'Kavya Reddy', class: 'Grade 12-B', amount: 52000, paid: 52000, due: 0, status: 'Paid', date: 'Jan 7, 2026' },
  { id: 'INV-2403', student: 'Rohit Kumar', class: 'Grade 9-A', amount: 38000, paid: 20000, due: 18000, status: 'Partial', date: 'Jan 10, 2026' },
  { id: 'INV-2404', student: 'Priya Patel', class: 'Grade 9-B', amount: 38000, paid: 0, due: 38000, status: 'Overdue', date: 'Dec 15, 2025' },
  { id: 'INV-2405', student: 'Aryan Singh', class: 'Grade 11-A', amount: 48000, paid: 48000, due: 0, status: 'Paid', date: 'Jan 3, 2026' },
  { id: 'INV-2406', student: 'Nisha Patel', class: 'Grade 10-B', amount: 45000, paid: 30000, due: 15000, status: 'Partial', date: 'Jan 12, 2026' },
  { id: 'INV-2407', student: 'Vikram Nair', class: 'Grade 12-A', amount: 52000, paid: 0, due: 52000, status: 'Pending', date: 'Jan 15, 2026' },
];

export default function FinancePage() {
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const filtered = INVOICES.filter(inv => {
    const m = inv.student.toLowerCase().includes(search.toLowerCase()) || inv.id.includes(search);
    const s = statusFilter === 'all' || inv.status === statusFilter;
    return m && s;
  });

  const totalRevenue = 8400000;
  const collected = 7650000;
  const pending = 750000;
  const collectionRate = ((collected / totalRevenue) * 100).toFixed(1);

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Finance & Fees</h1>
          <p className="page-subtitle">Fee management, invoicing, and revenue analytics</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-secondary btn-sm"><Download size={15} /> Export</button>
          <button className="btn btn-primary btn-sm"><Plus size={15} /> Create Invoice</button>
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid-4 mb-6">
        {[
          { label: 'Total Revenue', value: '₹84L', sub: 'Academic Year 25-26', color: 'blue', icon: Wallet, trend: '+12%' },
          { label: 'Collected', value: '₹76.5L', sub: `${collectionRate}% collection rate`, color: 'emerald', icon: CheckCircle2, trend: '+8%' },
          { label: 'Pending', value: '₹7.5L', sub: '142 pending invoices', color: 'amber', icon: Clock, trend: '-3%' },
          { label: 'Overdue', value: '₹2.1L', sub: '38 overdue invoices', color: 'rose', icon: AlertCircle, trend: '+2%' },
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
            <span className="badge badge-primary">6 Months</span>
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
                <YAxis tick={{ fontSize: 12, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} tickFormatter={v => `₹${(v/100000).toFixed(1)}L`} />
                <Tooltip formatter={(v: number) => [`₹${(v/1000).toFixed(0)}K`, '']} contentStyle={{ background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8, fontSize: 12 }} />
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
              <option value="Paid">Paid</option>
              <option value="Partial">Partial</option>
              <option value="Pending">Pending</option>
              <option value="Overdue">Overdue</option>
            </select>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Invoice ID</th>
                <th>Student</th>
                <th>Class</th>
                <th>Total Amount</th>
                <th>Paid</th>
                <th>Due</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(inv => (
                <tr key={inv.id}>
                  <td style={{ fontWeight: 700, color: 'var(--primary)', fontSize: '0.825rem' }}>{inv.id}</td>
                  <td style={{ fontWeight: 600, fontSize: '0.875rem' }}>{inv.student}</td>
                  <td><span className="badge badge-neutral">{inv.class}</span></td>
                  <td style={{ fontWeight: 600 }}>₹{inv.amount.toLocaleString()}</td>
                  <td style={{ color: 'var(--success)', fontWeight: 600 }}>₹{inv.paid.toLocaleString()}</td>
                  <td style={{ color: inv.due > 0 ? 'var(--danger)' : 'var(--text-muted)', fontWeight: 600 }}>
                    {inv.due > 0 ? `₹${inv.due.toLocaleString()}` : '—'}
                  </td>
                  <td style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{inv.date}</td>
                  <td>
                    <span className={`badge ${inv.status === 'Paid' ? 'badge-success' : inv.status === 'Partial' ? 'badge-warning' : inv.status === 'Overdue' ? 'badge-danger' : 'badge-neutral'}`}>
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

      {/* Quick Payment Methods */}
      <div className="flex gap-4 mt-5" style={{ flexWrap: 'wrap' }}>
        {[
          { label: 'Record Cash Payment', icon: Wallet, color: 'var(--accent-emerald)' },
          { label: 'Generate Fee Slip', icon: CreditCard, color: 'var(--primary)' },
          { label: 'Send Fee Reminders', icon: Send, color: 'var(--accent-amber)' },
          { label: 'Financial Report', icon: BarChart3, color: 'var(--accent-violet)' },
        ].map(a => (
          <button key={a.label} className="btn btn-secondary" style={{ gap: 8 }}>
            <a.icon size={16} style={{ color: a.color }} />
            {a.label}
          </button>
        ))}
      </div>
    </>
  );
}
