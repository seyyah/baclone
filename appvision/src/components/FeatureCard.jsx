// src/components/FeatureCard.jsx
import { motion } from 'framer-motion';

const PRIORITY = {
  Critical: { color: '#f87171', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.22)',  dot: '#f87171', glow: 'rgba(239,68,68,0.15)' },
  High:     { color: '#fbbf24', bg: 'rgba(251,191,36,0.08)', border: 'rgba(251,191,36,0.22)', dot: '#fbbf24', glow: 'rgba(251,191,36,0.12)' },
  Medium:   { color: '#818cf8', bg: 'rgba(99,102,241,0.08)', border: 'rgba(99,102,241,0.22)', dot: '#818cf8', glow: 'rgba(99,102,241,0.12)' },
  Low:      { color: '#34d399', bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.2)',  dot: '#34d399', glow: 'rgba(16,185,129,0.1)'  },
};

// Tag color palette — cycles based on tag name hash
const TAG_PALETTE = [
  { bg: 'rgba(99,102,241,0.12)',  color: '#a5b4fc', border: 'rgba(99,102,241,0.28)' },
  { bg: 'rgba(6,182,212,0.10)',   color: '#67e8f9', border: 'rgba(6,182,212,0.28)'  },
  { bg: 'rgba(139,92,246,0.10)',  color: '#c4b5fd', border: 'rgba(139,92,246,0.28)' },
  { bg: 'rgba(16,185,129,0.10)',  color: '#6ee7b7', border: 'rgba(16,185,129,0.28)' },
  { bg: 'rgba(251,191,36,0.09)',  color: '#fde68a', border: 'rgba(251,191,36,0.25)' },
  { bg: 'rgba(239,68,68,0.09)',   color: '#fca5a5', border: 'rgba(239,68,68,0.22)'  },
  { bg: 'rgba(236,72,153,0.09)',  color: '#f9a8d4', border: 'rgba(236,72,153,0.22)' },
];

function tagStyle(tag) {
  let hash = 0;
  for (let i = 0; i < tag.length; i++) hash = (hash * 31 + tag.charCodeAt(i)) >>> 0;
  return TAG_PALETTE[hash % TAG_PALETTE.length];
}

export default function FeatureCard({ feature, index }) {
  const p = PRIORITY[feature.priority] || PRIORITY.Medium;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.45, ease: [0.25, 0.46, 0.45, 0.94] }}
      whileHover={{ y: -3, boxShadow: `0 8px 32px ${p.glow}, 0 0 0 1px ${p.border}` }}
      style={{
        position: 'relative',
        borderRadius: 16,
        padding: '18px 18px 16px',
        background: 'rgba(10,10,20,0.75)',
        border: `1px solid rgba(99,102,241,0.11)`,
        backdropFilter: 'blur(12px)',
        display: 'flex',
        flexDirection: 'column',
        gap: 0,
        overflow: 'hidden',
        cursor: 'default',
        transition: 'box-shadow 0.3s ease, transform 0.3s ease',
      }}
    >
      {/* Priority accent line at top */}
      <div style={{
        position: 'absolute', top: 0, left: 0, right: 0, height: 2, borderRadius: '16px 16px 0 0',
        background: `linear-gradient(90deg, ${p.color}90, transparent 80%)`,
      }} />

      {/* Header row: title + priority badge */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 10, marginBottom: 10 }}>
        <h4 style={{
          fontSize: 13.5, fontWeight: 700, color: '#e2e8f0',
          lineHeight: 1.35, margin: 0, flex: 1,
        }}>
          {feature.name}
        </h4>

        {/* Priority badge */}
        <span style={{
          flexShrink: 0,
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '3px 9px', borderRadius: 99,
          background: p.bg, border: `1px solid ${p.border}`,
          fontSize: 10.5, fontWeight: 700, color: p.color,
          letterSpacing: '0.04em', whiteSpace: 'nowrap',
          fontFamily: 'JetBrains Mono, monospace',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: '50%', background: p.dot, flexShrink: 0 }} />
          {feature.priority}
        </span>
      </div>

      {/* Description */}
      <p style={{
        fontSize: 12.5, color: '#64748b', lineHeight: 1.6,
        margin: '0 0 14px', flex: 1,
      }}>
        {feature.description}
      </p>

      {/* Tags */}
      {feature.tags?.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {feature.tags.map((tag) => {
            const ts = tagStyle(tag);
            return (
              <span key={tag} style={{
                fontSize: 10, fontWeight: 600, padding: '3px 8px', borderRadius: 6,
                background: ts.bg, color: ts.color, border: `1px solid ${ts.border}`,
                fontFamily: 'JetBrains Mono, monospace', letterSpacing: '0.03em',
              }}>
                {tag}
              </span>
            );
          })}
        </div>
      )}
    </motion.div>
  );
}
