'use client';

import { useState, useEffect } from 'react';
import { Bus, Plus, MapPin, Phone, User, Trash2, Wrench } from 'lucide-react';
import { useUser } from '../components/UserProvider';

export default function TransportPage() {
  const { user } = useUser();
  const isAdmin = user?.role === 'school_admin' || user?.role === 'super_admin';

  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [creating, setCreating] = useState(false);
  const [stopsInput, setStopsInput] = useState('');
  const [form, setForm] = useState({ vehicleNumber: '', type: 'Bus', capacity: '40', driverName: '', driverPhone: '', routeName: '' });

  useEffect(() => {
    fetch('/api/transport').then(r => r.json()).then(d => setVehicles(Array.isArray(d) ? d : [])).catch(() => {}).finally(() => setLoading(false));
  }, []);

  const handleAdd = async () => {
    if (!form.vehicleNumber || !form.driverName || !form.driverPhone || !form.routeName) return;
    setCreating(true);
    try {
      const res = await fetch('/api/transport', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, capacity: Number(form.capacity), stops: stopsInput.split(',').map(s => s.trim()).filter(Boolean) })
      });
      if (res.ok) { setShowModal(false); setForm({ vehicleNumber: '', type: 'Bus', capacity: '40', driverName: '', driverPhone: '', routeName: '' }); setStopsInput('');
        const d = await fetch('/api/transport').then(r => r.json()); setVehicles(d);
      } else { const d = await res.json(); alert(d.error); }
    } catch (e) { alert('Network error'); }
    finally { setCreating(false); }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this vehicle?')) return;
    await fetch(`/api/transport/${id}`, { method: 'DELETE' });
    setVehicles(vehicles.filter(v => v._id !== id));
  };

  const statusColor = (s: string) => s === 'active' ? 'badge-success' : s === 'maintenance' ? 'badge-warning' : 'badge-neutral';

  return (
    <>
      <div className="page-header">
        <div className="page-header-left">
          <h1 className="page-title">Transport</h1>
          <p className="page-subtitle">Fleet management and bus routes — {vehicles.length} vehicles</p>
        </div>
        {isAdmin && (
          <div className="page-header-actions">
            <button className="btn btn-primary" onClick={() => setShowModal(true)}><Plus size={15} /> Add Vehicle</button>
          </div>
        )}
      </div>

      {loading ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>Loading...</div>
      ) : vehicles.length === 0 ? (
        <div className="card card-body" style={{ textAlign: 'center', padding: '5rem 2rem' }}>
          <div style={{ width: 64, height: 64, borderRadius: 16, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}><Bus size={30} color="var(--primary)" /></div>
          <div style={{ fontWeight: 700, fontSize: '1.2rem', marginBottom: 8 }}>No Vehicles Added</div>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', maxWidth: 400, margin: '0 auto' }}>Add buses to manage routes and track your school fleet.</div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(360px, 1fr))', gap: 16 }}>
          {vehicles.map(v => (
            <div key={v._id} className="card card-body" style={{ padding: '20px 24px' }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 14 }}>
                <div className="flex items-center gap-3">
                  <div style={{ width: 42, height: 42, borderRadius: 12, background: 'var(--primary-subtle)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Bus size={20} color="var(--primary)" />
                  </div>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '1rem' }}>{v.vehicleNumber}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{v.type} • {v.capacity} seats</div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`badge ${statusColor(v.status)}`}>{v.status}</span>
                  {isAdmin && <button className="btn btn-ghost btn-sm" style={{ color: '#f43f5e' }} onClick={() => handleDelete(v._id)}><Trash2 size={14} /></button>}
                </div>
              </div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-primary)', fontWeight: 600, marginBottom: 8 }}>
                <MapPin size={14} style={{ display: 'inline', verticalAlign: -2, marginRight: 6 }} />{v.routeName}
              </div>
              {v.stops?.length > 0 && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
                  {v.stops.map((s: string, i: number) => (
                    <span key={i} className="badge badge-neutral" style={{ fontSize: '0.72rem' }}>{s}</span>
                  ))}
                </div>
              )}
              <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: 10, display: 'flex', gap: 16 }}>
                <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><User size={13} /> {v.driverName}</span>
                <span className="flex items-center gap-1" style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}><Phone size={13} /> {v.driverPhone}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <div className="modal-header"><span className="modal-title">Add Vehicle</span><button className="modal-close" onClick={() => setShowModal(false)}>✕</button></div>
            <div className="modal-body">
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4"><label className="form-label">Vehicle Number *</label><input className="form-input" placeholder="e.g. UP-14-AB-1234" value={form.vehicleNumber} onChange={e => setForm({ ...form, vehicleNumber: e.target.value })} /></div>
                <div className="form-group mb-4"><label className="form-label">Type</label><select className="form-input" value={form.type} onChange={e => setForm({ ...form, type: e.target.value })}><option>Bus</option><option>Van</option><option>Mini Bus</option></select></div>
              </div>
              <div className="form-group mb-4"><label className="form-label">Route Name *</label><input className="form-input" placeholder="e.g. Route A — Sector 62 to Campus" value={form.routeName} onChange={e => setForm({ ...form, routeName: e.target.value })} /></div>
              <div className="form-group mb-4"><label className="form-label">Stops (comma-separated)</label><input className="form-input" placeholder="e.g. Sector 62, Botanical Garden, Campus" value={stopsInput} onChange={e => setStopsInput(e.target.value)} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div className="form-group mb-4"><label className="form-label">Driver Name *</label><input className="form-input" placeholder="Name" value={form.driverName} onChange={e => setForm({ ...form, driverName: e.target.value })} /></div>
                <div className="form-group mb-4"><label className="form-label">Driver Phone *</label><input className="form-input" placeholder="Phone" value={form.driverPhone} onChange={e => setForm({ ...form, driverPhone: e.target.value })} /></div>
                <div className="form-group mb-4"><label className="form-label">Capacity</label><input className="form-input" type="number" min={1} value={form.capacity} onChange={e => setForm({ ...form, capacity: e.target.value })} /></div>
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={handleAdd} disabled={creating || !form.vehicleNumber || !form.driverName || !form.routeName}>{creating ? 'Adding...' : 'Add Vehicle'}</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
