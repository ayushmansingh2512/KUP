import { NavLink } from 'react-router-dom'
import _Lottie from 'lottie-react'
const Lottie = _Lottie.default ?? _Lottie
import dashLottie from '../lottie/dashboredLogo.json'
import './Sidebar.css'

const NAV = [
  { id: 'headline', icon: IconPen,       label: 'Headline', fullLabel: 'Headline Gen' },
  { id: 'bio',      icon: IconUser,      label: 'Bio',      fullLabel: 'Bio Generator' },
  { id: 'job-finder', icon: IconCompass, label: 'Jobs',     fullLabel: 'AI Job Finder' },
  { id: 'project',  icon: IconBriefcase, label: 'Projects', fullLabel: 'Project Summary' },
  { id: 'outreach', icon: IconMail,      label: 'Outreach', fullLabel: 'Outreach Gen' },
  { id: 'resume',   icon: IconDocument,  label: 'Resume',   fullLabel: 'Resume Analyzer' },
  { id: 'editor',   icon: IconCamera,    label: 'PFP',      fullLabel: 'PFP Editor' },
]

/* ── Nav icon components (unchanged SVGs) ── */
function IconCompass({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
    </svg>
  )
}
function IconMail({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  )
}
function IconCamera({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}
function IconPen({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
    </svg>
  )
}
function IconUser({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  )
}
function IconBriefcase({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2" />
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" />
    </svg>
  )
}
function IconDocument({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
      <polyline points="14 2 14 8 20 8" />
      <line x1="16" y1="13" x2="8" y2="13" />
      <line x1="16" y1="17" x2="8" y2="17" />
    </svg>
  )
}

function navPath(id) { return `/${id}` }

/* ── Sidebar ── */
export default function Sidebar({ onReset }) {
  return (
    <aside className="sidebar">
      {/* Brand: Lottie replaces old static spark/K icon */}
      <NavLink to="/headline" className="sidebar-brand" data-cursor="LinkinAI">
        <div className="sidebar-brand-icon sidebar-lottie-wrap">
          <Lottie animationData={dashLottie} loop autoplay className="sidebar-brand-lottie" />
        </div>
        <span className="sidebar-brand-name">LinkinAI</span>
      </NavLink>

      <nav className="sidebar-nav">
        {NAV.map(({ id, icon: Icon, label }) => (
          <NavLink
            key={id}
            id={`nav-${id}`}
            to={navPath(id)}
            className={({ isActive }) => `sidebar-navbtn ${isActive ? 'active' : ''}`}
            data-cursor={label}
            onClick={() => { if (id === 'editor') onReset() }}
          >
            {({ isActive }) => (
              <>
                <span className={`navbtn-icon-wrap ${isActive ? 'active' : ''}`}>
                  <span className="navbtn-icon"><Icon size={22} /></span>
                </span>
                <span className="navbtn-label">{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="sidebar-footer-glow" />
      </div>
    </aside>
  )
}

/* ── Mobile Header ── */
export function MobileHeader() {
  return (
    <header className="mobile-header">
      <NavLink to="/headline" className="mobile-header-brand">
        <div className="sidebar-brand-icon sidebar-lottie-wrap mobile-seal">
          <Lottie animationData={dashLottie} loop autoplay className="sidebar-brand-lottie" />
        </div>
        <div>
          <div className="mobile-header-title">LinkinAI</div>
          <div className="mobile-header-sub">KIET Navigator</div>
        </div>
      </NavLink>
    </header>
  )
}

/* ── Bottom Nav ── */
export function BottomNav({ onReset }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main Navigation">
      {NAV.map(({ id, icon: Icon, label }) => (
        <NavLink
          key={id}
          id={`bottom-nav-${id}`}
          to={navPath(id)}
          className={({ isActive }) => `bnav-item ${isActive ? 'active' : ''}`}
          onClick={() => { if (id === 'editor') onReset() }}
          aria-label={label}
        >
          {({ isActive }) => (
            <>
              <span className="bnav-icon-wrap">
                {isActive && <span className="bnav-pill" />}
                <span className="bnav-icon"><Icon size={22} /></span>
              </span>
              <span className="bnav-label">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
