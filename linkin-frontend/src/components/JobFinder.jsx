import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import _Lottie from 'lottie-react'
import jobLottie from '../lottie/jobsearch.json'
const Lottie = _Lottie.default ?? _Lottie
import { getApiUrl } from '../apiConfig'
import './JobFinder.css'

const EXP_LEVELS = ['Fresher / Entry Level', '0-2 Years', '2-5 Years', 'Senior (5+ Yrs)']
const JOB_TYPES = ['Full-Time', 'Internship', 'Remote', 'Contract']

function cleanSearchQuery(company, title) {
  const comp = (company || '').replace(/\([^)]*\)/g, ' ').replace(/[^a-zA-Z0-9\s]/g, ' ')
  const tit = (title || '').replace(/\([^)]*\)/g, ' ').replace(/[^a-zA-Z0-9\s]/g, ' ')
  return `${comp} ${tit}`.replace(/\s+/g, ' ').trim()
}

export default function JobFinder() {
  const navigate = useNavigate()
  const routerLocation = useLocation()

  const [jobTitle, setJobTitle] = useState('Software Engineer')

  useEffect(() => {
    const prefilled = routerLocation.state?.prefilledRole
    if (prefilled && typeof prefilled === 'string') {
      setJobTitle(prefilled)
    }
  }, [routerLocation.state])
  const [experienceLevel, setExperienceLevel] = useState('Fresher / Entry Level')
  const [skills, setSkills] = useState('Java, Spring Boot, React')
  const [location, setLocation] = useState('India')
  const [jobType, setJobType] = useState('Full-Time')
  const [targetCompany, setTargetCompany] = useState('')

  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)

  async function handleFindJobs() {
    if (!jobTitle.trim()) return
    setLoading(true)
    setError(null)
    setResult(null)

    try {
      const res = await fetch(getApiUrl('/api/v1/linkin/find-jobs'), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          jobTitle,
          experienceLevel,
          skills,
          location,
          jobType,
          targetCompany
        }),
      })

      if (!res.ok) throw new Error(`Server returned error ${res.status}`)
      const data = await res.json()
      setResult(data)
    } catch (e) {
      setError(e.message)
    } finally {
      setLoading(false)
    }
  }

  function handleDraftOutreach(job) {
    navigate('/outreach', {
      state: {
        companyName: job.companyName || 'Target Company',
        recipientRole: 'Recruiter',
        jobContext: `Role: ${job.jobTitle || jobTitle} | Location: ${job.location || location} | Requirements: ${(job.keyRequirements || []).join(', ')}`,
        studentProfile: `CS Student at KIET targeting ${job.jobTitle || jobTitle} roles skilled in ${skills || 'Software Development'}`
      }
    })
  }

  return (
    <div className="jobfinder-page">
      <div className="page-header">
        <div className="page-header-left">
          <div className="page-eyebrow">Module III</div>
          <h1 className="page-title">AI Job &amp; Internship Finder</h1>
          <p className="page-desc">Discover curated roles across LinkedIn, Google Jobs, Naukri &amp; Indeed with 1-click cold outreach prefill</p>
        </div>

      </div>

      <div className="jobfinder-layout">
        {/* ── Input Panel ── */}
        <div className="jobfinder-input-panel">
          <div className="jf-field">
            <label className="jf-label" htmlFor="jf-role">Target Role / Job Title *</label>
            <input
              id="jf-role"
              type="text"
              className="jf-input"
              value={jobTitle}
              onChange={e => setJobTitle(e.target.value)}
              placeholder="e.g. Software Engineer, Frontend Developer, Data Analyst"
            />
          </div>

          <div className="jf-field">
            <label className="jf-label" htmlFor="jf-skills">Key Skills & Tech Stack</label>
            <input
              id="jf-skills"
              type="text"
              className="jf-input"
              value={skills}
              onChange={e => setSkills(e.target.value)}
              placeholder="e.g. Java, Spring Boot, React, Python, SQL"
            />
          </div>

          <div className="jf-field">
            <label className="jf-label" htmlFor="jf-location">Location</label>
            <input
              id="jf-location"
              type="text"
              className="jf-input"
              value={location}
              onChange={e => setLocation(e.target.value)}
              placeholder="e.g. India, Remote, Bengaluru, Delhi NCR"
            />
          </div>

          <div className="jf-field">
            <label className="jf-label" htmlFor="jf-company">Target Company (Optional)</label>
            <input
              id="jf-company"
              type="text"
              className="jf-input"
              value={targetCompany}
              onChange={e => setTargetCompany(e.target.value)}
              placeholder="e.g. TCS, Infosys, Google, Amazon"
            />
          </div>

          <div className="jf-field">
            <label className="jf-label">Experience Level</label>
            <div className="jf-pill-group">
              {EXP_LEVELS.map(exp => (
                <button
                  key={exp}
                  type="button"
                  className={`jf-pill ${experienceLevel === exp ? 'active' : ''}`}
                  onClick={() => setExperienceLevel(exp)}
                >
                  {exp}
                </button>
              ))}
            </div>
          </div>

          <div className="jf-field">
            <label className="jf-label">Job Type</label>
            <div className="jf-pill-group">
              {JOB_TYPES.map(jt => (
                <button
                  key={jt}
                  type="button"
                  className={`jf-pill ${jobType === jt ? 'active' : ''}`}
                  onClick={() => setJobType(jt)}
                >
                  {jt}
                </button>
              ))}
            </div>
          </div>

          <button
            id="btn-find-jobs"
            className={`btn-generate ${loading ? 'loading' : ''}`}
            onClick={handleFindJobs}
            disabled={loading || !jobTitle.trim()}
          >
            {loading ? (
              <><span className="gen-spinner" />Searching Opportunities…</>
            ) : (
              'Find Matching Jobs →'
            )}
          </button>

          {error && (
            <div className="jf-error">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" /><line x1="12" y1="16" x2="12.01" y2="16" /></svg>
              {error}
            </div>
          )}
        </div>

        {/* ── Results Panel ── */}
        <div className={`jobfinder-result-panel ${result ? 'has-result' : ''}`}>
          {!result && (
            <div className="jf-empty">
              <Lottie animationData={jobLottie} loop autoplay className="tg-empty-lottie" />
              <p>{loading ? 'Scanning hiring platforms and filtering target roles…' : 'Fill in your criteria and click Find Matching Jobs to discover opportunities and draft cold outreach in 1 click'}</p>
            </div>
          )}

          {result && (
            <div className="jf-results-content">
              {/* Direct Job Search Shortcuts */}
              <div className="jf-portal-links-card">
                <div className="jf-portal-title">🌐 Live Job Search Portals</div>
                <div className="jf-portal-buttons">
                  {result.linkedinSearchUrl && (
                    <a href={result.linkedinSearchUrl} target="_blank" rel="noreferrer" className="portal-btn portal-linkedin">
                      {/* LinkedIn Icon */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 0 1-2.063-2.065 2.064 2.064 0 1 1 2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                      LinkedIn Jobs
                    </a>
                  )}
                  {result.naukriSearchUrl && (
                    <a href={result.naukriSearchUrl} target="_blank" rel="noreferrer" className="portal-btn portal-naukri">
                      {/* Naukri "N" wordmark icon */}
                      <svg width="16" height="16" viewBox="0 0 32 32" fill="currentColor">
                        <rect width="32" height="32" rx="6" fill="none" />
                        <text x="3" y="24" fontSize="22" fontWeight="900" fontFamily="Arial, sans-serif" fill="currentColor">N</text>
                      </svg>
                      Naukri
                    </a>
                  )}
                  {result.googleJobsUrl && (
                    <a href={result.googleJobsUrl} target="_blank" rel="noreferrer" className="portal-btn portal-google">
                      {/* Google "G" icon */}
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                        <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                        <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                        <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                      </svg>
                      Google Jobs
                    </a>
                  )}
                  {result.indeedSearchUrl && (
                    <a href={result.indeedSearchUrl} target="_blank" rel="noreferrer" className="portal-btn portal-indeed">
                      {/* Indeed icon */}
                      <svg width="16" height="16" viewBox="0 0 122.88 122.88" fill="currentColor">
                        <path d="M61.44 0C27.5 0 0 27.5 0 61.44s27.5 61.44 61.44 61.44 61.44-27.5 61.44-61.44S95.38 0 61.44 0zm9.3 96.3h-18.6V52.47h18.6V96.3zm-9.3-50.72a10.77 10.77 0 1 1 0-21.54 10.77 10.77 0 0 1 0 21.54z" />
                      </svg>
                      Indeed
                    </a>
                  )}
                </div>
              </div>

              {/* Job Cards */}
              <div className="jf-job-cards-list">
                {result.jobs && result.jobs.map((job, idx) => (
                  <div key={idx} className="jf-job-card">
                    <div className="jf-job-card-header">
                      <div>
                        <div className="jf-company-name">{job.companyName}</div>
                        <h3 className="jf-job-title">{job.jobTitle}</h3>
                      </div>
                      <span className="jf-match-badge">{job.matchScore || '95% Match'}</span>
                    </div>

                    <div className="jf-job-meta">
                      <span>📍 {job.location || 'India'}</span>
                      <span>💼 {job.jobType || 'Full-Time'}</span>
                      {job.salaryRange && <span>💰 {job.salaryRange}</span>}
                    </div>

                    {job.keyRequirements && job.keyRequirements.length > 0 && (
                      <div className="jf-reqs">
                        <div className="jf-reqs-label">Key Requirements:</div>
                        <div className="jf-reqs-tags">
                          {job.keyRequirements.map((req, rIdx) => (
                            <span key={rIdx} className="jf-req-tag">{req}</span>
                          ))}
                        </div>
                      </div>
                    )}

                    <div className="jf-card-actions">
                      <a
                        href={
                          job.applySearchUrl && !job.applySearchUrl.includes('/jobs/view/')
                            ? job.applySearchUrl
                            : `https://www.linkedin.com/jobs/search/?keywords=${encodeURIComponent(cleanSearchQuery(job.companyName, job.jobTitle))}&location=${encodeURIComponent(job.location || location || '')}`
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="btn-linkedin-direct"
                      >
                        View on LinkedIn ↗
                      </a>
                      <button
                        className="btn-outreach-link"
                        onClick={() => handleDraftOutreach(job)}
                      >
                        ✉ Draft Cold Outreach →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
