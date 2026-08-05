import { useState } from 'react'
import _Lottie from 'lottie-react'
import projectsLottie from '../lottie/projects.json'
import { getApiUrl } from '../apiConfig'
import './TextGenerator.css'
import './PostGenerator.css'

const Lottie = _Lottie.default ?? _Lottie

const TONES = [
  { id: 'Storytelling', label: 'Storytelling' },
  { id: 'Educational', label: 'Educational' },
  { id: 'Announcement', label: 'Launch/Announcement' },
  { id: 'Minimalist', label: 'Minimalist' }
]

const AUDIENCES = [
  { id: 'General', label: 'General Network' },
  { id: 'Recruiters', label: 'Recruiters' },
  { id: 'Tech Peers', label: 'Tech Peers' }
]

export default function PostGenerator() {
  const [achievement, setAchievement] = useState('')
  const [tone, setTone] = useState('Storytelling')
  const [audience, setAudience] = useState('General')
  
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [activeTab, setActiveTab] = useState('post') // 'post' or 'carousel'
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0)
  const [copiedPost, setCopiedPost] = useState(false)
  const [copiedSlide, setCopiedSlide] = useState(false)

  async function generate() {
    if (!achievement.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)
    setCurrentSlideIndex(0)
    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/generate-post'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          achievementDetails: achievement,
          tone: tone,
          targetAudience: audience
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

  function copyPost() {
    if (!result?.postContent) return
    navigator.clipboard.writeText(result.postContent)
    setCopiedPost(true)
    setTimeout(() => setCopiedPost(false), 2000)
  }

  function copyCurrentSlide() {
    if (!result?.carouselSlides?.[currentSlideIndex]) return
    const slide = result.carouselSlides[currentSlideIndex]
    const textToCopy = `Slide ${slide.slideNumber}: ${slide.title}\n\n${slide.content}`
    navigator.clipboard.writeText(textToCopy)
    setCopiedSlide(true)
    setTimeout(() => setCopiedSlide(false), 2000)
  }

  return (
    <div className="tg-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module VIII</div>
          <h1 className="page-title">Post & Carousel Generator</h1>
          <p className="page-desc">Transform your achievements or projects into high-engagement updates and slides</p>
        </div>
      </div>

      <div className="tg-layout">
        {/* ── Input Panel ── */}
        <div className="tg-input-panel">
          <div className="tg-field">
            <label className="tg-label" htmlFor="achievement-details">What did you build or achieve?</label>
            <textarea
              id="achievement-details"
              className="tg-textarea"
              rows={8}
              value={achievement}
              onChange={e => setAchievement(e.target.value)}
              placeholder="E.g., Finished a 48-hour hackathon and won 1st prize for health-tech triage app, or completed Java Spring Boot backend deployment on AWS..."
            />
            <div className="tg-char-count">{achievement.length} chars</div>
          </div>

          <div className="tg-field">
            <label className="tg-label">Tone & Style</label>
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

          <div className="tg-field">
            <label className="tg-label">Target Audience</label>
            <div className="tg-audience-grid">
              {AUDIENCES.map(a => (
                <button
                  key={a.id}
                  type="button"
                  className={`audience-pill ${audience === a.id ? 'active' : ''}`}
                  onClick={() => setAudience(a.id)}
                >
                  {a.label}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-generate-post"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={generate}
            disabled={loading || !achievement.trim()}
          >
            {loading ? (
              <><span className="gen-spinner" />Structuring Updates…</>
            ) : (
              'Generate Content →'
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
                <Lottie animationData={projectsLottie} loop autoplay />
              </div>
              <h3>Fuel Your Brand</h3>
              <p>Type in your latest milestone and watch it turn into LinkedIn gold.</p>
            </div>
          )}

          {loading && (
            <div className="tg-result-placeholder">
              <div className="lottie-placeholder">
                <Lottie animationData={projectsLottie} loop autoplay />
              </div>
              <h3 className="loading-pulse">Analyzing & Formatting...</h3>
              <p>Gemini is sculpting the perfect professional post hook and slide structure.</p>
            </div>
          )}

          {result && (
            <div className="post-result-container">
              {/* Tab navigation */}
              <div className="post-tabs">
                <button 
                  className={`post-tab-btn ${activeTab === 'post' ? 'active' : ''}`}
                  onClick={() => setActiveTab('post')}
                >
                  📄 Text Post
                </button>
                <button 
                  className={`post-tab-btn ${activeTab === 'carousel' ? 'active' : ''}`}
                  onClick={() => setActiveTab('carousel')}
                >
                  🗂️ Carousel Slides ({result.carouselSlides?.length || 0})
                </button>
              </div>

              {/* Tab content: Post */}
              {activeTab === 'post' && (
                <div className="post-content-wrap">
                  <div className="post-header-actions">
                    <span className="post-preview-label">POST CONTENT PREVIEW</span>
                    <button className="post-copy-btn" onClick={copyPost}>
                      {copiedPost ? '✅ Copied!' : '📋 Copy Post'}
                    </button>
                  </div>
                  <pre className="post-preview-text">{result.postContent}</pre>
                </div>
              )}

              {/* Tab content: Carousel Slides */}
              {activeTab === 'carousel' && result.carouselSlides && result.carouselSlides.length > 0 && (
                <div className="post-carousel-wrap">
                  <div className="carousel-control-header">
                    <span className="post-preview-label">SLIDE {currentSlideIndex + 1} OF {result.carouselSlides.length}</span>
                    <button className="post-copy-btn" onClick={copyCurrentSlide}>
                      {copiedSlide ? '✅ Copied!' : '📋 Copy Slide Text'}
                    </button>
                  </div>

                  <div className="carousel-card-preview">
                    <div className="carousel-slide-badge">Slide {result.carouselSlides[currentSlideIndex].slideNumber}</div>
                    <h2 className="carousel-slide-title">{result.carouselSlides[currentSlideIndex].title}</h2>
                    <div className="carousel-slide-body">
                      {result.carouselSlides[currentSlideIndex].content.split('\n').map((line, idx) => (
                        <p key={idx} className="carousel-slide-line">{line}</p>
                      ))}
                    </div>
                    <div className="carousel-slide-footer">
                      <span className="carousel-footer-brand">LinkinAI</span>
                      <span className="carousel-footer-pagination">{currentSlideIndex + 1}/{result.carouselSlides.length}</span>
                    </div>
                  </div>

                  <div className="carousel-controls">
                    <button 
                      className="carousel-nav-btn"
                      disabled={currentSlideIndex === 0}
                      onClick={() => setCurrentSlideIndex(prev => prev - 1)}
                    >
                      ← Prev Slide
                    </button>
                    <div className="carousel-dots">
                      {result.carouselSlides.map((_, idx) => (
                        <span 
                          key={idx} 
                          className={`carousel-dot ${idx === currentSlideIndex ? 'active' : ''}`}
                          onClick={() => setCurrentSlideIndex(idx)}
                        />
                      ))}
                    </div>
                    <button 
                      className="carousel-nav-btn"
                      disabled={currentSlideIndex === result.carouselSlides.length - 1}
                      onClick={() => setCurrentSlideIndex(prev => prev + 1)}
                    >
                      Next Slide →
                    </button>
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
