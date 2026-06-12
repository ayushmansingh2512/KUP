import { useState } from 'react'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'

export default function HeadlineGenerator() {
  const [rawText,     setRawText]     = useState('')
  const [result,      setResult]      = useState(null)
  const [loading,     setLoading]     = useState(false)
  const [error,       setError]       = useState(null)
  const [copied,      setCopied]      = useState(false)

  async function generate() {
    if (!rawText.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/genrate'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ targetAudience: 'General', rawProjectText: rawText, projectName: '' }),
      })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setResult(data.headline)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function copy() {
    navigator.clipboard.writeText(result)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module II</div>
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
        <div className={`tg-result-panel ${result ? 'has-result' : ''}`}>
          {!result && !loading && (
            <div className="tg-empty">
              <div className="tg-empty-seal">✦</div>
              <p>Your generated LinkedIn Headline will appear here</p>
            </div>
          )}
          {loading && (
            <div className="tg-empty">
              <div className="gen-spinner-lg" />
              <p>Consulting the AI…</p>
            </div>
          )}
          {result && (
            <div id="result-headline" className="result-card">
              <div className="result-card-header">
                <div>
                  <div className="result-eyebrow">LinkedIn Headline · ≤180 Chars</div>
                  <div className="result-title">Headline Output</div>
                </div>
                <button className={`btn-copy ${copied ? 'copied' : ''}`} onClick={copy}>
                  {copied ? '✓ Copied' : 'Copy'}
                </button>
              </div>
              <div className="result-hairline" />
              <p className="result-text">{result}</p>
              <div className="result-chars">{result.length} chars</div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
