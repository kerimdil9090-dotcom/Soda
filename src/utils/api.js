const LENGTH_MAP = {
  'short': '150',
  'medium': '300',
  'long': '500',
  'very-long': '800',
}

const LEVEL_DESC = {
  'a1': 'A1 (Beginner) - Use very simple, basic vocabulary and short sentences',
  'a2': 'A2 (Elementary) - Use simple vocabulary and basic sentence structures',
  'b1': 'B1 (Intermediate) - Use moderately complex vocabulary and sentence structures',
  'b2': 'B2 (Upper Intermediate) - Use advanced vocabulary and complex sentences',
  'c1': 'C1 (Advanced) - Use sophisticated vocabulary and complex structures',
  'c2': 'C2 (Proficiency) - Use highly sophisticated, native-level vocabulary and structures',
}

const CATEGORY_DESC = {
  'general': 'a general topic',
  'game': 'gaming, entertainment, or adventure themes',
  'documentary': 'a documentary-style narrative about nature, history, or society',
  'academic': 'an academic or scholarly topic',
  'ydt': 'a YDS/YDT (Turkish Foreign Language Exam) style passage - formal, academic tone with complex sentence structures typical of Turkish university entrance English exams',
  'business': 'business, economics, or corporate themes',
  'science': 'science, technology, or innovation topics',
  'literature': 'literary fiction or creative writing style',
  'news': 'a news article or journalism style',
  'daily': 'everyday life, casual conversations, or daily routines',
}

export async function generateText({ words, settings, apiKey, signal }) {
  const wordList = words.join(', ')
  const wordCount = LENGTH_MAP[settings.length] || '300'
  const levelDesc = LEVEL_DESC[settings.level] || LEVEL_DESC['b1']
  const categoryDesc = CATEGORY_DESC[settings.category] || CATEGORY_DESC['general']

  const prompt = `You are an expert English language teacher and content writer. Generate a coherent, engaging English text that naturally incorporates ALL of the following ${words.length} vocabulary words.

VOCABULARY WORDS TO INCLUDE: ${wordList}

REQUIREMENTS:
1. TEXT LENGTH: Approximately ${wordCount} words total.
2. DIFFICULTY LEVEL: The surrounding text (words OTHER than the given vocabulary) should be at ${levelDesc} level.
3. CATEGORY/STYLE: Write about ${categoryDesc}.
4. WORD INTEGRATION: Each vocabulary word MUST appear at least once in the text. Integrate them naturally and meaningfully - they should fit the context perfectly, not feel forced.
5. COHERENCE: The text must be a single coherent piece - an essay, story, or article depending on the category. It should flow naturally and make sense as a whole.
6. Do NOT include translations, word lists, or explanations. Just write the text.
7. Do NOT use markdown formatting. Write plain text only with paragraph breaks.

Write the text now:`

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content: 'You are an expert English language content writer. You create engaging, natural texts that incorporate given vocabulary words seamlessly.'
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      temperature: 0.8,
      max_tokens: 2000,
    }),
    signal,
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    if (response.status === 401) {
      throw new Error('API anahtari gecersiz. Lutfen ayarlardan kontrol edin.')
    }
    if (response.status === 429) {
      throw new Error('API istek limiti asildi. Lutfen biraz bekleyin.')
    }
    throw new Error(errorData.error?.message || `API hatasi: ${response.status}`)
  }

  const data = await response.json()
  const content = data.choices?.[0]?.message?.content

  if (!content) {
    throw new Error('API bos bir yanit dondurdu.')
  }

  return content.trim()
}
