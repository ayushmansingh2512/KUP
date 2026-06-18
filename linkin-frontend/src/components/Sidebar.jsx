import { NavLink } from 'react-router-dom'
import './Sidebar.css'

const NAV = [
  { id: 'headline', icon: IconPen,       label: 'Headline',  fullLabel: 'Headline Gen' },
  { id: 'bio',      icon: IconUser,      label: 'Bio',       fullLabel: 'Bio Generator' },
  { id: 'project',  icon: IconBriefcase, label: 'Projects',  fullLabel: 'Project Summary' },
  { id: 'outreach', icon: IconMail,      label: 'Outreach',  fullLabel: 'Outreach Gen' },
  { id: 'resume',   icon: IconDocument,  label: 'Resume',    fullLabel: 'Resume Analyzer' },
  { id: 'editor',   icon: IconCamera,    label: 'PFP',       fullLabel: 'PFP Editor' },
]

function IconMail({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function IconCamera({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

function IconPen({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IconUser({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconBriefcase({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}

function IconDocument({ size = 20 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
      <polyline points="14 2 14 8 20 8"/>
      <line x1="16" y1="13" x2="8" y2="13"/>
      <line x1="16" y1="17" x2="8" y2="17"/>
      <polyline points="10 9 9 9 8 9"/>
    </svg>
  )
}

/* ─── Desktop Sidebar ─── */
export default function Sidebar({ onReset }) {
  return (
    <aside className="sidebar">
      {/* Brand */}
      <div className="sidebar-brand">
        <div className="brand-seal">K</div>
        <div>
          <div className="brand-name">KIET Utility</div>
          <div className="brand-tag">Programme</div>
        </div>
      </div>

      <div className="sidebar-hairline" />

      {/* Nav */}
      <nav className="sidebar-nav">
        <p className="sidebar-section-label">Modules</p>
        {NAV.map(({ id, icon: Icon, fullLabel }) => (
          <NavLink
            key={id}
            id={`nav-${id}`}
            to={`/${id}`}
            className={({ isActive }) => `sidebar-navbtn ${isActive ? 'active' : ''}`}
            onClick={() => { if (id === 'editor') onReset() }}
          >
            {({ isActive }) => (
              <>
                <span className="navbtn-icon"><Icon size={16} /></span>
                <span className="navbtn-label">{fullLabel}</span>
                {isActive && <span className="navbtn-indicator" />}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      <div style={{ flex: 1 }} />
      <div className="sidebar-hairline" />

      <div className="sidebar-footer">
        <div className="footer-dot" />
        <span>API <code>:8080</code></span>
      </div>
    </aside>
  )
}

/* ─── Mobile Top Header ─── */
export function MobileHeader() {
  return (
    <header className="mobile-header">
      <div className="mobile-header-brand">
        <div className="mobile-header-seal">K</div>
        <div>
          <div className="mobile-header-title">KIET Utility</div>
          <div className="mobile-header-sub">Programme</div>
        </div>
      </div>
      <div className="mobile-header-status">
        <div className="mobile-status-dot" />
        <span>Live</span>
      </div>
    </header>
  )
}

/* ─── Mobile Bottom Navigation ─── */
export function BottomNav({ onReset }) {
  return (
    <nav className="bottom-nav" role="navigation" aria-label="Main Navigation">
      {NAV.map(({ id, icon: Icon, label }) => {
        return (
          <NavLink
            key={id}
            id={`bottom-nav-${id}`}
            to={`/${id}`}
            className={({ isActive }) => `bnav-item ${isActive ? 'active' : ''}`}
            onClick={() => { if (id === 'editor') onReset() }}
            aria-label={label}
          >
            {({ isActive }) => (
              <>
                <span className="bnav-icon-wrap">
                  {isActive && <span className="bnav-pill" />}
                  <span className="bnav-icon">
                    <Icon size={22} />
                  </span>
                </span>
                <span className="bnav-label">{label}</span>
              </>
            )}
          </NavLink>
        )
      })}
    </nav>
  )
}
