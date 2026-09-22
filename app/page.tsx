'use client'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import {
  Camera, Crop, Maximize, Sliders, Sparkles, Move,
  Download, Shield, Zap, ArrowRight, CheckCircle,
  RotateCcw, Sun, Contrast, Droplets, Eye
} from 'lucide-react'

function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [value, setValue] = useState(0)
  const ref = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      let start = 0
      const step = target / 40
      const interval = setInterval(() => {
        start = Math.min(start + step, target)
        setValue(Math.round(start))
        if (start >= target) clearInterval(interval)
      }, 30)
    })
    if (ref.current) observer.observe(ref.current)
    return () => observer.disconnect()
  }, [target])
  return <div ref={ref}>{value}{suffix}</div>
}

const FEATURES = [
  { icon: Sliders, title: 'Full Adjustments', desc: '11 professional sliders — brightness, contrast, highlights, shadows, saturation, temperature, hue, blur, vignette, grayscale, sepia. Click any value to reset instantly.' },
  { icon: Sparkles, title: '12 Filter Presets', desc: 'One-click filters with live previews on your actual photo. Vivid, Warm, Cool, B&W, Cinematic, Vintage, and more.' },
  { icon: Crop, title: 'Interactive Crop', desc: 'Drag handles with a rule-of-thirds grid. 7 aspect ratio presets including 1:1, 4:3, 16:9, 9:16, and free-form.' },
  { icon: Maximize, title: 'Smart Resize', desc: '10 social media presets built in — Instagram, Twitter, LinkedIn, YouTube. Lock aspect ratio or enter exact pixel dimensions.' },
  { icon: Move, title: 'Transform', desc: 'Rotate 90°/180°/270° clockwise or counter-clockwise. Flip horizontal and vertical independently.' },
  { icon: Download, title: 'Export Any Format', desc: 'Download as PNG, JPEG, or WebP with adjustable quality slider. Full resolution preserved — no surprises.' },
  { icon: Shield, title: '100% Private', desc: 'Every edit runs on your device. Your photos never leave your browser — no server, no uploads, no cloud storage.' },
  { icon: RotateCcw, title: '30-Step History', desc: 'Undo and redo up to 30 steps with Ctrl+Z / Ctrl+Y. Experiment freely without fear of breaking anything.' },
  { icon: Zap, title: 'Instant — No Install', desc: 'Opens in the browser in under a second. No account, no download, no loading screen. Just open and edit.' },
]

const TOOLS = [
  { icon: Sun, label: 'Brightness' },
  { icon: Contrast, label: 'Contrast' },
  { icon: Droplets, label: 'Saturation' },
  { icon: Eye, label: 'Vignette' },
  { icon: Sparkles, label: 'Filters' },
  { icon: Crop, label: 'Crop' },
  { icon: Maximize, label: 'Resize' },
  { icon: Move, label: 'Rotate' },
]

