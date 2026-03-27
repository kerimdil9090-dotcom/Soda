import { useState } from 'react'
import './ApiKeyModal.css'

function ApiKeyModal({ apiKey: initialKey, onSave, onClose }) {
  const [key, setKey] = useState(initialKey)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (key.trim()) {
      onSave(key.trim())
    }
  }

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-header">
          <h2>API Anahtari Ayarlari</h2>
          {initialKey && (
            <button className="modal-close" onClick={onClose}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="18" y1="6" x2="6" y2="18"/>
                <line x1="6" y1="6" x2="18" y2="18"/>
              </svg>
            </button>
          )}
        </div>
        <p className="modal-desc">
          Metin olusturmak icin bir OpenAI API anahtari gereklidir.
          Anahtariniz yalnizca tarayicinizda saklanir.
        </p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="api-key">OpenAI API Anahtari</label>
            <input
              id="api-key"
              type="password"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              placeholder="sk-..."
              autoFocus
            />
          </div>
          <button type="submit" className="save-btn" disabled={!key.trim()}>
            Kaydet
          </button>
        </form>
      </div>
    </div>
  )
}

export default ApiKeyModal
