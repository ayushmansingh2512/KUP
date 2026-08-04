import { useRef, useEffect, useState, useCallback } from 'react'
import _Lottie from 'lottie-react'
import cameraLottie from '../lottie/camera.json'
import './PhotoEditor.css'

const Lottie = _Lottie.default ?? _Lottie

const CANVAS_SIZE = 600

// Background images served from ImageKit CDN.
// This avoids Git LFS issues on Vercel (LFS files are not pulled during build).
const BACKGROUNDS = [
  { id: 'office', label: 'Office', src: 'https://ik.imagekit.io/nzqflh6xv/KIET-LinkedIn-Nav/office.png' },
  { id: 'inferno', label: 'Inferno', src: 'https://ik.imagekit.io/nzqflh6xv/KIET-LinkedIn-Nav/inferno.png' },
  { id: 'mirage', label: 'Mirage', src: 'https://ik.imagekit.io/nzqflh6xv/KIET-LinkedIn-Nav/mirage.png' },
  { id: 'dust2', label: 'Dust II', src: 'https://ik.imagekit.io/nzqflh6xv/KIET-LinkedIn-Nav/dust2.png' },
  { id: 'anubis', label: 'Anubis', src: 'https://ik.imagekit.io/nzqflh6xv/KIET-LinkedIn-Nav/anubis.png' },
  { id: 'nuke', label: 'Nuke', src: 'https://ik.imagekit.io/nzqflh6xv/KIET-LinkedIn-Nav/nuke.png' },
]


// ─── Drop Zone ──────────────────────────────────────────────────────────────

function DropZone({ onUpload, loading, error }) {
  const [dragging, setDragging] = useState(false)
  const inputRef = useRef(null)

  function pick(files) {
    const file = files?.[0]
    if (file && file.type.startsWith('image/')) onUpload(file)
  }

  return (
    <div className="editor-page">
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module VII</div>
          <h1 className="page-title">PFP Editor</h1>
          <p className="page-desc">Remove background · Composite · Download</p>
        </div>
        <div className="page-header-ticks">
          <span className="tick-corner tl" />
          <span className="tick-corner tr" />
        </div>
      </div>

      {/* Drop zone */}
      <div className="dropzone-wrap">
        <div
          className={`dropzone ${dragging ? 'dragging' : ''} ${error ? 'error' : ''}`}
          onClick={() => inputRef.current?.click()}
          onDragOver={e => { e.preventDefault(); setDragging(true) }}
          onDragLeave={() => setDragging(false)}
          onDrop={e => { e.preventDefault(); setDragging(false); pick(e.dataTransfer.files) }}
        >
          {/* Corner ticks */}
          <span className="dz-tick dz-tl" /><span className="dz-tick dz-tr" />
          <span className="dz-tick dz-bl" /><span className="dz-tick dz-br" />

          <div className="dz-idle">
            <div className="dz-icon">
              <Lottie animationData={cameraLottie} loop autoplay className="dz-camera-lottie" />
            </div>
            <p className="dz-heading">{loading ? 'Removing background…' : 'Drop your photo here'}</p>
            <span className="dz-sub">{loading ? 'Neural network processing' : 'or click to browse · JPG, PNG, WEBP'}</span>
          </div>
          <input ref={inputRef} type="file" accept="image/*" style={{ display: 'none' }}
            onChange={e => pick(e.target.files)} />
        </div>

        {error && (
          <div className="dz-error">
            <div className="dz-error-lottie">
              <Lottie animationData={cameraLottie} loop autoplay />
            </div>
            {error}
          </div>
        )}

        <div className="dz-hint">
          <span className="dz-hint-pill">rembg Neural Net</span>
          <span className="dz-hint-pill">U²-Net Model</span>
          <span className="dz-hint-pill">6 Backgrounds</span>
        </div>
      </div>
    </div>
  )
}

// ─── Editor Canvas ──────────────────────────────────────────────────────────

