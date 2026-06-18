// netlify/functions/ai-chat.js
// Fonction serverless — la clé API Anthropic ne quitte JAMAIS le serveur

const SYSTEM_PROMPT = `Tu es un assistant pédagogique expert en enseignement de l'anglais pour adultes débutants (A1-B1 CECRL), intégré dans la plateforme EnglishPath.

Ton rôle :
- Expliquer simplement la grammaire anglaise en français
- Corriger les phrases des apprenants avec bienveillance
- Proposer des exercices interactifs adaptés au niveau
- Traduire du français vers l'anglais et inversement
- Encourager et motiver les apprenants fragiles
- Adapter tes explications au niveau CECRL (A1 = très basique, B1 = plus élaboré)
- Utiliser des exemples du quotidien et du monde professionnel (secteurs #AVENIR)
- Référencer le programme Navigate quand pertinent

Style de réponse :
- Simple, clair, bienveillant, jamais condescendant
- Réponses concises (8-12 lignes max)
- Exemples anglais toujours accompagnés de leur traduction française
- Utiliser des emojis avec modération pour encourager
- Si l'apprenant écrit en anglais, répondre en anglais ET en français
- Format : explication courte → exemples → conseil pratique

Tu peux aussi :
- Générer des exercices QCM en JSON structuré
- Expliquer les erreurs fréquentes des francophones
- Donner des conseils de prononciation avec phonétique
- Suggérer des stratégies mnémotechniques
- Adapter le niveau si l'apprenant est en difficulté`

export const handler = async (event) => {
  // CORS
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json',
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' }
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) }
  }

  try {
    const { messages, mode = 'chat' } = JSON.parse(event.body)

    // Clé API côté serveur uniquement — jamais exposée au client
    const apiKey = process.env.ANTHROPIC_API_KEY
    if (!apiKey) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: 'API key not configured' }) }
    }

    // Construire les messages selon le mode
    let systemPrompt = SYSTEM_PROMPT
    let apiMessages = messages

    if (mode === 'exercise') {
      systemPrompt += '\n\nIMPORTANT : Réponds UNIQUEMENT avec un objet JSON valide, sans markdown, sans texte avant ou après. Format : {"question":"...","options":["A. ...","B. ...","C. ...","D. ..."],"answer":0,"explanation":"..."}'
    }

    if (mode === 'correct') {
      systemPrompt += '\n\nAnalyse la phrase et réponds avec : 1) La version corrigée en gras, 2) Les erreurs expliquées en français, 3) Un exemple supplémentaire correct.'
    }

    if (mode === 'tts') {
      // Mode texte vers phonétique
      systemPrompt = 'Tu es un expert en phonétique anglaise. Donne la prononciation en API phonétique international ET une description simple en français pour chaque mot fourni. Format : mot → /phonétique/ → "prononcez comme..."'
    }

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model: 'claude-sonnet-4-6',
        max_tokens: 1000,
        system: systemPrompt,
        messages: apiMessages.map(m => ({
          role: m.role === 'bot' ? 'assistant' : 'user',
          content: m.content,
        })),
      }),
    })

    if (!response.ok) {
      const err = await response.text()
      console.error('Anthropic API error:', err)
      return {
        statusCode: response.status,
        headers,
        body: JSON.stringify({ error: 'AI service temporarily unavailable' }),
      }
    }

    const data = await response.json()
    const text = data.content?.find(b => b.type === 'text')?.text || ''

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ text, usage: data.usage }),
    }
  } catch (err) {
    console.error('Function error:', err)
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: 'Internal server error' }),
    }
  }
}
