// src/components/AnalysisSteps.jsx — updated labels for real API flow
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { motion } from 'framer-motion';
import { UploadCloud, Clock, Brain, GitBranch, Terminal, CheckCircle2, Circle } from 'lucide-react';

const STEPS = [
  { id: 1, icon: UploadCloud,  label: 'Uploading video to Gemini',    sublabel: 'Securely transferring your video via Files API…',       color: '#6366f1' },
  { id: 2, icon: Clock,        label: 'Processing video frames',        sublabel: 'Gemini is extracting frames and UI states…',             color: '#8b5cf6' },
  { id: 3, icon: Brain,        label: 'Analyzing application behavior', sublabel: 'Identifying features, flows, and data models…',          color: '#06b6d4' },
  { id: 4, icon: GitBranch,    label: 'Generating UML & architecture',  sublabel: 'Building class diagrams and sequence flows…',            color: '#a78bfa' },
  { id: 5, icon: Terminal,     label: 'Compiling CLI generation prompt', sublabel: 'Crafting production-ready backend generation prompt…',  color: '#34d399' },
];

export default function AnalysisSteps({ currentStep, progress }) {
  const progressBarRef = useRef(null);
  const containerRef   = useRef(null);

  useEffect(() => {
    if (containerRef.current) {
      gsap.fromTo(containerRef.current,
        { opacity: 0, y: 30, scale: 0.97 },
        { opacity: 1, y: 0, scale: 1, duration: 0.5, ease: 'power3.out' }
      );
    }
  }, []);

  useEffect(() => {
    if (progressBarRef.current) {
      gsap.to(progressBarRef.current, { width: `${progress}%`, duration: 0.6, ease: 'power2.out' });
    }
  }, [progress]);

  return (
    <div ref={containerRef} style={{ width: '100%', maxWidth: 520, margin: '0 auto', opacity: 0 }}>

      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 36 }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 99, marginBottom: 16,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
        }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#818cf8', animation: 'pulse-dot 2s ease-in-out infinite' }} />
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase', color: '#a5b4fc' }}>
            Gemini Analysis In Progress
          </span>
        </div>
        <h2 style={{ fontSize: 26, fontWeight: 900, color: '#e2e8f0', margin: '0 0 8px' }}>
          Reverse-engineering backend…
        </h2>
        <p style={{ fontSize: 13, color: '#64748b', margin: 0 }}>
          Gemini 3.5 Flash is analyzing your application video
        </p>
      </div>

      {/* Progress bar */}
      <div style={{
        position: 'relative', width: '100%', height: 4, borderRadius: 99, marginBottom: 32,
        background: 'rgba(99,102,241,0.1)', overflow: 'hidden',
      }}>
        <div ref={progressBarRef} style={{
          position: 'absolute', left: 0, top: 0, height: '100%', width: '0%', borderRadius: 99,
          background: 'linear-gradient(90deg, #6366f1, #8b5cf6, #06b6d4)',
          boxShadow: '0 0 12px rgba(99,102,241,0.7)',
        }} />
      </div>

      {/* Steps */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {STEPS.map((step, i) => {
          const isDone   = currentStep > step.id;
          const isActive = currentStep === step.id;
          const Icon     = step.icon;

          return (
            <motion.div key={step.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              style={{
                display: 'flex', alignItems: 'center', gap: 16,
                padding: '14px 18px', borderRadius: 14,
                background: isActive ? `${step.color}0A` : 'rgba(10,10,18,0.5)',
                border: `1px solid ${isDone ? 'rgba(52,211,153,0.2)' : isActive ? `${step.color}35` : 'rgba(99,102,241,0.08)'}`,
                boxShadow: isActive ? `0 0 24px ${step.color}1A` : 'none',
                transition: 'all 0.5s ease',
              }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 12, flexShrink: 0,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                background: isDone ? 'rgba(52,211,153,0.1)' : isActive ? `${step.color}18` : 'rgba(99,102,241,0.05)',
                border: `1px solid ${isDone ? 'rgba(52,211,153,0.3)' : isActive ? `${step.color}40` : 'rgba(99,102,241,0.1)'}`,
              }}>
                {isDone
                  ? <CheckCircle2 size={18} color="#34d399" />
                  : <Icon size={18} color={isActive ? step.color : '#334155'} />
                }
              </div>

              <div style={{ flex: 1 }}>
                <p style={{ fontSize: 13, fontWeight: 600, color: isDone ? '#34d399' : isActive ? '#e2e8f0' : '#334155', margin: 0 }}>
                  {step.label}
                </p>
                {isActive && (
                  <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    style={{ fontSize: 11, color: '#64748b', margin: '3px 0 0' }}>
                    {step.sublabel}
                  </motion.p>
                )}
              </div>

              <div style={{ flexShrink: 0 }}>
                {isDone
                  ? <span style={{ fontSize: 11, fontFamily: 'JetBrains Mono, monospace', color: '#34d399' }}>done</span>
                  : isActive
                  ? <div style={{ display: 'flex', gap: 4 }}>
                      {[0,1,2].map(j => (
                        <div key={j} style={{
                          width: 5, height: 5, borderRadius: '50%', background: step.color,
                          animation: `dot-bounce 1s ease-in-out ${j * 0.2}s infinite`,
                        }} />
                      ))}
                    </div>
                  : <Circle size={13} color="#1e1e30" />
                }
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Percentage */}
      <div style={{ textAlign: 'center', marginTop: 28 }}>
        <span style={{
          fontSize: 52, fontWeight: 900, fontFamily: 'JetBrains Mono, monospace',
          background: 'linear-gradient(135deg, #6366f1, #06b6d4)',
          WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
        }}>
          {Math.round(progress)}%
        </span>
        <p style={{ fontSize: 11, color: '#334155', margin: '4px 0 0' }}>analysis complete</p>
      </div>

      <style>{`
        @keyframes pulse-dot  { 0%,100%{opacity:0.4} 50%{opacity:1} }
        @keyframes dot-bounce { 0%,100%{transform:scale(0.6);opacity:0.4} 50%{transform:scale(1);opacity:1} }
      `}</style>
    </div>
  );
}
