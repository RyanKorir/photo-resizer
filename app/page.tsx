'use client'
import { useCallback, useEffect, useRef, useState } from 'react'
import {
  Upload, RotateCcw, RotateCw, FlipHorizontal, FlipVertical,
  ZoomIn, ZoomOut, Crop, Download, Undo2, Redo2, RefreshCcw,
  Sun, Contrast, Droplets, Palette, Eye, Wind, Sparkles,
  Image as ImageIcon, Maximize, X, ChevronDown, ChevronUp,
  Sliders, Layers, Camera, Move
} from 'lucide-react'

import {
  ImageState, TransformState, defaultImageState, defaultTransform,
  buildCSSFilter, FILTER_PRESETS, ASPECT_RATIOS, downloadCanvas,
  applyAllFiltersToCanvas, ResizeState
} from './lib/imageUtils'
import { useHistory } from './hooks/useHistory'
import AdjustmentSlider from './components/AdjustmentSlider'
import Toast from './components/Toast'

// ──────── Types ────────
interface EditorState {
  img: ImageState
  transform: TransformState
}

interface CropBox { x: number; y: number; w: number; h: number }

type SidebarTab = 'adjust' | 'filters' | 'transform' | 'resize' | 'crop'
type ExportFormat = 'png' | 'jpeg' | 'webp'

// ──────── Helpers ────────
function clamp(v: number, min: number, max: number) { return Math.max(min, Math.min(max, v)) }

