// src/components/ConfidenceBar.jsx
import { motion } from 'framer-motion';
import { TrendingUp } from 'lucide-react';

function scoreColor(score) {
  if (score >= 85) return { bar: '#34d399', text: '#6ee7b7', label: 'High' };
  if (score >= 65) return { bar: '#818cf8', text: '#a5b4fc', label: 'Medium' };
  if (score >= 45) return { bar: '#fbbf24', text: '#fde68a', label: 'Low' };
  return { bar: '#f87171', text: '#fca5a5', label: 'Uncertain' };
}

export default function ConfidenceScores({ scores }) {
  if (!scores || typeof scores !== 'object') return null;

  const entries = Object.entries(scores).sort((a, b) => b[1] - a[1]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
      {entries.map(([feature, rawScore], i) => {
        const score = Math.min(100, Math.max(0, Number(rawScore)));
        const { bar, text, label } = scoreColor(score);

        return (
          <motion.div
            key={feature}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05, duration: 0.35 }}
            style={{ display: 'flex', alignItems: 'center', gap: 12 }}
          >
            {/* Feature name */}
            <span style={{
              fontSize: 12.5, color: '#94a3b8', width: 180, flexShrink: 0,
              fontWeight: 500, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
            }}>
              {feature}
            </span>

            {/* Bar track */}
            <div style={{
              flex: 1, height: 6, borderRadius: 99, overflow: 'hidden',
              background: 'rgba(255,255,255,0.05)',
            }}>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${score}%` }}
                transition={{ delay: i * 0.05 + 0.2, duration: 0.7, ease: [0.25, 0.46, 0.45, 0.94] }}
                style={{
                  height: '100%', borderRadius: 99,
                  background: `linear-gradient(90deg, ${bar}aa, ${bar})`,
                  boxShadow: `0 0 8px ${bar}60`,
                }}
              />
            </div>

            {/* Score + label */}
            <div style={{ display: 'flex', align: 'center', gap: 6, flexShrink: 0, width: 80, justifyContent: 'flex-end' }}>
              <span style={{
                fontSize: 12, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: text,
              }}>
                {score}%
              </span>
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: '0.06em', textTransform: 'uppercase',
                padding: '2px 5px', borderRadius: 4, marginLeft: 4,
                background: `${bar}15`, color: bar, border: `1px solid ${bar}30`,
                fontFamily: 'JetBrains Mono, monospace',
              }}>
                {label}
              </span>
            </div>
          </motion.div>
        );
      })}

      {/* Average */}
      {entries.length > 0 && (
        <div style={{
          marginTop: 6, paddingTop: 12, borderTop: '1px solid rgba(99,102,241,0.12)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <TrendingUp size={12} color="#818cf8" />
          <span style={{ fontSize: 12, color: '#475569' }}>
            Overall confidence:{' '}
            <span style={{
              fontFamily: 'JetBrains Mono, monospace', fontWeight: 700, color: '#a5b4fc',
            }}>
              {Math.round(entries.reduce((s, [, v]) => s + Number(v), 0) / entries.length)}%
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
