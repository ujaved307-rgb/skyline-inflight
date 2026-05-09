'use client';

import './inflight.css';
import { useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plane, Home, Film, Music2, GraduationCap, Palette, HeartPulse, Map as MapIcon,
  UtensilsCrossed, ShoppingBag, Sparkles, Wifi, Search, Play, Pause, SkipBack, SkipForward,
  Volume2, Bell, User, ChevronRight, Languages, BookOpen, Brain, Wind, Moon, Compass,
  Cloud, Sun, CloudRain, Pencil, Camera, Mic, X, Check, Plus, Minus, Star, Coffee, Wine,
  Headphones, Bookmark, ArrowRight, MessageCircle, Send,
} from 'lucide-react';

/* ------------------------------ data ------------------------------ */
const FLIGHT = {
  number: 'SK 218',
  from: { code: 'SFO', city: 'San Francisco' },
  to: { code: 'CDG', city: 'Paris' },
  totalMin: 645,
  altitude: 37000,
  speed: 892,
  outsideTemp: -54,
  localTimeArrival: '08:42',
};

const MOVIES = [
  { t: 'Atlas of the Sky', g: 'Drama', d: '2h 12m', y: 2025, c1: '#1f3a3a', c2: '#0f1f1f' },
  { t: 'Quiet Engines', g: 'Thriller', d: '1h 48m', y: 2024, c1: '#3a1f2c', c2: '#1f0f17' },
  { t: 'North of Memory', g: 'Drama', d: '2h 02m', y: 2025, c1: '#2a2f3a', c2: '#11141f' },
  { t: 'Hummingbird', g: 'Animation', d: '1h 36m', y: 2024, c1: '#3a3a1f', c2: '#1f1f0f' },
  { t: 'Last Light', g: 'Sci-Fi', d: '2h 28m', y: 2025, c1: '#1f2a3a', c2: '#0f141f' },
  { t: 'Saltwater', g: 'Romance', d: '1h 52m', y: 2023, c1: '#3a2a1f', c2: '#1f140f' },
];
const SERIES = [
  { t: 'Lattice', g: '1 season · Drama', c1: '#2a3a1f', c2: '#141f0f' },
  { t: 'Glasshouse', g: '2 seasons · Mystery', c1: '#3a1f3a', c2: '#1f0f1f' },
  { t: 'Iron Wind', g: '1 season · Action', c1: '#1f3a2a', c2: '#0f1f14' },
];
const PODCASTS = [
  { t: 'Long Haul', a: 'Travel essays', d: '32m' },
  { t: 'Built / Unbuilt', a: 'Architecture', d: '47m' },
  { t: 'Cold Open', a: 'Cinema notes', d: '28m' },
  { t: 'Borrowed Sound', a: 'Music history', d: '54m' },
];
const PLAYLISTS = [
  { t: 'Window Seat', s: 'Ambient · 2h 14m' },
  { t: 'Tarmac Lounge', s: 'Jazz · 1h 48m' },
  { t: 'Cruise Altitude', s: 'Electronic · 3h 02m' },
  { t: 'Slow Descent', s: 'Classical · 1h 22m' },
];

const COURSES = [
  { t: 'Survival French', s: '12 micro-lessons · 4 min each', icon: Languages, p: 0.42 },
  { t: 'Sketching Basics', s: '8 lessons · pen + paper', icon: Pencil, p: 0.10 },
  { t: 'Mindful Focus', s: '6 lessons · audio guided', icon: Brain, p: 0.66 },
  { t: 'Photography 101', s: '10 lessons · interactive', icon: Camera, p: 0.0 },
  { t: 'Negotiation', s: '5 lessons · scenarios', icon: MessageCircle, p: 0.20 },
  { t: 'Wine Fundamentals', s: '7 lessons · tasting notes', icon: Wine, p: 0.0 },
];

const FRENCH = [
  { fr: 'Bonjour', en: 'Hello' },
  { fr: "S'il vous plaît", en: 'Please' },
  { fr: 'Merci beaucoup', en: 'Thank you very much' },
  { fr: 'Où est la station ?', en: 'Where is the station?' },
  { fr: "L'addition, s'il vous plaît", en: 'The check, please' },
  { fr: 'Je voudrais un café', en: 'I would like a coffee' },
];

const PARIS_SPOTS = [
  { t: 'Marais walk', s: 'Half-day · neighborhoods', tag: 'Local' },
  { t: 'Musée d’Orsay', s: '2–3h · art', tag: 'Culture' },
  { t: 'Canal Saint-Martin', s: 'Evening · cafés', tag: 'Food' },
  { t: 'Sainte-Chapelle', s: '45m · architecture', tag: 'Quiet' },
];

const MEALS = [
  { t: 'Miso-glazed cod', s: 'with jasmine rice, bok choy', tag: 'Chef’s pick', kcal: 540 },
  { t: 'Roasted chicken', s: 'lemon herb, root vegetables', tag: 'Classic', kcal: 610 },
  { t: 'Wild mushroom risotto', s: 'parmesan, truffle oil', tag: 'Vegetarian', kcal: 580 },
  { t: 'Cold soba bowl', s: 'cucumber, sesame, scallion', tag: 'Light', kcal: 420 },
];

const SHOP = [
  { t: 'Aesop Resurrection Hand Balm', s: 'Travel set · 75ml', p: '€32' },
  { t: 'Bose QC Ultra', s: 'Wireless headphones', p: '€379' },
  { t: 'Hermès Eau de Pamplemousse', s: '100ml EDC', p: '€128' },
  { t: 'Muji Aroma Diffuser', s: 'Travel size', p: '€44' },
];

/* ------------------------------ helpers ------------------------------ */
function fmt(min: number) {
  const h = Math.floor(min / 60);
  const m = Math.round(min % 60);
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

function Poster({ c1, c2, label, sub }: { c1: string; c2: string; label: string; sub?: string }) {
  return (
    <div className="poster" style={{ background: `linear-gradient(135deg, ${c1}, ${c2})` }}>
      <div>
        <div style={{ fontSize: 13, fontWeight: 700, letterSpacing: '-0.01em' }}>{label}</div>
        {sub && <div style={{ fontSize: 10, color: 'rgba(240,240,242,0.72)', marginTop: 2 }}>{sub}</div>}
      </div>
    </div>
  );
}

/* ------------------------------ flight progress hook ------------------------------ */
function useFlightProgress() {
  const [elapsed, setElapsed] = useState(214); // minutes flown
  useEffect(() => {
    const id = setInterval(() => setElapsed((e) => Math.min(FLIGHT.totalMin, e + 1 / 6)), 1000);
    return () => clearInterval(id);
  }, []);
  const pct = elapsed / FLIGHT.totalMin;
  const remaining = FLIGHT.totalMin - elapsed;
  return { elapsed, pct, remaining };
}

/* ------------------------------ top bar ------------------------------ */
function TopBar({ remaining, pct, onSearch }: { remaining: number; pct: number; onSearch: () => void }) {
  return (
    <div className="topbar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
        <Plane size={14} color="#C8F06E" />
        <span style={{ fontSize: 12, fontWeight: 600 }}>{FLIGHT.number}</span>
        <span style={{ fontSize: 11, color: '#6B6B72' }}>·</span>
        <span style={{ fontSize: 11, color: '#6B6B72' }} className="t-mono">
          {FLIGHT.from.code} → {FLIGHT.to.code}
        </span>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 10, maxWidth: 420 }}>
        <span className="t-mono" style={{ fontSize: 10, color: '#6B6B72' }}>{FLIGHT.from.code}</span>
        <div style={{ flex: 1, height: 2, background: '#2A2A2E', borderRadius: 100, position: 'relative' }}>
          <div style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: `${pct * 100}%`, background: '#C8F06E', borderRadius: 100 }} />
          <motion.div
            style={{ position: 'absolute', left: `${pct * 100}%`, top: -5, width: 12, height: 12, marginLeft: -6, color: '#C8F06E' }}
            animate={{ rotate: 90 }}
          >
            <Plane size={12} color="#C8F06E" />
          </motion.div>
        </div>
        <span className="t-mono" style={{ fontSize: 10, color: '#6B6B72' }}>{FLIGHT.to.code}</span>
      </div>
      <span className="t-mono" style={{ fontSize: 11, color: '#F0F0F2' }}>{fmt(remaining)} left</span>
      <div style={{ flex: 1 }} />
      <button className="rail-btn" style={{ width: 32, height: 32 }} onClick={onSearch} aria-label="Search">
        <Search size={14} />
      </button>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B6B72', fontSize: 11 }}>
        <Wifi size={12} />
        <span className="t-mono">Online</span>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11 }}>
        <div style={{ width: 22, height: 22, borderRadius: 100, background: '#2A2A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <User size={12} />
        </div>
        <span className="t-mono" style={{ color: '#6B6B72' }}>14A</span>
      </div>
    </div>
  );
}