// ──────── Main Component ────────
export default function PhotoEditor() {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const previewRef = useRef<HTMLCanvasElement>(null)
  const containerRef = useRef<HTMLDivElement>(null)

  const [originalImage, setOriginalImage] = useState<HTMLImageElement | null>(null)
  const [imageName, setImageName] = useState('photo')
  const [sideTab, setSideTab] = useState<SidebarTab>('adjust')
  const [isDragging, setIsDragging] = useState(false)
  const [toast, setToast] = useState<{ msg: string; type: 'success' | 'error' | 'info' } | null>(null)
  const [showExport, setShowExport] = useState(false)
  const [exportFormat, setExportFormat] = useState<ExportFormat>('jpeg')
  const [exportQuality, setExportQuality] = useState(92)
  const [viewZoom, setViewZoom] = useState(1)
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 })

  // Crop state
  const [cropActive, setCropActive] = useState(false)
  const [cropBox, setCropBox] = useState<CropBox>({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 })
  const [cropAspect, setCropAspect] = useState<number | null>(null)
  const [cropDrag, setCropDrag] = useState<{ type: string; startX: number; startY: number; origBox: CropBox } | null>(null)

  // Resize state
  const [resizeW, setResizeW] = useState(0)
  const [resizeH, setResizeH] = useState(0)
  const [resizeLock, setResizeLock] = useState(true)
  const [origAspect, setOrigAspect] = useState(1)

  // History
  const { state, set, undo, redo, reset, canUndo, canRedo } = useHistory<EditorState>({
    img: defaultImageState,
    transform: defaultTransform,
  })

  const { img, transform } = state

  // ── Load Image ──
  const loadImage = useCallback((file: File) => {
    const url = URL.createObjectURL(file)
    const image = new window.Image()
    image.onload = () => {
      setOriginalImage(image)
      setImageName(file.name.replace(/\.[^.]+$/, ''))
      setResizeW(image.naturalWidth)
      setResizeH(image.naturalHeight)
      setOrigAspect(image.naturalWidth / image.naturalHeight)
      reset({ img: defaultImageState, transform: defaultTransform })
      setViewZoom(1)
      setViewOffset({ x: 0, y: 0 })
      setCropActive(false)
      showToast('Image loaded', 'success')
    }
    image.src = url
  }, [reset])

  // ── File input ──
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0]
    if (f) loadImage(f)
  }

  // ── Drag & drop ──
  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const f = e.dataTransfer.files[0]
    if (f && f.type.startsWith('image/')) loadImage(f)
  }, [loadImage])

  // ── Render canvas ──
  const renderCanvas = useCallback(() => {
    if (!originalImage || !canvasRef.current) return
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    let srcX = 0, srcY = 0
    let srcW = originalImage.naturalWidth
    let srcH = originalImage.naturalHeight
    let outW = srcW, outH = srcH

    if (cropActive) {
      srcX = cropBox.x * srcW
      srcY = cropBox.y * srcH
      srcW = cropBox.w * originalImage.naturalWidth
      srcH = cropBox.h * originalImage.naturalHeight
      outW = srcW
      outH = srcH
    }

    // Apply resize if custom
    if (resizeW !== originalImage.naturalWidth || resizeH !== originalImage.naturalHeight) {
      outW = resizeW
      outH = resizeH
    }

    // Rotation swaps dimensions for 90/270
    if (transform.rotation === 90 || transform.rotation === 270) {
      ;[outW, outH] = [outH, outW]
    }

    applyAllFiltersToCanvas(ctx, originalImage, img, transform, outW, outH, srcX, srcY, srcW, srcH)
  }, [originalImage, img, transform, cropActive, cropBox, resizeW, resizeH])

  useEffect(() => { renderCanvas() }, [renderCanvas])

  // ── Preview canvas ──
  useEffect(() => {
    if (!previewRef.current || !originalImage) return
    const canvas = previewRef.current
    const ctx = canvas.getContext('2d')!
    const W = 320, H = 200
    canvas.width = W
    canvas.height = H
    const aspect = originalImage.naturalWidth / originalImage.naturalHeight
    let dw = W, dh = H
    if (aspect > W / H) dh = W / aspect
    else dw = H * aspect
    const dx = (W - dw) / 2, dy = (H - dh) / 2
    ctx.clearRect(0, 0, W, H)
    ctx.filter = buildCSSFilter(img)
    ctx.drawImage(originalImage, dx, dy, dw, dh)
    ctx.filter = 'none'
  }, [img, originalImage])

  // ── Keyboard shortcuts ──
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 'z') { e.preventDefault(); undo() }
        if (e.key === 'y') { e.preventDefault(); redo() }
        if (e.key === 's') { e.preventDefault(); handleExport() }
      }
      if (e.key === '+' || e.key === '=') setViewZoom(z => Math.min(4, z + 0.1))
      if (e.key === '-') setViewZoom(z => Math.max(0.1, z - 0.1))
      if (e.key === '0') { setViewZoom(1); setViewOffset({ x: 0, y: 0 }) }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [undo, redo])

  // ── Helpers ──
  const showToast = (msg: string, type: 'success' | 'error' | 'info' = 'success') => {
    setToast({ msg, type })
  }

  const updateImg = (patch: Partial<ImageState>) => {
    set(prev => ({ ...prev, img: { ...prev.img, ...patch } }))
  }

  const updateTransform = (patch: Partial<TransformState>) => {
    set(prev => ({ ...prev, transform: { ...prev.transform, ...patch } }))
  }

  const resetAdjustments = () => {
    set(prev => ({ ...prev, img: defaultImageState }))
    showToast('Adjustments reset', 'info')
  }

  const applyPreset = (presetState: Partial<ImageState>) => {
    set(prev => ({ ...prev, img: { ...defaultImageState, ...presetState } }))
  }

  const handleRotate = (dir: 1 | -1) => {
    updateTransform({ rotation: ((transform.rotation + dir * 90) + 360) % 360 })
  }

  const handleExport = () => {
    if (!canvasRef.current) return
    const ext = exportFormat === 'jpeg' ? 'jpg' : exportFormat
    downloadCanvas(canvasRef.current, `${imageName}-edited.${ext}`, exportFormat, exportQuality / 100)
    showToast(`Saved as ${exportFormat.toUpperCase()}`, 'success')
    setShowExport(false)
  }

  const handleCropApply = () => {
    if (!originalImage || !canvasRef.current) return
    // Bake the crop into a new "image"
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')!
    const sw = cropBox.w * originalImage.naturalWidth
    const sh = cropBox.h * originalImage.naturalHeight
    const sx = cropBox.x * originalImage.naturalWidth
    const sy = cropBox.y * originalImage.naturalHeight
    tempCanvas.width = sw
    tempCanvas.height = sh
    ctx.drawImage(originalImage, sx, sy, sw, sh, 0, 0, sw, sh)
    const newImg = new window.Image()
    newImg.onload = () => {
      setOriginalImage(newImg)
      setResizeW(sw)
      setResizeH(sh)
      setOrigAspect(sw / sh)
      setCropBox({ x: 0, y: 0, w: 1, h: 1 })
      setCropActive(false)
      showToast('Crop applied', 'success')
    }
    newImg.src = tempCanvas.toDataURL()
  }

  const handleResizeApply = () => {
    if (!originalImage) return
    const tempCanvas = document.createElement('canvas')
    const ctx = tempCanvas.getContext('2d')!
    tempCanvas.width = resizeW
    tempCanvas.height = resizeH
    ctx.drawImage(originalImage, 0, 0, resizeW, resizeH)
    const newImg = new window.Image()
    newImg.onload = () => {
      setOriginalImage(newImg)
      setOrigAspect(resizeW / resizeH)
      showToast(`Resized to ${resizeW}×${resizeH}`, 'success')
    }
    newImg.src = tempCanvas.toDataURL()
  }

  // ── Crop interaction ──
  const getCropHandles = (): { [key: string]: { cx: number; cy: number } } => {
    const { x, y, w, h } = cropBox
    return {
      nw: { cx: x, cy: y }, n: { cx: x + w / 2, cy: y }, ne: { cx: x + w, cy: y },
      w: { cx: x, cy: y + h / 2 }, e: { cx: x + w, cy: y + h / 2 },
      sw: { cx: x, cy: y + h }, s: { cx: x + w / 2, cy: y + h }, se: { cx: x + w, cy: y + h },
      move: { cx: x + w / 2, cy: y + h / 2 },
    }
  }

  const onCropMouseDown = (e: React.MouseEvent<HTMLDivElement>, handleType: string) => {
    if (!cropActive) return
    e.preventDefault()
    e.stopPropagation()
    setCropDrag({ type: handleType, startX: e.clientX, startY: e.clientY, origBox: { ...cropBox } })
  }

  const onCropMouseMove = useCallback((e: MouseEvent) => {
    if (!cropDrag || !containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const W = rect.width, H = rect.height
    const dx = (e.clientX - cropDrag.startX) / (W * viewZoom)
    const dy = (e.clientY - cropDrag.startY) / (H * viewZoom)
    const ob = cropDrag.origBox

    setCropBox(prev => {
      let { x, y, w, h } = { ...ob }
      const type = cropDrag.type

      if (type === 'move') {
        x = clamp(ob.x + dx, 0, 1 - ob.w)
        y = clamp(ob.y + dy, 0, 1 - ob.h)
      } else {
        if (type.includes('e')) w = clamp(ob.w + dx, 0.05, 1 - ob.x)
        if (type.includes('s')) h = clamp(ob.h + dy, 0.05, 1 - ob.y)
        if (type.includes('w')) { x = clamp(ob.x + dx, 0, ob.x + ob.w - 0.05); w = ob.x + ob.w - x }
        if (type.includes('n')) { y = clamp(ob.y + dy, 0, ob.y + ob.h - 0.05); h = ob.y + ob.h - y }
        if (cropAspect !== null && type !== 'move') {
          h = w / cropAspect * (1)
        }
      }
      return { x: clamp(x, 0, 1), y: clamp(y, 0, 1), w: clamp(w, 0.05, 1), h: clamp(h, 0.05, 1) }
    })
  }, [cropDrag, viewZoom, cropAspect])

  const onCropMouseUp = useCallback(() => { setCropDrag(null) }, [])

  useEffect(() => {
    if (cropDrag) {
      window.addEventListener('mousemove', onCropMouseMove)
      window.addEventListener('mouseup', onCropMouseUp)
      return () => {
        window.removeEventListener('mousemove', onCropMouseMove)
        window.removeEventListener('mouseup', onCropMouseUp)
      }
    }
  }, [cropDrag, onCropMouseMove, onCropMouseUp])

  // Canvas dimensions for display
  const displayCanvas = canvasRef.current
  const canvasW = displayCanvas?.width ?? 0
  const canvasH = displayCanvas?.height ?? 0

  // ──────── UI ────────
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100vh',
      background: 'var(--bg)',
      overflow: 'hidden',
    }}>

      {/* ── Top Bar ── */}
      <header style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        padding: '0 16px',
        height: 52,
        background: 'var(--surface)',
        borderBottom: '1px solid var(--border-subtle)',
        flexShrink: 0,
        zIndex: 10,
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginRight: 8 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg, var(--accent), #a855f7)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Camera size={14} color="white" />
          </div>
          <span style={{ fontFamily: "'Space Grotesk', sans-serif", fontWeight: 700, fontSize: 15, color: 'var(--text-primary)' }}>
            PixelForge
          </span>
        </div>

        {/* Image info */}
        {originalImage && (
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--text-muted)', fontSize: 12 }}>
            <span>{imageName}</span>
            <span style={{ color: 'var(--border)' }}>·</span>
            <span>{originalImage.naturalWidth} × {originalImage.naturalHeight}px</span>
          </div>
        )}

        <div style={{ flex: 1 }} />

        {/* History */}
        <button className="btn-icon" onClick={undo} disabled={!canUndo} data-tip="Undo (Ctrl+Z)"
          style={{ opacity: canUndo ? 1 : 0.3 }}>
          <Undo2 size={15} />
        </button>
        <button className="btn-icon" onClick={redo} disabled={!canRedo} data-tip="Redo (Ctrl+Y)"
          style={{ opacity: canRedo ? 1 : 0.3 }}>
          <Redo2 size={15} />
        </button>

        {/* Zoom */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 4, background: 'var(--surface-raised)', borderRadius: 8, padding: '2px 6px', border: '1px solid var(--border)' }}>
          <button className="btn-icon" style={{ border: 'none', background: 'transparent', padding: 4 }} onClick={() => setViewZoom(z => Math.max(0.1, z - 0.1))}>
            <ZoomOut size={13} />
          </button>
          <span style={{ fontSize: 12, color: 'var(--text-secondary)', minWidth: 40, textAlign: 'center', cursor: 'pointer' }}
            onClick={() => { setViewZoom(1); setViewOffset({ x: 0, y: 0 }) }}>
            {Math.round(viewZoom * 100)}%
          </span>
          <button className="btn-icon" style={{ border: 'none', background: 'transparent', padding: 4 }} onClick={() => setViewZoom(z => Math.min(4, z + 0.1))}>
            <ZoomIn size={13} />
          </button>
        </div>

        {/* Open file */}
        <button className="btn btn-ghost" onClick={() => fileInputRef.current?.click()}>
          <Upload size={13} />
          Open
        </button>

        {/* Export */}
        {originalImage && (
          <div style={{ position: 'relative' }}>
            <button className="btn btn-primary" onClick={() => setShowExport(p => !p)}>
              <Download size={13} />
              Export
              <ChevronDown size={12} />
            </button>
            {showExport && (
              <div style={{
                position: 'absolute', right: 0, top: '100%', marginTop: 6,
                background: 'var(--surface)', border: '1px solid var(--border)',
                borderRadius: 12, padding: 16, width: 220, zIndex: 200,
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
              }}>
                <p style={{ margin: '0 0 10px', fontSize: 12, color: 'var(--text-secondary)', fontWeight: 500 }}>Export Settings</p>
                <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
                  {(['png', 'jpeg', 'webp'] as ExportFormat[]).map(f => (
                    <button key={f} className={`btn ${exportFormat === f ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ flex: 1, padding: '5px 0', fontSize: 11, justifyContent: 'center' }}
                      onClick={() => setExportFormat(f)}>
                      {f.toUpperCase()}
                    </button>
                  ))}
                </div>
                {exportFormat !== 'png' && (
                  <div style={{ marginBottom: 12 }}>
                    <div style={{ fontSize: 11, color: 'var(--text-muted)', marginBottom: 6 }}>
                      Quality: {exportQuality}%
                    </div>
                    <input type="range" min={10} max={100} value={exportQuality}
                      onChange={e => setExportQuality(Number(e.target.value))} />
                  </div>
                )}
                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }} onClick={handleExport}>
                  <Download size={13} />
                  Download
                </button>
              </div>
            )}
          </div>
        )}
      </header>

      {/* ── Main Content ── */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>

        {/* ── Left Sidebar ── */}
        <aside style={{
          width: 260,
          background: 'var(--surface)',
          borderRight: '1px solid var(--border-subtle)',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          flexShrink: 0,
        }}>
          {/* Tabs */}
          <div style={{
            display: 'flex',
            gap: 2,
            padding: '8px 8px 0',
            borderBottom: '1px solid var(--border-subtle)',
            flexWrap: 'wrap',
          }}>
            {[
              { id: 'adjust', label: 'Adjust', icon: Sliders },
              { id: 'filters', label: 'Filters', icon: Sparkles },
              { id: 'transform', label: 'Transform', icon: Move },
              { id: 'crop', label: 'Crop', icon: Crop },
              { id: 'resize', label: 'Resize', icon: Maximize },
            ].map(({ id, label, icon: Icon }) => (
              <button key={id} className={`tab ${sideTab === id ? 'active' : ''}`}
                onClick={() => { setSideTab(id as SidebarTab); if (id !== 'crop') setCropActive(false) }}
                style={{ display: 'flex', alignItems: 'center', gap: 5, padding: '5px 9px', marginBottom: 6 }}>
                <Icon size={12} />
                {label}
              </button>
            ))}
          </div>

          {/* Panel content */}
          <div style={{ flex: 1, overflowY: 'auto' }}>

            {/* ── Adjust ── */}
            {sideTab === 'adjust' && (
              <div className="fade-in">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Light</span>
                  <button className="btn btn-ghost" style={{ fontSize: 10, padding: '3px 8px' }} onClick={resetAdjustments}>
                    <RefreshCcw size={10} />Reset all
                  </button>
                </div>
                <AdjustmentSlider label="Brightness" value={img.brightness} min={-100} max={100}
                  onChange={v => updateImg({ brightness: v })} onReset={() => updateImg({ brightness: 0 })} />
                <AdjustmentSlider label="Contrast" value={img.contrast} min={-100} max={100}
                  onChange={v => updateImg({ contrast: v })} onReset={() => updateImg({ contrast: 0 })} />
                <AdjustmentSlider label="Highlights" value={img.highlights} min={-100} max={100}
                  onChange={v => updateImg({ highlights: v })} onReset={() => updateImg({ highlights: 0 })} />
                <AdjustmentSlider label="Shadows" value={img.shadows} min={-100} max={100}
                  onChange={v => updateImg({ shadows: v })} onReset={() => updateImg({ shadows: 0 })} />

                <div style={{ padding: '10px 14px 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Color</span>
                </div>
                <AdjustmentSlider label="Saturation" value={img.saturation} min={-100} max={100}
                  onChange={v => updateImg({ saturation: v })} onReset={() => updateImg({ saturation: 0 })} />
                <AdjustmentSlider label="Temperature" value={img.temperature} min={-100} max={100}
                  onChange={v => updateImg({ temperature: v })} onReset={() => updateImg({ temperature: 0 })} />
                <AdjustmentSlider label="Hue" value={img.hue} min={-180} max={180}
                  onChange={v => updateImg({ hue: v })} onReset={() => updateImg({ hue: 0 })}
                  formatValue={v => `${v}°`} />

                <div style={{ padding: '10px 14px 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Effects</span>
                </div>
                <AdjustmentSlider label="Blur" value={img.blur} min={0} max={20}
                  onChange={v => updateImg({ blur: v })} onReset={() => updateImg({ blur: 0 })}
                  formatValue={v => `${v}px`} />
                <AdjustmentSlider label="Vignette" value={img.vignette} min={0} max={100}
                  onChange={v => updateImg({ vignette: v })} onReset={() => updateImg({ vignette: 0 })} />
                <AdjustmentSlider label="Grayscale" value={img.grayscale} min={0} max={100}
                  onChange={v => updateImg({ grayscale: v })} onReset={() => updateImg({ grayscale: 0 })} />
                <AdjustmentSlider label="Sepia" value={img.sepia} min={0} max={100}
                  onChange={v => updateImg({ sepia: v })} onReset={() => updateImg({ sepia: 0 })} />

                <div style={{ height: 16 }} />
              </div>
            )}

            {/* ── Filters ── */}
            {sideTab === 'filters' && (
              <div className="fade-in">
                <div style={{ padding: '10px 14px 4px' }}>
                  <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase' }}>Presets</span>
                </div>
                <div className="preset-grid">
                  {FILTER_PRESETS.map(preset => (
                    <button key={preset.name}
                      className="preset-card"
                      onClick={() => applyPreset(preset.state)}
                      style={{
                        border: `2px solid ${JSON.stringify(img) === JSON.stringify({ ...defaultImageState, ...preset.state }) ? 'var(--accent)' : 'transparent'}`,
                        background: 'var(--surface-raised)',
                        borderRadius: 8,
                        overflow: 'hidden',
                        cursor: 'pointer',
                        position: 'relative',
                      }}>
                      <div style={{
                        height: 56,
                        background: originalImage ? 'transparent' : 'linear-gradient(135deg, var(--surface-raised), var(--border))',
                        position: 'relative',
                        overflow: 'hidden',
                      }}>
                        {originalImage && (
                          <img
                            src={originalImage.src}
                            alt={preset.name}
                            style={{
                              width: '100%',
                              height: '100%',
                              objectFit: 'cover',
                              filter: buildCSSFilter({ ...defaultImageState, ...preset.state }),
                            }}
                          />
                        )}
                        {!originalImage && (
                          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                            <ImageIcon size={16} color="var(--text-muted)" />
                          </div>
                        )}
                      </div>
                      <div className="preset-name">{preset.name}</div>
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* ── Transform ── */}
            {sideTab === 'transform' && (
              <div className="fade-in" style={{ padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Rotate</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleRotate(-1)}>
                    <RotateCcw size={14} />90° CCW
                  </button>
                  <button className="btn btn-ghost" style={{ flex: 1, justifyContent: 'center' }} onClick={() => handleRotate(1)}>
                    <RotateCw size={14} />90° CW
                  </button>
                </div>

                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Flip</p>
                <div style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <button
                    className={`btn ${transform.flipH ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => updateTransform({ flipH: !transform.flipH })}>
                    <FlipHorizontal size={14} />Horizontal
                  </button>
                  <button
                    className={`btn ${transform.flipV ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ flex: 1, justifyContent: 'center' }}
                    onClick={() => updateTransform({ flipV: !transform.flipV })}>
                    <FlipVertical size={14} />Vertical
                  </button>
                </div>

                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Current</p>
                <div style={{ background: 'var(--surface-raised)', borderRadius: 8, padding: '10px 12px' }}>
                  {[
                    { label: 'Rotation', value: `${transform.rotation}°` },
                    { label: 'Flip H', value: transform.flipH ? 'Yes' : 'No' },
                    { label: 'Flip V', value: transform.flipV ? 'Yes' : 'No' },
                  ].map(row => (
                    <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                      <span style={{ fontSize: 12, color: 'var(--text-muted)' }}>{row.label}</span>
                      <span style={{ fontSize: 12, color: 'var(--text-secondary)' }}>{row.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: 20 }}>
                  <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                    onClick={() => set(prev => ({ ...prev, transform: defaultTransform }))}>
                    <RefreshCcw size={13} />Reset Transform
                  </button>
                </div>
              </div>
            )}

            {/* ── Crop ── */}
            {sideTab === 'crop' && (
              <div className="fade-in" style={{ padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Aspect Ratio</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {ASPECT_RATIOS.map(ar => (
                    <button key={ar.label}
                      className={`btn ${cropAspect === ar.value ? 'btn-primary' : 'btn-ghost'}`}
                      style={{ fontSize: 11, padding: '4px 10px' }}
                      onClick={() => setCropAspect(ar.value)}>
                      {ar.label}
                    </button>
                  ))}
                </div>

                <div style={{ marginBottom: 16 }}>
                  <button
                    className={`btn ${cropActive ? 'btn-primary' : 'btn-ghost'}`}
                    style={{ width: '100%', justifyContent: 'center', marginBottom: 8 }}
                    onClick={() => setCropActive(p => !p)}>
                    <Crop size={14} />
                    {cropActive ? 'Crop mode ON' : 'Start Crop'}
                  </button>

                  {cropActive && (
                    <>
                      <div style={{ background: 'var(--surface-raised)', borderRadius: 8, padding: '10px 12px', marginBottom: 8, fontSize: 12, color: 'var(--text-secondary)' }}>
                        Drag the crop handles on the canvas to adjust.
                      </div>
                      <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', marginBottom: 6 }}
                        onClick={handleCropApply}>
                        Apply Crop
                      </button>
                      <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center' }}
                        onClick={() => { setCropActive(false); setCropBox({ x: 0.1, y: 0.1, w: 0.8, h: 0.8 }) }}>
                        Cancel
                      </button>
                    </>
                  )}
                </div>

                {cropActive && originalImage && (
                  <div style={{ background: 'var(--surface-raised)', borderRadius: 8, padding: '10px 12px' }}>
                    <p style={{ margin: '0 0 8px', fontSize: 11, color: 'var(--text-muted)' }}>Crop area</p>
                    {[
                      { label: 'X', value: Math.round(cropBox.x * originalImage.naturalWidth) },
                      { label: 'Y', value: Math.round(cropBox.y * originalImage.naturalHeight) },
                      { label: 'Width', value: Math.round(cropBox.w * originalImage.naturalWidth) },
                      { label: 'Height', value: Math.round(cropBox.h * originalImage.naturalHeight) },
                    ].map(row => (
                      <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 4 }}>
                        <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.label}</span>
                        <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{row.value}px</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* ── Resize ── */}
            {sideTab === 'resize' && (
              <div className="fade-in" style={{ padding: 14 }}>
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 12 }}>Dimensions</p>

                <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 10 }}>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Width (px)</label>
                    <input type="number" value={resizeW} min={1} max={10000}
                      onChange={e => {
                        const w = Number(e.target.value)
                        setResizeW(w)
                        if (resizeLock) setResizeH(Math.round(w / origAspect))
                      }} />
                  </div>
                  <button className={`btn-icon ${resizeLock ? 'active' : ''}`} style={{ marginTop: 16 }}
                    onClick={() => setResizeLock(p => !p)} data-tip={resizeLock ? 'Unlock ratio' : 'Lock ratio'}>
                    {resizeLock ? '🔒' : '🔓'}
                  </button>
                  <div style={{ flex: 1 }}>
                    <label style={{ display: 'block', fontSize: 11, color: 'var(--text-muted)', marginBottom: 4 }}>Height (px)</label>
                    <input type="number" value={resizeH} min={1} max={10000}
                      onChange={e => {
                        const h = Number(e.target.value)
                        setResizeH(h)
                        if (resizeLock) setResizeW(Math.round(h * origAspect))
                      }} />
                  </div>
                </div>

                {/* Quick scale presets */}
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '16px 0 8px' }}>Quick Scale</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16 }}>
                  {[25, 50, 75, 100, 150, 200].map(pct => (
                    <button key={pct} className="btn btn-ghost" style={{ fontSize: 11, padding: '4px 10px' }}
                      onClick={() => {
                        if (!originalImage) return
                        const w = Math.round(originalImage.naturalWidth * pct / 100)
                        const h = Math.round(originalImage.naturalHeight * pct / 100)
                        setResizeW(w); setResizeH(h)
                      }}>
                      {pct}%
                    </button>
                  ))}
                </div>

                {/* Common size presets */}
                <p style={{ fontSize: 11, fontWeight: 600, color: 'var(--text-muted)', letterSpacing: '0.06em', textTransform: 'uppercase', margin: '0 0 8px' }}>Presets</p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 4, marginBottom: 16 }}>
                  {[
                    { label: 'HD 720p', w: 1280, h: 720 },
                    { label: 'Full HD 1080p', w: 1920, h: 1080 },
                    { label: '4K UHD', w: 3840, h: 2160 },
                    { label: 'Instagram Post', w: 1080, h: 1080 },
                    { label: 'Instagram Story', w: 1080, h: 1920 },
                    { label: 'Twitter Header', w: 1500, h: 500 },
                    { label: 'Facebook Cover', w: 851, h: 315 },
                    { label: 'LinkedIn Banner', w: 1584, h: 396 },
                    { label: 'Profile Picture', w: 400, h: 400 },
                    { label: 'Thumbnail', w: 1280, h: 720 },
                  ].map(p => (
                    <button key={p.label} className="btn btn-ghost" style={{ width: '100%', justifyContent: 'space-between', fontSize: 11 }}
                      onClick={() => { setResizeW(p.w); setResizeH(p.h) }}>
                      <span>{p.label}</span>
                      <span style={{ color: 'var(--text-muted)' }}>{p.w}×{p.h}</span>
                    </button>
                  ))}
                </div>

                <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}
                  onClick={handleResizeApply} disabled={!originalImage}>
                  <Maximize size={13} />
                  Apply Resize
                </button>
              </div>
            )}
          </div>
        </aside>

        {/* ── Canvas Area ── */}
        <main style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
          background: 'var(--bg)',
        }}>
          {/* Canvas viewport */}
          <div
            ref={containerRef}
            className="canvas-bg"
            style={{
              flex: 1,
              overflow: 'hidden',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              position: 'relative',
              cursor: cropActive && cropDrag?.type === 'move' ? 'grabbing' : cropActive ? 'crosshair' : 'default',
            }}
            onDragOver={e => { e.preventDefault(); setIsDragging(true) }}
            onDragLeave={() => setIsDragging(false)}
            onDrop={onDrop}
          >
            {!originalImage ? (
              /* Drop zone */
              <div
                className={`dropzone ${isDragging ? 'drag-over' : ''}`}
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 16,
                  padding: '60px 80px',
                  cursor: 'pointer',
                  textAlign: 'center',
                }}
                onClick={() => fileInputRef.current?.click()}
              >
                <div style={{
                  width: 64, height: 64, borderRadius: 16,
                  background: 'var(--accent-glow)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  border: '1px solid var(--accent)',
                }}>
                  <Upload size={28} color="var(--accent)" />
                </div>
                <div>
                  <p style={{ margin: '0 0 6px', fontSize: 18, fontFamily: "'Space Grotesk', sans-serif", fontWeight: 600, color: 'var(--text-primary)' }}>
                    Drop a photo here
                  </p>
                  <p style={{ margin: 0, fontSize: 13, color: 'var(--text-muted)' }}>
                    or click to open — JPG, PNG, WEBP, GIF supported
                  </p>
                </div>
                <div style={{ display: 'flex', gap: 20, fontSize: 12, color: 'var(--text-muted)' }}>
                  {['Crop & Resize', 'Filters', 'Adjustments', 'Export'].map(f => (
                    <span key={f} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                      <span style={{ color: 'var(--accent)' }}>✓</span> {f}
                    </span>
                  ))}
                </div>
                <p style={{ margin: 0, fontSize: 11, color: 'var(--text-muted)', opacity: 0.6 }}>
                  All processing happens locally — your photos never leave your device
                </p>
              </div>
            ) : (
              /* Canvas + crop overlay */
              <div style={{
                position: 'relative',
                transform: `translate(${viewOffset.x}px, ${viewOffset.y}px) scale(${viewZoom})`,
                transformOrigin: 'center',
                transition: cropDrag ? 'none' : 'transform 0.1s ease',
                boxShadow: '0 4px 40px rgba(0,0,0,0.5)',
              }}>
                <canvas ref={canvasRef} style={{ display: 'block', maxWidth: '100%', maxHeight: '100%' }} />

                {/* Crop overlay */}
                {cropActive && (
                  <div style={{
                    position: 'absolute', inset: 0, pointerEvents: 'all',
                  }}>
                    {/* Dim overlay */}
                    <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.5)', pointerEvents: 'none' }} />

                    {/* Crop window cutout */}
                    <div
                      onMouseDown={e => onCropMouseDown(e, 'move')}
                      style={{
                        position: 'absolute',
                        left: `${cropBox.x * 100}%`,
                        top: `${cropBox.y * 100}%`,
                        width: `${cropBox.w * 100}%`,
                        height: `${cropBox.h * 100}%`,
                        boxShadow: '0 0 0 9999px rgba(0,0,0,0.5)',
                        border: '1px solid var(--accent)',
                        cursor: 'move',
                      }}>
                      {/* Rule of thirds grid */}
                      {[1, 2].map(i => (
                        <React.Fragment key={i}>
                          <div style={{ position: 'absolute', left: `${i * 33.33}%`, top: 0, bottom: 0, width: 1, background: 'rgba(255,255,255,0.15)' }} />
                          <div style={{ position: 'absolute', top: `${i * 33.33}%`, left: 0, right: 0, height: 1, background: 'rgba(255,255,255,0.15)' }} />
                        </React.Fragment>
                      ))}

                      {/* Corner handles */}
                      {(['nw', 'ne', 'sw', 'se'] as const).map(dir => (
                        <div key={dir}
                          onMouseDown={e => onCropMouseDown(e, dir)}
                          style={{
                            position: 'absolute',
                            width: 12, height: 12,
                            background: 'var(--accent)',
                            borderRadius: 2,
                            ...(dir.includes('n') ? { top: -6 } : { bottom: -6 }),
                            ...(dir.includes('w') ? { left: -6 } : { right: -6 }),
                            cursor: `${dir}-resize`,
                            zIndex: 5,
                          }} />
                      ))}
                      {/* Edge handles */}
                      {(['n', 's', 'e', 'w'] as const).map(dir => {
                        const pos: React.CSSProperties = {}
                        if (dir === 'n') { pos.top = -4; pos.left = '50%'; pos.transform = 'translateX(-50%)'; pos.cursor = 'n-resize' }
                        if (dir === 's') { pos.bottom = -4; pos.left = '50%'; pos.transform = 'translateX(-50%)'; pos.cursor = 's-resize' }
                        if (dir === 'e') { pos.right = -4; pos.top = '50%'; pos.transform = 'translateY(-50%)'; pos.cursor = 'e-resize' }
                        if (dir === 'w') { pos.left = -4; pos.top = '50%'; pos.transform = 'translateY(-50%)'; pos.cursor = 'w-resize' }
                        return (
                          <div key={dir}
                            onMouseDown={e => onCropMouseDown(e, dir)}
                            style={{
                              position: 'absolute',
                              width: 8, height: 8,
                              background: 'white',
                              border: '1px solid var(--accent)',
                              borderRadius: 1,
                              zIndex: 4,
                              ...pos,
                            }} />
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Drag overlay */}
            {isDragging && originalImage && (
              <div style={{
                position: 'absolute', inset: 0,
                background: 'var(--accent-glow)',
                border: '3px dashed var(--accent)',
                borderRadius: 12,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                pointerEvents: 'none',
              }}>
                <p style={{ color: 'var(--accent)', fontWeight: 600, fontSize: 16 }}>Drop to open</p>
              </div>
            )}
          </div>

          {/* Bottom status bar */}
          {originalImage && (
            <div style={{
              padding: '8px 16px',
              background: 'var(--surface)',
              borderTop: '1px solid var(--border-subtle)',
              display: 'flex',
              alignItems: 'center',
              gap: 16,
              fontSize: 11,
              color: 'var(--text-muted)',
              flexShrink: 0,
            }}>
              <span>Original: {originalImage.naturalWidth} × {originalImage.naturalHeight}px</span>
              <span style={{ color: 'var(--border)' }}>|</span>
              <span>Output: {canvasRef.current?.width ?? 0} × {canvasRef.current?.height ?? 0}px</span>
              {(img.brightness !== 0 || img.contrast !== 0 || img.saturation !== 0) && (
                <>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span style={{ color: 'var(--accent)' }}>Adjustments active</span>
                </>
              )}
              {cropActive && (
                <>
                  <span style={{ color: 'var(--border)' }}>|</span>
                  <span style={{ color: 'var(--warning)' }}>Crop mode</span>
                </>
              )}
              <div style={{ flex: 1 }} />
              <span>Ctrl+Z undo · Ctrl+Y redo · +/- zoom · 0 reset view</span>
            </div>
          )}
        </main>

        {/* ── Right panel: mini preview ── */}
        {originalImage && (
          <aside style={{
            width: 200,
            background: 'var(--surface)',
            borderLeft: '1px solid var(--border-subtle)',
            display: 'flex',
            flexDirection: 'column',
            flexShrink: 0,
            overflow: 'hidden',
          }}>
            <div className="panel-header">Preview</div>
            <div style={{ padding: 8 }}>
              <canvas ref={previewRef} style={{
                width: '100%',
                borderRadius: 6,
                background: 'var(--bg)',
                display: 'block',
              }} />
            </div>

            <div style={{ padding: '0 8px 8px', flex: 1, overflowY: 'auto' }}>
              <div className="panel-header" style={{ marginBottom: 6 }}>Info</div>
              {[
                { label: 'Width', value: `${originalImage.naturalWidth}px` },
                { label: 'Height', value: `${originalImage.naturalHeight}px` },
                { label: 'Aspect', value: `${(originalImage.naturalWidth / originalImage.naturalHeight).toFixed(2)}:1` },
                { label: 'Rotation', value: `${transform.rotation}°` },
                { label: 'Format', value: exportFormat.toUpperCase() },
              ].map(row => (
                <div key={row.label} style={{ display: 'flex', justifyContent: 'space-between', padding: '4px 6px', borderRadius: 4 }}>
                  <span style={{ fontSize: 11, color: 'var(--text-muted)' }}>{row.label}</span>
                  <span style={{ fontSize: 11, color: 'var(--text-secondary)' }}>{row.value}</span>
                </div>
              ))}

              {/* Active adjustments list */}
              {Object.entries(img).some(([, v]) => v !== 0) && (
                <>
                  <div className="panel-header" style={{ margin: '10px 0 6px' }}>Active Adjustments</div>
                  {Object.entries(img).filter(([, v]) => v !== 0).map(([k, v]) => (
                    <div key={k} style={{ display: 'flex', justifyContent: 'space-between', padding: '3px 6px', borderRadius: 4 }}>
                      <span style={{ fontSize: 10, color: 'var(--text-muted)', textTransform: 'capitalize' }}>{k}</span>
                      <span style={{ fontSize: 10, color: 'var(--accent)' }}>{v > 0 ? `+${v}` : v}</span>
                    </div>
                  ))}
                </>
              )}
            </div>

            {/* Quick actions */}
            <div style={{ padding: 8, borderTop: '1px solid var(--border-subtle)' }}>
              <button className="btn btn-ghost" style={{ width: '100%', justifyContent: 'center', fontSize: 11, marginBottom: 6 }}
                onClick={resetAdjustments}>
                <RefreshCcw size={11} />Reset All
              </button>
              <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center', fontSize: 11 }}
                onClick={() => { setShowExport(true) }}>
                <Download size={11} />Export
              </button>
            </div>
          </aside>
        )}
      </div>

      {/* ── Hidden file input ── */}
      <input ref={fileInputRef} type="file" accept="image/*" style={{ display: 'none' }} onChange={onFileChange} />

      {/* ── Toast ── */}
      {toast && <Toast message={toast.msg} type={toast.type} onClose={() => setToast(null)} />}
    </div>
  )
}

// Need React for JSX Fragment in the file
import React from 'react'
