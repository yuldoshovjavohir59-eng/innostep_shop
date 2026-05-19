'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import {
  Plus, Edit, Trash2, Eye, EyeOff, BarChart2,
  Package, TrendingUp, Activity, Zap, LogOut,
} from 'lucide-react';
import { apiGetLots, apiToggleLot, apiDeleteLot, apiGetStats, isAdminLoggedIn, adminLogout, SiteStats } from '@/lib/api';
import { formatPrice } from '@/lib/data';
import { Lot } from '@/types';

export default function AdminLotsPage() {
  const router = useRouter();
  const [lots, setLots] = useState<Lot[]>([]);
  const [stats, setStats] = useState<SiteStats>({ totalViews: 0, totalOrders: 0, lotViews: {}, lotOrders: {} });

  async function reload() {
    const [l, s] = await Promise.all([apiGetLots(), apiGetStats()]);
    setLots(l);
    setStats(s);
  }

  useEffect(() => {
    if (!isAdminLoggedIn()) { router.push('/admin/login'); return; }
    reload();
  }, [router]);

  async function handleToggle(id: string) {
    await apiToggleLot(id);
    reload();
  }

  async function handleDelete(id: string) {
    if (confirm("Bu lotni o'chirishni tasdiqlaysizmi?")) {
      await apiDeleteLot(id);
      reload();
    }
  }

  function handleLogout() {
    adminLogout();
    router.push('/admin/login');
  }

  if (lots.length === 0 && typeof window !== 'undefined' && !isAdminLoggedIn()) return null;

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* SIDEBAR */}
      <aside style={{
        width: 240,
        background: 'var(--bg-card)',
        borderRight: '1px solid var(--border)',
        padding: '24px 0',
        display: 'flex', flexDirection: 'column',
        position: 'sticky', top: 0, height: '100vh',
      }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 8,
              background: 'linear-gradient(135deg, var(--accent), #a78bfa)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span className="font-display" style={{ fontSize: 14, fontWeight: 700 }}>Admin Panel</span>
          </div>
        </div>

        <nav style={{ padding: '16px 12px', flex: 1 }}>
          {[
            { href: '/admin/lots', icon: <Package size={16} />, label: 'Lotlar' },
            { href: '/admin/lot-new', icon: <Plus size={16} />, label: 'Yangi lot' },
          ].map((item) => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: '10px 12px', borderRadius: 10,
                color: 'var(--text)', fontSize: 14, fontWeight: 500,
                background: 'var(--bg-elevated)',
                marginBottom: 4,
              }}>
                <span style={{ color: 'var(--accent)' }}>{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div style={{ padding: '16px 20px', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: 8 }}>
          <Link href="/" style={{ textDecoration: 'none' }}>
            <button className="btn-outline" style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px' }}>
              Saytga qaytish
            </button>
          </Link>
          <button
            className="btn-outline"
            onClick={handleLogout}
            style={{ width: '100%', justifyContent: 'center', fontSize: 13, padding: '8px 12px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
          >
            <LogOut size={14} /> Chiqish
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
          <div>
            <h1 className="font-display" style={{ fontSize: 26, fontWeight: 700 }}>Lotlar boshqaruvi</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 14, marginTop: 4 }}>
              Jami {lots.length} ta lot
            </p>
          </div>
          <Link href="/admin/lot-new">
            <button className="btn-primary">
              <Plus size={16} /> Yangi lot
            </button>
          </Link>
        </div>

        {/* STATS */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: 16, marginBottom: 32,
        }}>
          {[
            { icon: <Package size={18} />, label: 'Jami lotlar', value: lots.length, color: 'var(--accent)' },
            { icon: <Activity size={18} />, label: 'Aktiv lotlar', value: lots.filter(l => l.isActive).length, color: 'var(--success)' },
            { icon: <Eye size={18} />, label: "Ko'rishlar", value: stats.totalViews.toLocaleString(), color: 'var(--gold)' },
            { icon: <TrendingUp size={18} />, label: 'Buyurtmalar', value: stats.totalOrders.toLocaleString(), color: '#f97316' },
          ].map((s) => (
            <div key={s.label} className="card" style={{ padding: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <span style={{ color: s.color }}>{s.icon}</span>
                <span style={{ fontSize: 12, color: 'var(--text-muted)', fontWeight: 600 }}>{s.label}</span>
              </div>
              <div style={{ fontSize: 28, fontWeight: 800, fontFamily: "'Unbounded', sans-serif", color: s.color }}>
                {s.value}
              </div>
            </div>
          ))}
        </div>

        {/* TABLE */}
        <div className="card" style={{ overflow: 'hidden' }}>
          <div style={{
            padding: '16px 20px', borderBottom: '1px solid var(--border)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <BarChart2 size={16} color="var(--accent)" />
            <span style={{ fontWeight: 600, fontSize: 15 }}>Barcha lotlar</span>
          </div>

          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid var(--border)' }}>
                  {['Rasm', 'Nomi', 'Kategoriya', 'Narxi', 'Holat', 'Amallar'].map((h) => (
                    <th key={h} style={{
                      padding: '12px 16px', textAlign: 'left',
                      fontSize: 11, fontWeight: 700, color: 'var(--text-dim)',
                      textTransform: 'uppercase', letterSpacing: 0.5,
                    }}>
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {lots.map((lot) => (
                  <tr key={lot.id} style={{ borderBottom: '1px solid var(--border)' }}
                    onMouseEnter={e => (e.currentTarget.style.background = 'var(--bg-elevated)')}
                    onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
                  >
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ width: 48, height: 48, borderRadius: 8, overflow: 'hidden', background: 'var(--bg-elevated)' }}>
                        {lot.images[0] ? (
                          <img src={lot.images[0]} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Package size={20} color="var(--text-dim)" />
                          </div>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontSize: 14, fontWeight: 600, maxWidth: 200 }}>{lot.title}</div>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span className="badge badge-accent">{lot.category}</span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{ fontWeight: 700, color: 'var(--gold)', fontFamily: "'Unbounded', sans-serif", fontSize: 13 }}>
                        {formatPrice(lot.price)}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <button
                        onClick={() => handleToggle(lot.id)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          background: lot.isActive ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
                          color: lot.isActive ? 'var(--success)' : 'var(--danger)',
                          border: 'none', borderRadius: 20, padding: '4px 10px',
                          fontSize: 12, fontWeight: 600, cursor: 'pointer',
                          fontFamily: "'Manrope', sans-serif",
                        }}
                      >
                        {lot.isActive ? <Eye size={12} /> : <EyeOff size={12} />}
                        {lot.isActive ? 'Aktiv' : 'Yashirin'}
                      </button>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <Link href={`/admin/lot-edit/${lot.id}`}>
                          <button className="btn-outline" style={{ padding: '6px 10px' }}>
                            <Edit size={14} />
                          </button>
                        </Link>
                        <button
                          className="btn-outline"
                          style={{ padding: '6px 10px', color: 'var(--danger)', borderColor: 'var(--danger)' }}
                          onClick={() => handleDelete(lot.id)}
                        >
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {lots.length === 0 && (
              <div style={{ textAlign: 'center', padding: '60px', color: 'var(--text-dim)' }}>
                Hozircha lotlar yo'q. <Link href="/admin/lot-new" style={{ color: 'var(--accent)' }}>Yangi lot qo'shish</Link>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
