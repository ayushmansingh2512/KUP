import { useRef, useEffect, useState, useCallback } from 'react'
import { getApiUrl } from '../apiConfig'
import './Editor.css'

const BACKGROUNDS = [
  { id: 'office',           label: 'Office',           url: getApiUrl('/background/office.png') },
  { id: 'tech-dark',        label: 'Tech Dark',        url: getApiUrl('/background/tech-dark.png') },
  { id: 'modern-gradient',  label: 'Modern Gradient',  url: getApiUrl('/background/modern-gradient.png') },
  { id: 'minimalist-blue',  label: 'Minimalist Blue',  url: getApiUrl('/background/minimalist-blue.png') },
]

const CANVAS_SIZE = 600

export default function Editor({ personDataUrl }) {
  const canvasRef      = useRef(null)
  const personImgRef   = useRef(null)
  const bgImagesRef    = useRef({})

  const [selectedBg, setSelectedBg] = useState('office')
  const [scale,      setScale]      = useState(1.0)
  const [offsetX,    setOffsetX]    = useState(0)   // px offset from center
  const [offsetY,    setOffsetY]    = useState(0)
  const [bgLoaded,   setBgLoaded]   = useState(false)

  // Drag state (using refs to avoid re-render during drag)
  const dragging   = useRef(false)
  const dragStart  = useRef({ x: 0, y: 0 })
  const offsetRef  = useRef({ x: 0, y: 0 })

  // Keep offsetRef in sync with state
  useEffect(() => { offsetRef.current = { x: offsetX, y: offsetY } }, [offsetX, offsetY])

  // Load person image once
  useEffect(() => {
    const img = new Image()
    img.onload = () => { personImgRef.current = img; drawCanvas() }
    img.src = personDataUrl
  }, [personDataUrl])

  // Preload all backgrounds
  useEffect(() => {
    let loaded = 0
    BACKGROUNDS.forEach(({ id, url }) => {
      const img = new Image()
      img.crossOrigin = 'anonymous'
      img.onload = () => {
        bgImagesRef.current[id] = img
        loaded++
        if (loaded === BACKGROUNDS.length) { setBgLoaded(true); drawCanvas() }
      }
      img.src = url
    })
  }, [])

  const drawCanvas = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, CANVAS_SIZE, CANVAS_SIZE)

    // Draw background (cropped to square)
    const bg = bgImagesRef.current[selectedBg]
    if (bg) {
      const size = Math.min(bg.naturalWidth, bg.naturalHeight)
      const sx   = (bg.naturalWidth  - size) / 2
      const sy   = (bg.naturalHeight - size) / 2
      ctx.drawImage(bg, sx, sy, size, size, 0, 0, CANVAS_SIZE, CANVAS_SIZE)
    }

    // Draw person
    const person = personImgRef.current
    if (person) {
      const pw = person.naturalWidth  * scale
      const ph = person.naturalHeight * scale
      const cx = (CANVAS_SIZE - pw) / 2 + offsetRef.current.x
      const cy = (CANVAS_SIZE - ph) / 2 + offsetRef.current.y
      ctx.drawImage(person, cx, cy, pw, ph)
    }
  }, [selectedBg, scale])

  // Redraw whenever key state changes
  useEffect(() => { drawCanvas() }, [selectedBg, scale, offsetX, offsetY, bgLoaded, drawCanvas])

  // ── Drag handlers ────────────────────────────────────────────────────────
  function getPos(e) {
    const rect = canvasRef.current.getBoundingClientRect()
    const clientX = e.touches ? e.touches[0].clientX : e.clientX
    const clientY = e.touches ? e.touches[0].clientY : e.clientY
    return { x: clientX - rect.left, y: clientY - rect.top }
  }

  function onPointerDown(e) {
    dragging.current  = true
    const pos         = getPos(e)
    dragStart.current = { x: pos.x - offsetRef.current.x, y: pos.y - offsetRef.current.y }
    e.preventDefault()
  }

  function onPointerMove(e) {
    if (!dragging.current) return
    const pos = getPos(e)
    const nx  = pos.x - dragStart.current.x
    const ny  = pos.y - dragStart.current.y
    setOffsetX(nx)
    setOffsetY(ny)
  }

  function onPointerUp() { dragging.current = false }

  // ── Fit to width ─────────────────────────────────────────────────────────
  function fitWidth() {
    const person = personImgRef.current
    if (!person) return
    // Scale so person width = canvas size
    const newScale = CANVAS_SIZE / person.naturalWidth
    setScale(parseFloat(newScale.toFixed(3)))
    setOffsetX(0)
    setOffsetY(0)
  }

  function resetPosition() {
    setScale(1.0)
    setOffsetX(0)
    setOffsetY(0)
  }

  // ── Download ─────────────────────────────────────────────────────────────
  function download() {
    drawCanvas()
    const link    = document.createElement('a')
    link.download = `pfp-${selectedBg}.png`
    link.href     = canvasRef.current.toDataURL('image/png')
    link.click()
  }

  return (
    <div className="editor">
      {/* ── Left: Canvas ── */}
      <div className="canvas-wrap">
        <canvas
          ref={canvasRef}
          width={CANVAS_SIZE}
          height={CANVAS_SIZE}
          className="main-canvas"
          onMouseDown={onPointerDown}
          onMouseMove={onPointerMove}
          onMouseUp={onPointerUp}
          onMouseLeave={onPointerUp}
          onTouchStart={onPointerDown}
          onTouchMove={onPointerMove}
          onTouchEnd={onPointerUp}
          style={{ cursor: dragging.current ? 'grabbing' : 'grab' }}
        />
        <p className="canvas-hint">Drag to reposition · Use scale slider to zoom</p>
      </div>

      {/* ── Right: Controls ── */}
      <div className="controls">

        {/* Background selector */}
        <section className="control-section">
          <h3>Background</h3>
          <div className="bg-grid">
            {BACKGROUNDS.map(bg => (
              <button
                key={bg.id}
                className={`bg-thumb ${selectedBg === bg.id ? 'active' : ''}`}
                onClick={() => setSelectedBg(bg.id)}
                title={bg.label}
              >
                <img
                  src={bg.url}
                  alt={bg.label}
                  crossOrigin="anonymous"
                />
                <span>{bg.label}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Scale */}
        <section className="control-section">
          <h3>Scale <span className="value-badge">{(scale * 100).toFixed(0)}%</span></h3>
          <input
            type="range"
            min="0.2"
            max="3.0"
            step="0.01"
            value={scale}
            onChange={(e) => setScale(parseFloat(e.target.value))}
          />
        </section>

        {/* Position X */}
        <section className="control-section">
          <h3>Horizontal <span className="value-badge">{offsetX.toFixed(0)}px</span></h3>
          <input
            type="range"
            min={-CANVAS_SIZE / 2}
            max={CANVAS_SIZE / 2}
            step="1"
            value={offsetX}
            onChange={(e) => setOffsetX(Number(e.target.value))}
          />
        </section>

        {/* Position Y */}
        <section className="control-section">
          <h3>Vertical <span className="value-badge">{offsetY.toFixed(0)}px</span></h3>
          <input
            type="range"
            min={-CANVAS_SIZE / 2}
            max={CANVAS_SIZE / 2}
            step="1"
            value={offsetY}
            onChange={(e) => setOffsetY(Number(e.target.value))}
          />
        </section>

        {/* Quick actions */}
        <section className="control-section actions">
          <button className="btn-secondary" onClick={fitWidth}>Fit Width</button>
          <button className="btn-secondary" onClick={resetPosition}>Reset</button>
        </section>

        {/* Download */}
        <section className="control-section">
          <button className="btn-download" onClick={download}>
            ⬇ Download PNG
          </button>
        </section>

      </div>
    </div>
  )
}
