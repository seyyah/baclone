// src/components/VideoUploader.jsx
import { useRef, useState, useCallback } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import { UploadCloud, X, Play, FileVideo } from 'lucide-react';

export default function VideoUploader({ onVideoSelect, videoFile }) {
  const dropRef = useRef(null);
  const inputRef = useRef(null);
  const [dragging, setDragging] = useState(false);
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleFile = useCallback((file) => {
    if (!file || !file.type.startsWith('video/')) return;
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    onVideoSelect(file);
    gsap.fromTo(dropRef.current, { scale: 0.97 }, { scale: 1, duration: 0.4, ease: 'back.out(1.5)' });
  }, [onVideoSelect]);

  const handleDrop = (e) => {
    e.preventDefault();
    setDragging(false);
    handleFile(e.dataTransfer.files[0]);
  };

  const setGlow = (on) => {
    gsap.to(dropRef.current, {
      boxShadow: on
        ? '0 0 0 1px rgba(99,102,241,0.7), 0 0 40px rgba(99,102,241,0.25)'
        : '0 0 0 1px rgba(99,102,241,0.15)',
      duration: 0.3,
    });
  };

  const clearVideo = (e) => {
    e.stopPropagation();
    setPreviewUrl(null);
    onVideoSelect(null);
    if (inputRef.current) inputRef.current.value = '';
  };

  const fmt = (bytes) =>
    bytes < 1024 * 1024 ? `${(bytes / 1024).toFixed(1)} KB` : `${(bytes / (1024 * 1024)).toFixed(1)} MB`;

  return (
    <div style={{ width: '100%' }}>
      <div
        ref={dropRef}
        onClick={() => !videoFile && inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={(e) => { e.preventDefault(); if (!dragging) { setDragging(true); setGlow(true); } }}
        onDragLeave={() => { setDragging(false); setGlow(false); }}
        onMouseEnter={() => { if (!videoFile) setGlow(true); }}
        onMouseLeave={() => { if (!videoFile) setGlow(false); }}
        style={{
          width: '100%', borderRadius: 16, overflow: 'hidden',
          border: '1px solid rgba(99,102,241,0.15)',
          background: 'rgba(10,10,18,0.85)',
          cursor: videoFile ? 'default' : 'pointer',
          minHeight: videoFile ? 'auto' : 220,
          boxSizing: 'border-box',
          boxShadow: '0 0 0 1px rgba(99,102,241,0.15)',
          transition: 'min-height 0.3s',
        }}
      >
        <input ref={inputRef} type="file" accept="video/*" style={{ display: 'none' }}
          onChange={(e) => handleFile(e.target.files[0])} />

        <AnimatePresence mode="wait">
          {!videoFile ? (
            <motion.div key="drop"
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0, scale: 0.95 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '60px 32px' }}>
              {/* Icon */}
              <div style={{ position: 'relative', marginBottom: 20 }}>
                <div style={{
                  width: 72, height: 72, borderRadius: 18,
                  background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.25)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <UploadCloud size={30} color="#6366f1" />
                </div>
                <div style={{
                  position: 'absolute', inset: -8, borderRadius: 26,
                  border: '1px solid rgba(99,102,241,0.1)', pointerEvents: 'none',
                }} />
              </div>

              <h3 style={{ fontSize: 17, fontWeight: 700, color: '#e2e8f0', margin: '0 0 8px' }}>
                {dragging ? 'Drop it here!' : 'Drop your app video'}
              </h3>
              <p style={{ fontSize: 13, color: '#64748b', margin: '0 0 20px', textAlign: 'center' }}>
                Supports MP4, MOV, WebM, AVI — up to 500 MB
              </p>

              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
                <div style={{ height: 1, width: 60, background: 'rgba(99,102,241,0.2)' }} />
                <span style={{ fontSize: 12, color: '#475569' }}>or</span>
                <div style={{ height: 1, width: 60, background: 'rgba(99,102,241,0.2)' }} />
              </div>

              <button
                onClick={(e) => { e.stopPropagation(); inputRef.current?.click(); }}
                style={{
                  padding: '8px 20px', borderRadius: 10, fontSize: 13, fontWeight: 600,
                  background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.3)',
                  color: '#a5b4fc', cursor: 'pointer', fontFamily: 'Inter, sans-serif',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'rgba(99,102,241,0.2)'}
                onMouseLeave={e => e.currentTarget.style.background = 'rgba(99,102,241,0.12)'}
              >
                Browse files
              </button>
            </motion.div>
          ) : (
            <motion.div key="preview"
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
              style={{ padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16 }}>
                {/* Thumbnail */}
                <div style={{
                  position: 'relative', borderRadius: 12, overflow: 'hidden',
                  flexShrink: 0, width: 150, height: 90, background: '#000',
                }}>
                  <video src={previewUrl} style={{ width: '100%', height: '100%', objectFit: 'cover' }} muted />
                  <div style={{
                    position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    background: 'rgba(0,0,0,0.4)',
                  }}>
                    <div style={{
                      width: 36, height: 36, borderRadius: '50%',
                      background: 'rgba(99,102,241,0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                    }}>
                      <Play size={13} fill="white" color="white" />
                    </div>
                  </div>
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 8 }}>
                    <FileVideo size={13} color="#6366f1" />
                    <span style={{
                      fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase',
                      padding: '2px 8px', borderRadius: 20,
                      background: 'rgba(99,102,241,0.1)', color: '#a5b4fc', border: '1px solid rgba(99,102,241,0.25)',
                      fontFamily: 'JetBrains Mono, monospace',
                    }}>Video Loaded</span>
                  </div>
                  <p style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', margin: '0 0 4px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {videoFile.name}
                  </p>
                  <p style={{ fontSize: 12, color: '#64748b', margin: '0 0 12px' }}>
                    {fmt(videoFile.size)} · {videoFile.type}
                  </p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#34d399', animation: 'pulse 2s ease-in-out infinite' }} />
                    <span style={{ fontSize: 12, color: '#34d399' }}>Ready for analysis</span>
                  </div>
                </div>

                {/* Remove */}
                <button onClick={clearVideo} style={{
                  flexShrink: 0, width: 32, height: 32, borderRadius: 8,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  color: '#f87171', cursor: 'pointer', transition: 'all 0.2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
                  onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.08)'}>
                  <X size={13} />
                </button>
              </div>

              <button onClick={() => inputRef.current?.click()}
                style={{ marginTop: 12, fontSize: 12, color: '#64748b', background: 'none', border: 'none', cursor: 'pointer', transition: 'color 0.2s' }}
                onMouseEnter={e => e.currentTarget.style.color = '#a5b4fc'}
                onMouseLeave={e => e.currentTarget.style.color = '#64748b'}>
                Change video →
              </button>
              <style>{`@keyframes pulse { 0%,100%{opacity:0.5} 50%{opacity:1} }`}</style>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
