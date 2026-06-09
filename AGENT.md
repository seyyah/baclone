# 🤖 Coding Agent Onboarding Guide (AGENT.md)

Welcome, AI Coding Agent! This guide is designed to help you quickly understand the codebase, architectural choices, and rules of engagement for developing, debugging, or extending the **baclone** repository.

---

## 📌 Repository Core Architecture

This is a React 19 application built with Vite and Tailwind CSS v4.

### Key Entrypoints & Files

1. **`appvision/src/services/gemini.js`**
   - Implements the connection to the Google Gemini API.
   - Uses the **Resumable Upload Protocol (Files API)** via `uploadVideoToFilesAPI` to securely upload video files before generation.
   - Implements `waitForFileActive` to poll the status of uploaded video files.
   - Implements `generateWithRetry` which tries models in the `MODEL_CHAIN` sequentially if they return `503` (overloaded) or `429` (rate limit).
   
2. **`appvision/src/services/api.js`**
   - The unified API routing layer.
   - Detects whether `VITE_GEMINI_API_KEY` exists in the environment.
   - If key exists: Routes requests to the real Gemini API.
   - If key is missing: Fallback to `_mockAnalyze` with simulated progress bar intervals and returns static mock data from `src/data/mockAnalysis.js`.

3. **`appvision/src/pages/Home.jsx`**
   - Governs the main flow state of the application: `VIEW.UPLOAD` ➜ `VIEW.ANALYZING` ➜ `VIEW.RESULT`.
   - Manages error display and maps API progress percentages (0-100) to human-readable steps.

4. **`appvision/src/components/ResultPanel.jsx`**
   - Renders the tabs, badges, lists, code boxes, and markdown/JSON export options for the extracted architecture.

---

## ⚠️ Important Rules & Technical Specs for Agents

### 1. Active Gemini Model Chain
The stable production model is **`gemini-3.5-flash`**. Older models like `gemini-2.0-flash` are kept as secondary fallback options. The model chain configured in `gemini.js` is:
```javascript
const MODEL_CHAIN = [
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
];
```

### 2. Video Processing Timeouts
Do not reduce the loop iterations in `waitForFileActive`. High-resolution or long video files can take up to **2-3 minutes** to be fully transcoded on Gemini servers.
- Currently set to **90 iterations** at **2-second intervals** (maximum 3 minutes timeout).
- Progress bar increment in this step is scaled via `20 + i * 0.15` to ensure a smooth UI transition up to the 35% mark.

### 3. Tailwind CSS Version
This project uses **`tailwindcss` v4** via the `@tailwindcss/vite` plugin. Avoid writing legacy utility configurations or config files unless explicitly requested. Custom tokens and glassmorphism styling are defined directly inline or in `src/index.css`.

### 4. JSON Output Repair
Gemini's response must strictly match the JSON schema defined in `SYSTEM_PROMPT`.
- If the token limit is reached or the response is slightly truncated, the helper function `repairJSON` in `gemini.js` will attempt to automatically close unclosed brackets and braces to prevent JSON parsing crashes. Ensure any prompt modifications preserve this structural format.

---

## ⚙️ Environment Variables
Ensure the following variable is defined in `.env` (in the root AND/OR the `appvision` directory) to enable the real API:
```env
VITE_GEMINI_API_KEY=AIzaSy...
```

## 🛠️ Developer Commands
- Run Dev Server: `npm run dev` (inside `appvision/`)
- Build Application: `npm run build`
- Lint: `npm run lint`
