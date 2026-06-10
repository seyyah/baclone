// src/components/MermaidDiagram.jsx
import { useEffect, useRef, useState } from 'react';
import mermaid from 'mermaid';
import { Copy, Check, Code } from 'lucide-react';

mermaid.initialize({
  startOnLoad: false,
  theme: 'dark',
  themeVariables: {
    primaryColor: '#6366f1',
    primaryTextColor: '#e2e8f0',
    primaryBorderColor: '#4f46e5',
    lineColor: '#475569',
    secondaryColor: '#0f0f1a',
    tertiaryColor: '#1e1e30',
    background: '#050508',
    mainBkg: '#0a0a12',
    nodeBorder: '#4f46e5',
    clusterBkg: '#0f0f1a',
    titleColor: '#e2e8f0',
    edgeLabelBackground: '#0a0a12',
    attributeBackgroundColorEven: '#0a0a12',
    attributeBackgroundColorOdd: '#0f0f1a',
  },
  securityLevel: 'loose',
  fontFamily: 'JetBrains Mono, monospace',
  fontSize: 13,
});

let idCounter = 0;

export default function MermaidDiagram({ code, title, color = '#a78bfa' }) {
  const [svg, setSvg] = useState('');
  const [error, setError] = useState(null);
  const [showCode, setShowCode] = useState(false);
  const [copied, setCopied] = useState(false);
  const diagramId = useRef(`mermaid-${++idCounter}`);

  useEffect(() => {
    if (!code) return;

    const clean = code.trim();

    mermaid.render(diagramId.current, clean)
      .then(({ svg: rendered }) => {
        // Inject responsive styles
        const styled = rendered
           .replace('<svg ', '<svg style="width:100%;height:auto;max-width:100%" ')
           .replace(/fill="[^"]*white[^"]*"/gi, 'fill="#e2e8f0"');
        setSvg(styled);
        setError(null);
      })
      .catch((err) => {
        console.warn('[Mermaid] render error:', err);
        setError('Diagram render failed — showing source code');
        setShowCode(true);
      });
  }, [code]);

  const copyCode = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div style={{
      borderRadius: 14, overflow: 'hidden',
      border: `1px solid ${color}22`,
      background: 'rgba(0,0,0,0.35)',
    }}>
      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '10px 14px',
        background: 'rgba(0,0,0,0.4)',
        borderBottom: `1px solid ${color}18`,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <div style={{ display: 'flex', gap: 5 }}>
            {['#f87171','#fbbf24','#34d399'].map(c => (
              <div key={c} style={{ width: 10, height: 10, borderRadius: '50%', background: c }} />
            ))}
          </div>
          <span style={{ fontSize: 12, fontFamily: 'JetBrains Mono, monospace', color: '#475569', marginLeft: 4 }}>
            {title}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setShowCode(v => !v)} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
            borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: showCode ? `${color}15` : 'rgba(99,102,241,0.07)',
            border: `1px solid ${showCode ? color + '40' : 'rgba(99,102,241,0.15)'}`,
            color: showCode ? color : '#64748b', transition: 'all 0.2s',
          }}>
            <Code size={11} /> {showCode ? 'Diagram' : 'Source'}
          </button>
          <button onClick={copyCode} style={{
            display: 'flex', alignItems: 'center', gap: 5, padding: '4px 10px',
            borderRadius: 7, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            background: copied ? 'rgba(52,211,153,0.1)' : 'rgba(99,102,241,0.07)',
            border: `1px solid ${copied ? 'rgba(52,211,153,0.3)' : 'rgba(99,102,241,0.15)'}`,
            color: copied ? '#34d399' : '#64748b', transition: 'all 0.2s',
          }}>
            {copied ? <Check size={11} /> : <Copy size={11} />}
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>

      {/* Content */}
      <div style={{ padding: showCode ? 0 : '20px 16px', overflowX: 'auto' }}>
        {showCode ? (
          <pre style={{
            margin: 0, padding: 16,
            fontFamily: 'JetBrains Mono, monospace', fontSize: 12, lineHeight: 1.7,
            color: color, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
          }}>{code}</pre>
        ) : svg ? (
          <div
            dangerouslySetInnerHTML={{ __html: svg }}
            style={{ display: 'flex', justifyContent: 'center' }}
          />
        ) : error ? (
          <p style={{ color: '#f87171', fontSize: 12, padding: 16 }}>{error}</p>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', padding: 24 }}>
            <div style={{ width: 20, height: 20, borderRadius: '50%', border: '2px solid #6366f1', borderTopColor: 'transparent', animation: 'spin 0.8s linear infinite' }} />
            <style>{`@keyframes spin{from{transform:rotate(0)}to{transform:rotate(360deg)}}`}</style>
          </div>
        )}
      </div>
    </div>
  );
}
