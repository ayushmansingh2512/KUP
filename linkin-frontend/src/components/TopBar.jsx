import './TopBar.css'

export default function TopBar() {
  return (
    <header className="top-bar">
      <div className="top-bar-spacer" />
      <div className="top-bar-actions">
        <div className="top-bar-status">
          <span className="status-dot" />
          <span className="status-label">KIET AI Navigator</span>
        </div>
      </div>
    </header>
  )
}

