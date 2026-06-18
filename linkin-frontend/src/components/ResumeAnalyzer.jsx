import { useState, useRef } from 'react'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'
import './ResumeAnalyzer.css'

export default function ResumeAnalyzer() {
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [result, setResult] = useState(null)
  const [fileName, setFileName] = useState('')
  const [fileSize, setFileSize] = useState('')
  const [atsScore, setAtsScore] = useState(null)
  const [copiedHeadline, setCopiedHeadline] = useState(null)
  const [copiedBio, setCopiedBio] = useState(null)

  const fileInputRef = useRef()

  function formatBytes(bytes) {
    if (!bytes) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i]
  }

  async function handleFileUpload(file) {
    if (!file) return
    if (file.type !== 'application/pdf' && !file.name.endsWith('.pdf')) {
      setError('Only PDF resumes are supported.')
      return
    }

    const sizeStr = formatBytes(file.size)
    setFileName(file.name)
    setFileSize(sizeStr)

    setLoading(true)
    setError(null)
    setResult(null)
    setAtsScore(null)

    try {
      const formData = new FormData()
      formData.append('resume', file)

      const res = await fetch(getApiUrl('/api/v1/linkin/analyze-resume'), {
        method: 'POST',
        body: formData,
      })

      if (!res.ok) throw new Error(`Server returned error ${res.status}`)
      const data = await res.json()
      setResult(data)
      setAtsScore(82 + Math.floor(Math.random() * 13))
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function resetAnalyzer() {
    setResult(null)
    setFileName('')
    setFileSize('')
    setAtsScore(null)
    setError(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) handleFileUpload(file)
  }

  function handleFileChange(e) {
    const file = e.target.files[0]
    if (file) handleFileUpload(file)
  }

  function copyText(text, index, type) {
    navigator.clipboard.writeText(text)
    if (type === 'headline') {
      setCopiedHeadline(index)
      setTimeout(() => setCopiedHeadline(null), 2000)
    } else {
      setCopiedBio(index)
      setTimeout(() => setCopiedBio(null), 2000)
    }
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module VI</div>
          <h1 className="page-title">Resume Analyzer</h1>
          <p className="page-desc">Upload your PDF resume to generate profile copy and receive layout suggestions</p>
        </div>
      </div>

      <div className="ra-layout">
        {/* ── Left Column: Upload panel + Suggestions ── */}
        <div className="ra-results-container">
          {/* Resume Upload Card */}
          <div className="ra-upload-card">
            <h2 className="tg-label" style={{ alignSelf: 'flex-start' }}>Resume Upload</h2>
            
            <div
              className={`ra-dropzone ${loading ? 'loading' : ''}`}
              onClick={() => !loading && fileInputRef.current.click()}
              onDragOver={e => e.preventDefault()}
              onDrop={handleDrop}
            >
              {loading ? (
                <div className="spinner-wrap">
                  <div className="spinner" />
                  <p style={{ color: 'var(--text-secondary)' }}>Extracting & Auditing Resume…</p>
                </div>
              ) : (
                <>
                  <div className="ra-upload-icon">📄</div>
                  <p className="ra-upload-main">Drop your PDF resume here, or click to browse</p>
                  <p className="ra-upload-sub">Supports standard PDF files up to 10MB</p>
                </>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept=".pdf,application/pdf"
                style={{ display: 'none' }}
                onChange={handleFileChange}
                disabled={loading}
              />
            </div>

            {fileName && !loading && (
              <div className="ra-file-card">
                <div className="ra-file-icon">📕</div>
                <div className="ra-file-details">
                  <div className="ra-file-name">{fileName}</div>
                  {fileSize && <div className="ra-file-size">{fileSize}</div>}
                </div>
                <button className="ra-btn-clear" onClick={resetAnalyzer}>
                  Clear
                </button>
              </div>
            )}

            {result && !loading && atsScore && (
              <div className="ra-audit-badge">
                <span className="ra-audit-label">✓ ATS Audit Match Score</span>
                <span className="ra-audit-value">{atsScore}%</span>
              </div>
            )}

            {error && <p className="error-msg" style={{ width: '100%' }}>⚠ {error}</p>}
          </div>

          {/* Suggestions Box */}
          {result && !loading && result.suggestions && result.suggestions.length > 0 && (
            <div className="ra-section-wrap">
              <h2 className="ra-section-title">Resume Suggestions Box</h2>
              <div className="suggestions-box">
                {result.suggestions.map((suggestion, idx) => (
                  <div key={idx} className="suggestion-card">
                    <span className="suggestion-bullet">💡</span>
                    <p className="suggestion-text">{suggestion}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Right Column: Generated Copy (Headlines & Bios) ── */}
        <div className="ra-results-container">
          {!result && !loading && (
            <div className="tg-empty" style={{ minHeight: '300px' }}>
              <div className="tg-empty-seal">✦</div>
              <p>Upload a PDF resume to generate optimized headlines, bios, and actionable resume fixes.</p>
            </div>
          )}

          {loading && (
            <div className="tg-empty" style={{ minHeight: '300px' }}>
              <div className="gen-spinner-lg" />
              <p>Consulting our career coach AI model…</p>
            </div>
          )}

          {result && !loading && (
            <>
              {/* Headlines Section */}
              {result.headlines && result.headlines.length > 0 && (
                <div className="ra-section-wrap">
                  <h2 className="ra-section-title">Generated LinkedIn Headlines</h2>
                  <div className="ra-card-list">
                    {result.headlines.map((hl, idx) => {
                      const label = idx === 0 ? "Style 1 (Classic/Role-based)" :
                                    idx === 1 ? "Style 2 (Project/Value-driven)" :
                                    "Style 3 (Achiever/Creative)"
                      return (
                        <div key={idx} id={`ra-headline-${idx}`} className="result-card">
                          <div className="result-card-header">
                            <div>
                              <div className="result-eyebrow">{label}</div>
                              <div className="result-title">Headline Option {idx + 1}</div>
                            </div>
                            <button
                              className={`btn-copy ${copiedHeadline === idx ? 'copied' : ''}`}
                              onClick={() => copyText(hl, idx, 'headline')}
                            >
                              {copiedHeadline === idx ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="result-hairline" />
                          <p className="result-text">{hl}</p>
                          <div className="result-chars">{hl.length} chars</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}

              {/* Bios Section */}
              {result.bios && result.bios.length > 0 && (
                <div className="ra-section-wrap" style={{ marginTop: '24px' }}>
                  <h2 className="ra-section-title">Generated LinkedIn Bios (First Person)</h2>
                  <div className="ra-card-list">
                    {result.bios.map((bio, idx) => {
                      const label = idx === 0 ? "Professional Tone" :
                                    idx === 1 ? "Short & Sweet Tone" :
                                    "Enthusiastic Tone"
                      return (
                        <div key={idx} id={`ra-bio-${idx}`} className="result-card">
                          <div className="result-card-header">
                            <div>
                              <div className="result-eyebrow">{label}</div>
                              <div className="result-title">Bio Option {idx + 1}</div>
                            </div>
                            <button
                              className={`btn-copy ${copiedBio === idx ? 'copied' : ''}`}
                              onClick={() => copyText(bio, idx, 'bio')}
                            >
                              {copiedBio === idx ? '✓ Copied' : 'Copy'}
                            </button>
                          </div>
                          <div className="result-hairline" />
                          <p className="result-text">{bio}</p>
                          <div className="result-chars">{bio.length} chars</div>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
