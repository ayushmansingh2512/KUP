import { useRef } from 'react'
import './Upload.css'

export default function Upload({ onUpload, loading, error }) {
  const inputRef = useRef()

  function handleDrop(e) {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file) onUpload(file)
  }

  function handleChange(e) {
    const file = e.target.files[0]
    if (file) onUpload(file)
  }

  return (
    <div className="upload-page">
      <div
        className={`dropzone ${loading ? 'loading' : ''}`}
        onClick={() => !loading && inputRef.current.click()}
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
      >
        {loading ? (
          <div className="spinner-wrap">
            <div className="spinner" />
            <p>Removing background… this may take 10–20s on first run</p>
          </div>
        ) : (
          <>
            <div className="upload-icon">📷</div>
            <p className="upload-main">Drop your photo here, or click to browse</p>
            <p className="upload-sub">JPG, PNG — selfie or portrait works best</p>
          </>
        )}
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleChange}
        />
      </div>
      {error && <p className="error-msg">⚠ {error}</p>}
    </div>
  )
}
