import { useState, useEffect } from 'react'
import LoadingScreen from './components/LoadingScreen'
import { getApiUrl } from './apiConfig'
import Sidebar from './components/Sidebar'
import PhotoEditor from './components/PhotoEditor'
import HeadlineGenerator from './components/HeadlineGenerator'
import BioGenerator from './components/BioGenerator'
import ProjectGenerator from './components/ProjectGenerator'
import OutreachGenerator from './components/OutreachGenerator'
import './index.css'
import './App.css'

const ROUTES = {
  headline: 'headline',
  bio:      'bio',
  project:  'project',
  outreach: 'outreach',
  editor:   'editor',
}

export default function App() {
  const [booted, setBooted]           = useState(false)
  // Default to headline — that's the main tool
  const [route, setRoute]             = useState(ROUTES.headline)
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
    <div className="app-shell">
      <Sidebar route={route} setRoute={setRoute} onReset={() => { setPersonUrl(null); setUploadError(null) }} />
      <main className="app-main">
        <div className={route === ROUTES.headline ? '' : 'hidden-tab'}>
          <HeadlineGenerator />
        </div>
        <div className={route === ROUTES.bio ? '' : 'hidden-tab'}>
          <BioGenerator />
        </div>
        <div className={route === ROUTES.project ? '' : 'hidden-tab'}>
          <ProjectGenerator />
        </div>
        <div className={route === ROUTES.outreach ? '' : 'hidden-tab'}>
          <OutreachGenerator />
        </div>
        <div className={route === ROUTES.editor ? '' : 'hidden-tab'}>
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
  )
}
