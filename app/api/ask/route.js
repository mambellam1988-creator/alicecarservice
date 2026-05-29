import { NextResponse } from 'next/server';

const ANTHROPIC_URL = 'https://api.anthropic.com/v1/complete';

const SYSTEM_PROMPT = `Sei un meccanico esperto italiano specializzato in istruzioni di montaggio e smontaggio per automobili. Rispondi in modo chiaro, preciso e professionale. Devi restituire esclusivamente un oggetto JSON valido senza testo aggiuntivo. Il JSON deve avere queste proprietà:
- titolo: string
- difficolta: string
- tempo: string
- attrezzi: array di stringhe
- avvertenze: array di stringhe
- passi: array di stringhe
- consiglio: string

Non includere Markdown, punti elenco con simboli, né spiegazioni aggiuntive fuori dal JSON. Usa un linguaggio italiano semplice e diretto.\n`;

async function callAnthropic(query) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('Missing ANTHROPIC_API_KEY environment variable');
  }

  const prompt = `${SYSTEM_PROMPT}\nHuman: ${query}\nAssistant:`;

  const response = await fetch(ANTHROPIC_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
    },
    body: JSON.stringify({
      model: 'claude-sonnet-4-20250514',
      prompt,
      max_tokens: 450,
      temperature: 0.2,
      top_p: 1,
      stop_sequences: ['\n\nHuman:'],
    }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Anthropic API error: ${response.status} ${errorText}`);
  }

  const data = await response.json();
  const text = data.completion?.trim();
  if (!text) {
    throw new Error('Anthropic response missing completion text');
  }

  try {
    return JSON.parse(text);
  } catch (error) {
    const match = text.match(/\{[\s\S]*\}$/);
    if (match) {
      return JSON.parse(match[0]);
    }
    throw new Error(`Unable to parse Anthropic response as JSON: ${text}`);
  }
}

export async function POST(request) {
  const body = await request.json();
  const query = body?.query?.toString().trim();

  if (!query) {
    return NextResponse.json({ error: 'Missing query in request body' }, { status: 400 });
  }

  try {
    const answer = await callAnthropic(query);
    return NextResponse.json(answer);
  } catch (error) {
    return NextResponse.json({ error: error.message || 'Errore interno' }, { status: 500 });
  }
}
