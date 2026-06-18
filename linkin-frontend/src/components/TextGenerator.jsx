import { useState } from 'react'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'

const AUDIENCES = [
  'Recruiters', 'Investors', 'Technical Peers',
  'Business Leaders', 'Academic Community', 'General Professional',
]

export default function TextGenerator() {
  const [projectName, setProjectName] = useState('')
  const [audience,    setAudience]    = useState('Recruiters')
  const [rawText,     setRawText]     = useState('')
  const [result,      setResult]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [copied,      setCopied]      = useState(null)

  async function generate() {
    if (!rawText.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/genrate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAudience: audience, rawProjectText: rawText, projectName }),
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

  function copy(text, key) {
    navigator.clipboard.writeText(text)
    setCopied(key)
    setTimeout(() => setCopied(null), 2000)
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module II</div>
          <h1 className="page-title">Text Generator</h1>
          <p className="page-desc">AI-crafted professional copy tailored to your target audience</p>
        </div>
      </div>

      <div className="tg-layout">
        {/* ── Input Panel ── */}
        <div className="tg-input-panel">
          {/* Project Name */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="project-name">Project Name</label>
            <input
              id="project-name"
              type="text"
              className="tg-input"
              value={projectName}
              onChange={e => setProjectName(e.target.value)}
              placeholder="e.g. KIET LinkedIn Navigator"
            />
          </div>

          {/* Audience selector */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="audience-select">Target Audience</label>
            <div className="tg-audience-grid">
              {AUDIENCES.map(a => (
                <button key={a} id={`audience-${a.replace(/\s+/g,'-').toLowerCase()}`}
                  className={`audience-pill ${audience === a ? 'active' : ''}`}
                  onClick={() => setAudience(a)}>
                  {a}
                </button>
              ))}
            </div>
          </div>

          {/* Raw text */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="raw-text">Career Details / Project Description</label>
            <textarea
              id="raw-text"
              className="tg-textarea"
              rows={8}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste your skills, experience, projects, tech stack… anything. The AI will distil it into professional LinkedIn copy."
            />
            <div className="tg-char-count">{rawText.length} chars</div>
          </div>

          <button
            id="btn-generate-text"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={generate}
            disabled={loading || !rawText.trim()}
          >
            {loading ? (
              <><span className="gen-spinner" />Generating…</>
            ) : (
              'Generate LinkedIn Copy →'
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
              <div className="tg-empty-seal">✦</div>
              <p>Your generated copy will appear here</p>
            </div>
          )}
          {loading && (
            <div className="tg-empty">
              <div className="gen-spinner-lg" />
              <p>Consulting the AI…</p>
            </div>
          )}
          {result && (
            <>
              <ResultCard
                id="result-headline"
                title="Headline"
                eyebrow="LinkedIn · ≤180 chars"
                text={result.headline}
                onCopy={() => copy(result.headline, 'headline')}
                copied={copied === 'headline'}
              />
              <ResultCard
                id="result-bio"
                title="Bio / About"
                eyebrow="LinkedIn · ≤450 chars"
                text={result.bio}
                onCopy={() => copy(result.bio, 'bio')}
                copied={copied === 'bio'}
              />
              <ResultCard
                id="result-project"
                title="Project Summary"
                eyebrow="LinkedIn · ≤450 chars"
                text={result.projectSummary}
                onCopy={() => copy(result.projectSummary, 'project')}
                copied={copied === 'project'}
              />
            </>
          )}
        </div>
      </div>
    </div>
  )
}

function ResultCard({ id, title, eyebrow, text, onCopy, copied }) {
  return (
    <div id={id} className="result-card">
      <div className="result-card-header">
        <div>
          <div className="result-eyebrow">{eyebrow}</div>
          <div className="result-title">{title}</div>
        </div>
        <button className={`btn-copy ${copied ? 'copied' : ''}`} onClick={onCopy}>
          {copied ? '✓ Copied' : 'Copy'}
        </button>
      </div>
      <div className="result-hairline" />
      <p className="result-text">{text}</p>
      <div className="result-chars">{text?.length} chars</div>
    </div>
  )
}
