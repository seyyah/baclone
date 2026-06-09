// src/components/ScreenTimeline.jsx
import { motion } from 'framer-motion';
import { Monitor, Clock } from 'lucide-react';

const SCREEN_ICONS = {
  login: '🔐', auth: '🔐', signup: '📝', register: '📝',
  home: '🏠', dashboard: '📊', main: '🏠',
  product: '📦', detail: '🔍', listing: '📋',
  cart: '🛒', basket: '🛒',
  checkout: '💳', payment: '💰', pay: '💳',
  order: '📬', orders: '📬', history: '📜',
  profile: '👤', account: '⚙️', settings: '⚙️',
  search: '🔍', filter: '🎚️',
  admin: '🛡️', panel: '🛡️',
  notification: '🔔', message: '💬', chat: '💬',
  map: '🗺️', location: '📍',
  upload: '⬆️', gallery: '🖼️', photo: '📷',
};

function getIcon(screen) {
  const lower = screen.toLowerCase();
  for (const [key, icon] of Object.entries(SCREEN_ICONS)) {
    if (lower.includes(key)) return icon;
  }
  return '📱';
}

export default function ScreenTimeline({ timeline }) {
  if (!timeline?.length) return null;

  return (
    <div>
      {/* Timeline track */}
      <div style={{ position: 'relative', paddingLeft: 0 }}>
        {/* Connecting line */}
        <div style={{
          position: 'absolute', left: 19, top: 24, bottom: 24, width: 1,
          background: 'linear-gradient(to bottom, rgba(99,102,241,0.4), rgba(6,182,212,0.2))',
        }} />

        <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
          {timeline.map((item, i) => {
            const icon = getIcon(item.screen);
            const progress = i / Math.max(timeline.length - 1, 1);
            const color = `hsl(${250 - progress * 60}, 80%, 70%)`;

            return (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.07, duration: 0.4 }}
                style={{ display: 'flex', alignItems: 'flex-start', gap: 14, padding: '8px 4px' }}
              >
                {/* Node */}
                <div style={{
                  width: 38, height: 38, borderRadius: 10, flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  background: `${color}14`,
                  border: `1px solid ${color}35`,
                  fontSize: 16, zIndex: 1,
                  boxShadow: `0 0 12px ${color}20`,
                }}>
                  {icon}
                </div>

                {/* Content */}
                <div style={{
                  flex: 1, padding: '6px 14px', borderRadius: 12,
                  background: 'rgba(10,10,20,0.6)',
                  border: '1px solid rgba(99,102,241,0.1)',
                  display: 'flex', alignItems: 'center', gap: 12,
                  transition: 'border-color 0.2s, background 0.2s',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.borderColor = `${color}35`;
                    e.currentTarget.style.background = `${color}08`;
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.borderColor = 'rgba(99,102,241,0.1)';
                    e.currentTarget.style.background = 'rgba(10,10,20,0.6)';
                  }}
                >
                  {/* Timestamp */}
                  <span style={{
                    fontSize: 11, fontFamily: 'JetBrains Mono, monospace', fontWeight: 700,
                    color, flexShrink: 0,
                    padding: '2px 8px', borderRadius: 6,
                    background: `${color}12`, border: `1px solid ${color}25`,
                  }}>
                    {item.timestamp}
                  </span>

                  {/* Screen name */}
                  <span style={{ fontSize: 13, fontWeight: 600, color: '#e2e8f0', flex: 1 }}>
                    {item.screen}
                  </span>

                  {/* Description */}
                  {item.description && (
                    <span style={{ fontSize: 11, color: '#475569', maxWidth: 200, textAlign: 'right' }}>
                      {item.description}
                    </span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Duration summary */}
      {timeline.length > 1 && (
        <div style={{
          marginTop: 12, padding: '8px 16px', borderRadius: 10,
          background: 'rgba(6,182,212,0.05)', border: '1px solid rgba(6,182,212,0.12)',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <Clock size={12} color="#67e8f9" />
          <span style={{ fontSize: 11, color: '#475569' }}>
            <span style={{ color: '#67e8f9', fontWeight: 600 }}>{timeline.length} screens</span>
            {' '}detected from{' '}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748b' }}>
              {timeline[0]?.timestamp}
            </span>
            {' '}to{' '}
            <span style={{ fontFamily: 'JetBrains Mono, monospace', color: '#64748b' }}>
              {timeline[timeline.length - 1]?.timestamp}
            </span>
          </span>
        </div>
      )}
    </div>
  );
}
