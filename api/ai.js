// api/ai.js — Sovereign AI Proxy (Vercel Serverless)
// Token is stored in Vercel environment variable HF_API_KEY — never exposed to client.

const HF_MODELS = [
  'mistralai/Mistral-7B-Instruct-v0.3',
  'HuggingFaceH4/zephyr-7b-beta',
  'tiiuae/falcon-7b-instruct',
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

  if (!res.ok) {
    const errText = await res.text();
    throw new Error(`HF ${res.status}: ${errText.substring(0, 200)}`);
  }

  const data = await res.json();
  const text = Array.isArray(data) ? data[0]?.generated_text : data?.generated_text;

  if (!text || text.trim().length < 5) {
    throw new Error('Empty or invalid response from model');
  }

  return text.trim();
}

export default async function handler(req, res) {
  // Allow from any origin (the site itself)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { prompt } = req.body || {};

  if (!prompt || typeof prompt !== 'string' || prompt.trim().length < 3) {
    return res.status(400).json({ error: 'Invalid prompt' });
  }

  // 🔐 Token lives ONLY on the server (Vercel env var)
  const apiKey = process.env.HF_API_KEY;

  if (!apiKey) {
    console.error('HF_API_KEY environment variable is not set!');
    return res.status(500).json({ error: 'AI service not configured. Please set HF_API_KEY in Vercel.' });
  }

  // Try each model in order until one succeeds
  let lastError = null;

  for (const model of HF_MODELS) {
    try {
      console.log(`[AI Proxy] Trying model: ${model}`);
      const reply = await callHuggingFace(prompt.trim(), model, apiKey);

      return res.status(200).json({
        reply,
        model,
        status: 'success',
      });
    } catch (err) {
      console.warn(`[AI Proxy] Model ${model} failed: ${err.message}`);
      lastError = err;
    }
  }

  // All models failed
  console.error('[AI Proxy] All models failed:', lastError?.message);
  return res.status(503).json({
    error: 'All AI models are currently busy. Please try again in a moment.',
    details: lastError?.message,
  });
}