export default function PhotoEditor({ personDataUrl, uploading, uploadError, onUpload, onReset }) {
  const canvasRef = useRef(null)
  const personImgRef = useRef(null)
  const bgImgRef = useRef(null)
  // Cache for ALL preloaded background Image objects so switching is instant
  const bgCacheRef = useRef({})

  const [bgId, setBgId] = useState('office')
  const [scale, setScale] = useState(1.0)
  const [posX, setPosX] = useState(0.5)  // 0-1 fraction of canvas
  const [posY, setPosY] = useState(0.5)
  const [dragging, setDragging] = useState(false)
  const dragStart = useRef(null)

  const activeBg = BACKGROUNDS.find(b => b.id === bgId) || BACKGROUNDS[0]

  // ── Preload ALL 6 backgrounds when editor first opens ──────────────────────
  useEffect(() => {
    if (!personDataUrl) return
    BACKGROUNDS.forEach(bg => {
      if (bgCacheRef.current[bg.id]) return // already cached
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.src = bg.src
      img.onload = () => {
        bgCacheRef.current[bg.id] = img          // save to cache
        if (bg.id === bgId) {                    // if this is the active bg, render immediately
          bgImgRef.current = img
          drawCanvas()
        }
      }
      img.onerror = () => console.warn('BG preload failed:', bg.src)
    })
  }, [personDataUrl])

  // ── Switch active background from cache when bgId changes ──────────────────
  useEffect(() => {
    if (!personDataUrl) return
    const cached = bgCacheRef.current[bgId]
    if (cached) {
      bgImgRef.current = cached
      drawCanvas()
    }
  }, [bgId, personDataUrl])

  // ── Load person cutout image when it arrives from server ───────────────────
  useEffect(() => {
    if (!personDataUrl) return
    const img = new Image()
    img.src = personDataUrl
    img.onload = () => { personImgRef.current = img; drawCanvas() }
  }, [personDataUrl])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const S = CANVAS_SIZE

    ctx.clearRect(0, 0, S, S)

    // Draw background
    if (bgImgRef.current) {
      ctx.drawImage(bgImgRef.current, 0, 0, S, S)
    } else {
      ctx.fillStyle = '#1C1C18'
      ctx.fillRect(0, 0, S, S)
    }

    // Draw person
    if (personImgRef.current) {
      const p = personImgRef.current
      const pw = p.naturalWidth * scale * (S / 800)
      const ph = p.naturalHeight * scale * (S / 800)
      const px = posX * S - pw / 2
      const py = posY * S - ph / 2
      ctx.drawImage(p, px, py, pw, ph)
    }
  }, [scale, posX, posY, bgId])

  // Redraw on any state change
  useEffect(() => { drawCanvas() }, [drawCanvas])

  // ── Drag handlers ──
  function getCanvasXY(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return {
      x: (clientX - rect.left) / rect.width,
      y: (clientY - rect.top) / rect.height,
    }
  }

  function onPointerDown(e) {
    if (e.cancelable) e.preventDefault()
    setDragging(true)
    const pos = getCanvasXY(e)
    dragStart.current = { mouseX: pos.x, mouseY: pos.y, origX: posX, origY: posY }
  }

  function onPointerMove(e) {
    if (!dragging || !dragStart.current) return
    if (e.cancelable) e.preventDefault()
    const pos = getCanvasXY(e)
    setPosX(Math.max(0, Math.min(1, dragStart.current.origX + pos.x - dragStart.current.mouseX)))
    setPosY(Math.max(0, Math.min(1, dragStart.current.origY + pos.y - dragStart.current.mouseY)))
  }

  function onPointerUp() { setDragging(false); dragStart.current = null }

  function download() {
    const link = document.createElement('a')
    link.download = `kiet-pfp-${bgId}.png`
    link.href = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  function fitWidth() {
    if (!personImgRef.current) return
    const p = personImgRef.current
    const desiredW = CANVAS_SIZE
    const naturalScaled = p.naturalWidth * (CANVAS_SIZE / 800)
    setScale(desiredW / naturalScaled)
    setPosX(0.5)
    setPosY(0.5)
  }

  function reset() { setScale(1.0); setPosX(0.5); setPosY(0.5) }

  // Not yet uploaded — show drop zone
  if (!personDataUrl) {
    return <DropZone onUpload={onUpload} loading={uploading} error={uploadError} />
  }

  return (
    <div className="editor-page">
      {/* Page header */}
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module VII</div>
          <h1 className="page-title">PFP Editor</h1>
          <p className="page-desc">Drag to reposition · Scale · Choose background · Download</p>
        </div>
        <button className="btn-ghost" id="btn-new-photo" onClick={onReset}>
          ← New photo
        </button>
      </div>

      <div className="editor-layout">
        {/* ── Left: Canvas ── */}
        <div className="editor-canvas-section">
          <div className="canvas-frame">
            <span className="cf-tick cf-tl" /><span className="cf-tick cf-tr" />
            <span className="cf-tick cf-bl" /><span className="cf-tick cf-br" />
            <canvas
              ref={canvasRef}
              id="pfp-canvas"
              width={CANVAS_SIZE}
              height={CANVAS_SIZE}
              className={`editor-canvas ${dragging ? 'grabbing' : 'grab'}`}
              onMouseDown={onPointerDown}
              onMouseMove={onPointerMove}
              onMouseUp={onPointerUp}
              onMouseLeave={onPointerUp}
              onTouchStart={onPointerDown}
              onTouchMove={onPointerMove}
              onTouchEnd={onPointerUp}
            />
          </div>

          {/* Quick actions */}
          <div className="canvas-actions">
            <button className="btn-action" id="btn-fit-width" onClick={fitWidth}>Fit Width</button>
            <button className="btn-action" id="btn-reset-pos" onClick={reset}>Reset</button>
            <button className="btn-primary" id="btn-download" onClick={download}>
              ⬇ Download PNG
            </button>
          </div>
        </div>

        {/* ── Right: Controls ── */}
        <div className="editor-controls">

          {/* Background picker */}
          <div className="ctrl-section">
            <p className="ctrl-label">Background</p>
            <div className="bg-grid">
              {BACKGROUNDS.map(bg => (
                <button
                  key={bg.id}
                  id={`bg-${bg.id}`}
                  className={`bg-thumb ${bgId === bg.id ? 'active' : ''}`}
                  onClick={() => setBgId(bg.id)}
                  title={bg.label}
                >
                  <img src={bg.src} alt={bg.label} />
                  <span className="bg-thumb-label">{bg.label}</span>
                  {bgId === bg.id && <span className="bg-thumb-check">✓</span>}
                </button>
              ))}
            </div>
          </div>

          <div className="ctrl-hairline" />

          {/* Scale */}
          <div className="ctrl-section">
            <p className="ctrl-label">Scale <span className="ctrl-val">{Math.round(scale * 100)}%</span></p>
            <input id="slider-scale" type="range" min="0.1" max="3" step="0.01"
              value={scale} onChange={e => setScale(parseFloat(e.target.value))}
              className="ctrl-slider" />
          </div>

          <div className="ctrl-hairline" />

          {/* Position */}
          <div className="ctrl-section">
            <p className="ctrl-label">Horizontal <span className="ctrl-val">{Math.round(posX * 100)}%</span></p>
            <input id="slider-x" type="range" min="0" max="1" step="0.005"
              value={posX} onChange={e => setPosX(parseFloat(e.target.value))}
              className="ctrl-slider" />
          </div>

          <div className="ctrl-section">
            <p className="ctrl-label">Vertical <span className="ctrl-val">{Math.round(posY * 100)}%</span></p>
            <input id="slider-y" type="range" min="0" max="1" step="0.005"
              value={posY} onChange={e => setPosY(parseFloat(e.target.value))}
              className="ctrl-slider" />
          </div>

          <div className="ctrl-hairline" />

          {/* Info panel */}
          <div className="ctrl-info">
            <div className="info-row">
              <span>Canvas</span><span>600 × 600 px</span>
            </div>
            <div className="info-row">
              <span>Output</span><span>PNG (lossless)</span>
            </div>
            <div className="info-row">
              <span>Background</span><span>{activeBg.label}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}