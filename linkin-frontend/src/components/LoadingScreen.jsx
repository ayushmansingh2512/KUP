import { useEffect, useRef, useState } from 'react'
import './LoadingScreen.css'

export default function LoadingScreen() {
  const [progress, setProgress] = useState(0)
  const raf = useRef(null)

  useEffect(() => {
    const start = performance.now()
    const duration = 2300
    function tick(now) {
      const pct = Math.min(((now - start) / duration) * 100, 100)
      setProgress(pct)
      if (pct < 100) raf.current = requestAnimationFrame(tick)
    }
    raf.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf.current)
  }, [])

  return (
    <div className="ls-root">
      <div className="ls-grain" />
      <div className="ls-orb ls-orb--1" />
      <div className="ls-orb ls-orb--2" />
      <div className="ls-orb ls-orb--3" />

      <div className="ls-seal-wrap">
        <div className="ls-seal-bg" />
        <svg className="ls-seal" viewBox="0 0 180 180" fill="none">
          {/* Outer ring */}
          <circle className="ls-ring ls-ring--outer" cx="90" cy="90" r="82"
            stroke="var(--gold)" strokeWidth="0.6" strokeDasharray="5 4" opacity="0.5"/>
          {/* Mid ring */}
          <circle className="ls-ring ls-ring--mid" cx="90" cy="90" r="68"
            stroke="var(--gold)" strokeWidth="0.8" opacity="0.35"/>
          {/* Inner ring */}
          <circle className="ls-ring ls-ring--inner" cx="90" cy="90" r="54"
            stroke="var(--gold)" strokeWidth="0.5" strokeDasharray="3 4" opacity="0.5"/>
          {/* Tick marks */}
          {[0,45,90,135,180,225,270,315].map(deg => {
            const r = 76, cx = 90, cy = 90
            const rad = (deg * Math.PI) / 180
            const x1 = cx + r * Math.cos(rad), y1 = cy + r * Math.sin(rad)
            const x2 = cx + (r-7) * Math.cos(rad), y2 = cy + (r-7) * Math.sin(rad)
            return <line key={deg} x1={x1} y1={y1} x2={x2} y2={y2}
              stroke="var(--gold)" strokeWidth="0.8" opacity="0.6"/>
          })}
          {/* Monogram */}
          <text x="90" y="98" textAnchor="middle"
            className="ls-monogram"
            fontFamily="'Playfair Display', serif" fontSize="36"
            fill="var(--gold)" opacity="0.9">K</text>
        </svg>
      </div>

      <h1 className="ls-title">
        {"KIET LinkedIn Navigator".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.04}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <p className="ls-sub">By - Training Division - CRPC</p>

      <div className="ls-bar-wrap">
        <div className="ls-bar" style={{ width: `${progress}%` }} />
      </div>
      <span className="ls-pct">{Math.round(progress)}%</span>
    </div>
  )
}
