import { useState } from 'react'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'
import './OutreachGenerator.css'

const ROLES = [
  { id: 'Recruiter', label: 'Recruiter' },
  { id: 'Alumni', label: 'Alumnus/Alumna' },
  { id: 'Hiring Manager', label: 'Hiring Manager' },
  { id: 'Tech Lead', label: 'Tech Lead / Eng Manager' }
]

const MEDIUMS = [
  { id: 'LinkedIn Message', label: 'LinkedIn Message' },
  { id: 'Email', label: 'Email' },
  { id: 'Connection Note', label: 'Connection Invite (300 Chars)' }
]

const TONES = [
  { id: 'Professional', label: 'Professional' },
  { id: 'Enthusiastic', label: 'Enthusiastic' },
  { id: 'Short & Sweet', label: 'Short & Sweet' }
]

export default function OutreachGenerator() {
  const [profile, setProfile] = useState('')
  const [role, setRole] = useState('Recruiter')
  const [company, setCompany] = useState('')
  const [context, setContext] = useState('')
  const [tone, setTone] = useState('Professional')
  const [medium, setMedium] = useState('LinkedIn Message')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [copiedSubject, setCopiedSubject] = useState(false)
  const [copiedBody, setCopiedBody] = useState(false)

  async function generate() {
    if (!profile.trim() || !company.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/generate-outreach'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          studentProfile: profile,
          recipientRole: role,
          companyName: company,
          jobContext: context,
          tone: tone,
          medium: medium
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

  function copyText(text, target) {
    navigator.clipboard.writeText(text)
    if (target === 'subject') {
      setCopiedSubject(true)
      setTimeout(() => setCopiedSubject(false), 2000)
    } else {
      setCopiedBody(true)
      setTimeout(() => setCopiedBody(false), 2000)
    }
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module V</div>
          <h1 className="page-title">Outreach Generator</h1>
          <p className="page-desc">AI-generated cold outreach and InMails tailored for student networking</p>
        </div>
      </div>

      <div className="tg-layout">
        {/* ── Input Panel ── */}
        <div className="tg-input-panel">
          
          {/* Profile Details */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="outreach-profile">Your Profile Summary / Core Skills</label>
            <textarea
              id="outreach-profile"
              className="tg-textarea"
              rows={4}
              value={profile}
              onChange={e => setProfile(e.target.value)}
              placeholder="e.g. Computer Science student at KIET. Fluent in Java and Spring Boot. Built a secure library manager app using PostgreSQL."
            />
            <div className="tg-char-count">{profile.length} chars</div>
          </div>

          {/* Company Name */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="outreach-company">Target Company</label>
            <input
              id="outreach-company"
              type="text"
              className="tg-input"
              value={company}
              onChange={e => setCompany(e.target.value)}
              placeholder="e.g. Google, TechCorp, or Startup X"
            />
          </div>

          {/* Context Details */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="outreach-context">Job Context / Role ID (Optional)</label>
            <textarea
              id="outreach-context"
              className="tg-textarea mini-textarea"
              rows={2}
              value={context}
              onChange={e => setContext(e.target.value)}
              placeholder="e.g. Software Engineer Intern position (Job ID: 9482), or asking for a virtual coffee chat"
            />
          </div>

          {/* Recipient Role */}
          <div className="tg-field">
            <label className="tg-label">Recipient Connection</label>
            <div className="tg-audience-grid">
              {ROLES.map(r => (
                <button
                  key={r.id}
                  type="button"
                  className={`audience-pill ${role === r.id ? 'active' : ''}`}
                  onClick={() => setRole(r.id)}
                >
                  {r.label}
                </button>
              ))}
            </div>
          </div>

          {/* Medium */}
          <div className="tg-field">
            <label className="tg-label">Communication Medium</label>
            <div className="tg-audience-grid">
              {MEDIUMS.map(m => (
                <button
                  key={m.id}
                  type="button"
                  className={`audience-pill ${medium === m.id ? 'active' : ''}`}
                  onClick={() => setMedium(m.id)}
                >
                  {m.label}
                </button>
              ))}
            </div>
          </div>

          {/* Tone */}
          <div className="tg-field">
            <label className="tg-label">Outreach Tone</label>
            <div className="tg-audience-grid">
              {TONES.map(t => (
                <button
                  key={t.id}
                  type="button"
                  className={`audience-pill ${tone === t.id ? 'active' : ''}`}
                  onClick={() => setTone(t.id)}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-generate-outreach"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={generate}
            disabled={loading || !profile.trim() || !company.trim()}
          >
            {loading ? (
              <><span className="gen-spinner" />Drafting outreach…</>
            ) : (
              'Generate Outreach Message →'
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
            <div className="tg-empty">
              <div className="tg-empty-seal">✉</div>
              <p>Your tailored cold outreach template will appear here</p>
            </div>
          )}
          {loading && (
            <div className="tg-empty">
              <div className="gen-spinner-lg" />
              <p>Drafting networking copy...</p>
            </div>
          )}
          {result && (
            <div className="outreach-results-container">
              {result.subjectLine && (
                <div id="result-subject" className="result-card subject-card">
                  <div className="result-card-header">
                    <div>
                      <div className="result-eyebrow">Subject Line</div>
                      <div className="result-title">Email Outreach Subject</div>
                    </div>
                    <button className={`btn-copy ${copiedSubject ? 'copied' : ''}`} onClick={() => copyText(result.subjectLine, 'subject')}>
                      {copiedSubject ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="result-hairline" />
                  <p className="result-text">{result.subjectLine}</p>
                </div>
              )}

              <div id="result-body" className="result-card">
                <div className="result-card-header">
                  <div>
                    <div className="result-eyebrow">{medium} · {tone}</div>
                    <div className="result-title">Message Body</div>
                  </div>
                  <button className={`btn-copy ${copiedBody ? 'copied' : ''}`} onClick={() => copyText(result.body, 'body')}>
                    {copiedBody ? '✓ Copied' : 'Copy'}
                  </button>
                </div>
                <div className="result-hairline" />
                <p className="result-text">{result.body}</p>
                <div className="result-chars">{result.body.length} chars</div>
              </div>

              {result.tips && (
                <div id="result-tips" className="result-card tips-card">
                  <div className="result-card-header">
                    <div>
                      <div className="result-eyebrow">Outreach Tips</div>
                      <div className="result-title">Networking Action Tips</div>
                    </div>
                  </div>
                  <div className="result-hairline" />
                  <p className="result-text tips-text">{result.tips}</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
