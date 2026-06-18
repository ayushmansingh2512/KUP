import { useState, useEffect } from 'react'
import { BrowserRouter, useLocation, useNavigate } from 'react-router-dom'
import LoadingScreen from './components/LoadingScreen'
import { getApiUrl } from './apiConfig'
import Sidebar, { MobileHeader, BottomNav } from './components/Sidebar'
import PhotoEditor from './components/PhotoEditor'
import HeadlineGenerator from './components/HeadlineGenerator'
import BioGenerator from './components/BioGenerator'
import ProjectGenerator from './components/ProjectGenerator'
import OutreachGenerator from './components/OutreachGenerator'
import ResumeAnalyzer from './components/ResumeAnalyzer'
import './index.css'
import './App.css'

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

  // Redirect root and invalid paths to /headline
  useEffect(() => {
    const validPaths = ['/headline', '/bio', '/project', '/outreach', '/resume', '/editor']
    if (currentPath === '/' || !validPaths.includes(currentPath)) {
      navigate('/headline', { replace: true })
    }
  }, [currentPath, navigate])

  return (
    <div className="app-shell">
      {/* Desktop: Left sidebar */}
      <Sidebar onReset={() => { setPersonUrl(null); setUploadError(null) }} />

      <main className="app-main">
        {/* Mobile: Sticky top header (hidden on desktop via CSS) */}
        <MobileHeader />

        <div className={currentPath === '/headline' ? '' : 'hidden-tab'}>
          <HeadlineGenerator />
        </div>
        
        <div className={currentPath === '/bio' ? '' : 'hidden-tab'}>
          <BioGenerator />
        </div>
        
        <div className={currentPath === '/project' ? '' : 'hidden-tab'}>
          <ProjectGenerator />
        </div>
        
        <div className={currentPath === '/outreach' ? '' : 'hidden-tab'}>
          <OutreachGenerator />
        </div>
        
        <div className={currentPath === '/resume' ? '' : 'hidden-tab'}>
          <ResumeAnalyzer />
        </div>
        
        <div className={currentPath === '/editor' ? '' : 'hidden-tab'}>
          <PhotoEditor
            personDataUrl={personDataUrl}
            uploading={uploading}
            uploadError={uploadError}
            onUpload={handleUpload}
            onReset={() => { setPersonUrl(null); setUploadError(null) }}
          />
        </div>
      </main>

      {/* Mobile: Fixed bottom nav (hidden on desktop via CSS) */}
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

