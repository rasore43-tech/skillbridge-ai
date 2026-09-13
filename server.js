// server.js
// Simple Express proxy so the Gemini API key never touches the browser.
// The frontend calls POST /api/generate, and THIS server calls Google's API.

require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.0-flash';

if (!GEMINI_API_KEY) {
  console.warn('[WARNING] GEMINI_API_KEY is not set. Create a .env file (see .env.example).');
}

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// System prompts per coach mode. Kept on the server so users can't tamper with them.
const SYSTEM_PROMPTS = {
  resume:
    'You are an elite career coach and senior recruiter. The user may write their prompt or resume in any language. Respond intelligently by analyzing their strengths, 2 critical weaknesses, and provide an optimized professional resume summary and cover letter draft in professional English.',
  interview:
    'You are an elite technical hiring manager conducting a mock interview. The user may respond in any language. Ask the first targeted and challenging interview question based on their target role, and provide clear evaluation criteria.',
  learning:
    'You are a professional career mentor. The user may write in any language. Design a structured, week-by-week learning roadmap with recommended free resources and milestones.',
};

app.post('/api/generate', async (req, res) => {
  try {
    const { mode, prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || !prompt.trim()) {
      return res.status(400).json({ error: 'Missing "prompt" in request body.' });
    }
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ error: 'Server is missing GEMINI_API_KEY. See .env.example.' });
    }

    const systemPrompt = SYSTEM_PROMPTS[mode] || SYSTEM_PROMPTS.resume;
    const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [{ parts: [{ text: prompt }] }],
      systemInstruction: { parts: [{ text: systemPrompt }] },
    };

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('Gemini API error:', result);
      return res.status(response.status).json({ error: result.error?.message || 'Gemini API error' });
    }

    const text = result.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!text) {
      return res.status(502).json({ error: 'Invalid response format from Gemini API' });
    }

    res.json({ text });
  } catch (err) {
    console.error('Server error:', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`SkillBridge AI server running on http://localhost:${PORT}`);
});
