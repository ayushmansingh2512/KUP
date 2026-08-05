import { useState } from 'react'
import _Lottie from 'lottie-react'
import searchLottie from '../lottie/jobsearch.json'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'
import './NetworkAdvisor.css'

const Lottie = _Lottie.default ?? _Lottie

const PRESET_INDUSTRIES = [
  'Fintech & Digital Banking',
  'AI & Machine Learning',
  'Cloud Infrastructure & DevOps',
  'Product Management',
  'Web3 & Blockchain',
  'Cybersecurity & SecOps'
]

const CAREER_LEVELS = [
  'Student / Fresher',
  'Junior (1-2 yrs)',
  'Mid-Level (3-5 yrs)',
  'Career Switcher'
]

export default function NetworkAdvisor() {
  const [industry, setIndustry] = useState('Fintech & Digital Banking')
  const [customIndustry, setCustomIndustry] = useState('')
  const [level, setLevel] = useState('Student / Fresher')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  const activeIndustry = customIndustry.trim() ? customIndustry.trim() : industry

  async function generate() {
    if (!activeIndustry) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/recommend-network'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          targetIndustry: activeIndustry,
          careerLevel: level
        }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module IX</div>
          <h1 className="page-title">Industry Network Advisor</h1>
          <p className="page-desc">Gemini knowledge-based recommendations for target roles, leaders, and companies to follow</p>
        </div>
      </div>

      <div className="tg-layout">
        {/* ── Input Panel ── */}
        <div className="tg-input-panel">
          <div className="tg-field">
            <label className="tg-label">Target Industry / Domain</label>
            <div className="tg-audience-grid" style={{ marginBottom: '10px' }}>
              {PRESET_INDUSTRIES.map(ind => (
                <button
                  key={ind}
                  type="button"
                  className={`audience-pill ${!customIndustry && industry === ind ? 'active' : ''}`}
                  onClick={() => {
                    setIndustry(ind)
                    setCustomIndustry('')
                  }}
                >
                  {ind}
                </button>
              ))}
            </div>
            <input
              type="text"
              className="tg-textarea"
              style={{ minHeight: '42px', height: '42px', padding: '10px 14px' }}
              value={customIndustry}
              onChange={e => setCustomIndustry(e.target.value)}
              placeholder="Or enter custom industry (e.g. HealthTech, E-Commerce...)"
            />
          </div>

          <div className="tg-field">
            <label className="tg-label">Career Stage</label>
            <div className="tg-audience-grid">
              {CAREER_LEVELS.map(lvl => (
                <button
                  key={lvl}
                  type="button"
                  className={`audience-pill ${level === lvl ? 'active' : ''}`}
                  onClick={() => setLevel(lvl)}
                >
                  {lvl}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-generate-network"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={generate}
            disabled={loading || !activeIndustry}
          >
            {loading ? (
              <><span className="gen-spinner" />Searching Knowledge Base…</>
            ) : (
              'Discover Network Suggestions →'
            )}
          </button>

          {error && (
            <div className="tg-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
              {error}
            </div>
          )}
        </div>

        {/* ── Result Panel ── */}
        <div className={`tg-result-panel ${result ? 'has-result' : ''}`}>
          {!result && !loading && (
            <div className="tg-result-placeholder">
              <div className="lottie-placeholder">
                <Lottie animationData={searchLottie} loop autoplay />
              </div>
              <h3>Expand Your Network</h3>
              <p>Select your target domain to instantly pinpoint who to follow and connect with.</p>
            </div>
          )}

          {loading && (
            <div className="tg-result-placeholder">
              <div className="lottie-placeholder">
                <Lottie animationData={searchLottie} loop autoplay />
              </div>
              <h3 className="loading-pulse">Analyzing Industry Ecosystem...</h3>
              <p>Mining Gemini's knowledge base for top leaders, titles, and key domain hubs.</p>
            </div>
          )}

          {result && (
            <div className="network-results-container">
              {/* Summary Card */}
              {result.summary && (
                <div className="network-summary-banner">
                  <span className="network-section-label">STRATEGY FOCUS</span>
                  <p className="network-summary-text">{result.summary}</p>
                </div>
              )}

              {/* Recommended Roles */}
              {result.recommendedRoles && result.recommendedRoles.length > 0 && (
                <div className="network-section">
                  <h4 className="network-section-title">🎯 Target Roles & Titles to Search</h4>
                  <div className="roles-chip-grid">
                    {result.recommendedRoles.map((role, idx) => (
                      <div key={idx} className="role-chip">
                        <span className="role-chip-bullet">✦</span>
                        {role}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Thought Leaders */}
              {result.thoughtLeaders && result.thoughtLeaders.length > 0 && (
                <div className="network-section">
                  <h4 className="network-section-title">🌟 Key Thought Leaders & Figures</h4>
                  <div className="leaders-grid">
                    {result.thoughtLeaders.map((leader, idx) => (
                      <div key={idx} className="leader-card">
                        <div className="leader-card-header">
                          <div className="leader-name">{leader.name}</div>
                          <div className="leader-role">{leader.titleRole}</div>
                        </div>
                        <p className="leader-reason">{leader.reasonToFollow}</p>
                        {leader.searchUrl && (
                          <a
                            href={leader.searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="network-action-link"
                          >
                            Find on LinkedIn ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Top Companies */}
              {result.topCompanies && result.topCompanies.length > 0 && (
                <div className="network-section">
                  <h4 className="network-section-title">🏢 Prominent Companies & Hubs</h4>
                  <div className="companies-grid">
                    {result.topCompanies.map((comp, idx) => (
                      <div key={idx} className="company-card">
                        <div className="company-name">{comp.companyName}</div>
                        <div className="company-tagline">{comp.domainTagline}</div>
                        {comp.searchUrl && (
                          <a
                            href={comp.searchUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="network-action-link"
                          >
                            Explore Page ↗
                          </a>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Networking Tip */}
              {result.networkingTip && (
                <div className="network-tip-banner">
                  <div className="network-tip-icon">💡</div>
                  <div className="network-tip-content">
                    <strong>Networking Pro-Tip:</strong> {result.networkingTip}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
