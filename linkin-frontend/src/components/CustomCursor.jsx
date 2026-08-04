import { useEffect, useRef } from 'react'
import './CustomCursor.css'

export default function CustomCursor() {
  const dotRef = useRef(null)
  const circleRef = useRef(null)
  const labelTextRef = useRef(null)
  const lastAngle = useRef(0)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      return
    }

    document.documentElement.classList.add('custom-cursor-active')

    const dot = dotRef.current
    const circle = circleRef.current
    const labelText = labelTextRef.current

    let clientX = -100
    let clientY = -100
    let dotLerpX = -100
    let dotLerpY = -100
    let animationFrameId = null
    let lastLabelText = ''

    const handleMouseMove = (e) => {
      clientX = e.clientX
      clientY = e.clientY
    }

    const animate = () => {
      const element = document.elementFromPoint(clientX, clientY)
      const hoveredBtn = element && element.closest(
        'a, button, [role="button"], .clickable, .magnetic-btn, .tech-stack-bubble, .dash-card, .sidebar-navbtn'
      )

      let targetDotX = clientX
      let targetDotY = clientY
      let isCaptured = false

      if (hoveredBtn) {
        const rect = hoveredBtn.getBoundingClientRect()
        const btnCenterX = rect.left + rect.width / 2
        const btnCenterY = rect.top + rect.height / 2
        targetDotX = btnCenterX + (clientX - btnCenterX) * 0.25
        targetDotY = btnCenterY + (clientY - btnCenterY) * 0.25
        isCaptured = true
      }

      const dotSpeed = isCaptured ? 0.35 : 0.2
      dotLerpX += (targetDotX - dotLerpX) * dotSpeed
      dotLerpY += (targetDotY - dotLerpY) * dotSpeed

      if (dot) {
        dot.style.transform = `translate3d(${dotLerpX}px, ${dotLerpY}px, 0) translate(-50%, -50%)`
      }

      const dx = targetDotX - dotLerpX
      const dy = targetDotY - dotLerpY
      const distance = Math.sqrt(dx * dx + dy * dy)

      let angle = lastAngle.current
      let scaleX = 1
      let scaleY = 1

      if (!isCaptured && distance > 2) {
        angle = Math.atan2(dy, dx) * (180 / Math.PI)
        lastAngle.current = angle
        const maxDistance = 150
        const velocity = Math.min(distance, maxDistance) / maxDistance
        scaleX = 1 + velocity * 0.45
        scaleY = 1 - velocity * 0.25
      }

      if (circle) {
        circle.style.transform = `rotate(${angle}deg) scale(${scaleX}, ${scaleY})`
      }

      const isSuppress = element && element.closest('[data-cursor-suppress]')
      const cursorTarget = !isSuppress && element && element.closest('[data-cursor]')
      const hasCursorText = !!cursorTarget && !hoveredBtn

      if (hasCursorText) {
        const text = cursorTarget.getAttribute('data-cursor')
        if (text !== lastLabelText) {
          if (labelText) {
            labelText.innerHTML = text.trim().replace(/\s+/g, '<br />')
          }
          lastLabelText = text
        }
        if (dot) {
          dot.classList.add('custom-cursor-dot-has-text')
          dot.classList.toggle('custom-cursor-dot-small-text', text === 'Coming Soon')
        }
      } else if (dot) {
        dot.classList.remove('custom-cursor-dot-has-text', 'custom-cursor-dot-small-text')
      }

      if (dot) {
        const isDarkBg = element && element.closest(
          '.btn-primary, .btn-generate, .loading-screen-root, .sidebar-brand-icon'
        )
        if (isDarkBg) {
          dot.classList.add('custom-cursor-dark-bg')
          dot.classList.remove('custom-cursor-light-bg')
        } else {
          dot.classList.add('custom-cursor-light-bg')
          dot.classList.remove('custom-cursor-dark-bg')
        }

        const isStack = hoveredBtn && hoveredBtn.classList.contains('tech-stack-bubble')
        const isDarkBtn = hoveredBtn && (
          hoveredBtn.closest('.btn-primary, .btn-generate') ||
          (hoveredBtn.tagName === 'A' && hoveredBtn.querySelector('.btn-primary'))
        )
        const isLightBtn = hoveredBtn && (
          hoveredBtn.closest('.btn-outline, .btn-ghost') ||
          hoveredBtn.classList.contains('dash-card') ||
          hoveredBtn.classList.contains('sidebar-navbtn')
        )

        dot.classList.toggle('custom-cursor-dot-stack', !!isStack)
        dot.classList.toggle('custom-cursor-on-dark-btn', !!isDarkBtn)
        dot.classList.toggle('custom-cursor-on-light-btn', !!isLightBtn)

        const isHoverable = !hasCursorText && (hoveredBtn || isSuppress)
        dot.classList.toggle('custom-cursor-dot-hover', !!isHoverable && !isCaptured)
        dot.classList.toggle('custom-cursor-dot-captured', !!isCaptured)
      }

      animationFrameId = requestAnimationFrame(animate)
    }

    const handleMouseLeave = () => {
      if (dot) dot.style.opacity = '0'
    }
    const handleMouseEnter = () => {
      if (dot) dot.style.opacity = '1'
    }

    window.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseleave', handleMouseLeave)
    document.addEventListener('mouseenter', handleMouseEnter)
    animationFrameId = requestAnimationFrame(animate)

    return () => {
      document.documentElement.classList.remove('custom-cursor-active')
      window.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseleave', handleMouseLeave)
      document.removeEventListener('mouseenter', handleMouseEnter)
      cancelAnimationFrame(animationFrameId)
    }
  }, [])

  return (
    <div ref={dotRef} className="custom-cursor-dot custom-cursor-light-bg">
      <div ref={circleRef} className="custom-cursor-circle" />
      <span ref={labelTextRef} className="custom-cursor-text" />
    </div>
  )
}
