import { useState, useRef } from 'react'
import './WordInput.css'

function WordInput({ words, onChange }) {
  const [inputValue, setInputValue] = useState('')
  const [bulkMode, setBulkMode] = useState(false)
  const [bulkText, setBulkText] = useState('')
  const inputRef = useRef(null)

  const addWord = (word) => {
    const trimmed = word.trim().toLowerCase()
    if (trimmed && !words.includes(trimmed) && words.length < 50) {
      onChange([...words, trimmed])
    }
  }

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' || e.key === ',') {
      e.preventDefault()
      addWord(inputValue)
      setInputValue('')
    }
    if (e.key === 'Backspace' && inputValue === '' && words.length > 0) {
      onChange(words.slice(0, -1))
    }
  }

  const removeWord = (index) => {
    onChange(words.filter((_, i) => i !== index))
  }

  const clearAll = () => {
    onChange([])
  }

  const handleBulkAdd = () => {
    const newWords = bulkText
      .split(/[\n,;]+/)
      .map(w => w.trim().toLowerCase())
      .filter(w => w && !words.includes(w))

    const available = 50 - words.length
    const toAdd = newWords.slice(0, available)

    if (toAdd.length > 0) {
      onChange([...words, ...toAdd])
    }

    setBulkText('')
    setBulkMode(false)
  }

  return (
    <div className="word-input-container">
      <div className="word-input-header">
        <h3>Kelimeler ({words.length}/50)</h3>
        <div className="word-input-actions">
          <button
            className="action-btn"
            onClick={() => setBulkMode(!bulkMode)}
          >
            {bulkMode ? 'Tek Tek' : 'Toplu Ekle'}
          </button>
          {words.length > 0 && (
            <button className="action-btn danger" onClick={clearAll}>
              Temizle
            </button>
          )}
        </div>
      </div>

      {bulkMode ? (
        <div className="bulk-input">
          <textarea
            value={bulkText}
            onChange={(e) => setBulkText(e.target.value)}
            placeholder="Kelimeleri virgul, noktali virgul veya yeni satir ile ayirarak girin...&#10;&#10;Ornek: abandon, ability, absence, abstract, academic"
            rows={6}
          />
          <button
            className="bulk-add-btn"
            onClick={handleBulkAdd}
            disabled={!bulkText.trim()}
          >
            Kelimeleri Ekle
          </button>
        </div>
      ) : (
        <div className="word-input-field" onClick={() => inputRef.current?.focus()}>
          <div className="word-tags">
            {words.map((word, index) => (
              <span key={index} className="word-tag">
                {word}
                <button onClick={(e) => { e.stopPropagation(); removeWord(index) }}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"/>
                    <line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </span>
            ))}
            {words.length < 50 && (
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={words.length === 0 ? "Kelime yazin ve Enter'a basin..." : ""}
                className="tag-input"
              />
            )}
          </div>
        </div>
      )}

      {words.length >= 50 && (
        <p className="word-limit-msg">Maksimum 50 kelime sinirina ulastiniz.</p>
      )}
    </div>
  )
}

export default WordInput
