# SkillBridge AI — Smart Career & Resume Coach

Built for the **Hyperbloom September - AI/ML Hackathon**.

An AI career coach with three modes:
- **Resume & Cover Letter Coach** — reviews resumes, gives feedback, drafts a professional resume/cover letter.
- **Mock Interview Coach** — runs a live mock interview for a target role.
- **Skill Learning Path Generator** — builds a week-by-week roadmap for a career transition.

Supports input in any language (English, Amharic, Afaan Oromoo, Tigrinya, etc.) via the Gemini API.

## Why a backend?

The original single-file version called the Gemini API directly from the browser, which means
the API key would be visible to anyone who viewed the page source. This version adds a small
Express backend that holds the key server-side — the browser only ever talks to our own server.

## Project structure

```
skillbridge-ai/
├── server.js          # Express backend — proxies requests to Gemini, keeps the API key secret
├── package.json
├── .env.example       # Template for your API key (copy to .env)
├── .gitignore         # Makes sure .env and node_modules are never committed
└── public/
    └── index.html     # Frontend (chat UI) — talks to /api/generate, never to Gemini directly
```

## Setup & run locally

1. Install dependencies:
   ```bash
   npm install
   ```
2. Get a free Gemini API key from https://aistudio.google.com/app/apikey
3. Create your `.env` file:
   ```bash
   cp .env.example .env
   ```
   Then open `.env` and paste your key:
   ```
   GEMINI_API_KEY=your_real_key_here
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open http://localhost:3000 in your browser.

## Uploading to GitHub

```bash
git init
git add .
git commit -m "Initial commit: SkillBridge AI"
git branch -M main
git remote add origin https://github.com/<your-username>/<your-repo-name>.git
git push -u origin main
```

`.env` is already listed in `.gitignore`, so your real API key will **never** be pushed to GitHub.
Only `.env.example` (with a placeholder) gets committed.

## Deploying (optional)

If you want a live link for your hackathon submission, you can deploy for free on:
- **Render** (render.com) — set `GEMINI_API_KEY` in the dashboard's Environment tab.
- **Railway** (railway.app) — same idea, add the env var in project settings.
- **Vercel** — works with a small adaptation (serverless function instead of Express server) if you prefer.

Never put the real key in any file you commit — always set it as an environment variable
in the hosting platform's dashboard.

## Hackathon submission checklist

- [ ] Project Description (200–500 words)
- [ ] GitHub repository link (this repo)
- [ ] Team members list
- [ ] AI Tools Disclosure (Gemini API for coaching responses, mention any coding assistant used)
- [ ] Post-event feedback survey
