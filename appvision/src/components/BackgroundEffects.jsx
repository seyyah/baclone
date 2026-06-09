// src/components/BackgroundEffects.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';

export default function BackgroundEffects() {
  const orb1Ref = useRef(null);
  const orb2Ref = useRef(null);
  const orb3Ref = useRef(null);

  useEffect(() => {
    gsap.to(orb1Ref.current, {
      x: 60, y: -40, duration: 8, repeat: -1, yoyo: true, ease: 'sine.inOut',
    });
    gsap.to(orb2Ref.current, {
      x: -50, y: 60, duration: 10, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 2,
    });
    gsap.to(orb3Ref.current, {
      x: 40, y: 50, duration: 12, repeat: -1, yoyo: true, ease: 'sine.inOut', delay: 4,
    });
  }, []);

  return (
    <div style={{ position: 'fixed', inset: 0, overflow: 'hidden', pointerEvents: 'none', zIndex: 0 }}>
      {/* Grid */}
      <div style={{
        position: 'absolute', inset: 0,
        backgroundImage: 'linear-gradient(rgba(99,102,241,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(99,102,241,0.05) 1px, transparent 1px)',
        backgroundSize: '50px 50px',
      }} />

      {/* Scan lines */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(0,0,0,0.03) 2px, rgba(0,0,0,0.03) 4px)',
        opacity: 0.4,
      }} />

      {/* Orb 1 — top left indigo */}
      <div ref={orb1Ref} style={{
        position: 'absolute', borderRadius: '50%', filter: 'blur(90px)',
        width: 700, height: 700, top: -250, left: -150,
        background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
      }} />

      {/* Orb 2 — bottom right violet */}
      <div ref={orb2Ref} style={{
        position: 'absolute', borderRadius: '50%', filter: 'blur(80px)',
        width: 600, height: 600, bottom: '-10%', right: -150,
        background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
      }} />

      {/* Orb 3 — center cyan */}
      <div ref={orb3Ref} style={{
        position: 'absolute', borderRadius: '50%', filter: 'blur(100px)',
        width: 500, height: 500, top: '35%', left: '45%',
        background: 'radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)',
      }} />

      {/* Top vignette */}
      <div style={{ position: 'absolute', inset: '0 0 auto 0', height: 200,
        background: 'linear-gradient(to bottom, rgba(5,5,8,0.9) 0%, transparent 100%)' }} />

      {/* Bottom vignette */}
      <div style={{ position: 'absolute', inset: 'auto 0 0 0', height: 200,
        background: 'linear-gradient(to top, rgba(5,5,8,0.9) 0%, transparent 100%)' }} />
    </div>
  );
}
