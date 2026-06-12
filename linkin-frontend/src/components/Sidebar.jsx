import './Sidebar.css'

const NAV = [
  { id: 'headline', icon: IconPen,       label: 'Headline Gen' },
  { id: 'bio',      icon: IconUser,      label: 'Bio Generator' },
  { id: 'project',  icon: IconBriefcase, label: 'Project Summary' },
  { id: 'outreach', icon: IconMail,      label: 'Outreach Gen' },
  { id: 'editor',   icon: IconCamera,    label: 'PFP Editor' },
]

function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  )
}

function IconCamera() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  )
}

function IconPen() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
    </svg>
  )
}

function IconUser() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  )
}

function IconBriefcase() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="7" width="20" height="14" rx="2" ry="2"/>
      <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
    </svg>
  )
}

export default function Sidebar({ route, setRoute, onReset }) {
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
        {NAV.map(({ id, icon: Icon, label }) => (
          <button
            key={id}
            id={`nav-${id}`}
            className={`sidebar-navbtn ${route === id ? 'active' : ''}`}
            onClick={() => { setRoute(id); if (id === 'editor') onReset() }}
          >
            <span className="navbtn-icon"><Icon /></span>
            <span className="navbtn-label">{label}</span>
            {route === id && <span className="navbtn-indicator" />}
          </button>
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
