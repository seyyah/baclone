// src/components/PromptInput.jsx
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, ChevronDown } from 'lucide-react';

const PLACEHOLDER = `e.g. "Focus on the authentication flow and admin dashboard. Extract all CRUD operations and identify any payment gateway integration."`;

export default function PromptInput({ value, onChange }) {
  const [open, setOpen] = useState(false);

  return (
    <div
      style={{
        width: '100%',
        borderRadius: 16,
        overflow: 'hidden',
        border: '1px solid rgba(99,102,241,0.2)',
        background: 'rgba(10,10,18,0.85)',
        transition: 'border-color 0.3s',
      }}
    >
      {/* Toggle header */}
      <button
        onClick={() => setOpen((v) => !v)}
        style={{
          width: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '16px 20px',
          background: 'transparent',
          border: 'none',
          cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{
            width: 32, height: 32, borderRadius: 10,
            background: 'rgba(99,102,241,0.1)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <MessageSquare size={15} color="#6366f1" />
          </div>
          <div style={{ textAlign: 'left' }}>
            <p style={{ fontSize: 14, fontWeight: 600, color: '#e2e8f0', margin: 0 }}>
              Custom Focus Prompt{' '}
              <span style={{ fontSize: 12, fontWeight: 400, color: '#64748b' }}>— optional</span>
            </p>
            <p style={{ fontSize: 12, color: '#475569', margin: 0 }}>
              Tell the AI what to pay attention to
            </p>
          </div>
        </div>
        <ChevronDown
          size={16}
          color="#64748b"
          style={{ transform: open ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.3s ease' }}
        />
      </button>

      {/* Expandable body — Framer Motion handles height */}
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            key="prompt-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '0 20px 20px' }}>
              <div style={{ height: 1, background: 'rgba(99,102,241,0.1)', marginBottom: 16 }} />
              <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={PLACEHOLDER}
                rows={4}
                maxLength={1000}
                style={{
                  width: '100%',
                  resize: 'none',
                  borderRadius: 12,
                  padding: '12px 16px',
                  fontSize: 13,
                  outline: 'none',
                  background: 'rgba(0,0,0,0.4)',
                  border: '1px solid rgba(99,102,241,0.2)',
                  color: '#e2e8f0',
                  fontFamily: 'Inter, sans-serif',
                  lineHeight: '1.6',
                  boxSizing: 'border-box',
                  transition: 'border-color 0.3s, box-shadow 0.3s',
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = 'rgba(99,102,241,0.6)';
                  e.target.style.boxShadow = '0 0 20px rgba(99,102,241,0.15)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = 'rgba(99,102,241,0.2)';
                  e.target.style.boxShadow = 'none';
                }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
                <p style={{ fontSize: 11, color: '#334155', margin: 0 }}>More context = more accurate backend extraction</p>
                <span style={{ fontSize: 11, color: '#334155', fontFamily: 'JetBrains Mono, monospace' }}>
                  {value.length} / 1000
                </span>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
