import express from 'express'
import cors from 'cors'
import { createRequire } from 'module'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// Serve static files from dist in production
app.use(express.static(join(__dirname, 'dist')))

// Proxy endpoint for Claude API
app.post('/api/generate', async (req, res) => {
  const { apiKey, prompt } = req.body

  if (!apiKey) {
    return res.status(401).json({ error: 'API anahtari gerekli.' })
  }

  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 2048,
        messages: [
          {
            role: 'user',
            content: prompt,
          }
        ],
      }),
    })

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      return res.status(response.status).json({
        error: errorData.error?.message || `Claude API hatasi: ${response.status}`
      })
    }

    const data = await response.json()
    const text = data.content?.[0]?.text || ''

    res.json({ text })
  } catch (err) {
    console.error('Claude API error:', err)
    res.status(500).json({ error: 'Sunucu hatasi. Lutfen tekrar deneyin.' })
  }
})

// SPA fallback
app.get('*', (req, res) => {
  res.sendFile(join(__dirname, 'dist', 'index.html'))
})

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`)
})
