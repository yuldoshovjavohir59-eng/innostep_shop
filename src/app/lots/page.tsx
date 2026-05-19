'use client';
import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'next/navigation';
import { Suspense } from 'react';
import Navbar from '@/components/layout/Navbar';
import LotCard from '@/components/lot/LotCard';
import { apiGetLots } from '@/lib/api';
import { Lot } from '@/types';

function LotsContent() {
  const searchParams = useSearchParams();
  const [allLots, setAllLots] = useState<Lot[]>([]);
  const [search, setSearch] = useState(searchParams.get('q') || '');
  const [activeCategory, setActiveCategory] = useState('Barchasi');
  const [sort, setSort] = useState('new');

  useEffect(() => {
    apiGetLots().then(all => setAllLots(all.filter(l => l.isActive)));
  }, []);

  useEffect(() => {
    const q = searchParams.get('q');
    if (q) setSearch(q);
  }, [searchParams]);

  const categories = useMemo(() => ['Barchasi', ...Array.from(new Set(allLots.map((l) => l.category)))], [allLots]);

  const lots = useMemo(() => {
    let filtered = allLots;
    if (activeCategory !== 'Barchasi') filtered = filtered.filter((l) => l.category === activeCategory);
    if (search.trim()) {
      const q = search.toLowerCase();
      filtered = filtered.filter((l) =>
        l.title.toLowerCase().includes(q) ||
        l.description.toLowerCase().includes(q) ||
        l.category.toLowerCase().includes(q)
      );
    }
    if (sort === 'price-asc') return [...filtered].sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') return [...filtered].sort((a, b) => b.price - a.price);
    return [...filtered].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [allLots, search, activeCategory, sort]);

  return (
    <>
      <Navbar />
      <main style={{ maxWidth: 1280, margin: '0 auto', padding: '40px 24px' }}>
        <div style={{ marginBottom: 36 }}>
          <h1 className="font-display" style={{ fontSize: 36, fontWeight: 700, marginBottom: 8 }}>
            Barcha <span className="gradient-text">lotlar</span>
          </h1>
          <p style={{ color: 'var(--text-muted)', fontSize: 15 }}>Jami {lots.length} ta mahsulot</p>
        </div>

        <div style={{ display: 'flex', gap: 12, marginBottom: 32, alignItems: 'center', flexWrap: 'wrap' }}>
          <input
            className="input"
            placeholder="🔍  Mahsulot qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ maxWidth: 320, height: 42 }}
          />
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {categories.map((cat) => (
              <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                background: activeCategory === cat ? 'var(--accent)' : 'var(--bg-elevated)',
                border: '1px solid ' + (activeCategory === cat ? 'var(--accent)' : 'var(--border)'),
                borderRadius: 20, padding: '8px 16px',
                color: activeCategory === cat ? 'white' : 'var(--text-muted)',
                fontSize: 13, fontWeight: 500, cursor: 'pointer',
                fontFamily: "'Manrope', sans-serif", transition: 'all 0.2s',
              }}>{cat}</button>
            ))}
          </div>
          <select value={sort} onChange={e => setSort(e.target.value)} style={{
            background: 'var(--bg-elevated)', border: '1px solid var(--border)', borderRadius: 8,
            color: 'var(--text-muted)', padding: '8px 12px', fontSize: 13, cursor: 'pointer',
            fontFamily: "'Manrope', sans-serif", marginLeft: 'auto', outline: 'none',
          }}>
            <option value="new">Yangi birinchi</option>
            <option value="price-asc">Narx: arzondan qimmatga</option>
            <option value="price-desc">Narx: qimmatdan arzonga</option>
          </select>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, alignItems: 'stretch' }}>
          {lots.map((lot) => <LotCard key={lot.id} lot={lot} />)}
        </div>

        {lots.length === 0 && (
          <div style={{ textAlign: 'center', padding: '80px 0', color: 'var(--text-dim)', fontSize: 16 }}>
            {search ? `"${search}" bo'yicha hech narsa topilmadi` : "Hozircha lotlar yo'q"}
          </div>
        )}
      </main>
    </>
  );
}

export default function LotsPage() {
  return <Suspense fallback={null}><LotsContent /></Suspense>;
}
