import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import './Dashboard.css'

const MODULES = [
  {
    id: 'job-finder',
    title: 'AI Job Finder',
    desc: 'Curated roles across LinkedIn, Naukri & Indeed with outreach prefill.',
    icon: IconCompass,
  },
  {
    id: 'headline',
    title: 'Headline Generator',
    desc: 'Craft a sharp, keyword-rich LinkedIn headline in seconds.',
    icon: IconPen,
  },
  {
    id: 'bio',
    title: 'Bio Generator',
    desc: 'Turn your experience into a compelling About section.',
    icon: IconUser,
  },
  {
    id: 'project',
    title: 'Project Summary',
    desc: 'Summarize projects for Featured or Experience bullets.',
    icon: IconBriefcase,
  },
  {
    id: 'outreach',
    title: 'Outreach Generator',
    desc: 'Personalized connection notes and cold messages.',
    icon: IconMail,
  },
  {
    id: 'resume',
    title: 'Resume Analyzer',
    desc: 'Gap analysis and LinkedIn alignment from your CV.',
    icon: IconDocument,
  },
  {
    id: 'editor',
    title: 'Profile Photo Editor',
    desc: 'Clean backgrounds and professional framing for PFP.',
    icon: IconCamera,
  },
  {
    id: 'headline',
    title: 'Profile Polish',
    desc: 'Quick pass on headline, bio, and featured content tips.',
    icon: IconSpark,
    comingSoon: true,
  },
]

function IconCompass({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10" />
      <polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76" />
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

function IconMail({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
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

function IconCamera({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  )
}

function IconSpark({ size = 22 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
    </svg>
  )
}

export default function Dashboard() {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')

  function handleSearchSubmit(e) {
    e.preventDefault()
    navigate('/job-finder', { state: { prefilledRole: query.trim() || undefined } })
  }

  return (
    <div className="dash-page">
      <section className="dash-hero">
        <h1 className="dash-greeting">
          Welcome, <span className="dash-greeting-accent">KIET Navigator</span>
        </h1>
        <p className="dash-sub">
          What would you like to work on today? Find roles, polish your profile, or draft outreach — all in one place.
        </p>

        <form className="dash-search-card" onSubmit={handleSearchSubmit}>
          <textarea
            className="dash-search-input"
            rows={3}
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask for job matches, headline ideas, or outreach help…"
            data-cursor-suppress
          />
          <div className="dash-search-footer">
            <div className="dash-search-meta">
              <span className="dash-meta-label">Focus:</span>
              <label className="dash-radio">
                <input type="radio" name="focus" defaultChecked />
                <span>Profile</span>
              </label>
              <label className="dash-radio">
                <input type="radio" name="focus" />
                <span>Jobs</span>
              </label>
            </div>
            <div className="dash-search-actions">
              <button type="button" className="dash-attach" aria-label="Attach" data-cursor="Attach">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
                  <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" />
                </svg>
              </button>
              <button type="submit" className="btn-primary dash-submit magnetic-btn" aria-label="Submit">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
                  <line x1="12" y1="19" x2="12" y2="5" />
                  <polyline points="5 12 12 5 19 12" />
                </svg>
              </button>
            </div>
          </div>
        </form>
      </section>

      <section className="dash-grid-section">
        <div className="dash-grid-header">
          <h2 className="dash-grid-title">Start your LinkedIn workflow</h2>
          <p className="dash-grid-caption">Select a module to move faster on applications and visibility.</p>
        </div>

        <div className="dash-grid">
          {MODULES.map((mod, i) => {
            const Icon = mod.icon
            const key = `${mod.id}-${mod.title}-${i}`
            return (
              <button
                key={key}
                type="button"
                className={`dash-card ${mod.comingSoon ? 'dash-card--soon' : ''}`}
                data-cursor={mod.comingSoon ? 'Coming Soon' : mod.title}
                disabled={mod.comingSoon}
                onClick={() => !mod.comingSoon && navigate(`/${mod.id}`)}
              >
                <span className="dash-card-icon">
                  <Icon />
                </span>
                <h3 className="dash-card-title">{mod.title}</h3>
                <p className="dash-card-desc">{mod.desc}</p>
              </button>
            )
          })}
        </div>
      </section>
    </div>
  )
}
