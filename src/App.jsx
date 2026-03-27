import { useState, useCallback } from 'react'
import Sidebar from './components/Sidebar'
import MainContent from './components/MainContent'
import ApiKeyModal from './components/ApiKeyModal'
import './App.css'

const createNewSession = () => ({
  id: Date.now().toString(),
  title: 'Yeni Calisma',
  words: [],
  settings: {
    length: 'medium',
    level: 'b1',
    category: 'general',
  },
  generatedTexts: [],
  activeTextIndex: -1,
  createdAt: new Date().toISOString(),
})

function App() {
  const [sessions, setSessions] = useState(() => {
    const saved = localStorage.getItem('vocabai_sessions')
    if (saved) {
      try { return JSON.parse(saved) } catch { return [] }
    }
    return []
  })

  const [activeSessionId, setActiveSessionId] = useState(() => {
    const saved = localStorage.getItem('vocabai_active_session')
    return saved || null
  })

  const [apiKey, setApiKey] = useState(() => {
    return localStorage.getItem('vocabai_api_key') || ''
  })

  const [showApiKeyModal, setShowApiKeyModal] = useState(!apiKey)
  const [sidebarOpen, setSidebarOpen] = useState(true)

  const saveToStorage = useCallback((newSessions, newActiveId) => {
    localStorage.setItem('vocabai_sessions', JSON.stringify(newSessions))
    if (newActiveId !== undefined) {
      localStorage.setItem('vocabai_active_session', newActiveId || '')
    }
  }, [])

  const handleNewSession = useCallback(() => {
    const session = createNewSession()
    setSessions(prev => {
      const updated = [session, ...prev]
      saveToStorage(updated, session.id)
      return updated
    })
    setActiveSessionId(session.id)
  }, [saveToStorage])

  const handleSelectSession = useCallback((id) => {
    setActiveSessionId(id)
    localStorage.setItem('vocabai_active_session', id)
  }, [])

  const handleDeleteSession = useCallback((id) => {
    setSessions(prev => {
      const updated = prev.filter(s => s.id !== id)
      const newActiveId = id === activeSessionId
        ? (updated.length > 0 ? updated[0].id : null)
        : activeSessionId
      saveToStorage(updated, newActiveId)
      if (id === activeSessionId) setActiveSessionId(newActiveId)
      return updated
    })
  }, [activeSessionId, saveToStorage])

  const handleUpdateSession = useCallback((id, updates) => {
    setSessions(prev => {
      const updated = prev.map(s => s.id === id ? { ...s, ...updates } : s)
      saveToStorage(updated)
      return updated
    })
  }, [saveToStorage])

  const handleSaveApiKey = useCallback((key) => {
    setApiKey(key)
    localStorage.setItem('vocabai_api_key', key)
    setShowApiKeyModal(false)
  }, [])

  const activeSession = sessions.find(s => s.id === activeSessionId) || null

  return (
    <div className="app">
      <Sidebar
        sessions={sessions}
        activeSessionId={activeSessionId}
        onNewSession={handleNewSession}
        onSelectSession={handleSelectSession}
        onDeleteSession={handleDeleteSession}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(prev => !prev)}
        onOpenApiKey={() => setShowApiKeyModal(true)}
      />
      <MainContent
        session={activeSession}
        onUpdateSession={handleUpdateSession}
        onNewSession={handleNewSession}
        apiKey={apiKey}
        sidebarOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(prev => !prev)}
      />
      {showApiKeyModal && (
        <ApiKeyModal
          apiKey={apiKey}
          onSave={handleSaveApiKey}
          onClose={() => apiKey && setShowApiKeyModal(false)}
        />
      )}
    </div>
  )
}

export default App
