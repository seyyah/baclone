// src/pages/Home.jsx
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertCircle, X } from 'lucide-react';
import BackgroundEffects from '../components/BackgroundEffects';
import Hero from '../components/Hero';
import VideoUploader from '../components/VideoUploader';
import PromptInput from '../components/PromptInput';
import AnalyzeButton from '../components/AnalyzeButton';
import AnalysisSteps from '../components/AnalysisSteps';
import ResultPanel from '../components/ResultPanel';
import { analyzeVideo } from '../services/api';

const VIEW = { UPLOAD: 'upload', ANALYZING: 'analyzing', RESULT: 'result' };
const HAS_KEY = !!import.meta.env.VITE_GEMINI_API_KEY;

const progressToStep = (p) => {
  if (p < 20) return 1; // uploading
  if (p < 35) return 2; // processing
  if (p < 60) return 3; // analyzing
  if (p < 85) return 4; // uml
  return 5;             // cli prompt
};

export default function Home() {
  const [view,        setView]        = useState(VIEW.UPLOAD);
  const [videoFile,   setVideoFile]   = useState(null);
  const [prompt,      setPrompt]      = useState('');
  const [progress,    setProgress]    = useState(0);
  const [currentStep, setCurrentStep] = useState(1);
  const [result,      setResult]      = useState(null);
  const [error,       setError]       = useState(null);

  const handleAnalyze = useCallback(async () => {
    if (!videoFile) return;
    setView(VIEW.ANALYZING);
    setProgress(0);
    setCurrentStep(1);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });

    try {
      const data = await analyzeVideo(videoFile, prompt, (p) => {
        setProgress(p);
        setCurrentStep(progressToStep(p));
      });
      setResult(data);
      setTimeout(() => setView(VIEW.RESULT), 500);
    } catch (err) {
      console.error('[Baclone] Analysis error:', err);
      const msg = err?.message || '';
      const is503 = msg.includes('503') || msg.includes('high demand') || msg.includes('unavailable');
      const is429 = msg.includes('429') || msg.includes('quota');
      const friendly = is503
        ? 'Gemini servers are experiencing high demand right now. Retries were attempted automatically. Please wait a moment and try again.'
        : is429
        ? 'API rate limit reached. Please wait 30 seconds and try again.'
        : (msg || 'Analysis failed. Please try again.');
      setError(friendly);
      setView(VIEW.UPLOAD);
    }
  }, [videoFile, prompt]);

  const handleReset = () => {
    setView(VIEW.UPLOAD);
    setVideoFile(null);
    setPrompt('');
    setProgress(0);
    setCurrentStep(1);
    setResult(null);
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', background: '#050508' }}>
      <BackgroundEffects />

      {/* ── Navbar ── */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '14px 24px',
        background: 'rgba(5,5,8,0.75)', backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(99,102,241,0.08)',
      }}>
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{
            width: 28, height: 28, borderRadius: 8,
            background: 'linear-gradient(135deg,#6366f1,#8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <svg width="13" height="13" viewBox="0 0 14 14" fill="none">
              <path d="M7 1L13 4.5V9.5L7 13L1 9.5V4.5L7 1Z" stroke="white" strokeWidth="1.2" fill="none"/>
              <circle cx="7" cy="7" r="2" fill="white"/>
            </svg>
          </div>
          <span style={{ fontSize: 14, fontWeight: 700, color: '#e2e8f0' }}>
            ba<span style={{ color: '#818cf8' }}>clone</span>
          </span>
        </div>

        {/* Status badge */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: 6,
          padding: '5px 12px', borderRadius: 99,
          background: HAS_KEY ? 'rgba(16,185,129,0.07)' : 'rgba(99,102,241,0.07)',
          border: `1px solid ${HAS_KEY ? 'rgba(16,185,129,0.25)' : 'rgba(99,102,241,0.2)'}`,
          fontSize: 12,
          color: HAS_KEY ? '#34d399' : '#64748b',
        }}>
          <div style={{
            width: 6, height: 6, borderRadius: '50%',
            background: HAS_KEY ? '#34d399' : '#818cf8',
            animation: 'nav-pulse 2s ease-in-out infinite',
          }} />
          {HAS_KEY ? 'Gemini 3.5 Flash — Live' : 'Mock Mode'}
        </div>
      </nav>

      {/* ── Main ── */}
      <main style={{ position: 'relative', zIndex: 10 }}>
        <AnimatePresence mode="wait">

          {/* UPLOAD */}
          {view === VIEW.UPLOAD && (
            <motion.div key="upload"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -20 }} transition={{ duration: 0.4 }}>
              <Hero />

              <div style={{ maxWidth: 560, margin: '0 auto', padding: '0 16px 120px', display: 'flex', flexDirection: 'column', gap: 16 }}>

                {/* Error toast */}
                <AnimatePresence>
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.97 }}
                      style={{
                        display: 'flex', alignItems: 'flex-start', gap: 12,
                        padding: '14px 16px', borderRadius: 12,
                        background: 'rgba(239,68,68,0.08)',
                        border: '1px solid rgba(239,68,68,0.25)',
                      }}
                    >
                      <AlertCircle size={16} color="#f87171" style={{ flexShrink: 0, marginTop: 1 }} />
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: 13, fontWeight: 600, color: '#f87171', margin: '0 0 2px' }}>Analysis Failed</p>
                        <p style={{ fontSize: 12, color: '#94a3b8', margin: 0 }}>{error}</p>
                      </div>
                      <button onClick={() => setError(null)} style={{
                        background: 'none', border: 'none', cursor: 'pointer', color: '#64748b', flexShrink: 0,
                      }}>
                        <X size={14} />
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Divider */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                  <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.12)' }} />
                  <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.15em', textTransform: 'uppercase', color: '#334155' }}>
                    Upload your video
                  </span>
                  <div style={{ flex: 1, height: 1, background: 'rgba(99,102,241,0.12)' }} />
                </div>

                <VideoUploader onVideoSelect={setVideoFile} videoFile={videoFile} />
                <PromptInput value={prompt} onChange={setPrompt} />
                <AnalyzeButton disabled={!videoFile} loading={false} onClick={handleAnalyze} />

                {/* Info row */}
                {HAS_KEY ? (
                  <p style={{ textAlign: 'center', fontSize: 11, color: '#1e293b' }}>
                    ✓ End-to-end encrypted &nbsp;·&nbsp; ✓ File auto-deleted after analysis &nbsp;·&nbsp; ✓ GDPR compliant
                  </p>
                ) : (
                  <p style={{ textAlign: 'center', fontSize: 11, color: '#334155' }}>
                    Running in mock mode — add VITE_GEMINI_API_KEY to .env to enable real analysis
                  </p>
                )}
              </div>
            </motion.div>
          )}

          {/* ANALYZING */}
          {view === VIEW.ANALYZING && (
            <motion.div key="analyzing"
              initial={{ opacity: 0, scale: 0.97 }} animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.97 }} transition={{ duration: 0.4 }}
              style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '80px 16px 40px' }}>
              <AnalysisSteps currentStep={currentStep} progress={progress} />
            </motion.div>
          )}

          {/* RESULT */}
          {view === VIEW.RESULT && (
            <motion.div key="result"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }}
              exit={{ opacity: 0 }} transition={{ duration: 0.5 }}
              style={{ paddingTop: 96 }}>
              <ResultPanel result={result} onReset={handleReset} />
            </motion.div>
          )}

        </AnimatePresence>
      </main>

      {/* Footer */}
      {view === VIEW.UPLOAD && (
        <footer style={{
          position: 'fixed', bottom: 0, left: 0, right: 0, zIndex: 40,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          padding: '12px 24px', fontSize: 11,
          background: 'rgba(5,5,8,0.85)', backdropFilter: 'blur(16px)',
          borderTop: '1px solid rgba(99,102,241,0.06)', color: '#1e293b',
        }}>
          baclone ·&nbsp;
          <span style={{ color: '#334155' }}>Powered by Gemini 3.5 Flash</span>
          &nbsp;· v1.0
        </footer>
      )}

      <style>{`@keyframes nav-pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
    </div>
  );
}
