import { useEffect, useRef, useState } from 'react'
import _Lottie from 'lottie-react'
const Lottie = _Lottie.default ?? _Lottie
import loadingLottie from '../lottie/loading_logo.json'
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
    <div className="ls-root loading-screen-root">
      <div className="ls-grain" />
      <div className="ls-orb ls-orb--1" />
      <div className="ls-orb ls-orb--2" />
      <div className="ls-orb ls-orb--3" />

      <div className="ls-seal-wrap">
        <div className="ls-seal-bg" />
        {/* Lottie spinner replaces the old SVG ring + K monogram */}
        <Lottie
          animationData={loadingLottie}
          loop
          autoplay
          className="ls-lottie-logo"
        />
      </div>

      <h1 className="ls-title">
        {"LinkinAI Navigator".split("").map((char, index) => (
          <span key={index} style={{ animationDelay: `${index * 0.04}s` }}>
            {char === " " ? "\u00A0" : char}
          </span>
        ))}
      </h1>
      <p className="ls-sub">By - Training Division - CRPC · KIET</p>

      <div className="ls-bar-wrap">
        <div className="ls-bar" style={{ width: `${progress}%` }} />
      </div>
      <span className="ls-pct">{Math.round(progress)}%</span>
    </div>
  )
}
