// src/services/gemini.js — updated system prompt with all new fields

import { GoogleGenerativeAI } from '@google/generative-ai';

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) console.error('[Baclone] VITE_GEMINI_API_KEY is not set in .env');

const genAI = new GoogleGenerativeAI(API_KEY);

// ─── System Prompt ─────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are Baclone, an expert software architect. Analyze the app demo video carefully and return ONLY a valid JSON object. No markdown, no code fences, no extra text outside the JSON.

Return this exact JSON structure:
{
  "appName": "detected app name",
  "summary": "2 sentence overview",
  "screenTimeline": [
    { "timestamp": "00:03", "screen": "Screen Name", "description": "brief what user sees" }
  ],
  "modules": [
    { "name": "Auth Module", "icon": "🔐", "description": "one sentence" }
  ],
  "confidenceScores": {
    "Feature Name": 95
  },
  "risks": [
    { "severity": "High", "issue": "short title", "detail": "explanation" }
  ],
  "backendFeatures": [
    { "id": "feat-01", "name": "feature", "description": "backend requirement", "priority": "Critical", "tags": ["Tag"] }
  ],
  "entities": [
    { "name": "Entity", "fields": ["id","field1","createdAt"], "color": "primary" }
  ],
  "endpoints": [
    { "method": "GET", "path": "/api/resource", "description": "brief" }
  ],
  "umlDescription": {
    "classDiagram": "classDiagram\\n  User --> Order : places",
    "sequenceDiagram": "sequenceDiagram\\n  Client->>API: request\\n  API-->>Client: response"
  },
  "cliPrompt": "Build a complete backend...\\n\\nStack: ...\\n\\nModules:\\n1. ...\\n\\nDatabase: ...\\nGenerate all files."
}

Rules:
- screenTimeline: detect each distinct screen with approximate timestamp (MM:SS format), list ALL visible screens
- modules: list each major backend module detected (Auth, Product, Order, etc.) with fitting emoji icon
- confidenceScores: rate each detected feature 0-100 based on how clearly it appears in the video
- risks: identify missing/unclear features that could cause backend problems (2-5 risks)
- backendFeatures: 5-10 items, priority must be one of Critical/High/Medium/Low
- entities: 5-12 database models with realistic fields
- endpoints: 12-25 REST endpoints
- umlDescription: valid Mermaid syntax, use \\n for newlines inside the JSON string
- cliPrompt: 150-250 words, include stack, modules list, database requirements, output format request
- entity colors cycle: primary, violet, cyan, green
- ALL strings properly escaped, NO raw newlines in JSON strings`;

// ─── JSON repair for partial truncation ───────────────────────────────────
function repairJSON(text) {
  let s = text.trim();
  s = s.replace(/^```(?:json)?\n?/, '').replace(/\n?```$/, '').trim();

  try { return JSON.parse(s); } catch { void 0; }

  // Fix truncated string: count structural characters
  let braces = 0, brackets = 0, inString = false, escape = false;
  for (let i = 0; i < s.length; i++) {
    const c = s[i];
    if (escape) { escape = false; continue; }
    if (c === '\\') { escape = true; continue; }
    if (c === '"') { inString = !inString; continue; }
    if (inString) continue;
    if (c === '{') braces++;
    if (c === '}') braces--;
    if (c === '[') brackets++;
    if (c === ']') brackets--;
  }

  if (inString) s += '"';
  while (brackets > 0) { s += ']'; brackets--; }
  while (braces > 0) { s += '}'; braces--; }

  try { return JSON.parse(s); } catch { void 0; }
  throw new Error('Could not parse Gemini response. Try a shorter video or add a focus prompt to narrow the analysis.');
}

// ─── Parse & normalize ─────────────────────────────────────────────────────
function parseGeminiResponse(text) {
  console.log('[Baclone] Response length:', text.length, 'chars');
  const parsed = repairJSON(text);

  const palette = ['primary', 'violet', 'cyan', 'green'];

  // Normalize & provide fallbacks for all fields
  parsed.appName     = parsed.appName     || 'Analyzed Application';
  parsed.summary     = parsed.summary     || 'Backend architecture extracted from video analysis.';
  parsed.screenTimeline   = parsed.screenTimeline   || [];
  parsed.modules          = parsed.modules          || [];
  parsed.confidenceScores = parsed.confidenceScores || {};
  parsed.risks            = parsed.risks            || [];
  parsed.backendFeatures  = (parsed.backendFeatures || []).map((f, i) => ({
    ...f, id: f.id || `feat-${String(i+1).padStart(2,'0')}`, tags: f.tags || [],
  }));
  parsed.entities  = (parsed.entities  || []).map((e, i) => ({
    ...e, color: e.color || palette[i % palette.length], fields: e.fields || [],
  }));
  parsed.endpoints = parsed.endpoints || [];
  parsed.umlDescription = parsed.umlDescription || {
    classDiagram: 'classDiagram\n  User --> Resource : accesses',
    sequenceDiagram: 'sequenceDiagram\n  Client->>API: request\n  API-->>Client: response',
  };
  parsed.cliPrompt = parsed.cliPrompt || 'Generate a complete backend for this application.';

  return parsed;
}

// ─── File Upload ───────────────────────────────────────────────────────────
async function uploadVideoToFilesAPI(videoFile, onProgress) {
  const uploadUrl = `https://generativelanguage.googleapis.com/upload/v1beta/files?key=${API_KEY}`;

  const initRes = await fetch(uploadUrl, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Protocol': 'resumable',
      'X-Goog-Upload-Command': 'start',
      'X-Goog-Upload-Header-Content-Length': videoFile.size,
      'X-Goog-Upload-Header-Content-Type': videoFile.type,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ file: { display_name: videoFile.name } }),
  });

  if (!initRes.ok) throw new Error(`Upload init failed: ${await initRes.text()}`);

  const resumableUri = initRes.headers.get('X-Goog-Upload-URL');
  if (!resumableUri) throw new Error('No resumable upload URL returned');

  onProgress?.(5);

  const uploadRes = await fetch(resumableUri, {
    method: 'POST',
    headers: {
      'X-Goog-Upload-Command': 'upload, finalize',
      'X-Goog-Upload-Offset': '0',
      'Content-Type': videoFile.type,
      'Content-Length': videoFile.size,
    },
    body: videoFile,
  });

  if (!uploadRes.ok) throw new Error(`Upload failed: ${await uploadRes.text()}`);

  const data = await uploadRes.json();
  const fileUri  = data?.file?.uri;
  const fileName = data?.file?.name;
  if (!fileUri) throw new Error('No file URI from Files API');

  onProgress?.(20);
  return { fileUri, fileName, mimeType: videoFile.type };
}

