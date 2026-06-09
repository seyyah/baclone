// src/components/AnalyzeButton.jsx
import { useRef } from 'react';
import { motion } from 'framer-motion';
import { Zap, Loader2 } from 'lucide-react';

export default function AnalyzeButton({ disabled, loading, onClick }) {
  const btnRef = useRef(null);

  const baseStyle = {
    position: 'relative',
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 10,
    padding: '16px 24px',
    borderRadius: 16,
    fontWeight: 700,
    fontSize: 15,
    border: 'none',
    cursor: disabled || loading ? 'not-allowed' : 'pointer',
    overflow: 'hidden',
    transition: 'all 0.25s ease',
    fontFamily: 'Inter, sans-serif',
  };

  const activeStyle = {
    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #06b6d4 100%)',
    color: '#fff',
    boxShadow: '0 0 40px rgba(99,102,241,0.45), 0 4px 20px rgba(0,0,0,0.5)',
    border: '1px solid rgba(99,102,241,0.5)',
  };

  const loadingStyle = {
    background: 'linear-gradient(135deg, #4338ca 0%, #7c3aed 100%)',
    color: '#fff',
    boxShadow: '0 0 30px rgba(99,102,241,0.3)',
    border: '1px solid rgba(99,102,241,0.3)',
  };

  const disabledStyle = {
    background: 'rgba(20,20,35,0.9)',
    color: '#334155',
    border: '1px solid rgba(99,102,241,0.08)',
  };

  const computedStyle = {
    ...baseStyle,
    ...(disabled ? disabledStyle : loading ? loadingStyle : activeStyle),
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2, duration: 0.5 }}
      style={{ width: '100%' }}
    >
      <motion.button
        ref={btnRef}
        style={computedStyle}
        onClick={disabled || loading ? undefined : onClick}
        whileHover={!disabled && !loading ? { scale: 1.02, y: -2 } : {}}
        whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      >
        {/* Shimmer overlay */}
        {!disabled && !loading && (
          <span style={{
            position: 'absolute', inset: 0, pointerEvents: 'none',
            background: 'linear-gradient(105deg, transparent 40%, rgba(255,255,255,0.1) 50%, transparent 60%)',
            backgroundSize: '200% 100%',
          }} />
        )}

        {loading ? (
          <>
            <Loader2 size={20} style={{ animation: 'spin 1s linear infinite' }} />
            <span>Analyzing your application…</span>
          </>
        ) : (
          <>
            <Zap size={20} fill={disabled ? '#334155' : 'white'} color={disabled ? '#334155' : 'white'} />
            <span>{disabled ? 'Upload a video to analyze' : 'Start AI Analysis'}</span>
          </>
        )}
      </motion.button>

      {!disabled && !loading && (
        <p style={{ textAlign: 'center', fontSize: 11, color: '#1e293b', marginTop: 10 }}>
          Powered by Gemini Video Intelligence · ~30 second analysis
        </p>
      )}

      <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
    </motion.div>
  );
}