const GUMROAD_URL = 'https://ryankorir.gumroad.com/l/pixelforge'

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false)

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 40)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return (
    <div style={{ background: 'var(--bg)', color: 'var(--text-primary)', minHeight: '100vh', overflowY: 'auto', overflowX: 'hidden' }}>

      {/* Navbar */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 100,
        padding: '0 24px', height: 60,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        background: scrolled ? 'rgba(15,15,17,0.92)' : 'transparent',
        backdropFilter: scrolled ? 'blur(16px)' : 'none',
        borderBottom: scrolled ? '1px solid var(--border-subtle)' : 'none',
        transition: 'all 0.2s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 9,
            background: 'linear-gradient(135deg, var(--accent), #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            boxShadow: '0 0 18px rgba(108,99,255,0.4)',
          }}>
            <Camera size={16} color="white" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 17, color: 'var(--text-primary)' }}>
            PixelForge
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Link href="/privacy" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy</Link>
          <Link href="/terms" style={{ fontSize: 13, color: 'var(--text-muted)', textDecoration: 'none', marginRight: 8 }}>Terms</Link>
          <Link href="/editor" style={{
            display: 'inline-flex', alignItems: 'center', gap: 6,
            background: 'var(--accent)', color: 'white',
            padding: '7px 16px', borderRadius: 8, fontSize: 13, fontWeight: 500,
            textDecoration: 'none',
          }}>
            Launch Editor <ArrowRight size={13} />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        minHeight: '100vh', display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '100px 24px 60px', textAlign: 'center', position: 'relative',
      }}>
        <div style={{
          position: 'absolute', top: '20%', left: '50%', transform: 'translateX(-50%)',
          width: 600, height: 400, borderRadius: '50%',
          background: 'radial-gradient(ellipse, rgba(108,99,255,0.12) 0%, transparent 70%)',
          pointerEvents: 'none',
        }} />

        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)',
          borderRadius: 100, padding: '5px 14px', marginBottom: 28,
          fontSize: 12, color: 'var(--accent)', fontWeight: 500,
        }}>
          <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)', display: 'inline-block' }} />
          No uploads · No account · 100% free to use
        </div>

        <h1 style={{
          fontFamily: "'Space Grotesk', sans-serif",
          fontSize: 'clamp(36px, 7vw, 72px)', fontWeight: 700,
          lineHeight: 1.08, letterSpacing: '-0.03em',
          margin: '0 0 22px', maxWidth: 780,
        }}>
          Professional photo editing,{' '}
          <span style={{ background: 'linear-gradient(135deg, var(--accent), #a855f7)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>
            right in your browser
          </span>
        </h1>

        <p style={{ fontSize: 18, color: 'var(--text-secondary)', maxWidth: 520, lineHeight: 1.65, margin: '0 0 40px' }}>
          Crop, resize, rotate, apply filters and fine-tune adjustments —
          all client-side. Your photos never leave your device.
        </p>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 56 }}>
          <Link href="/editor" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--accent)', color: 'white',
            padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600,
            textDecoration: 'none', boxShadow: '0 4px 24px rgba(108,99,255,0.35)',
          }}>
            Open Editor — it&apos;s free <ArrowRight size={15} />
          </Link>
          <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            background: 'var(--surface)', color: 'var(--text-primary)',
            border: '1px solid var(--border)', padding: '13px 28px',
            borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none',
          }}>
            Get the source code →
          </a>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
          {TOOLS.map(({ icon: Icon, label }) => (
            <div key={label} style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              background: 'var(--surface)', border: '1px solid var(--border-subtle)',
              borderRadius: 100, padding: '5px 12px', fontSize: 12, color: 'var(--text-muted)',
            }}>
              <Icon size={11} color="var(--accent)" />
              {label}
            </div>
          ))}
        </div>
      </section>

      {/* Stats */}
      <section style={{ padding: '60px 24px', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', background: 'var(--surface)' }}>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))' }}>
          {[
            { value: 11, suffix: '', label: 'Adjustment tools' },
            { value: 12, suffix: '', label: 'Filter presets' },
            { value: 30, suffix: '', label: 'Undo steps' },
            { value: 0, suffix: 'KB', label: 'Data uploaded' },
          ].map(({ value, suffix, label }, i) => (
            <div key={label} style={{
              textAlign: 'center', padding: '20px 24px',
              borderRight: i < 3 ? '1px solid var(--border-subtle)' : 'none',
            }}>
              <div style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 42, fontWeight: 700, color: i === 3 ? 'var(--success)' : 'var(--text-primary)' }}>
                <Counter target={value} suffix={suffix} />
              </div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', marginTop: 4 }}>{label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Editor mockup */}
      <section style={{ padding: '80px 24px', maxWidth: 900, margin: '0 auto' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden', boxShadow: '0 24px 80px rgba(0,0,0,0.5)' }}>
          <div style={{ padding: '12px 16px', background: 'var(--surface)', borderBottom: '1px solid var(--border-subtle)', display: 'flex', alignItems: 'center', gap: 8 }}>
            {['#f43f5e','#f59e0b','#34c77b'].map(c => (
              <div key={c} style={{ width: 11, height: 11, borderRadius: '50%', background: c }} />
            ))}
            <div style={{ flex: 1, height: 22, background: 'var(--surface-raised)', borderRadius: 5, margin: '0 8px', display: 'flex', alignItems: 'center', padding: '0 10px' }}>
              <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>pixelforge.app/editor</span>
            </div>
          </div>
          <div style={{ display: 'flex', height: 360 }}>
            {/* Sidebar */}
            <div style={{ width: 200, background: 'var(--surface)', borderRight: '1px solid var(--border-subtle)', padding: 12, flexShrink: 0 }}>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                {['Adjust','Filters','Transform','Crop','Resize'].map(t => (
                  <div key={t} style={{ fontSize: 10, padding: '3px 8px', borderRadius: 5, background: t === 'Adjust' ? 'rgba(108,99,255,0.18)' : 'var(--surface-raised)', color: t === 'Adjust' ? 'var(--accent)' : 'var(--text-muted)' }}>{t}</div>
                ))}
              </div>
              {['Brightness','Contrast','Saturation','Highlights','Shadows','Temperature','Hue'].map((s, i) => (
                <div key={s} style={{ marginBottom: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 3 }}>
                    <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{s}</span>
                    <span style={{ fontSize: 10, color: 'var(--accent)' }}>{['+12','0','+30','-15','+20','+10','0'][i]}</span>
                  </div>
                  <div style={{ height: 3, background: 'var(--border)', borderRadius: 2 }}>
                    <div style={{ height: '100%', width: `${[60,50,70,35,65,58,50][i]}%`, background: 'var(--accent)', borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
            {/* Canvas */}
            <div style={{ flex: 1, background: `repeating-conic-gradient(#1a1a22 0% 25%, #141418 0% 50%) 0 0 / 16px 16px`, display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative' }}>
              <div style={{ width: 280, height: 200, borderRadius: 4, background: 'linear-gradient(135deg, #1e3a5f 0%, #2d5986 25%, #4a9eda 50%, #87ceeb 75%, #ffd700 100%)', boxShadow: '0 8px 32px rgba(0,0,0,0.5)', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: 30, right: 40, width: 40, height: 40, borderRadius: '50%', background: '#ffd700', boxShadow: '0 0 30px rgba(255,215,0,0.6)' }} />
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '40%', background: 'rgba(30,58,95,0.7)' }} />
              </div>
              <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '6px 12px', background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)', display: 'flex', gap: 12, fontSize: 10, color: 'var(--text-muted)' }}>
                <span>1920 × 1080px</span>
                <span style={{ color: 'var(--border)' }}>|</span>
                <span style={{ color: 'var(--accent)' }}>Adjustments active</span>
              </div>
            </div>
            {/* Right panel */}
            <div style={{ width: 160, background: 'var(--surface)', borderLeft: '1px solid var(--border-subtle)', padding: 10, flexShrink: 0 }}>
              <div style={{ fontSize: 10, color: 'var(--text-muted)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Preview</div>
              <div style={{ width: '100%', height: 90, borderRadius: 6, background: 'linear-gradient(135deg, #1e3a5f, #4a9eda, #ffd700)', marginBottom: 12, filter: 'saturate(1.3) brightness(1.1)' }} />
              {[['Width','1920px'],['Height','1080px'],['Format','JPEG']].map(([k,v]) => (
                <div key={k} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 10, color: 'var(--text-muted)' }}>{k}</span>
                  <span style={{ fontSize: 10, color: 'var(--text-secondary)' }}>{v}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <p style={{ textAlign: 'center', fontSize: 13, color: 'var(--text-muted)', marginTop: 16 }}>The full editor — runs entirely in your browser.</p>
      </section>

      {/* Features Grid */}
      <section style={{ padding: '60px 24px 80px', maxWidth: 900, margin: '0 auto' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 4vw, 36px)', fontWeight: 700, textAlign: 'center', marginBottom: 48, letterSpacing: '-0.02em' }}>
          Everything you need, nothing you don&apos;t
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', border: '1px solid var(--border-subtle)', borderRadius: 16, overflow: 'hidden' }}>
          {FEATURES.map(({ icon: Icon, title, desc }) => (
            <div key={title} style={{ padding: '24px', background: 'var(--surface)', borderRight: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)', transition: 'background 0.15s', cursor: 'default' }}
              onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-raised)')}
              onMouseLeave={e => (e.currentTarget.style.background = 'var(--surface)')}>
              <div style={{ width: 36, height: 36, borderRadius: 9, background: 'var(--accent-glow)', border: '1px solid rgba(108,99,255,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 14 }}>
                <Icon size={17} color="var(--accent)" />
              </div>
              <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 8 }}>{title}</div>
              <div style={{ fontSize: 13, color: 'var(--text-muted)', lineHeight: 1.6 }}>{desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Privacy block */}
      <section style={{ padding: '60px 24px', background: 'var(--surface)', borderTop: '1px solid var(--border-subtle)', borderBottom: '1px solid var(--border-subtle)' }}>
        <div style={{ maxWidth: 640, margin: '0 auto', textAlign: 'center' }}>
          <div style={{ width: 52, height: 52, borderRadius: 14, background: 'rgba(52,199,123,0.12)', border: '1px solid rgba(52,199,123,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px' }}>
            <Shield size={24} color="var(--success)" />
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
            Your photos stay on your device. Always.
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.7, marginBottom: 24 }}>
            PixelForge runs entirely in your browser using the HTML5 Canvas API. There is no server, no cloud storage, no analytics on your images. No account required.
          </p>
          <div style={{ display: 'flex', gap: 16, justifyContent: 'center', flexWrap: 'wrap' }}>
            {['No uploads','No server','No account','No watermarks','No file size limits'].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'var(--text-secondary)' }}>
                <CheckCircle size={14} color="var(--success)" /> {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Source code CTA */}
      <section style={{ padding: '80px 24px', maxWidth: 700, margin: '0 auto', textAlign: 'center' }}>
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: 20, padding: '48px 40px', position: 'relative', overflow: 'hidden' }}>
          <div style={{ position: 'absolute', top: -60, left: '50%', transform: 'translateX(-50%)', width: 300, height: 200, borderRadius: '50%', background: 'radial-gradient(ellipse, rgba(108,99,255,0.15) 0%, transparent 70%)', pointerEvents: 'none' }} />
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: 'rgba(108,99,255,0.12)', border: '1px solid rgba(108,99,255,0.3)', borderRadius: 100, padding: '4px 12px', marginBottom: 20, fontSize: 11, color: 'var(--accent)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Source code available
          </div>
          <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 28, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>
            Build your own version
          </h2>
          <p style={{ fontSize: 15, color: 'var(--text-secondary)', lineHeight: 1.65, marginBottom: 8 }}>
            The complete PixelForge source code — clean Next.js 15, TypeScript, and Tailwind. No third-party image SDKs, no subscription fees, no lock-in.
          </p>
          <p style={{ fontSize: 13, color: 'var(--text-muted)', marginBottom: 32 }}>
            Use it as a starting point, ship it as a product, or integrate it into your own app.
          </p>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
            {['Next.js 15 App Router','TypeScript','Tailwind CSS','HTML5 Canvas API','No image SDK','Lucide icons','Vercel-ready'].map(tag => (
              <span key={tag} style={{ fontSize: 12, padding: '4px 10px', borderRadius: 5, background: 'var(--surface-raised)', border: '1px solid var(--border-subtle)', color: 'var(--text-secondary)' }}>{tag}</span>
            ))}
          </div>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href={GUMROAD_URL} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: 'white', padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 24px rgba(108,99,255,0.35)' }}>
              Get the source code <ArrowRight size={15} />
            </a>
            <Link href="/editor" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'transparent', color: 'var(--text-secondary)', border: '1px solid var(--border)', padding: '13px 28px', borderRadius: 10, fontSize: 15, fontWeight: 500, textDecoration: 'none' }}>
              Try it first — free
            </Link>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section style={{ padding: '80px 24px', textAlign: 'center', borderTop: '1px solid var(--border-subtle)' }}>
        <h2 style={{ fontFamily: "'Space Grotesk', sans-serif", fontSize: 'clamp(24px, 4vw, 40px)', fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
          Ready to edit?
        </h2>
        <p style={{ fontSize: 16, color: 'var(--text-muted)', marginBottom: 32 }}>No sign-up. No loading. Just open and start.</p>
        <Link href="/editor" style={{ display: 'inline-flex', alignItems: 'center', gap: 8, background: 'var(--accent)', color: 'white', padding: '14px 32px', borderRadius: 10, fontSize: 16, fontWeight: 600, textDecoration: 'none', boxShadow: '0 4px 24px rgba(108,99,255,0.35)' }}>
          Open PixelForge <ArrowRight size={16} />
        </Link>
      </section>

      {/* Footer */}
      <footer style={{ padding: '24px', borderTop: '1px solid var(--border-subtle)', display: 'flex', flexWrap: 'wrap', gap: 16, alignItems: 'center', justifyContent: 'space-between', fontSize: 13, color: 'var(--text-muted)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ width: 22, height: 22, borderRadius: 6, background: 'linear-gradient(135deg, var(--accent), #a855f7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Camera size={11} color="white" />
          </div>
          <span style={{ fontWeight: 600, color: 'var(--text-secondary)', fontFamily: "'Space Grotesk', sans-serif" }}>PixelForge</span>
          <span>© {new Date().getFullYear()} Ryan Korir. All rights reserved.</span>
        </div>
        <div style={{ display: 'flex', gap: 20 }}>
          <Link href="/privacy" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Privacy Policy</Link>
          <Link href="/terms" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Terms of Service</Link>
          <a href="https://github.com/RyanKorir/photo-resizer" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>GitHub</a>
          <Link href="/editor" style={{ color: 'var(--text-muted)', textDecoration: 'none' }}>Editor</Link>
        </div>
      </footer>
    </div>
  )
}
