'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, Plus, Trash2, Save, Zap } from 'lucide-react';
import { Characteristic } from '@/types';
import { apiAddLot, isAdminLoggedIn } from '@/lib/api';

export default function AdminLotNewPage() {
  const router = useRouter();
  const [saving, setSaving] = useState(false);

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [minOrder, setMinOrder] = useState('1');
  const [maxOrder, setMaxOrder] = useState('100');
  const [cooperationLink, setCooperationLink] = useState('');
  const [images, setImages] = useState<string[]>(['']);
  const [chars, setChars] = useState<Characteristic[]>([{ key: '', value: '' }]);

  useEffect(() => {
    if (!isAdminLoggedIn()) router.push('/admin/login');
  }, [router]);

  function addImage() { setImages([...images, '']); }
  function removeImage(i: number) { setImages(images.filter((_, idx) => idx !== i)); }
  function setImage(i: number, val: string) { setImages(images.map((img, idx) => idx === i ? val : img)); }

  function addChar() { setChars([...chars, { key: '', value: '' }]); }
  function removeChar(i: number) { setChars(chars.filter((_, idx) => idx !== i)); }
  function setChar(i: number, field: 'key' | 'value', val: string) {
    setChars(chars.map((c, idx) => idx === i ? { ...c, [field]: val } : c));
  }

  async function handleSave() {
    if (!title || !price) {
      alert("Iltimos, Nomi va Narxini kiriting");
      return;
    }
    setSaving(true);
    const newLot = {
      id: Date.now().toString(),
      title, description,
      price: parseInt(price) || 0,
      currency: 'UZS',
      category: category || 'Boshqa',
      stock: parseInt(stock) || 0,
      minOrder: parseInt(minOrder) || 1,
      maxOrder: parseInt(maxOrder) || 100,
      cooperationLink,
      cooperationPrice: undefined,
      images: images.filter(Boolean),
      characteristics: chars.filter((c) => c.key && c.value),
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    apiAddLot(newLot);
    await new Promise((r) => setTimeout(r, 400));
    setSaving(false);
    router.push('/admin/lots');
  }

  const lbl = (text: string, required = false) => (
    <label style={{ display: 'block', fontSize: 12, fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' as const, letterSpacing: 0.5, marginBottom: 8 }}>
      {text} {required && <span style={{ color: 'var(--danger)' }}>*</span>}
    </label>
  );

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      {/* Sidebar */}
      <aside style={{ width: 240, background: 'var(--bg-card)', borderRight: '1px solid var(--border)', padding: '24px 0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '0 20px 24px', borderBottom: '1px solid var(--border)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div style={{ width: 32, height: 32, borderRadius: 8, background: 'linear-gradient(135deg, var(--accent), #a78bfa)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Zap size={14} color="white" fill="white" />
            </div>
            <span className="font-display" style={{ fontSize: 14, fontWeight: 700 }}>Admin Panel</span>
          </div>
        </div>
        <nav style={{ padding: '16px 12px', flex: 1 }}>
          <Link href="/admin/lots" style={{ textDecoration: 'none' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', borderRadius: 10, color: 'var(--text-muted)', fontSize: 14, fontWeight: 500, marginBottom: 4 }}>
              ← Lotlar ro'yxati
            </div>
          </Link>
        </nav>
      </aside>

      {/* Main */}
      <main style={{ flex: 1, padding: '32px', overflowY: 'auto', maxWidth: 800 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 32 }}>
          <Link href="/admin/lots"><button className="btn-outline" style={{ padding: '8px 12px' }}><ArrowLeft size={16} /></button></Link>
          <div>
            <h1 className="font-display" style={{ fontSize: 24, fontWeight: 700 }}>Yangi lot</h1>
            <p style={{ color: 'var(--text-muted)', fontSize: 13, marginTop: 2 }}>Yangi mahsulot qo'shish</p>
          </div>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
          {/* Basic info */}
          <div className="card" style={{ padding: 24 }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 20 }}>Asosiy ma'lumotlar</h3>
            <div style={{ display: 'grid', gap: 16 }}>
              <div>{lbl('Nomi', true)}<input className="input" value={title} onChange={e => setTitle(e.target.value)} placeholder="Mahsulot nomi" /></div>
              <div>{lbl('Tavsif')}<textarea className="input" value={description} onChange={e => setDescription(e.target.value)} placeholder="Mahsulot haqida batafsil" style={{ minHeight: 100, resize: 'vertical' }} /></div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <div>{lbl('Narxi (UZS)', true)}<input className="input" type="number" value={price} onChange={e => setPrice(e.target.value)} placeholder="12500000" /></div>
                <div>{lbl('Kategoriya')}<input className="input" value={category} onChange={e => setCategory(e.target.value)} placeholder="Elektronika" /></div>
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 16 }}>
                <div>{lbl('Omborda')}<input className="input" type="number" value={stock} onChange={e => setStock(e.target.value)} placeholder="50" /></div>
                <div>{lbl('Min buyurtma')}<input className="input" type="number" value={minOrder} onChange={e => setMinOrder(e.target.value)} /></div>
                <div>{lbl('Max buyurtma')}<input className="input" type="number" value={maxOrder} onChange={e => setMaxOrder(e.target.value)} /></div>
              </div>
              <div>{lbl('Cooperation link')}<input className="input" value={cooperationLink} onChange={e => setCooperationLink(e.target.value)} placeholder="https://cooperation.uz/product/..." /></div>
            </div>
          </div>

          {/* Images */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Rasmlar (URL)</h3>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 13 }} onClick={addImage}><Plus size={14} /> Rasm qo'shish</button>
            </div>
            {images.map((img, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8, alignItems: 'center' }}>
                {img && <img src={img} alt="" style={{ width: 48, height: 48, objectFit: 'cover', borderRadius: 8, border: '1px solid var(--border)', flexShrink: 0 }} onError={e => (e.currentTarget.style.display = 'none')} />}
                <input className="input" value={img} onChange={e => setImage(i, e.target.value)} placeholder="https://example.com/image.jpg" />
                {images.length > 1 && <button className="btn-outline" style={{ padding: '8px', flexShrink: 0 }} onClick={() => removeImage(i)}><Trash2 size={14} /></button>}
              </div>
            ))}
          </div>

          {/* Characteristics */}
          <div className="card" style={{ padding: 24 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
              <h3 style={{ fontSize: 15, fontWeight: 700 }}>Xarakteristikalar</h3>
              <button className="btn-outline" style={{ padding: '6px 12px', fontSize: 13 }} onClick={addChar}><Plus size={14} /> Qo'shish</button>
            </div>
            {chars.map((c, i) => (
              <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: 8, marginBottom: 8 }}>
                <input className="input" value={c.key} onChange={e => setChar(i, 'key', e.target.value)} placeholder="Xususiyat (masalan: RAM)" />
                <input className="input" value={c.value} onChange={e => setChar(i, 'value', e.target.value)} placeholder="Qiymati (masalan: 8 GB)" />
                {chars.length > 1 && <button className="btn-outline" style={{ padding: '8px' }} onClick={() => removeChar(i)}><Trash2 size={14} /></button>}
              </div>
            ))}
          </div>

          <button className="btn-primary" onClick={handleSave} disabled={saving} style={{ alignSelf: 'flex-start', fontSize: 16, padding: '14px 32px' }}>
            <Save size={18} /> {saving ? 'Saqlanmoqda...' : "Saqlash"}
          </button>
        </div>
      </main>
    </div>
  );
}