// ─── Poll for ACTIVE ──────────────────────────────────────────────────────
async function waitForFileActive(fileName, onProgress) {
  const url = `https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`;
  for (let i = 0; i < 90; i++) {
    const data = await (await fetch(url)).json();
    if (data?.state === 'ACTIVE') { onProgress?.(35); return; }
    if (data?.state === 'FAILED') throw new Error('Video processing failed on Gemini servers');
    onProgress?.(20 + i * 0.15);
    await new Promise(r => setTimeout(r, 2000));
  }
  throw new Error('Timed out waiting for video to become active');
}

// ─── Cleanup ──────────────────────────────────────────────────────────────
async function deleteFile(fileName) {
  try {
    await fetch(`https://generativelanguage.googleapis.com/v1beta/${fileName}?key=${API_KEY}`, { method: 'DELETE' });
  } catch { /* non-critical */ }
}

// ─── Model fallback chain (try in order on 503/429) ─────────────────────────
const MODEL_CHAIN = [
  'gemini-3.5-flash',
  'gemini-2.5-flash',
  'gemini-2.0-flash',
  'gemini-2.0-flash-001',
  'gemini-2.0-flash-lite',
  'gemini-flash-latest',
];

async function generateWithRetry(parts, fullPrompt, onProgress) {
  const RETRY_DELAYS = [5000, 10000, 15000];

  for (const modelName of MODEL_CHAIN) {
    console.info(`[Baclone] Trying model: ${modelName}`);
    const model = genAI.getGenerativeModel({
      model: modelName,
      generationConfig: {
        temperature: 0.15,
        topP: 0.85,
        maxOutputTokens: 65536,
        responseMimeType: 'application/json',
      },
    });

    for (let attempt = 0; attempt < 3; attempt++) {
      try {
        const result = await model.generateContent([
          ...parts,
          { text: fullPrompt },
        ]);
        console.info(`[Baclone] Success with ${modelName} on attempt ${attempt + 1}`);
        return result;
      } catch (err) {
        const msg = err?.message || '';
        const is503 = msg.includes('503') || msg.includes('high demand') || msg.includes('overloaded');
        const is429 = msg.includes('429') || msg.includes('quota') || msg.includes('rate');
        const isUnsupported = msg.includes('404') || msg.includes('not found') || msg.includes('400') || msg.includes('supported');

        if (isUnsupported) {
          console.warn(`[Baclone] ${modelName} is unsupported or not found, trying next model…`);
          break; // Try next model in chain
        }

        if ((is503 || is429) && attempt < 2) {
          const delay = RETRY_DELAYS[attempt];
          console.warn(`[Baclone] ${modelName} attempt ${attempt + 1} failed (${is503 ? '503' : '429'}), retrying in ${delay / 1000}s…`);
          onProgress?.(45 + attempt * 5);
          await new Promise(r => setTimeout(r, delay));
          continue;
        }
        // Not retryable or exhausted retries for this model
        if (is503 || is429) {
          console.warn(`[Baclone] ${modelName} exhausted, trying next model…`);
          break; // Try next model in chain
        }
        throw err; // Other error — propagate immediately
      }
    }
  }

  throw new Error('All Gemini models are currently unavailable (503). Please try again in a few minutes.');
}

// ─── Main ─────────────────────────────────────────────────────────────────
export async function analyzeVideoWithGemini(videoFile, textPrompt = '', onProgress) {
  onProgress?.(2);
  const { fileUri, fileName, mimeType } = await uploadVideoToFilesAPI(videoFile, onProgress);
  await waitForFileActive(fileName, onProgress);

  const userSection = textPrompt?.trim() ? `\n\nAdditional focus: "${textPrompt}"\n` : '';
  const fullPrompt  = SYSTEM_PROMPT + userSection + '\n\nAnalyze the video and return the JSON:';

  onProgress?.(40);

  const result = await generateWithRetry(
    [{ fileData: { mimeType, fileUri } }],
    fullPrompt,
    onProgress,
  );

  onProgress?.(85);

  const parsed = parseGeminiResponse(result.response.text());

  onProgress?.(95);
  deleteFile(fileName);
  onProgress?.(100);

  return { ...parsed, _mock: false };
}
