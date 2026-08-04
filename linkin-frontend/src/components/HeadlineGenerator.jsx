import { useState } from 'react'
import _Lottie from 'lottie-react'
import headlineLottie from '../lottie/bio_headline.json'
const Lottie = _Lottie.default ?? _Lottie
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'

export default function HeadlineGenerator() {
  const [rawText,     setRawText]     = useState('')
  const [headlines,   setHeadlines]   = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  async function generate() {
    if (!rawText.trim()) return
    setLoading(true)
    setError(null)
    setHeadlines([])

    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/genrate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetAudience: 'General', 
          rawProjectText: rawText, 
          projectName: ''
        }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.headlines && data.headlines.length > 0) {
        setHeadlines(data.headlines)
      } else {
        setHeadlines([data.headline])
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function copyHeadline(text, index) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module I</div>
          <h1 className="page-title">Headline Generator</h1>
          <p className="page-desc">AI-crafted professional LinkedIn headline tailored to your profile</p>
        </div>
      </div>

      <div className="tg-layout">
        {/* ── Input Panel ── */}
        <div className="tg-input-panel">
          {/* Raw text */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="raw-text">Career / Skill Details</label>
            <textarea
              id="raw-text"
              className="tg-textarea"
              rows={12}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="List your core roles, technical skills, achievements, or target job titles..."
            />
            <div className="tg-char-count">{rawText.length} chars</div>
          </div>

          <button
            id="btn-generate-headline"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={generate}
            disabled={loading || !rawText.trim()}
          >
            {loading ? (
              <><span className="gen-spinner" />Generating Headline…</>
            ) : (
              'Generate Headline →'
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
        <div className={`tg-result-panel ${headlines.length > 0 ? 'has-result' : ''}`}>
          {headlines.length === 0 && (
            <div className="tg-empty">
              <Lottie animationData={headlineLottie} loop autoplay className="tg-empty-lottie" />
              <p>{loading ? 'Consulting the AI…' : 'Your generated LinkedIn Headline will appear here'}</p>
            </div>
          )}
          {headlines.length > 0 && (
            <div className="outreach-results-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {headlines.map((hl, idx) => {
                const label = idx === 0 ? "Style 1 (Classic/Role-based)" :
                              idx === 1 ? "Style 2 (Project/Value-driven)" :
                              "Style 3 (Achiever/Creative)"
                return (
                  <div key={idx} id={`result-headline-${idx}`} className="result-card">
                    <div className="result-card-header">
                      <div>
                        <div className="result-eyebrow">{label}</div>
                        <div className="result-title">Headline Option {idx + 1}</div>
                      </div>
                      <button 
                        className={`btn-copy ${copiedIndex === idx ? 'copied' : ''}`} 
                        onClick={() => copyHeadline(hl, idx)}
                      >
                        {copiedIndex === idx ? '✓ Copied' : 'Copy'}
                      </button>
                    </div>
                    <div className="result-hairline" />
                    <p className="result-text">{hl}</p>
                    <div className="result-chars">{hl.length} chars</div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
