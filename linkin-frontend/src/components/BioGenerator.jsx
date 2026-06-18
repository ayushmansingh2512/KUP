import { useState } from 'react'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'

const TONES = [
  { id: 'Professional', label: 'Professional' },
  { id: 'Short & Sweet', label: 'Short & Sweet' },
  { id: 'Enthusiastic', label: 'Enthusiastic' }
]

export default function BioGenerator() {
  const [rawText,     setRawText]     = useState('')
  const [tone,        setTone]        = useState('Professional')
  const [bios,        setBios]        = useState([])
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [copiedIndex, setCopiedIndex] = useState(null)

  async function generate() {
    if (!rawText.trim()) return
    setLoading(true)
    setError(null)
    setBios([])

    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/genrate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          targetAudience: 'General', 
          rawProjectText: rawText, 
          projectName: '', 
          tone
        }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      if (data.bios && data.bios.length > 0) {
        setBios(data.bios)
      } else {
        setBios([data.bio])
      }
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function copyBio(text, index) {
    navigator.clipboard.writeText(text)
    setCopiedIndex(index)
    setTimeout(() => setCopiedIndex(null), 2000)
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module III</div>
          <h1 className="page-title">Bio Generator</h1>
          <p className="page-desc">AI-crafted LinkedIn Bio / About section summarizing your value proposition</p>
        </div>
      </div>

      <div className="tg-layout">
        {/* ── Input Panel ── */}
        <div className="tg-input-panel">
          {/* Raw text */}
          <div className="tg-field">
            <label className="tg-label" htmlFor="raw-text">Career History / Accomplishments</label>
            <textarea
              id="raw-text"
              className="tg-textarea"
              rows={12}
              value={rawText}
              onChange={e => setRawText(e.target.value)}
              placeholder="Paste your past experience, highlights, projects, or background..."
            />
            <div className="tg-char-count">{rawText.length} chars</div>
          </div>

          {/* Tone Selector */}
          <div className="tg-field">
            <label className="tg-label">Bio Tone</label>
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
            id="btn-generate-bio"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={generate}
            disabled={loading || !rawText.trim()}
          >
            {loading ? (
              <><span className="gen-spinner" />Generating Bio…</>
            ) : (
              'Generate Bio →'
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
        <div className={`tg-result-panel ${bios.length > 0 ? 'has-result' : ''}`}>
          {bios.length === 0 && !loading && (
            <div className="tg-empty">
              <div className="tg-empty-seal">✦</div>
              <p>Your generated LinkedIn Bio will appear here</p>
            </div>
          )}
          {loading && (
            <div className="tg-empty">
              <div className="gen-spinner-lg" />
              <p>Consulting the AI…</p>
            </div>
          )}
          {bios.length > 0 && (
            <div className="outreach-results-container" style={{ display: 'flex', flexDirection: 'column', gap: '16px', width: '100%' }}>
              {bios.map((b, idx) => (
                <div key={idx} id={`result-bio-${idx}`} className="result-card">
                  <div className="result-card-header">
                    <div>
                      <div className="result-eyebrow">{tone} Style</div>
                      <div className="result-title">Bio Option {idx + 1}</div>
                    </div>
                    <button 
                      className={`btn-copy ${copiedIndex === idx ? 'copied' : ''}`} 
                      onClick={() => copyBio(b, idx)}
                    >
                      {copiedIndex === idx ? '✓ Copied' : 'Copy'}
                    </button>
                  </div>
                  <div className="result-hairline" />
                  <p className="result-text">{b}</p>
                  <div className="result-chars">{b.length} chars</div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