/* ------------------------------ rail ------------------------------ */
type TabId = 'home' | 'watch' | 'listen' | 'learn' | 'create' | 'wellness' | 'map' | 'destination' | 'food' | 'shop';
const TABS: { id: TabId; icon: any; label: string }[] = [
  { id: 'home', icon: Home, label: 'Home' },
  { id: 'watch', icon: Film, label: 'Watch' },
  { id: 'listen', icon: Music2, label: 'Listen' },
  { id: 'learn', icon: GraduationCap, label: 'Learn' },
  { id: 'create', icon: Palette, label: 'Create' },
  { id: 'wellness', icon: HeartPulse, label: 'Wellness' },
  { id: 'map', icon: MapIcon, label: 'Map' },
  { id: 'destination', icon: Compass, label: 'Arrive' },
  { id: 'food', icon: UtensilsCrossed, label: 'Dine' },
  { id: 'shop', icon: ShoppingBag, label: 'Shop' },
];

function Rail({ tab, setTab }: { tab: TabId; setTab: (t: TabId) => void }) {
  return (
    <div className="rail">
      <div className="rail-btn" style={{ color: '#C8F06E', cursor: 'default' }} aria-hidden>
        <Sparkles size={16} />
      </div>
      <div style={{ height: 8 }} />
      {TABS.map((t) => {
        const Icon = t.icon;
        const active = tab === t.id;
        return (
          <button
            key={t.id}
            className={`rail-btn ${active ? 'active' : ''}`}
            onClick={() => setTab(t.id)}
            aria-label={t.label}
            style={{ position: 'relative' }}
            title={t.label}
          >
            <Icon size={16} />
          </button>
        );
      })}
    </div>
  );
}

/* ------------------------------ bottom bar ------------------------------ */
function BottomBar({
  playing, setPlaying, track, vol, setVol, onAssistant,
}: {
  playing: boolean; setPlaying: (p: boolean) => void; track: { t: string; a: string };
  vol: number; setVol: (v: number) => void; onAssistant: () => void;
}) {
  return (
    <div className="bottombar">
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, minWidth: 220 }}>
        <div style={{ width: 36, height: 36, borderRadius: 8, background: 'linear-gradient(135deg,#1f3a2a,#0f1f14)' }} />
        <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.2 }}>
          <span style={{ fontSize: 12, fontWeight: 600 }}>{track.t}</span>
          <span style={{ fontSize: 10, color: '#6B6B72' }}>{track.a}</span>
        </div>
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <button className="rail-btn" style={{ width: 30, height: 30 }} aria-label="Previous"><SkipBack size={13} /></button>
        <button
          className="rail-btn"
          style={{ width: 32, height: 32, background: '#C8F06E', color: '#0D0D0F' }}
          onClick={() => setPlaying(!playing)}
          aria-label={playing ? 'Pause' : 'Play'}
        >
          {playing ? <Pause size={14} /> : <Play size={14} />}
        </button>
        <button className="rail-btn" style={{ width: 30, height: 30 }} aria-label="Next"><SkipForward size={13} /></button>
      </div>
      <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: 8 }}>
        <Volume2 size={12} color="#6B6B72" />
        <input
          className="range" type="range" min={0} max={100} value={vol}
          onChange={(e) => setVol(parseInt(e.target.value))} aria-label="Volume"
        />
        <span className="t-mono" style={{ fontSize: 10, color: '#6B6B72', width: 28, textAlign: 'right' }}>{vol}</span>
      </div>
      <button className="btn" onClick={onAssistant} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
        <Sparkles size={12} color="#C8F06E" />
        <span>Ask Skyline</span>
        <span className="kbd">AI</span>
      </button>
    </div>
  );
}

/* ============================== TABS ============================== */

