// src/services/api.js
// Unified API service — routes to real Gemini or mock based on env

import { analyzeVideoWithGemini } from './gemini.js';
import { mockAnalysisResult } from '../data/mockAnalysis.js';

const USE_MOCK = !import.meta.env.VITE_GEMINI_API_KEY;

if (USE_MOCK) {
  console.warn('[Baclone] No API key found — running in mock mode');
} else {
  console.info('[Baclone] Gemini API key detected — using real analysis');
}

/**
 * Analyzes a video file.
 * Real mode: uploads to Gemini Files API → generateContent → structured JSON
 * Mock mode: returns mockAnalysis after simulated delay
 *
 * @param {File}     videoFile  - App demo video
 * @param {string}   textPrompt - Optional user instructions
 * @param {Function} onProgress - Callback (0-100)
 */
export async function analyzeVideo(videoFile, textPrompt = '', onProgress) {
  if (USE_MOCK) {
    return _mockAnalyze(onProgress);
  }

  try {
    return await analyzeVideoWithGemini(videoFile, textPrompt, onProgress);
  } catch (err) {
    console.error('[Baclone] Gemini API error:', err);
    throw err;
  }
}

// ─── Mock fallback ────────────────────────────────────────────────────────────
function _mockAnalyze(onProgress) {
  return new Promise((resolve) => {
    let progress = 0;
    const interval = setInterval(() => {
      progress += Math.random() * 7 + 3;
      if (progress >= 100) {
        progress = 100;
        clearInterval(interval);
        resolve({ ...mockAnalysisResult, _mock: true });
      }
      onProgress?.(Math.min(progress, 100));
    }, 300);
  });
}
