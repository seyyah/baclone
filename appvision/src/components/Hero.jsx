// src/components/Hero.jsx
import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { Sparkles, Zap, Brain } from 'lucide-react';

const HEADLINE = ['Upload.', 'Understand.', 'Build.'];
const HEADLINE_COLORS = [
  'linear-gradient(135deg, #e2e8f0 0%, #94a3b8 100%)',
  'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
  'linear-gradient(135deg, #06b6d4 0%, #6366f1 100%)',
];

export default function Hero() {
  const badgeRef = useRef(null);
  const wordsRef = useRef([]);
  const subtitleRef = useRef(null);
  const statsRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });

    tl.fromTo(badgeRef.current,
      { opacity: 0, y: -20 },
      { opacity: 1, y: 0, duration: 0.6 }
    );
    tl.fromTo(wordsRef.current,
      { opacity: 0, y: 50 },
      { opacity: 1, y: 0, duration: 0.7, stagger: 0.12 },
      '-=0.2'
    );
    tl.fromTo(subtitleRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6 },
      '-=0.3'
    );
    tl.fromTo(statsRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.5 },
      '-=0.2'
    );
    tl.fromTo(scrollRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      '-=0.1'
    );

    // Subtle pulsing glow on headline words (after initial animation)
    setTimeout(() => {
      gsap.to(wordsRef.current, {
        filter: 'brightness(1.2)',
        duration: 2,
        repeat: -1,
        yoyo: true,
        ease: 'sine.inOut',
        stagger: { each: 0.4, repeat: -1 },
      });
    }, 1500);
  }, []);

  return (
    <section style={{
      position: 'relative', display: 'flex', flexDirection: 'column',
      alignItems: 'center', textAlign: 'center',
      paddingTop: 120, paddingBottom: 60, paddingLeft: 16, paddingRight: 16,
      zIndex: 10,
    }}>
      {/* Badge */}
      <div ref={badgeRef} style={{ opacity: 0, marginBottom: 24 }}>
        <span style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          padding: '6px 16px', borderRadius: 99,
          background: 'rgba(99,102,241,0.1)', border: '1px solid rgba(99,102,241,0.3)',
          color: '#a5b4fc', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase',
        }}>
          <Sparkles size={11} />
          AI-Powered Backend Intelligence
          <Sparkles size={11} />
        </span>
      </div>

      {/* Main headline */}
      <h1 style={{
        fontSize: 'clamp(52px, 9vw, 100px)',
        fontWeight: 900, lineHeight: 1, letterSpacing: '-0.02em',
        marginBottom: 28, display: 'flex', flexWrap: 'wrap',
        justifyContent: 'center', gap: '0 16px',
      }}>
        {HEADLINE.map((word, i) => (
          <span
            key={word}
            ref={(el) => (wordsRef.current[i] = el)}
            style={{
              display: 'inline-block', opacity: 0,
              background: HEADLINE_COLORS[i],
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}
          >
            {word}
          </span>
        ))}
      </h1>

      {/* Subtitle */}
      <p ref={subtitleRef} style={{
        maxWidth: 580, fontSize: 'clamp(15px,2vw,19px)',
        lineHeight: 1.7, marginBottom: 40, opacity: 0, color: '#94a3b8',
      }}>
        Drop any app demo video and{' '}
        <span style={{ color: '#a5b4fc' }}>Baclone</span> will reverse-engineer
        its backend architecture — generating{' '}
        <span style={{ color: '#67e8f9' }}>API endpoints</span>,{' '}
        <span style={{ color: '#c4b5fd' }}>UML diagrams</span>, and a
        ready-to-run <span style={{ color: '#6ee7b7' }}>CLI generation prompt</span>.
      </p>

      {/* Stats */}
      <div ref={statsRef} style={{
        display: 'flex', alignItems: 'center', gap: 40, opacity: 0,
      }}>
        {[
          { icon: Brain, label: 'AI-Analyzed', value: '500+', color: '#a5b4fc' },
          { icon: Zap, label: 'Avg. Analysis Time', value: '< 30s', color: '#67e8f9' },
          { icon: Sparkles, label: 'Endpoints Generated', value: '10k+', color: '#c4b5fd' },
        ].map(({ icon: Icon, label, value, color }) => (
          <div key={label} style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6, marginBottom: 4 }}>
              <Icon size={14} color={color} />
              <span style={{ fontSize: 22, fontWeight: 800, color }}>{value}</span>
            </div>
            <span style={{ fontSize: 11, color: '#475569' }}>{label}</span>
          </div>
        ))}
      </div>

      {/* Scroll indicator */}
      <div ref={scrollRef} style={{ marginTop: 60, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8, opacity: 0 }}>
        <span style={{ fontSize: 10, letterSpacing: '0.2em', textTransform: 'uppercase', color: '#334155' }}>Scroll to begin</span>
        <div style={{
          width: 1, height: 40,
          background: 'linear-gradient(to bottom, rgba(99,102,241,0.5), transparent)',
        }} />
      </div>
    </section>
  );
}
