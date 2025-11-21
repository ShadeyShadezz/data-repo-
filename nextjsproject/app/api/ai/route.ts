import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const cache = new Map<string, any>();

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const prompt = body.prompt ?? '';
    if (!prompt) return NextResponse.json({ error: 'No prompt provided' }, { status: 400 });

    if (cache.has(prompt)) {
      return NextResponse.json({ cached: true, result: cache.get(prompt) });
    }

    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      // No API key configured — return a placeholder response
      const placeholder = `Placeholder AI response for prompt: ${prompt.slice(0, 200)}`;
      cache.set(prompt, placeholder);
      return NextResponse.json({ cached: false, result: placeholder });
    }

    const client = new OpenAI({ apiKey });
    const completion = await client.responses.create({
      model: 'gpt-4o-mini',
      input: prompt,
      max_tokens: 500,
    });

    const text = completion.output?.[0]?.content?.[0]?.text ?? JSON.stringify(completion.output) ?? '';
    cache.set(prompt, text);
    return NextResponse.json({ cached: false, result: text });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
