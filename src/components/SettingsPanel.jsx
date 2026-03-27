import './SettingsPanel.css'

const LENGTH_OPTIONS = [
  { value: 'short', label: 'Kisa', desc: '~150 kelime' },
  { value: 'medium', label: 'Orta', desc: '~300 kelime' },
  { value: 'long', label: 'Uzun', desc: '~500 kelime' },
  { value: 'very-long', label: 'Cok Uzun', desc: '~800 kelime' },
]

const LEVEL_OPTIONS = [
  { value: 'a1', label: 'A1', desc: 'Baslangic' },
  { value: 'a2', label: 'A2', desc: 'Temel' },
  { value: 'b1', label: 'B1', desc: 'Orta Alti' },
  { value: 'b2', label: 'B2', desc: 'Orta Ustu' },
  { value: 'c1', label: 'C1', desc: 'Ileri' },
  { value: 'c2', label: 'C2', desc: 'Uzman' },
]

const CATEGORY_OPTIONS = [
  { value: 'general', label: 'Genel' },
  { value: 'game', label: 'Oyun / Eglence' },
  { value: 'documentary', label: 'Belgesel' },
  { value: 'academic', label: 'Akademik' },
  { value: 'ydt', label: 'YDT Sinav Tarzi' },
  { value: 'business', label: 'Is Dunyasi' },
  { value: 'science', label: 'Bilim / Teknoloji' },
  { value: 'literature', label: 'Edebiyat' },
  { value: 'news', label: 'Haber / Gazetecilik' },
  { value: 'daily', label: 'Gunluk Yasam' },
]

function SettingsPanel({ settings, onChange }) {
  const update = (key, value) => {
    onChange({ ...settings, [key]: value })
  }

  return (
    <div className="settings-panel">
      <h3 className="settings-title">Metin Ayarlari</h3>

      <div className="settings-grid">
        <div className="setting-group">
          <label className="setting-label">Metin Uzunlugu</label>
          <div className="option-chips">
            {LENGTH_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`chip ${settings.length === opt.value ? 'active' : ''}`}
                onClick={() => update('length', opt.value)}
              >
                <span className="chip-label">{opt.label}</span>
                <span className="chip-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">
            Zorluk Seviyesi
            <span className="setting-hint">(50 kelime disindaki kelimelerin seviyesi)</span>
          </label>
          <div className="option-chips levels">
            {LEVEL_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`chip level-chip ${settings.level === opt.value ? 'active' : ''}`}
                onClick={() => update('level', opt.value)}
              >
                <span className="chip-label">{opt.label}</span>
                <span className="chip-desc">{opt.desc}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="setting-group">
          <label className="setting-label">Kategori</label>
          <div className="option-chips categories">
            {CATEGORY_OPTIONS.map(opt => (
              <button
                key={opt.value}
                className={`chip ${settings.category === opt.value ? 'active' : ''}`}
                onClick={() => update('category', opt.value)}
              >
                <span className="chip-label">{opt.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default SettingsPanel
