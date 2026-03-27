import { useState, useMemo } from 'react'
import './TextDisplay.css'

function TextDisplay({ text, words, settings }) {
  const [showTranslation, setShowTranslation] = useState({})

  const highlightedText = useMemo(() => {
    if (!text || words.length === 0) return text

    const wordSet = new Set(words.map(w => w.toLowerCase()))
    const pattern = words
      .map(w => w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      .join('|')
    const regex = new RegExp(`\\b(${pattern})\\b`, 'gi')

    const parts = []
    let lastIndex = 0
    let match

    const textStr = text
    regex.lastIndex = 0

    while ((match = regex.exec(textStr)) !== null) {
      if (match.index > lastIndex) {
        parts.push({ type: 'text', content: textStr.slice(lastIndex, match.index) })
      }
      parts.push({ type: 'highlight', content: match[0], word: match[0].toLowerCase() })
      lastIndex = regex.lastIndex
    }

    if (lastIndex < textStr.length) {
      parts.push({ type: 'text', content: textStr.slice(lastIndex) })
    }

    return parts
  }, [text, words])

  const levelLabel = {
    a1: 'A1', a2: 'A2', b1: 'B1', b2: 'B2', c1: 'C1', c2: 'C2'
  }

  const categoryLabel = {
    general: 'Genel', game: 'Oyun', documentary: 'Belgesel',
    academic: 'Akademik', ydt: 'YDT', business: 'Is Dunyasi',
    science: 'Bilim', literature: 'Edebiyat', news: 'Haber', daily: 'Gunluk'
  }

  const copyText = () => {
    navigator.clipboard.writeText(text)
  }

  const foundWords = useMemo(() => {
    if (!text) return []
    return words.filter(w => {
      const regex = new RegExp(`\\b${w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`, 'i')
      return regex.test(text)
    })
  }, [text, words])

  const missingWords = useMemo(() => {
    return words.filter(w => !foundWords.includes(w))
  }, [words, foundWords])

  return (
    <div className="text-display">
      <div className="text-display-header">
        <div className="text-badges">
          <span className="badge level">{levelLabel[settings.level] || settings.level}</span>
          <span className="badge category">{categoryLabel[settings.category] || settings.category}</span>
          <span className="badge words-count">{foundWords.length}/{words.length} kelime</span>
        </div>
        <button className="copy-btn" onClick={copyText} title="Metni kopyala">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect x="9" y="9" width="13" height="13" rx="2" ry="2"/>
            <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
          </svg>
          Kopyala
        </button>
      </div>

      <div className="text-body">
        {Array.isArray(highlightedText) ? (
          highlightedText.map((part, i) =>
            part.type === 'highlight' ? (
              <span key={i} className="highlighted-word" title={part.word}>
                {part.content}
              </span>
            ) : (
              <span key={i}>{part.content}</span>
            )
          )
        ) : (
          <p>{text}</p>
        )}
      </div>

      {missingWords.length > 0 && (
        <div className="missing-words">
          <span className="missing-label">Metinde bulunamayan kelimeler:</span>
          <div className="missing-list">
            {missingWords.map((w, i) => (
              <span key={i} className="missing-tag">{w}</span>
            ))}
          </div>
        </div>
      )}

      <div className="word-legend">
        <div className="legend-item">
          <span className="legend-highlight"></span>
          <span>Vurgulanan kelimeler sizin eklediginiz kelimelerdir</span>
        </div>
      </div>
    </div>
  )
}

export default TextDisplay
