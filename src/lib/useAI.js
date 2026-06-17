import { useState } from 'react';

const SYSTEM_PROMPT = `Tu es un assistant pédagogique expert en enseignement de l'anglais pour adultes débutants (A1-B1 CECRL), intégré dans la plateforme EnglishPath.

Ton rôle :
- Expliquer simplement la grammaire anglaise en français
- Corriger les phrases des apprenants
- Proposer des exercices interactifs
- Traduire du français vers l'anglais et inversement
- Encourager et motiver les apprenants
- Adapter tes explications au niveau (A1 = très simple, B1 = plus élaboré)
- Utiliser des exemples concrets du quotidien et du monde professionnel
- Référencer le programme Navigate quand pertinent (unités 1-5 A1 : First meetings, Questions, People & possessions, My life, Style & design)

Style : 
- Simple, clair, bienveillant
- Réponses courtes (5-10 lignes max)
- Exemples en anglais toujours avec traduction française
- Utilise des emojis modérément pour encourager
- Si l'apprenant écrit en anglais, réponds en anglais et en français
- Format : explication courte → exemples → conseil pratique

Tu peux aussi :
- Générer des exercices QCM, textes à trous, associations
- Expliquer les erreurs fréquentes
- Donner des conseils de prononciation
- Suggérer des stratégies d'apprentissage`;

export function useAI() {
  const [loading, setLoading] = useState(false);

  const ask = async (userMessage, conversationHistory = []) => {
    setLoading(true);
    try {
      const messages = [
        ...conversationHistory
          .filter(m => m.role !== 'system')
          .map(m => ({ role: m.role === 'bot' ? 'assistant' : 'user', content: m.content })),
        { role: 'user', content: userMessage }
      ];

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model: 'claude-sonnet-4-6',
          max_tokens: 1000,
          system: SYSTEM_PROMPT,
          messages,
        }),
      });

      if (!response.ok) throw new Error('API error');
      const data = await response.json();
      const text = data.content?.find(b => b.type === 'text')?.text || 'Désolé, je n\'ai pas pu répondre.';
      return text;
    } catch (e) {
      console.error(e);
      return 'Connexion temporairement indisponible. Vérifiez votre connexion internet.';
    } finally {
      setLoading(false);
    }
  };

  const generateExercise = async (unit, type = 'qcm') => {
    const prompt = `Génère un exercice de type ${type} pour l'unité ${unit} du programme Navigate A1 en anglais. 
    Format JSON : { "question": "...", "options": ["A.","B.","C.","D."], "answer": 0, "explanation": "..." }
    Réponds UNIQUEMENT avec le JSON, sans backticks ni explication.`;
    const result = await ask(prompt);
    try {
      return JSON.parse(result.replace(/```json?|```/g, '').trim());
    } catch {
      return null;
    }
  };

  const correctSentence = async (sentence) => {
    return await ask(`Corrige cette phrase en anglais et explique les erreurs en français : "${sentence}"`);
  };

  const translate = async (text, direction = 'fr-en') => {
    const prompt = direction === 'fr-en'
      ? `Traduis en anglais et donne un exemple d'utilisation : "${text}"`
      : `Traduis en français et donne un exemple d'utilisation : "${text}"`;
    return await ask(prompt);
  };

  return { ask, generateExercise, correctSentence, translate, loading };
}
