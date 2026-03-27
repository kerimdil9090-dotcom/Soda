import { useState } from 'react'
import './Sidebar.css'

function Sidebar({ sessions, activeSessionId, onNewSession, onSelectSession, onDeleteSession, isOpen, onToggle, darkMode, onToggleDarkMode, onOpenApiKey, hasApiKey }) {
  const [hoveredId, setHoveredId] = useState(null)

  const formatDate = (dateStr) => {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 1) return 'Simdi'
    if (diffMins < 60) return `${diffMins} dk once`
    if (diffHours < 24) return `${diffHours} saat once`
    if (diffDays < 7) return `${diffDays} gun once`
    return date.toLocaleDateString('tr-TR')
  }

  return (
    <>
      <div className={`sidebar ${isOpen ? 'open' : 'closed'}`}>
        <div className="sidebar-header">
          <div className="logo">
            <div className="logo-icon">V</div>
            <span className="logo-text">VocabAI</span>
          </div>
          <button className="sidebar-close-btn" onClick={onToggle} title="Kenar cubugunu kapat">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M11 17l-5-5 5-5"/>
              <path d="M18 17l-5-5 5-5"/>
            </svg>
          </button>
        </div>

        <button className="new-session-btn" onClick={onNewSession}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="12" y1="5" x2="12" y2="19"/>
            <line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Yeni Calisma
        </button>

        <div className="sessions-list">
          {sessions.length === 0 ? (
            <div className="no-sessions">
              <p>Henuz bir calisma olusturulmanis.</p>
              <p className="hint">Yeni bir calisma baslatin!</p>
            </div>
          ) : (
            sessions.map(session => (
              <div
                key={session.id}
                className={`session-item ${session.id === activeSessionId ? 'active' : ''}`}
                onClick={() => onSelectSession(session.id)}
                onMouseEnter={() => setHoveredId(session.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div className="session-info">
                  <span className="session-title">{session.title}</span>
                  <span className="session-meta">
                    {session.words.length > 0 ? `${session.words.length} kelime` : 'Bos'}
                    {' · '}
                    {formatDate(session.createdAt)}
                  </span>
                </div>
                {hoveredId === session.id && (
                  <button
                    className="delete-btn"
                    onClick={(e) => {
                      e.stopPropagation()
                      onDeleteSession(session.id)
                    }}
                    title="Calismayi sil"
                  >
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="3 6 5 6 21 6"/>
                      <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                )}
              </div>
            ))
          )}
        </div>

        <div className="sidebar-footer">
          <button className="api-key-btn" onClick={onOpenApiKey}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3m-3.5 3.5L19 4"/>
            </svg>
            {hasApiKey ? 'API Anahtari (Ayarli)' : 'API Anahtari Ekle'}
          </button>
          <button className="theme-toggle-btn" onClick={onToggleDarkMode}>
            {darkMode ? (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="5"/>
                <line x1="12" y1="1" x2="12" y2="3"/>
                <line x1="12" y1="21" x2="12" y2="23"/>
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/>
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
                <line x1="1" y1="12" x2="3" y2="12"/>
                <line x1="21" y1="12" x2="23" y2="12"/>
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/>
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
              </svg>
            ) : (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
              </svg>
            )}
            {darkMode ? 'Acik Mod' : 'Karanlik Mod'}
          </button>
        </div>
      </div>

      {isOpen && <div className="sidebar-overlay" onClick={onToggle} />}
    </>
  )
}

export default Sidebar
