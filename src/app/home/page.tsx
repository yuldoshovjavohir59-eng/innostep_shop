'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Zap, Shield, RefreshCw, Package } from 'lucide-react';
import Navbar from '@/components/layout/Navbar';
import LotCard from '@/components/lot/LotCard';
import { apiGetLots } from '@/lib/api';
import { Lot } from '@/types';

export default function HomePage() {
  const [lots, setLots] = useState<Lot[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('Barchasi');

  useEffect(() => {
    apiGetLots().then((all) => {
      setLots(all.filter((l) => l.isActive));
      setLoading(false);
    });
  }, []);

  const categories = Array.from(new Set(lots.map((l) => l.category)));
  const filtered = activeCategory === 'Barchasi' ? lots : lots.filter(l => l.category === activeCategory);
  const displayLots = filtered.slice(0, 18);

  return (
    <>
      <Navbar />
      <main>
        {/* HERO */}
        <section style={{ minHeight: '85vh', display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden', padding: '80px 24px' }}>
          <div style={{ position: 'absolute', top: '10%', left: '15%', width: 500, height: 500, borderRadius: '50%', background: 'radial-gradient(circle, rgba(108,99,255,0.12) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ position: 'absolute', bottom: '10%', right: '10%', width: 400, height: 400, borderRadius: '50%', background: 'radial-gradient(circle, rgba(245,200,66,0.08) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ maxWidth: 1280, margin: '0 auto', width: '100%', position: 'relative', zIndex: 1 }}>
            <div style={{ maxWidth: 720 }}>
              <span className="badge badge-accent" style={{ marginBottom: 20, display: 'inline-flex' }}>
                <Zap size={12} /> Premium Mahsulotlar Katalogi
              </span>
              <h1 className="font-display" style={{ fontSize: 'clamp(36px, 5vw, 72px)', fontWeight: 700, lineHeight: 1.1, marginBottom: 24 }}>
                Sifatli{' '}<span className="gradient-text">mahsulotlar</span>{' '}eng qulay narxda
              </h1>
              <p style={{ fontSize: 18, color: 'var(--text-muted)', lineHeight: 1.7, marginBottom: 40, maxWidth: 520 }}>
                Qog'oz mahsulotlari va konstovarlar — sifatli, qulay va hamyonbop narxlarda. New Cooperation.uz sayitidan buyurtma berish imkoniyati mavjud.
              </p>
              <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
                <Link href="/lots"><button className="btn-gold" style={{ fontSize: 16 }}>Barcha lotlar <ArrowRight size={18} /></button></Link>
                <Link href="/lots"><button className="btn-outline" style={{ fontSize: 16 }}>Kategoriyalar</button></Link>
              </div>
              <div style={{ display: 'flex', gap: 40, marginTop: 60, flexWrap: 'wrap' }}>
                {[
                  { value: lots.length + '+', label: 'Aktiv lot' },
                  { value: categories.length + '+', label: 'Kategoriya' },
                  { value: '100%', label: 'Kafolat' },
                ].map((s) => (
                  <div key={s.label}>
                    <div className="font-display gradient-text-gold" style={{ fontSize: 32, fontWeight: 700 }}>{s.value}</div>
                    <div style={{ fontSize: 13, color: 'var(--text-muted)' }}>{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* FEATURES */}
        <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border)' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 16 }}>
              {[
                { icon: <Package size={22} />, title: "To'liq ma'lumot", desc: "Har bir lot uchun batafsil xarakteristikalar va rasmlar" },
                { icon: <RefreshCw size={22} />, title: 'Narx sinxronizatsiyasi', desc: "Cooperation sayitidagi narxlar avtomatik yangilanib turadi" },
                { icon: <Zap size={22} />, title: 'Tezkor buyurtma', desc: "Bir bosish bilan Cooperation ga o'tib buyurtma bering" },
                { icon: <Shield size={22} />, title: 'Ishonchli', desc: 'Tasdiqlangan mahsulotlar, kafolatlangan sifat' },
              ].map((f) => (
                <div key={f.title} className="card" style={{ padding: 24 }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(108,99,255,0.15)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--accent)', marginBottom: 16 }}>{f.icon}</div>
                  <h3 style={{ fontSize: 15, fontWeight: 600, marginBottom: 8 }}>{f.title}</h3>
                  <p style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{f.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* LOTS */}
        <section style={{ padding: '60px 24px' }}>
          <div style={{ maxWidth: 1280, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
              <h2 className="font-display" style={{ fontSize: 28, fontWeight: 700, marginBottom: 6 }}>Barcha lotlar</h2>
              <p style={{ fontSize: 14, color: 'var(--text-muted)' }}>{loading ? 'Yuklanmoqda...' : `${displayLots.length} ta mahsulot ko'rsatilmoqda`}</p>
            </div>

            {/* Category filter */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 28, flexWrap: 'wrap' }}>
              {['Barchasi', ...categories].map((cat) => (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-elevated)',
                  border: '1px solid ' + (activeCategory === cat ? 'var(--accent)' : 'var(--border)'),
                  borderRadius: 20, padding: cat === 'Barchasi' ? '8px 16px' : '6px 14px',
                  color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                  fontSize: 13, fontWeight: activeCategory === cat ? 600 : 500,
                  cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'Manrope', sans-serif",
                }}>{cat}</button>
              ))}
            </div>

            {loading ? (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="card" style={{ height: 280, opacity: 0.4, background: 'var(--bg-elevated)' }} />
                ))}
              </div>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
                {displayLots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
              </div>
            )}

            {lots.length > 0 && (
              <div style={{ display: 'flex', justifyContent: 'center', marginTop: 40 }}>
                <Link href="/lots">
                  <button className="btn-outline" style={{ padding: '14px 40px', fontSize: 15 }}>
                    Hammasini ko'rish <ArrowRight size={16} />
                  </button>
                </Link>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer style={{ borderTop: '1px solid var(--border)', padding: '32px 24px', textAlign: 'center', color: 'var(--text-dim)', fontSize: 13 }}>
        <div className="font-display" style={{ fontSize: 16, fontWeight: 700, marginBottom: 8, color: 'var(--text-muted)' }}>INNOSTEP MCHJ</div>
        <p>© 2026 INNOSTEP Shop. Barcha huquqlar himoyalangan.</p>
      </footer>
    </>
  );
}
