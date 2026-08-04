import { useState, useEffect } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import CustomCursor from './components/CustomCursor'
import TopBar from './components/TopBar'
import { getApiUrl } from './apiConfig'
import Sidebar, { MobileHeader, BottomNav } from './components/Sidebar'
import PhotoEditor from './components/PhotoEditor'
import HeadlineGenerator from './components/HeadlineGenerator'
import BioGenerator from './components/BioGenerator'
import ProjectGenerator from './components/ProjectGenerator'
import OutreachGenerator from './components/OutreachGenerator'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import JobFinder from './components/JobFinder'
import './index.css'
import './App.css'
import './components/PhotoEditor.css'

function AppContent({
  personDataUrl,
  setPersonUrl,
  uploading,
  uploadError,
  setUploadError,
  handleUpload
}) {
  const location = useLocation()
  const navigate = useNavigate()
  const currentPath = location.pathname

  useEffect(() => {
    const validPaths = ['/headline', '/bio', '/job-finder', '/project', '/outreach', '/resume', '/editor']
    if (!validPaths.includes(currentPath)) {
      navigate('/headline', { replace: true })
    }
  }, [currentPath, navigate])

  return (
    <div className="app-shell">
      <CustomCursor />
      <Sidebar onReset={() => { setPersonUrl(null); setUploadError(null) }} />

      <div className="hero-container">
        <div className="hero-blob hero-blob--a" aria-hidden />
        <div className="hero-blob hero-blob--b" aria-hidden />
        <div className="hero-blob hero-blob--c" aria-hidden />
        <div className="hero-blob hero-blob--d" aria-hidden />

        <TopBar />

        <main className="app-main">
          <MobileHeader />

          <div className={`module-page-wrap ${currentPath === '/headline' ? '' : 'hidden-tab'}`}>
            <HeadlineGenerator />
          </div>

          <div className={`module-page-wrap ${currentPath === '/bio' ? '' : 'hidden-tab'}`}>
            <BioGenerator />
          </div>

          <div className={`module-page-wrap ${currentPath === '/job-finder' ? '' : 'hidden-tab'}`}>
            <JobFinder />
          </div>

          <div className={`module-page-wrap ${currentPath === '/project' ? '' : 'hidden-tab'}`}>
            <ProjectGenerator />
          </div>

          <div className={`module-page-wrap ${currentPath === '/outreach' ? '' : 'hidden-tab'}`}>
            <OutreachGenerator />
          </div>

          <div className={`module-page-wrap ${currentPath === '/resume' ? '' : 'hidden-tab'}`}>
            <ResumeAnalyzer />
          </div>

          <div className={`module-page-wrap ${currentPath === '/editor' ? '' : 'hidden-tab'}`}>
            <PhotoEditor
              personDataUrl={personDataUrl}
              uploading={uploading}
              uploadError={uploadError}
              onUpload={handleUpload}
              onReset={() => { setPersonUrl(null); setUploadError(null) }}
            />
          </div>
        </main>
      </div>

      <BottomNav onReset={() => { setPersonUrl(null); setUploadError(null) }} />
    </div>
  )
}

export default function App() {
  const [booted, setBooted]           = useState(false)
  const [personDataUrl, setPersonUrl] = useState(null)
  const [uploading, setUploading]     = useState(false)
  const [uploadError, setUploadError] = useState(null)

  useEffect(() => {
    const t = setTimeout(() => setBooted(true), 2600)
    return () => clearTimeout(t)
  }, [])

  async function handleUpload(file) {
    setUploading(true)
    setUploadError(null)
    setPersonUrl(null)
    try {
      const form = new FormData()
      form.append('profileImage', file)
      const res = await fetch(getApiUrl('/api/v1/linkin/extract-person'), { method: 'POST', body: form })
      if (!res.ok) throw new Error(`Server error ${res.status}`)
      const data = await res.json()
      setPersonUrl(data.personImage)
    } catch (e) {
      setUploadError(e.message)
    } finally {
      setUploading(false)
    }
  }

  if (!booted) return <LoadingScreen />

  return (
    <BrowserRouter>
      <AppContent
        personDataUrl={personDataUrl}
        setPersonUrl={setPersonUrl}
        uploading={uploading}
        uploadError={uploadError}
        setUploadError={setUploadError}
        handleUpload={handleUpload}
      />
    </BrowserRouter>
  )
}
