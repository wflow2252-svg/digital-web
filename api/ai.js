// api/ai.js — Sovereign AI Proxy (Vercel Serverless) v14
// Primary : Google Gemini 1.5 Flash (FREE — 15 req/min, 1M tokens/day)
// Fallback: Hugging Face Mistral-7B  (FREE — slower on cold start)
// Token stored in Vercel env vars: GEMINI_API_KEY / HF_API_KEY

// ─────────────────────────────────────────────────
// 1. Google Gemini (primary — always fast & free)
// ─────────────────────────────────────────────────
async function callGemini(prompt, apiKey) {
  const res = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${apiKey}`,
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.75,
          topP: 0.9,
          maxOutputTokens: 8192,
        },
        safetySettings: [
          { category: 'HARM_CATEGORY_HARASSMENT',        threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_HATE_SPEECH',       threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_SEXUALLY_EXPLICIT', threshold: 'BLOCK_NONE' },
          { category: 'HARM_CATEGORY_DANGEROUS_CONTENT', threshold: 'BLOCK_NONE' },
        ],
      }),
    }
  );

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Gemini ${res.status}: ${err.substring(0, 300)}`);
  }

  const data = await res.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!text || text.trim().length < 5) throw new Error('Gemini returned empty response');
  return text.trim();
}

// ─────────────────────────────────────────────────
// 2. Hugging Face (fallback)
// ─────────────────────────────────────────────────
const HF_MODELS = [
  'mistralai/Mistral-7B-Instruct-v0.3',
  'HuggingFaceH4/zephyr-7b-beta',
];

async function callHuggingFace(prompt, modelId, apiKey) {
  const formatted = `<s>[INST] ${prompt} [/INST]`;
  const res = await fetch(`https://api-inference.huggingface.co/models/${modelId}`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      inputs: formatted,
      parameters: {
        max_new_tokens: 4096,
        temperature: 0.72,
        top_p: 0.9,
        do_sample: true,
        return_full_text: false,
      },
      options: { wait_for_model: true, use_cache: false },
    }),
  });

  if (!res.ok) throw new Error(`HF ${res.status}: ${(await res.text()).substring(0, 200)}`);

  const data = await res.json();
  const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;
  if (!text || text.trim().length < 5) throw new Error('HF returned empty response');
  return text.trim();
}

// ─────────────────────────────────────────────────
// Handler
// ─────────────────────────────────────────────────
export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { prompt } = req.body || {};
  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3)
    return res.status(400).json({ error: 'Invalid prompt' });

  const geminiKey = process.env.GEMINI_API_KEY;
  const hfKey    = process.env.HF_API_KEY;

  // ── 1. Try Gemini (preferred)
  if (geminiKey) {
    try {
      console.log('[AI Proxy] Using Google Gemini 1.5 Flash');
      const reply = await callGemini(prompt.trim(), geminiKey);
      return res.status(200).json({ reply, model: 'gemini-1.5-flash', status: 'success' });
    } catch (err) {
      console.warn('[AI Proxy] Gemini failed:', err.message);
    }
  } else {
    console.warn('[AI Proxy] GEMINI_API_KEY not set — skipping Gemini');
  }

  // ── 2. Try HF models as fallback
  if (hfKey) {
    for (const model of HF_MODELS) {
      try {
        console.log(`[AI Proxy] Trying HF model: ${model}`);
        const reply = await callHuggingFace(prompt.trim(), model, hfKey);
        return res.status(200).json({ reply, model, status: 'success' });
      } catch (err) {
        console.warn(`[AI Proxy] HF ${model} failed:`, err.message);
      }
    }
  } else {
    console.warn('[AI Proxy] HF_API_KEY not set — skipping HF');
  }

  // ── 3. Both failed
  if (!geminiKey && !hfKey) {
    return res.status(500).json({
      error: 'AI service not configured. Add GEMINI_API_KEY to Vercel environment variables.',
    });
  }

  return res.status(503).json({
    error: 'All AI providers are currently busy. Please try again in a moment.',
  });
}