/* ------- Home ------- */
function HomeTab({ remaining, setTab, onPlay }: { remaining: number; setTab: (t: TabId) => void; onPlay: (t: { t: string; a: string }) => void }) {
  const greet = useMemo(() => {
    const h = new Date().getHours();
    if (h < 5) return 'Good night';
    if (h < 12) return 'Good morning';
    if (h < 18) return 'Good afternoon';
    return 'Good evening';
  }, []);
  return (
    <div className="scrolly" style={{ height: '100%', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="t-eyebrow">Welcome aboard · 14A</div>
          <div className="t-title" style={{ marginTop: 4 }}>{greet}, Alex.</div>
          <div className="t-body" style={{ marginTop: 4, maxWidth: 560 }}>
            You have {fmt(remaining)} until Paris. Here’s what we picked for the rest of your flight — a mix of relaxing, productive and curious.
          </div>
        </div>
        <div className="card" style={{ padding: '10px 12px', display: 'flex', gap: 14, alignItems: 'center' }}>
          <Cloud size={14} color="#C8F06E" />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <span style={{ fontSize: 11, color: '#6B6B72' }}>Paris on arrival</span>
            <span className="t-mono" style={{ fontSize: 13 }}>14° · light rain</span>
          </div>
        </div>
      </div>

      {/* hero recommendation */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.4fr 1fr', gap: 14, marginTop: 16 }}>
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}
          style={{ padding: 16, display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 178, background: 'linear-gradient(135deg,#1a2418,#0f1310)' }}
        >
          <div>
            <div className="t-eyebrow" style={{ color: '#C8F06E' }}>Curated for this leg</div>
            <div className="t-title" style={{ marginTop: 6 }}>Arrive speaking a little French.</div>
            <div className="t-body" style={{ marginTop: 6, maxWidth: 420 }}>
              Six four-minute micro-lessons fit perfectly before landing. Audio + flashcards, no Wi-Fi needed.
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
            <button className="btn btn-primary" onClick={() => setTab('learn')}>Start lesson 1</button>
            <button className="btn">Preview</button>
            <div style={{ flex: 1 }} />
            <span className="t-mono" style={{ fontSize: 11, color: '#6B6B72', alignSelf: 'center' }}>~24 min total</span>
          </div>
        </motion.div>

        <motion.div
          className="card"
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.05 }}
          style={{ padding: 16, display: 'flex', flexDirection: 'column', gap: 10 }}
        >
          <div className="t-eyebrow">Quick start</div>
          {[
            { icon: Wind, t: 'Box breathing · 4 min', sub: 'Settle in', tab: 'wellness' as TabId },
            { icon: Headphones, t: 'Window Seat playlist', sub: 'Ambient · 2h 14m', tab: 'listen' as TabId, play: { t: 'Window Seat', a: 'Ambient · skyline' } },
            { icon: Pencil, t: 'Sketch the clouds', sub: 'Creative studio', tab: 'create' as TabId },
          ].map((x, i) => {
            const Icon = x.icon;
            return (
              <button
                key={i}
                className="card glow"
                onClick={() => { setTab(x.tab); if ((x as any).play) onPlay((x as any).play); }}
                style={{ padding: 10, display: 'flex', alignItems: 'center', gap: 10, textAlign: 'left' }}
              >
                <div style={{ width: 32, height: 32, borderRadius: 8, background: '#0D0D0F', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #2A2A2E' }}>
                  <Icon size={14} color="#C8F06E" />
                </div>
                <div style={{ flex: 1, lineHeight: 1.3 }}>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{x.t}</div>
                  <div style={{ fontSize: 10, color: '#6B6B72' }}>{x.sub}</div>
                </div>
                <ChevronRight size={14} color="#6B6B72" />
              </button>
            );
          })}
        </motion.div>
      </div>

      {/* continue */}
      <div style={{ marginTop: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div className="t-h2">Continue</div>
        <button className="pill" onClick={() => setTab('watch')}>See all</button>
      </div>
      <div className="scrollx" style={{ display: 'flex', gap: 12, paddingBottom: 4, marginTop: 8 }}>
        {MOVIES.slice(0, 4).map((m, i) => (
          <motion.div
            key={m.t}
            className="tile"
            style={{ flex: '0 0 200px', scrollSnapAlign: 'start' }}
            initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.04 }}
            onClick={() => setTab('watch')}
          >
            <Poster c1={m.c1} c2={m.c2} label={m.t} sub={`${m.g} · ${m.d}`} />
            <div style={{ height: 2, background: '#2A2A2E', position: 'relative' }}>
              <div style={{ position: 'absolute', inset: 0, width: `${20 + i * 17}%`, background: '#C8F06E' }} />
            </div>
            <div className="meta" style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 11 }}>{m.t}</span>
              <span style={{ fontSize: 10, color: '#6B6B72' }}>{m.d}</span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* AI insights row */}
      <div style={{ marginTop: 16 }} className="t-h2">Smart for your trip</div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginTop: 8 }}>
        {[
          { icon: Compass, t: 'Paris is 9h ahead', s: 'Suggest a 30-min nap at hour 7 to ease jet lag.', cta: 'Schedule', tab: 'wellness' as TabId },
          { icon: Languages, t: '6 phrases for landing', s: 'Customs, taxi, café — covered in 8 minutes.', cta: 'Practice', tab: 'learn' as TabId },
          { icon: Sun, t: 'Sunrise over Greenland', s: 'In ~42 min on the right side of the plane.', cta: 'Open map', tab: 'map' as TabId },
        ].map((c, i) => {
          const Icon = c.icon;
          return (
            <motion.div
              key={i}
              className="card"
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
              style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 8 }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 26, height: 26, borderRadius: 8, background: '#0D0D0F', border: '1px solid #2A2A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Icon size={13} color="#C8F06E" />
                </div>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{c.t}</span>
              </div>
              <div className="t-body">{c.s}</div>
              <button className="pill" style={{ alignSelf: 'flex-start' }} onClick={() => setTab(c.tab)}>{c.cta}</button>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}

/* ------- Watch ------- */
function WatchTab() {
  const cats = ['For you', 'New', 'Drama', 'Comedy', 'Sci-Fi', 'Animation', 'Short films', 'Series'];
  const [cat, setCat] = useState('For you');
  const [open, setOpen] = useState<typeof MOVIES[number] | null>(null);
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', gap: 8, alignItems: 'center' }}>
        <div className="t-h2">Watch</div>
        <div style={{ flex: 1 }} />
        <div style={{ display: 'flex', gap: 6, overflowX: 'auto' }}>
          {cats.map((c) => (
            <button key={c} className={`pill ${c === cat ? 'active' : ''}`} onClick={() => setCat(c)}>{c}</button>
          ))}
        </div>
      </div>
      <div className="scrolly" style={{ flex: 1, padding: '4px 18px 18px' }}>
        <div className="t-eyebrow" style={{ marginBottom: 8 }}>Featured</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {MOVIES.map((m, i) => (
            <motion.button
              key={m.t}
              className="tile"
              onClick={() => setOpen(m)}
              initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
              style={{ textAlign: 'left' }}
            >
              <Poster c1={m.c1} c2={m.c2} label={m.t} sub={`${m.g} · ${m.y}`} />
              <div className="meta" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 11 }}>{m.t}</span>
                <span style={{ fontSize: 10, color: '#6B6B72' }}>{m.d}</span>
              </div>
            </motion.button>
          ))}
        </div>
        <div className="t-eyebrow" style={{ margin: '16px 0 8px' }}>Series</div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
          {SERIES.map((s) => (
            <div key={s.t} className="tile">
              <Poster c1={s.c1} c2={s.c2} label={s.t} sub={s.g} />
              <div className="meta" style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 11 }}>{s.t}</span>
                <span style={{ fontSize: 10, color: '#6B6B72' }}>{s.g}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,10,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 18, zIndex: 10 }}
            onClick={() => setOpen(null)}
          >
            <motion.div
              initial={{ scale: 0.96, y: 10 }} animate={{ scale: 1, y: 0 }} exit={{ scale: 0.96, opacity: 0 }}
              className="card"
              style={{ width: 720, padding: 0, overflow: 'hidden' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div style={{ height: 220, background: `linear-gradient(135deg, ${open.c1}, ${open.c2})`, position: 'relative' }}>
                <button className="rail-btn" style={{ position: 'absolute', top: 10, right: 10, width: 30, height: 30, background: '#0D0D0F' }} onClick={() => setOpen(null)}>
                  <X size={14} />
                </button>
              </div>
              <div style={{ padding: 16 }}>
                <div className="t-title">{open.t}</div>
                <div className="t-body" style={{ marginTop: 4 }}>{open.g} · {open.d} · {open.y}</div>
                <div className="t-body" style={{ marginTop: 8, maxWidth: 560 }}>
                  A quietly powerful story you can finish before landing. Subtitles available in 14 languages, audio in 6.
                </div>
                <div style={{ display: 'flex', gap: 8, marginTop: 14, alignItems: 'center' }}>
                  <button className="btn btn-primary"><Play size={12} style={{ marginRight: 6, verticalAlign: -2 }} />Play</button>
                  <button className="btn"><Bookmark size={12} style={{ marginRight: 6, verticalAlign: -2 }} />Save</button>
                  <button className="btn">Trailer</button>
                  <div style={{ flex: 1 }} />
                  <span className="t-mono" style={{ fontSize: 11, color: '#6B6B72' }}>Fits in remaining flight time ✓</span>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ------- Listen ------- */
function ListenTab({ onPlay }: { onPlay: (t: { t: string; a: string }) => void }) {
  const [mode, setMode] = useState<'mood' | 'podcasts' | 'sleep'>('mood');
  const moods = ['Calm', 'Focus', 'Lift-off', 'Sleep', 'Window seat'];
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', gap: 10, alignItems: 'center' }}>
        <div className="t-h2">Listen</div>
        <div style={{ flex: 1 }} />
        {(['mood', 'podcasts', 'sleep'] as const).map((m) => (
          <button key={m} className={`pill ${mode === m ? 'active' : ''}`} onClick={() => setMode(m)}>
            {m === 'mood' ? 'By mood' : m === 'podcasts' ? 'Podcasts' : 'Sleep'}
          </button>
        ))}
      </div>
      <div className="scrolly" style={{ flex: 1, padding: '0 18px 18px' }}>
        {mode === 'mood' && (
          <>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 12 }}>
              {moods.map((m, i) => (
                <button key={m} className={`pill ${i === 0 ? 'active' : ''}`}>{m}</button>
              ))}
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
              {PLAYLISTS.concat(PLAYLISTS).map((p, i) => (
                <motion.button
                  key={i}
                  className="tile"
                  onClick={() => onPlay({ t: p.t, a: p.s })}
                  initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.03 }}
                  style={{ textAlign: 'left' }}
                >
                  <div className="poster" style={{
                    background: `linear-gradient(135deg, hsl(${(i * 53) % 360} 30% 22%), hsl(${(i * 53 + 60) % 360} 25% 12%))`,
                    aspectRatio: '1/1',
                  }}>
                    <Music2 size={18} color="#C8F06E" />
                  </div>
                  <div className="meta">
                    <div style={{ fontSize: 12, fontWeight: 600 }}>{p.t}</div>
                    <div style={{ fontSize: 10, color: '#6B6B72' }}>{p.s}</div>
                  </div>
                </motion.button>
              ))}
            </div>
          </>
        )}
        {mode === 'podcasts' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
            {PODCASTS.map((p) => (
              <div key={p.t} className="card" style={{ padding: 12, display: 'flex', alignItems: 'center', gap: 12 }}>
                <div style={{ width: 56, height: 56, borderRadius: 10, background: 'linear-gradient(135deg,#3a2a1f,#1f140f)' }} />
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{p.t}</div>
                  <div style={{ fontSize: 11, color: '#6B6B72' }}>{p.a} · {p.d}</div>
                </div>
                <button className="rail-btn" style={{ width: 32, height: 32, background: '#C8F06E', color: '#0D0D0F' }} onClick={() => onPlay({ t: p.t, a: p.a })}>
                  <Play size={13} />
                </button>
              </div>
            ))}
          </div>
        )}
        {mode === 'sleep' && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
            {['Rain on roof', 'Cabin hum', 'Forest at dusk', 'Soft piano', 'Brown noise', 'Slow waves'].map((s, i) => (
              <button key={s} className="card" onClick={() => onPlay({ t: s, a: 'Sleep · ambience' })} style={{ padding: 14, textAlign: 'left' }}>
                <Moon size={14} color="#C8F06E" />
                <div style={{ fontSize: 13, fontWeight: 600, marginTop: 8 }}>{s}</div>
                <div style={{ fontSize: 10, color: '#6B6B72', marginTop: 2 }}>Loop · auto-fade</div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------- Learn ------- */
function LearnTab() {
  const [active, setActive] = useState<number | null>(0);
  const [idx, setIdx] = useState(0);
  const card = FRENCH[idx];
  const [revealed, setRevealed] = useState(false);
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0 }}>
      <div className="scrolly" style={{ padding: '14px 18px', borderRight: '1px solid #2A2A2E' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="t-h2">Learn</div>
          <div style={{ flex: 1 }} />
          <span className="pill active" style={{ cursor: 'default' }}>Fits this flight</span>
        </div>
        <div className="t-body" style={{ marginTop: 4 }}>Tiny lessons designed for short attention windows. No homework, real progress.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
          {COURSES.map((c, i) => {
            const Icon = c.icon;
            return (
              <button
                key={c.t}
                className="card"
                onClick={() => { setActive(i); setIdx(0); setRevealed(false); }}
                style={{
                  padding: 12, textAlign: 'left', borderColor: active === i ? '#C8F06E' : '#2A2A2E',
                  display: 'flex', flexDirection: 'column', gap: 8, cursor: 'pointer',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 28, height: 28, borderRadius: 8, background: '#0D0D0F', border: '1px solid #2A2A2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Icon size={14} color="#C8F06E" />
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{c.t}</span>
                </div>
                <div style={{ fontSize: 10, color: '#6B6B72' }}>{c.s}</div>
                <div style={{ height: 2, background: '#2A2A2E', borderRadius: 100, overflow: 'hidden' }}>
                  <div style={{ width: `${c.p * 100}%`, height: '100%', background: '#C8F06E' }} />
                </div>
              </button>
            );
          })}
        </div>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', padding: 18, gap: 12 }}>
        <div className="t-eyebrow">Lesson 1 · {COURSES[active ?? 0].t}</div>
        <div className="t-h2">Flashcard {idx + 1} of {FRENCH.length}</div>
        <motion.div
          key={idx + (revealed ? '-r' : '')}
          initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
          className="card" style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, padding: 18 }}
          onClick={() => setRevealed((r) => !r)}
        >
          <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.02em' }}>{card.fr}</div>
          <div className="t-body">tap card to {revealed ? 'hide' : 'reveal'} translation</div>
          <AnimatePresence>
            {revealed && (
              <motion.div
                initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                style={{ fontSize: 16, color: '#C8F06E' }}
              >
                {card.en}
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button className="btn" onClick={() => { setIdx((i) => (i - 1 + FRENCH.length) % FRENCH.length); setRevealed(false); }}>Previous</button>
          <button className="btn"><Mic size={12} style={{ verticalAlign: -2, marginRight: 6 }} />Say it</button>
          <div style={{ flex: 1 }} />
          <button className="btn btn-primary" onClick={() => { setIdx((i) => (i + 1) % FRENCH.length); setRevealed(false); }}>
            Next <ArrowRight size={12} style={{ verticalAlign: -2, marginLeft: 6 }} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ------- Create ------- */
function CreateTab() {
  const tools = ['Sketch', 'Journal', 'Compose', 'Photo edit'];
  const [tool, setTool] = useState('Sketch');
  return (
    <div style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      <div style={{ padding: '14px 18px 10px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <div className="t-h2">Creative studio</div>
        <div style={{ flex: 1 }} />
        {tools.map((t) => (
          <button key={t} className={`pill ${tool === t ? 'active' : ''}`} onClick={() => setTool(t)}>{t}</button>
        ))}
      </div>
      <div style={{ flex: 1, padding: '0 18px 18px', display: 'grid', gridTemplateColumns: tool === 'Journal' ? '1fr' : '1fr 220px', gap: 12 }}>
        {tool === 'Sketch' && <SketchPad />}
        {tool === 'Journal' && <Journal />}
        {tool === 'Compose' && <Compose />}
        {tool === 'Photo edit' && <PhotoEdit />}
        {tool !== 'Journal' && (
          <div className="card" style={{ padding: 12, display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="t-eyebrow">Inspiration</div>
            <div className="t-body">A short prompt to get going.</div>
            <div style={{ fontSize: 13, fontWeight: 600 }}>“Draw the cloud you’ve been staring at for the last three minutes.”</div>
            <button className="btn">New prompt</button>
            <div className="divider" />
            <div className="t-eyebrow">Save to</div>
            <button className="btn">Boarding pass · 14A</button>
            <button className="btn">Email myself</button>
          </div>
        )}
      </div>
    </div>
  );
}

function SketchPad() {
  const ref = useRef<HTMLCanvasElement | null>(null);
  const drawing = useRef(false);
  const last = useRef<{ x: number; y: number } | null>(null);
  const [color, setColor] = useState('#C8F06E');
  const [size, setSize] = useState(3);
  useEffect(() => {
    const c = ref.current; if (!c) return;
    const ctx = c.getContext('2d')!;
    ctx.fillStyle = '#0D0D0F'; ctx.fillRect(0, 0, c.width, c.height);
  }, []);
  function pos(e: React.PointerEvent) {
    const c = ref.current!; const r = c.getBoundingClientRect();
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height };
  }
  return (
    <div className="card" style={{ display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', gap: 8, padding: 10, alignItems: 'center', borderBottom: '1px solid #2A2A2E' }}>
        {['#C8F06E', '#F0F0F2', '#6B6B72', '#2A2A2E'].map((c) => (
          <button key={c} onClick={() => setColor(c)} style={{
            width: 18, height: 18, borderRadius: 100, background: c, border: color === c ? '2px solid #F0F0F2' : '1px solid #2A2A2E', cursor: 'pointer',
          }} />
        ))}
        <div style={{ width: 1, height: 18, background: '#2A2A2E', margin: '0 4px' }} />
        <input className="range" type="range" min={1} max={20} value={size} onChange={(e) => setSize(parseInt(e.target.value))} style={{ width: 120 }} />
        <span className="t-mono" style={{ fontSize: 10, color: '#6B6B72' }}>{size}px</span>
        <div style={{ flex: 1 }} />
        <button className="btn" onClick={() => {
          const c = ref.current!; const ctx = c.getContext('2d')!;
          ctx.fillStyle = '#0D0D0F'; ctx.fillRect(0, 0, c.width, c.height);
        }}>Clear</button>
      </div>
      <canvas
        ref={ref}
        width={760} height={420}
        className="checker"
        style={{ width: '100%', flex: 1, borderRadius: '0 0 12px 12px', cursor: 'crosshair', touchAction: 'none' }}
        onPointerDown={(e) => { drawing.current = true; last.current = pos(e); }}
        onPointerUp={() => { drawing.current = false; last.current = null; }}
        onPointerLeave={() => { drawing.current = false; last.current = null; }}
        onPointerMove={(e) => {
          if (!drawing.current) return;
          const c = ref.current!; const ctx = c.getContext('2d')!;
          const p = pos(e); const l = last.current ?? p;
          ctx.strokeStyle = color; ctx.lineWidth = size; ctx.lineCap = 'round';
          ctx.beginPath(); ctx.moveTo(l.x, l.y); ctx.lineTo(p.x, p.y); ctx.stroke();
          last.current = p;
        }}
      />
    </div>
  );
}

function Journal() {
  const [text, setText] = useState('Today I noticed —');
  const words = text.trim() ? text.trim().split(/\s+/).length : 0;
  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 8 }}>
      <div className="t-eyebrow">Travel journal · {new Date().toDateString()}</div>
      <textarea className="text-input" value={text} onChange={(e) => setText(e.target.value)}
        style={{ flex: 1, resize: 'none', fontSize: 13, lineHeight: 1.6, padding: 14 }} />
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <span className="t-mono" style={{ fontSize: 10, color: '#6B6B72' }}>{words} words</span>
        <div style={{ flex: 1 }} />
        <button className="btn">AI rewrite</button>
        <button className="btn btn-primary">Save</button>
      </div>
    </div>
  );
}

function Compose() {
  const notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B'];
  const [seq, setSeq] = useState<string[]>([]);
  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="t-eyebrow">Tiny composer</div>
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
        {notes.map((n) => (
          <button key={n} className="pill" onClick={() => setSeq((s) => [...s, n])}>{n}</button>
        ))}
        <button className="pill" onClick={() => setSeq([])}>Clear</button>
      </div>
      <div className="card checker" style={{ flex: 1, padding: 12, display: 'flex', alignItems: 'flex-end', gap: 4 }}>
        {seq.map((n, i) => (
          <motion.div
            key={i}
            initial={{ height: 0 }} animate={{ height: 30 + (notes.indexOf(n) * 20) }}
            style={{ width: 14, background: '#C8F06E', borderRadius: 4 }}
          />
        ))}
      </div>
      <div style={{ display: 'flex', gap: 8 }}>
        <button className="btn"><Play size={12} style={{ verticalAlign: -2, marginRight: 6 }} />Preview</button>
        <div style={{ flex: 1 }} />
        <button className="btn btn-primary">Export to phone</button>
      </div>
    </div>
  );
}

function PhotoEdit() {
  const [b, setB] = useState(100); const [s, setS] = useState(100); const [h, setH] = useState(0);
  return (
    <div className="card" style={{ padding: 14, display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div className="t-eyebrow">Photo edit · sample</div>
      <div style={{ flex: 1, borderRadius: 12, background: 'linear-gradient(135deg,#3a2a1f,#1f3a3a)', filter: `brightness(${b}%) saturate(${s}%) hue-rotate(${h}deg)` }} />
      {[
        { l: 'Brightness', v: b, set: setB, min: 50, max: 150 },
        { l: 'Saturation', v: s, set: setS, min: 0, max: 200 },
        { l: 'Hue', v: h, set: setH, min: -180, max: 180 },
      ].map((r) => (
        <div key={r.l} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, width: 80, color: '#6B6B72' }}>{r.l}</span>
          <input className="range" type="range" min={r.min} max={r.max} value={r.v} onChange={(e) => r.set(parseInt(e.target.value))} />
          <span className="t-mono" style={{ fontSize: 10, color: '#6B6B72', width: 30, textAlign: 'right' }}>{r.v}</span>
        </div>
      ))}
    </div>
  );
}

/* ------- Wellness ------- */
function WellnessTab() {
  const [phase, setPhase] = useState<'idle' | 'in' | 'hold' | 'out' | 'rest'>('idle');
  const [count, setCount] = useState(4);
  const [running, setRunning] = useState(false);
  useEffect(() => {
    if (!running) return;
    const seq: ('in' | 'hold' | 'out' | 'rest')[] = ['in', 'hold', 'out', 'rest'];
    let s = 0; let c = 4;
    setPhase('in'); setCount(4);
    const id = setInterval(() => {
      c -= 1;
      if (c === 0) { s = (s + 1) % seq.length; c = 4; setPhase(seq[s]); setCount(4); }
      else setCount(c);
    }, 1000);
    return () => clearInterval(id);
  }, [running]);
  const scale = phase === 'in' ? 1 : phase === 'out' ? 0.6 : phase === 'hold' ? 1 : 0.6;
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.1fr 1fr', gap: 0 }}>
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', borderRight: '1px solid #2A2A2E', padding: 24 }}>
        <div className="t-eyebrow">Box breathing</div>
        <motion.div
          animate={{ scale }}
          transition={{ duration: 1, ease: 'easeInOut' }}
          style={{
            marginTop: 14, width: 220, height: 220, borderRadius: 100, border: '1px solid #2A2A2E',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column',
            background: 'radial-gradient(circle at 50% 50%, rgba(200,240,110,0.12), transparent 70%)',
          }}
        >
          <div style={{ fontSize: 14, color: '#C8F06E', textTransform: 'uppercase', letterSpacing: '0.18em' }}>
            {phase === 'idle' ? 'ready' : phase}
          </div>
          <div className="t-mono" style={{ fontSize: 48, fontWeight: 700, marginTop: 4 }}>{running ? count : 4}</div>
        </motion.div>
        <div style={{ display: 'flex', gap: 8, marginTop: 18 }}>
          <button className="btn btn-primary" onClick={() => setRunning((r) => !r)}>
            {running ? 'Stop' : 'Start 4 minutes'}
          </button>
          <button className="btn">Try 4-7-8</button>
        </div>
      </div>
      <div className="scrolly" style={{ padding: 18 }}>
        <div className="t-h2">Long-haul wellness</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {[
            { icon: Wind, t: 'Seat stretches', s: '6 moves · 5 min', tag: 'Now' },
            { icon: Moon, t: 'Sleep window', s: 'Best in 1h 12m · 35 min nap', tag: 'AI' },
            { icon: HeartPulse, t: 'Hydration nudge', s: 'Drink water in 18 min', tag: 'Auto' },
            { icon: Sun, t: 'Light therapy', s: 'Match Paris sunrise', tag: 'Jet lag' },
          ].map((c, i) => {
            const Icon = c.icon;
            return (
              <button key={i} className="card glow" style={{ padding: 12, textAlign: 'left' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <Icon size={14} color="#C8F06E" />
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{c.t}</span>
                  <div style={{ flex: 1 }} />
                  <span className="pill" style={{ padding: '2px 8px', fontSize: 9 }}>{c.tag}</span>
                </div>
                <div className="t-body" style={{ marginTop: 6 }}>{c.s}</div>
              </button>
            );
          })}
        </div>
        <div className="t-h2" style={{ marginTop: 16 }}>Mood check-in</div>
        <div style={{ display: 'flex', gap: 8, marginTop: 8 }}>
          {['Tired', 'Restless', 'Calm', 'Excited', 'Anxious'].map((m, i) => (
            <button key={m} className={`pill ${i === 2 ? 'active' : ''}`}>{m}</button>
          ))}
        </div>
        <div className="t-body" style={{ marginTop: 8 }}>Skyline will tune lighting and audio to match. Ambient lights dim slightly when you’re calm.</div>
      </div>
    </div>
  );
}

/* ------- Map ------- */
function MapTab({ pct }: { pct: number }) {
  // path from bottom-left to top-right with arc
  const A = { x: 90, y: 380 }, B = { x: 700, y: 90 };
  const C = { x: 380, y: 70 }; // control point for arc
  const t = pct;
  const x = (1 - t) * (1 - t) * A.x + 2 * (1 - t) * t * C.x + t * t * B.x;
  const y = (1 - t) * (1 - t) * A.y + 2 * (1 - t) * t * C.y + t * t * B.y;
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1fr 280px' }}>
      <div style={{ position: 'relative', borderRight: '1px solid #2A2A2E', overflow: 'hidden' }}>
        <svg viewBox="0 0 800 460" style={{ width: '100%', height: '100%' }}>
          <defs>
            <pattern id="grid" width="32" height="32" patternUnits="userSpaceOnUse">
              <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1c1c20" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#grid)" />
          {/* stylized continents */}
          <path d="M40,260 C140,210 220,260 290,250 C360,240 420,200 480,220 C540,240 580,300 540,340 C500,380 420,360 360,360 C260,360 100,360 40,330 Z" fill="#13131a" stroke="#2A2A2E" />
          <path d="M520,80 C600,70 700,90 760,150 C780,200 760,260 700,280 C640,300 580,260 560,210 C540,160 480,120 520,80 Z" fill="#13131a" stroke="#2A2A2E" />
          {/* path */}
          <path d={`M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke="#2A2A2E" strokeWidth="2" strokeDasharray="4 6" />
          <path d={`M${A.x},${A.y} Q${C.x},${C.y} ${B.x},${B.y}`} fill="none" stroke="#C8F06E" strokeWidth="2" strokeDasharray="500" strokeDashoffset={500 * (1 - pct)} />
          <circle cx={A.x} cy={A.y} r="5" fill="#C8F06E" />
          <circle cx={B.x} cy={B.y} r="5" fill="none" stroke="#C8F06E" strokeWidth="2" />
          <text x={A.x + 10} y={A.y + 4} fill="#F0F0F2" fontSize="12" fontFamily="Inter">SFO</text>
          <text x={B.x + 10} y={B.y + 4} fill="#F0F0F2" fontSize="12" fontFamily="Inter">CDG</text>
          {/* plane marker */}
          <g transform={`translate(${x},${y}) rotate(35)`}>
            <circle r="14" fill="#0D0D0F" stroke="#C8F06E" />
            <path d="M-6,0 L0,-7 L6,0 L0,7 Z" fill="#C8F06E" />
          </g>
        </svg>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 12 }}>
        <div className="t-h2">Live status</div>
        <div className="card" style={{ padding: 12 }}>
          {[
            ['Altitude', `${FLIGHT.altitude.toLocaleString()} ft`],
            ['Ground speed', `${FLIGHT.speed} km/h`],
            ['Outside', `${FLIGHT.outsideTemp}°C`],
            ['ETA local', FLIGHT.localTimeArrival],
            ['Distance left', `${Math.round((1 - pct) * 9100)} km`],
          ].map(([k, v]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: '1px solid #2A2A2E' }}>
              <span style={{ fontSize: 11, color: '#6B6B72' }}>{k}</span>
              <span className="t-mono" style={{ fontSize: 12 }}>{v}</span>
            </div>
          ))}
        </div>
        <div className="t-eyebrow">Soon outside your window</div>
        <div className="card" style={{ padding: 12 }}>
          <div style={{ fontSize: 12, fontWeight: 600 }}>Sunrise over Greenland</div>
          <div className="t-body" style={{ marginTop: 4 }}>In 42 minutes · right side · seat 14A faces it.</div>
          <button className="pill active" style={{ marginTop: 8 }}>Wake me up</button>
        </div>
      </div>
    </div>
  );
}

/* ------- Destination ------- */
function DestinationTab() {
  return (
    <div className="scrolly" style={{ height: '100%', padding: 18 }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <div>
          <div className="t-eyebrow">Your destination</div>
          <div className="t-title" style={{ marginTop: 4 }}>Paris is preparing for you.</div>
          <div className="t-body" style={{ marginTop: 4, maxWidth: 520 }}>
            A short briefing — weather, money, transit, and a few nearby ideas tuned to a 3-day trip.
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          {[
            { icon: CloudRain, t: '14°', s: 'Rain · 9km/h' },
            { icon: Coffee, t: '€1.80', s: 'Espresso avg' },
            { icon: Compass, t: '+9h', s: 'vs SFO' },
          ].map((s, i) => {
            const Icon = s.icon;
            return (
              <div key={i} className="card" style={{ padding: 10, minWidth: 110, display: 'flex', flexDirection: 'column', gap: 4 }}>
                <Icon size={13} color="#C8F06E" />
                <div className="t-mono" style={{ fontSize: 14, fontWeight: 700 }}>{s.t}</div>
                <div style={{ fontSize: 10, color: '#6B6B72' }}>{s.s}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: 14, marginTop: 16 }}>
        <div className="card" style={{ padding: 14 }}>
          <div className="t-eyebrow">Half-day picks near your hotel</div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 10 }}>
            {PARIS_SPOTS.map((s) => (
              <div key={s.t} className="card glow" style={{ padding: 12 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 12, fontWeight: 600 }}>{s.t}</span>
                  <span className="pill" style={{ padding: '2px 8px', fontSize: 9 }}>{s.tag}</span>
                </div>
                <div className="t-body" style={{ marginTop: 6 }}>{s.s}</div>
                <div style={{ display: 'flex', gap: 6, marginTop: 8 }}>
                  <button className="pill">Save</button>
                  <button className="pill">Add to day 1</button>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card" style={{ padding: 14 }}>
          <div className="t-eyebrow">Arrival checklist</div>
          {[
            'Customs form pre-filled',
            'Taxi vs. RER B compared (€56 vs €11)',
            'eSIM ready · 5GB / 10 days',
            'Hotel check-in: 15:00',
            'First meal booked: Buvette · 13:00',
          ].map((c, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #2A2A2E' }}>
              <div style={{ width: 18, height: 18, borderRadius: 100, border: '1px solid #2A2A2E', display: 'flex', alignItems: 'center', justifyContent: 'center', background: i < 2 ? '#C8F06E' : 'transparent' }}>
                {i < 2 && <Check size={11} color="#0D0D0F" />}
              </div>
              <span style={{ fontSize: 12 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------- Food ------- */
function FoodTab() {
  const [chosen, setChosen] = useState<number | null>(null);
  const [drink, setDrink] = useState('Sparkling water');
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
      <div className="scrolly" style={{ padding: 18, borderRight: '1px solid #2A2A2E' }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <div className="t-h2">Tonight’s menu</div>
          <div style={{ flex: 1 }} />
          <span className="pill active" style={{ cursor: 'default' }}>Service in 1h 04m</span>
        </div>
        <div className="t-body" style={{ marginTop: 4 }}>Choose now to skip the cart wait. Allergens auto-checked against your profile.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {MEALS.map((m, i) => (
            <button
              key={m.t}
              className="card"
              onClick={() => setChosen(i)}
              style={{ padding: 12, textAlign: 'left', borderColor: chosen === i ? '#C8F06E' : '#2A2A2E' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{m.t}</span>
                <span className="pill" style={{ padding: '2px 8px', fontSize: 9 }}>{m.tag}</span>
              </div>
              <div className="t-body" style={{ marginTop: 6 }}>{m.s}</div>
              <div className="t-mono" style={{ fontSize: 10, color: '#6B6B72', marginTop: 6 }}>{m.kcal} kcal</div>
            </button>
          ))}
        </div>
        <div className="t-eyebrow" style={{ marginTop: 14 }}>Drink</div>
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8 }}>
          {['Sparkling water', 'Still water', 'Coffee', 'Green tea', 'Red wine', 'White wine', 'Champagne'].map((d) => (
            <button key={d} className={`pill ${drink === d ? 'active' : ''}`} onClick={() => setDrink(d)}>{d}</button>
          ))}
        </div>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="t-eyebrow">Your selection</div>
        <div className="card" style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column' }}>
          <div className="t-h2">{chosen === null ? 'No meal yet' : MEALS[chosen].t}</div>
          <div className="t-body" style={{ marginTop: 4 }}>{chosen === null ? 'Pick a dish on the left.' : MEALS[chosen].s}</div>
          <div className="divider" style={{ margin: '12px 0' }} />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
            <span style={{ color: '#6B6B72' }}>Drink</span><span>{drink}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
            <span style={{ color: '#6B6B72' }}>Allergens</span><span>None detected ✓</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, marginTop: 6 }}>
            <span style={{ color: '#6B6B72' }}>Served at</span><span className="t-mono">in 1h 04m</span>
          </div>
          <div style={{ flex: 1 }} />
          <button className="btn btn-primary" disabled={chosen === null} style={{ opacity: chosen === null ? 0.4 : 1 }}>Confirm order</button>
        </div>
      </div>
    </div>
  );
}

/* ------- Shop ------- */
function ShopTab() {
  const [cart, setCart] = useState<Record<number, number>>({});
  return (
    <div style={{ height: '100%', display: 'grid', gridTemplateColumns: '1.2fr 1fr' }}>
      <div className="scrolly" style={{ padding: 18, borderRight: '1px solid #2A2A2E' }}>
        <div className="t-h2">Duty free</div>
        <div className="t-body" style={{ marginTop: 4 }}>Reserve now, collect at the gate or have it delivered to seat.</div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 12 }}>
          {SHOP.map((it, i) => (
            <div key={it.t} className="card" style={{ padding: 12 }}>
              <div style={{ height: 80, borderRadius: 10, background: `linear-gradient(135deg, hsl(${i * 80} 25% 22%), hsl(${i * 80 + 60} 20% 12%))` }} />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <span style={{ fontSize: 12, fontWeight: 600 }}>{it.t}</span>
                <span className="t-mono" style={{ fontSize: 12 }}>{it.p}</span>
              </div>
              <div className="t-body" style={{ marginTop: 4 }}>{it.s}</div>
              <div style={{ display: 'flex', gap: 6, marginTop: 8, alignItems: 'center' }}>
                <button className="rail-btn" style={{ width: 26, height: 26 }} onClick={() => setCart((c) => ({ ...c, [i]: Math.max(0, (c[i] ?? 0) - 1) }))}><Minus size={11} /></button>
                <span className="t-mono" style={{ fontSize: 12, width: 18, textAlign: 'center' }}>{cart[i] ?? 0}</span>
                <button className="rail-btn" style={{ width: 26, height: 26 }} onClick={() => setCart((c) => ({ ...c, [i]: (c[i] ?? 0) + 1 }))}><Plus size={11} /></button>
                <div style={{ flex: 1 }} />
                <button className="pill">Save</button>
              </div>
            </div>
          ))}
        </div>
      </div>
      <div style={{ padding: 18, display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div className="t-eyebrow">Bag</div>
        <div className="card" style={{ padding: 14, flex: 1, display: 'flex', flexDirection: 'column', gap: 8 }}>
          {Object.entries(cart).filter(([, q]) => q > 0).length === 0 && <div className="t-body">Your bag is empty.</div>}
          {Object.entries(cart).filter(([, q]) => q > 0).map(([k, q]) => (
            <div key={k} style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12 }}>
              <span>{SHOP[+k].t} × {q}</span>
              <span className="t-mono">{SHOP[+k].p}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div className="divider" />
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 13 }}>
            <span>Total</span>
            <span className="t-mono" style={{ fontWeight: 700 }}>
              €{Object.entries(cart).reduce((sum, [k, q]) => sum + q * parseInt(SHOP[+k].p.replace(/\D/g, '')), 0)}
            </span>
          </div>
          <button className="btn btn-primary">Reserve</button>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Assistant overlay ------------------------------ */
function Assistant({ open, onClose, setTab }: { open: boolean; onClose: () => void; setTab: (t: TabId) => void }) {
  const [msgs, setMsgs] = useState<{ role: 'user' | 'ai'; t: string; cta?: { label: string; tab: TabId } }[]>([
    { role: 'ai', t: 'Hi Alex — I’m Skyline. I can suggest something to do, prep you for Paris, or help you sleep through the night. What sounds good?' },
  ]);
  const [val, setVal] = useState('');
  const ref = useRef<HTMLDivElement | null>(null);
  useEffect(() => { ref.current?.scrollTo({ top: 99999 }); }, [msgs]);
  function send(text: string) {
    if (!text.trim()) return;
    const t = text.trim().toLowerCase();
    setMsgs((m) => [...m, { role: 'user', t: text }]);
    setVal('');
    setTimeout(() => {
      let reply: typeof msgs[number] = { role: 'ai', t: 'Got it. I lined something up for you.' };
      if (t.includes('sleep')) reply = { role: 'ai', t: 'Best window starts in 1h 12m. I’ll dim your screen, queue brown noise, and wake you 30 min before landing.', cta: { label: 'Open Wellness', tab: 'wellness' } };
      else if (t.includes('paris') || t.includes('learn') || t.includes('french')) reply = { role: 'ai', t: 'Six four-minute French lessons cover customs, taxis and cafés. Want to start now?', cta: { label: 'Start lessons', tab: 'learn' } };
      else if (t.includes('movie') || t.includes('watch')) reply = { role: 'ai', t: '“Atlas of the Sky” fits the time you have left — quiet, gorgeous, 2h 12m. Subtitles in 14 languages.', cta: { label: 'Open Watch', tab: 'watch' } };
      else if (t.includes('food') || t.includes('eat')) reply = { role: 'ai', t: 'Service in about an hour. I can pre-order the miso-glazed cod with a sparkling water — sound good?', cta: { label: 'Open Dine', tab: 'food' } };
      else if (t.includes('map') || t.includes('where')) reply = { role: 'ai', t: 'You’re crossing Greenland soon. Sunrise on the right side in 42 minutes.', cta: { label: 'Open Map', tab: 'map' } };
      setMsgs((m) => [...m, reply]);
    }, 380);
  }
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
          style={{ position: 'absolute', inset: 0, background: 'rgba(8,8,10,0.7)', display: 'flex', alignItems: 'flex-end', justifyContent: 'center', zIndex: 20 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ y: 30, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 30, opacity: 0 }}
            className="card"
            style={{ width: 760, height: 420, marginBottom: 70, display: 'flex', flexDirection: 'column' }}
            onClick={(e) => e.stopPropagation()}
          >
            <div style={{ padding: 14, borderBottom: '1px solid #2A2A2E', display: 'flex', alignItems: 'center', gap: 10 }}>
              <Sparkles size={14} color="#C8F06E" />
              <div className="t-h2">Skyline Assistant</div>
              <span className="pill" style={{ padding: '2px 8px', fontSize: 9 }}>AI · private</span>
              <div style={{ flex: 1 }} />
              <button className="rail-btn" style={{ width: 30, height: 30 }} onClick={onClose}><X size={14} /></button>
            </div>
            <div ref={ref} className="scrolly" style={{ flex: 1, padding: 14, display: 'flex', flexDirection: 'column', gap: 10 }}>
              {msgs.map((m, i) => (
                <div key={i} style={{ display: 'flex', justifyContent: m.role === 'user' ? 'flex-end' : 'flex-start' }}>
                  <div style={{
                    maxWidth: 460, padding: '10px 12px', borderRadius: 12,
                    background: m.role === 'user' ? '#C8F06E' : '#161618',
                    color: m.role === 'user' ? '#0D0D0F' : '#F0F0F2',
                    border: m.role === 'user' ? 'none' : '1px solid #2A2A2E',
                    fontSize: 12, lineHeight: 1.5,
                  }}>
                    {m.t}
                    {m.cta && (
                      <button className="pill active" style={{ marginTop: 8, padding: '4px 10px', fontSize: 10 }}
                        onClick={() => { setTab(m.cta!.tab); onClose(); }}>
                        {m.cta.label}
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
            <div style={{ padding: 12, borderTop: '1px solid #2A2A2E', display: 'flex', gap: 8 }}>
              {['Help me sleep', 'Prep me for Paris', 'Pick a movie', 'What’s outside?'].map((s) => (
                <button key={s} className="pill" onClick={() => send(s)}>{s}</button>
              ))}
              <div style={{ flex: 1 }} />
              <input className="text-input" value={val} onChange={(e) => setVal(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && send(val)}
                placeholder="Ask anything…" style={{ width: 220 }} />
              <button className="rail-btn" style={{ width: 32, height: 32, background: '#C8F06E', color: '#0D0D0F' }} onClick={() => send(val)}>
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ------------------------------ shell ------------------------------ */
export default function InflightPage() {
  const [tab, setTab] = useState<TabId>('home');
  const { remaining, pct } = useFlightProgress();
  const [playing, setPlaying] = useState(true);
  const [vol, setVol] = useState(48);
  const [track, setTrack] = useState({ t: 'Cruise Altitude', a: 'Skyline Radio · Electronic' });
  const [aiOpen, setAiOpen] = useState(false);

  return (
    <div className="inflight-frame">
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#6B6B72', fontSize: 11 }}>
          <Sparkles size={12} color="#C8F06E" /> SKYLINE · Tablet preview · 1024 × 600
        </div>
        <div className="inflight-stage">
          <Rail tab={tab} setTab={setTab} />
          <TopBar remaining={remaining} pct={pct} onSearch={() => setAiOpen(true)} />
          <div className="content">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.22 }}
                style={{ position: 'absolute', inset: 0 }}
              >
                {tab === 'home' && <HomeTab remaining={remaining} setTab={setTab} onPlay={setTrack} />}
                {tab === 'watch' && <WatchTab />}
                {tab === 'listen' && <ListenTab onPlay={setTrack} />}
                {tab === 'learn' && <LearnTab />}
                {tab === 'create' && <CreateTab />}
                {tab === 'wellness' && <WellnessTab />}
                {tab === 'map' && <MapTab pct={pct} />}
                {tab === 'destination' && <DestinationTab />}
                {tab === 'food' && <FoodTab />}
                {tab === 'shop' && <ShopTab />}
              </motion.div>
            </AnimatePresence>
            <Assistant open={aiOpen} onClose={() => setAiOpen(false)} setTab={setTab} />
          </div>
          <BottomBar
            playing={playing} setPlaying={setPlaying}
            track={track} vol={vol} setVol={setVol}
            onAssistant={() => setAiOpen(true)}
          />
        </div>
        <div style={{ display: 'flex', gap: 16, color: '#6B6B72', fontSize: 11 }}>
          <span>Use the left rail to switch screens · click <span className="kbd">Ask Skyline</span> for the AI assistant</span>
        </div>
      </div>
    </div>
  );
}
