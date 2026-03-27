import { useState } from 'react'
import WordInput from './WordInput'
import SettingsPanel from './SettingsPanel'
import TextDisplay from './TextDisplay'
import { generateText, fetchWordDefinitions } from '../utils/api'
import './MainContent.css'

function MainContent({ session, onUpdateSession, onNewSession, apiKey, sidebarOpen, onToggleSidebar, onOpenApiKey }) {
  const [isGenerating, setIsGenerating] = useState(false)
  const [error, setError] = useState('')
  const [definitions, setDefinitions] = useState({})

  if (!session) {
    return (
      <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
        {!sidebarOpen && (
          <button className="sidebar-toggle" onClick={onToggleSidebar}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"/>
              <line x1="3" y1="6" x2="21" y2="6"/>
              <line x1="3" y1="18" x2="21" y2="18"/>
            </svg>
          </button>
        )}
        <div className="empty-state">
          <div className="empty-icon">
            <svg width="64" height="64" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              <line x1="8" y1="7" x2="16" y2="7"/>
              <line x1="8" y1="11" x2="14" y2="11"/>
            </svg>
          </div>
          <h2>VocabAI'ya Hos Geldiniz</h2>
          <p>Claude AI destekli Ingilizce kelime ezberleme araci</p>
          <p className="empty-hint">Kelimelerinizi girin, Claude AI bu kelimeleri iceren anlamli bir metin olustursun</p>
          <button className="start-btn" onClick={onNewSession}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/>
              <line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            Yeni Calisma Baslat
          </button>
        </div>
      </div>
    )
  }

  const handleWordsChange = (words) => {
    const title = words.length > 0
      ? words.slice(0, 3).join(', ') + (words.length > 3 ? '...' : '')
      : 'Yeni Calisma'
    onUpdateSession(session.id, { words, title })
  }

  const handleSettingsChange = (settings) => {
    onUpdateSession(session.id, { settings })
  }

  const handleGenerate = async () => {
    if (!apiKey) {
      setError('Lutfen once sol panelden API anahtarinizi ayarlayin.')
      return
    }
    if (session.words.length === 0) {
      setError('Lutfen en az bir kelime girin.')
      return
    }

    setIsGenerating(true)
    setError('')

    try {
      const [text, defs] = await Promise.all([
        generateText({
          words: session.words,
          settings: session.settings,
          apiKey,
        }),
        fetchWordDefinitions(session.words),
      ])

      setDefinitions(prev => ({ ...prev, ...defs }))

      const newText = {
        id: Date.now().toString(),
        content: text,
        createdAt: new Date().toISOString(),
        settings: { ...session.settings },
      }

      const updatedTexts = [...session.generatedTexts, newText]
      onUpdateSession(session.id, {
        generatedTexts: updatedTexts,
        activeTextIndex: updatedTexts.length - 1,
      })
    } catch (err) {
      setError(err.message || 'Metin olusturulurken bir hata olustu.')
    } finally {
      setIsGenerating(false)
    }
  }

  const handleRegenerate = () => {
    handleGenerate()
  }

  const handleSelectText = (index) => {
    onUpdateSession(session.id, { activeTextIndex: index })
  }

  const activeText = session.activeTextIndex >= 0
    ? session.generatedTexts[session.activeTextIndex]
    : null

  return (
    <div className={`main-content ${sidebarOpen ? '' : 'expanded'}`}>
      {!sidebarOpen && (
        <button className="sidebar-toggle" onClick={onToggleSidebar}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>
      )}

      <div className="content-wrapper">
        {!apiKey && (
          <div className="api-warning">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <span>Metin olusturmak icin Claude API anahtari gerekli.</span>
            <button onClick={onOpenApiKey}>Anahtar Ekle</button>
          </div>
        )}

        <div className="input-section">
          <WordInput words={session.words} onChange={handleWordsChange} />
          <SettingsPanel settings={session.settings} onChange={handleSettingsChange} />

          <div className="generate-area">
            <button
              className="generate-btn"
              onClick={handleGenerate}
              disabled={isGenerating || session.words.length === 0}
            >
              {isGenerating ? (
                <>
                  <div className="spinner" />
                  Claude olusturuyor...
                </>
              ) : (
                <>
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
                  </svg>
                  Metin Olustur
                </>
              )}
            </button>

            {session.generatedTexts.length > 0 && (
              <button
                className="regenerate-btn"
                onClick={handleRegenerate}
                disabled={isGenerating || session.words.length === 0}
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="23 4 23 10 17 10"/>
                  <polyline points="1 20 1 14 7 14"/>
                  <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/>
                </svg>
                Yeniden Olustur
              </button>
            )}
          </div>

          {error && <div className="error-msg">{error}</div>}
        </div>

        {session.generatedTexts.length > 0 && (
          <div className="output-section">
            {session.generatedTexts.length > 1 && (
              <div className="text-tabs">
                {session.generatedTexts.map((t, i) => (
                  <button
                    key={t.id}
                    className={`text-tab ${i === session.activeTextIndex ? 'active' : ''}`}
                    onClick={() => handleSelectText(i)}
                  >
                    Versiyon {i + 1}
                  </button>
                ))}
              </div>
            )}

            {activeText && (
              <TextDisplay
                text={activeText.content}
                words={session.words}
                settings={activeText.settings}
                definitions={definitions}
              />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default MainContent
