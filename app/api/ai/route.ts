// route/api/route.ts
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = String(body.prompt ?? '').trim();
    if (!prompt) {
      return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // For local dev without a key, return a harmless placeholder
      const placeholder = `Placeholder AI response for prompt: ${prompt.slice(0, 200)}`;
      return NextResponse.json({ cached: false, result: placeholder });
    }

    // Call OpenAI Chat Completions endpoint (works even if SDK versions differ)
    const resp = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini', // keep the model you prefer
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.2,
      }),
    });

    if (!resp.ok) {
      const errText = await resp.text();
      return NextResponse.json({ error: `OpenAI error: ${resp.status} ${errText}` }, { status: 502 });
    }

    const data = await resp.json();
    const text = data?.choices?.[0]?.message?.content ?? JSON.stringify(data);
    return NextResponse.json({ cached: false, result: text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
