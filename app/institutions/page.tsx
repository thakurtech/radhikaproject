'use client';

import { useState, useEffect } from 'react';
import { School, Building, Trash2, Edit2, Plus, Users, Search, Activity, X } from 'lucide-react';
import { useUser } from '../components/UserProvider';
import { useRouter } from 'next/navigation';

export default function InstitutionsPlatformPage() {
  const { user, loading } = useUser();
  const router = useRouter();
  
  const [schools, setSchools] = useState<any[]>([]);
  const [fetching, setFetching] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  // Form State
  const [name, setName] = useState('');
  const [adminName, setAdminName] = useState('');
  const [adminEmail, setAdminEmail] = useState('');
  const [password, setPassword] = useState('');
  const [address, setAddress] = useState('');

  const fetchSchools = async () => {
    try {
      setFetching(true);
      const res = await fetch('/api/institutions');
      if (res.ok) {
        const data = await res.json();
        setSchools(data.schools || []);
      }
    } catch (error) {
      console.error('Failed to fetch schools', error);
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    if (!loading) {
      if (!user || user.role !== 'super_admin') {
        router.push('/dashboard');
      } else {
        fetchSchools();
      }
    }
  }, [user, loading, router]);

  const handleCreateSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setFormLoading(true);
      const res = await fetch('/api/institutions', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, adminName, adminEmail, password, address })
      });

      if (res.ok) {
        alert('School and Admin Account created successfully!');
        setIsModalOpen(false);
        setName('');
        setAdminName('');
        setAdminEmail('');
        setPassword('');
        setAddress('');
        fetchSchools(); // Refresh table
      } else {
        const data = await res.json();
        alert(data.error || 'Failed to create school');
      }
    } catch (error) {
      console.error('Error creating school:', error);
      alert('Network error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  if (loading || !user || user.role !== 'super_admin') {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
        <p style={{ color: 'var(--text-muted)' }}>Security Check...</p>
      </div>
    );
  }

  // Calculate platform totals
  const totalSchools = schools.length;
  // Safely extract numeric value from formatted string "₹X,XXX"
  const parseMRR = (mrrString: string) => parseInt(mrrString.replace(/[^0-9]/g, ''), 10) || 0;
  const totalMRR = schools.reduce((acc, curr) => acc + parseMRR(curr.mrr), 0);
  const totalMembers = schools.reduce((acc, curr) => acc + (curr.members || 0), 0);

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">EduVerse Platform</h1>
          <p className="page-subtitle">Super Admin Control Panel — Manage All Institutions</p>
        </div>
        <div className="page-header-actions">
          <button className="btn btn-primary btn-sm" onClick={() => setIsModalOpen(true)}>
            <Plus size={15} /> Onboard New School
          </button>
        </div>
      </div>

      <div className="grid-3 mb-5">
        <div className="stat-card blue">
          <div className="stat-icon blue"><Building size={18} /></div>
          <div className="stat-value">{totalSchools}</div>
          <div className="stat-label">Total Institutions</div>
        </div>
        <div className="stat-card emerald">
          <div className="stat-icon emerald"><Activity size={18} /></div>
          <div className="stat-value">₹{totalMRR.toLocaleString('en-IN')}</div>
          <div className="stat-label">Platform MRR</div>
        </div>
        <div className="stat-card violet">
          <div className="stat-icon violet"><Users size={18} /></div>
          <div className="stat-value">{totalMembers.toLocaleString()}</div>
          <div className="stat-label">Total Users Managed</div>
        </div>
      </div>

      <div className="card">
        <div className="card-header">
          <span className="card-title">Registered Institutions</span>
          <div className="flex gap-2">
            <div style={{ position: 'relative', width: 220 }}>
               <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
               <input className="form-input" style={{ paddingLeft: 32, fontSize: '0.8rem', padding: '6px 32px' }} placeholder="Search schools..." />
            </div>
          </div>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Institution Name</th>
                <th>Domain / Admin</th>
                <th>Plan</th>
                <th>MRR</th>
                <th>Status</th>
                <th style={{ width: 80 }}>Actions</th>
              </tr>
            </thead>
            <tbody>
               {fetching ? (
                 <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Loading platforms...</td></tr>
               ) : schools.length === 0 ? (
                 <tr><td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>No institutions registered yet.</td></tr>
               ) : (
                 schools.map(inst => (
                   <tr key={inst.id}>
                     <td>
                       <div className="flex items-center gap-3">
                         <div className="avatar avatar-sm" style={{ background: 'linear-gradient(135deg, #1e293b, #0f172a)' }}>
                            <School size={16} color="white" />
                         </div>
                         <span style={{ fontWeight: 600 }}>{inst.name}</span>
                       </div>
                     </td>
                     <td style={{ color: 'var(--primary)' }}>{inst.domain}</td>
                     <td><span className="badge badge-neutral">{inst.plan}</span></td>
                     <td style={{ fontWeight: 600 }}>{inst.mrr}</td>
                     <td><span className={`badge ${inst.status === 'Active' ? 'badge-success' : 'badge-danger'}`}>{inst.status}</span></td>
                     <td>
                        <div className="flex items-center gap-1">
                          <button className="btn btn-ghost btn-icon btn-sm"><Edit2 size={14} /></button>
                          <button className="btn btn-ghost btn-icon btn-sm"><Trash2 size={14} color="#ef4444" /></button>
                        </div>
                     </td>
                   </tr>
                 ))
               )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Slide-over Modal for Onboarding School */}
      {isModalOpen && (
        <div className="modal-overlay" onClick={() => setIsModalOpen(false)}>
          <div className="modal-container slide-in-right" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Onboard New School</h3>
              <button className="btn btn-ghost btn-icon btn-sm" onClick={() => setIsModalOpen(false)}>
                <X size={18} />
              </button>
            </div>
            <div className="modal-body">
              <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Create a new isolated database shard and instantly provision a School Admin account.
              </p>
              
              <form onSubmit={handleCreateSchool} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Institution Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                    placeholder="e.g. Springfield High School"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Admin Full Name</label>
                  <input
                    type="text"
                    className="form-input"
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    required
                    placeholder="e.g. Dr. Priya Sharma"
                  />
                  <div className="form-hint">The name of the person managing this school on the platform.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">School Admin Email</label>
                  <input
                    type="email"
                    className="form-input"
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    required
                    placeholder="admin@springfield.edu"
                  />
                  <div className="form-hint">This will be the primary login for the entire school.</div>
                </div>

                <div className="form-group">
                  <label className="form-label">Initial Admin Password</label>
                  <input
                    type="password"
                    className="form-input"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    placeholder="Provide a temporary secure password"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Address (Optional)</label>
                  <input
                    type="text"
                    className="form-input"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="City, State"
                  />
                </div>

                <div style={{ marginTop: '1rem', display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                  <button type="button" className="btn btn-ghost" onClick={() => setIsModalOpen(false)}>
                    Cancel
                  </button>
                  <button type="submit" className="btn btn-primary" disabled={formLoading}>
                    {formLoading ? 'Provisioning...' : 'Complete Onboarding'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
