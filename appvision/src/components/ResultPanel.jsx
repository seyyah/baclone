// src/components/ResultPanel.jsx
import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ShieldCheck, Database, Globe, GitBranch, Terminal,
  Copy, Check, ChevronDown, RotateCcw, Download,
  Sparkles, FileJson, Clock, Layers, AlertTriangle,
  TrendingUp, FileText, Box
} from 'lucide-react';
import FeatureCard from './FeatureCard';
import MermaidDiagram from './MermaidDiagram';
import ScreenTimeline from './ScreenTimeline';
import ConfidenceScores from './ConfidenceBar';

// ── Constants ───────────────────────────────────────────────────────────────
const METHOD_COLOR = {
  GET:    { bg: 'rgba(52,211,153,0.1)',   color: '#34d399', border: 'rgba(52,211,153,0.3)'  },
  POST:   { bg: 'rgba(96,165,250,0.1)',   color: '#60a5fa', border: 'rgba(96,165,250,0.3)'  },
  PUT:    { bg: 'rgba(251,191,36,0.1)',   color: '#fbbf24', border: 'rgba(251,191,36,0.3)'  },
  DELETE: { bg: 'rgba(248,113,113,0.1)',  color: '#f87171', border: 'rgba(248,113,113,0.3)' },
  PATCH:  { bg: 'rgba(192,132,252,0.1)',  color: '#c084fc', border: 'rgba(192,132,252,0.3)' },
};
const ENTITY_COLORS = {
  primary: { bg: 'rgba(99,102,241,0.08)',  border: 'rgba(99,102,241,0.25)',  accent: '#818cf8' },
  violet:  { bg: 'rgba(139,92,246,0.08)', border: 'rgba(139,92,246,0.25)',  accent: '#c4b5fd' },
  cyan:    { bg: 'rgba(6,182,212,0.07)',   border: 'rgba(6,182,212,0.25)',   accent: '#67e8f9' },
  green:   { bg: 'rgba(16,185,129,0.07)', border: 'rgba(16,185,129,0.25)',  accent: '#6ee7b7' },
};
const RISK_STYLE = {
  High:   { color: '#f87171', bg: 'rgba(239,68,68,0.08)',  border: 'rgba(239,68,68,0.22)'  },
  Medium: { color: '#fbbf24', bg: 'rgba(251,191,36,0.07)', border: 'rgba(251,191,36,0.2)'  },
  Low:    { color: '#818cf8', bg: 'rgba(99,102,241,0.07)', border: 'rgba(99,102,241,0.18)' },
};

// ── Helpers ──────────────────────────────────────────────────────────────────
function Panel({ children, delay = 0 }) {
  return (
    <motion.div initial={{ opacity:0, y:28 }} animate={{ opacity:1, y:0 }}
      transition={{ delay, duration:0.5, ease:[0.25,0.46,0.45,0.94] }}
      style={{ borderRadius:20, padding:24, background:'rgba(10,10,18,0.88)',
        border:'1px solid rgba(99,102,241,0.14)', backdropFilter:'blur(20px)' }}>
      {children}
    </motion.div>
  );
}

function SectionHeader({ icon:Icon, title, subtitle, color='#6366f1', count }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:16, marginBottom:20 }}>
      <div style={{ width:42,height:42,borderRadius:12,flexShrink:0,background:`${color}18`,
        border:`1px solid ${color}40`,display:'flex',alignItems:'center',justifyContent:'center' }}>
        <Icon size={18} color={color} />
      </div>
      <div style={{ flex:1 }}>
        <h3 style={{ fontSize:15,fontWeight:700,color:'#e2e8f0',margin:0 }}>{title}</h3>
        {subtitle && <p style={{ fontSize:12,color:'#64748b',margin:'2px 0 0' }}>{subtitle}</p>}
      </div>
      {count !== undefined && (
        <span style={{ fontSize:12,fontFamily:'JetBrains Mono,monospace',fontWeight:700,
          padding:'4px 10px',borderRadius:20,background:`${color}15`,color,border:`1px solid ${color}30` }}>
          {count}
        </span>
      )}
    </div>
  );
}

function CopyBtn({ text, label='Copy' }) {
  const [copied, setCopied] = useState(false);
  return (
    <button onClick={() => { navigator.clipboard.writeText(text); setCopied(true); setTimeout(()=>setCopied(false),2000); }}
      style={{ display:'flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:8,
        fontSize:12,fontWeight:600,cursor:'pointer',transition:'all 0.2s',
        background: copied?'rgba(52,211,153,0.12)':'rgba(99,102,241,0.1)',
        border:`1px solid ${copied?'rgba(52,211,153,0.3)':'rgba(99,102,241,0.25)'}`,
        color: copied?'#34d399':'#a5b4fc' }}>
      {copied ? <Check size={12}/> : <Copy size={12}/>}
      {copied ? 'Copied!' : label}
    </button>
  );
}

function Collapsible({ title, children, defaultOpen=false, color='#a5b4fc' }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div style={{ borderRadius:12,overflow:'hidden',border:'1px solid rgba(99,102,241,0.12)',background:'rgba(0,0,0,0.3)' }}>
      <button onClick={()=>setOpen(v=>!v)}
        style={{ width:'100%',display:'flex',alignItems:'center',justifyContent:'space-between',
          padding:'12px 16px',background:'transparent',border:'none',cursor:'pointer' }}>
        <span style={{ fontSize:13,fontWeight:600,fontFamily:'JetBrains Mono,monospace',color }}>{title}</span>
        <ChevronDown size={14} color="#64748b"
          style={{ transform:open?'rotate(180deg)':'rotate(0)',transition:'transform 0.3s' }}/>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div initial={{height:0,opacity:0}} animate={{height:'auto',opacity:1}}
            exit={{height:0,opacity:0}} transition={{duration:0.3,ease:[0.4,0,0.2,1]}}
            style={{overflow:'hidden'}}>
            <div style={{padding:'0 16px 16px'}}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ── Markdown Export ─────────────────────────────────────────────────────────
function buildMarkdown(result) {
  const lines = [];
  lines.push(`# Baclone Analysis: ${result.appName}`);
  lines.push(`\n> ${result.summary}\n`);

  if (result.screenTimeline?.length) {
    lines.push('## 🎬 Screen Timeline');
    result.screenTimeline.forEach(s => lines.push(`- \`${s.timestamp}\` **${s.screen}** — ${s.description}`));
  }

  if (result.modules?.length) {
    lines.push('\n## 📦 Detected Modules');
    result.modules.forEach(m => lines.push(`- ${m.icon} **${m.name}**: ${m.description}`));
  }

  if (result.backendFeatures?.length) {
    lines.push('\n## 🛡️ Backend Features');
    result.backendFeatures.forEach(f => lines.push(`- **[${f.priority}]** ${f.name}: ${f.description}`));
  }

  if (result.entities?.length) {
    lines.push('\n## 🗄️ Database Entities');
    result.entities.forEach(e => lines.push(`- **${e.name}**: \`${e.fields.join(', ')}\``));
  }

  if (result.endpoints?.length) {
    lines.push('\n## 🌐 API Endpoints');
    result.endpoints.forEach(e => lines.push(`- \`${e.method} ${e.path}\` — ${e.description}`));
  }

  if (result.confidenceScores && Object.keys(result.confidenceScores).length) {
    lines.push('\n## 📊 Confidence Scores');
    Object.entries(result.confidenceScores).sort((a,b)=>b[1]-a[1])
      .forEach(([k,v]) => lines.push(`- ${k}: ${v}%`));
  }

  if (result.risks?.length) {
    lines.push('\n## ⚠️ Risk Analysis');
    result.risks.forEach(r => lines.push(`- **[${r.severity}]** ${r.issue}: ${r.detail}`));
  }

  if (result.umlDescription?.classDiagram) {
    lines.push('\n## 🔀 UML Class Diagram');
    lines.push('```mermaid\n' + result.umlDescription.classDiagram + '\n```');
  }

  if (result.cliPrompt) {
    lines.push('\n## ⌨️ CLI Generation Prompt');
    lines.push('```\n' + result.cliPrompt + '\n```');
  }

  lines.push('\n---\n*Generated by Baclone — AI Backend Analyzer*');
  return lines.join('\n');
}

function downloadText(content, filename, mime='text/plain') {
  const a = Object.assign(document.createElement('a'), {
    href: URL.createObjectURL(new Blob([content], {type:mime})),
    download: filename,
  });
  a.click();
}

// ── Main ─────────────────────────────────────────────────────────────────────
export default function ResultPanel({ result, onReset }) {
  const headerRef = useRef(null);

  useEffect(() => {
    if (headerRef.current) {
      gsap.fromTo(headerRef.current, {opacity:0,y:-20}, {opacity:1,y:0,duration:0.6,ease:'power3.out'});
    }
  }, []);

  if (!result) return null;

  return (
    <div style={{ width:'100%',maxWidth:980,margin:'0 auto',padding:'0 16px 96px' }}>

      {/* ── Header ── */}
      <div ref={headerRef} style={{ textAlign:'center',marginBottom:48,opacity:0 }}>
        <div style={{ display:'flex',alignItems:'center',justifyContent:'center',gap:10,marginBottom:16,flexWrap:'wrap' }}>
          <div style={{ display:'inline-flex',alignItems:'center',gap:8,padding:'6px 16px',borderRadius:99,
            background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.3)' }}>
            <div style={{ width:8,height:8,borderRadius:'50%',background:'#34d399' }}/>
            <span style={{ fontSize:11,fontWeight:700,letterSpacing:'0.12em',textTransform:'uppercase',color:'#34d399' }}>
              Analysis Complete
            </span>
          </div>
          <div style={{ display:'inline-flex',alignItems:'center',gap:6,padding:'6px 12px',borderRadius:99,
            background: result._mock?'rgba(251,191,36,0.08)':'rgba(99,102,241,0.08)',
            border:`1px solid ${result._mock?'rgba(251,191,36,0.25)':'rgba(99,102,241,0.25)'}` }}>
            <Sparkles size={11} color={result._mock?'#fbbf24':'#818cf8'}/>
            <span style={{ fontSize:11,fontWeight:600,color:result._mock?'#fbbf24':'#818cf8' }}>
              {result._mock ? 'Mock Data' : 'Gemini 3.5 Flash'}
            </span>
          </div>
        </div>

        {result.appName && result.appName !== 'Analyzed Application' && (
          <p style={{ fontSize:12,fontWeight:600,color:'#64748b',margin:'0 0 6px',letterSpacing:'0.08em',textTransform:'uppercase' }}>
            {result.appName}
          </p>
        )}
        <h2 style={{ fontSize:'clamp(26px,5vw,42px)',fontWeight:900,color:'#e2e8f0',margin:'0 0 12px' }}>
          Backend Architecture{' '}
          <span style={{ background:'linear-gradient(135deg,#6366f1,#8b5cf6,#06b6d4)',
            WebkitBackgroundClip:'text',WebkitTextFillColor:'transparent',backgroundClip:'text' }}>
            Extracted
          </span>
        </h2>
        <p style={{ fontSize:14,color:'#64748b',maxWidth:560,margin:'0 auto 20px' }}>{result.summary}</p>

        {/* Stat pills */}
        <div style={{ display:'flex',flexWrap:'wrap',alignItems:'center',justifyContent:'center',gap:10 }}>
          {[
            { label:'Features',  val:result.backendFeatures?.length, color:'#818cf8' },
            { label:'Entities',  val:result.entities?.length,        color:'#67e8f9' },
            { label:'Endpoints', val:result.endpoints?.length,       color:'#c4b5fd' },
            { label:'Screens',   val:result.screenTimeline?.length,  color:'#34d399' },
          ].filter(x => x.val).map(({ label, val, color }) => (
            <span key={label} style={{ display:'flex',alignItems:'center',gap:6,padding:'6px 14px',
              borderRadius:99,fontSize:14,fontWeight:700,background:`${color}12`,border:`1px solid ${color}28`,color }}>
              <span style={{ fontSize:18 }}>{val}</span>
              <span style={{ fontSize:11,fontWeight:400,opacity:0.7 }}>{label}</span>
            </span>
          ))}
        </div>
      </div>

      {/* ── Sections ── */}
      <div style={{ display:'flex',flexDirection:'column',gap:16 }}>

        {/* 1 — Screen Timeline */}
        {result.screenTimeline?.length > 0 && (
          <Panel delay={0.04}>
            <SectionHeader icon={Clock} title="Video Screen Flow" subtitle="Detected screens and timestamps from the demo video" color="#06b6d4"/>
            <ScreenTimeline timeline={result.screenTimeline}/>
          </Panel>
        )}

        {/* 2 — Modules */}
        {result.modules?.length > 0 && (
          <Panel delay={0.08}>
            <SectionHeader icon={Box} title="Detected Backend Modules" subtitle="Auto-extracted module architecture" color="#8b5cf6" count={result.modules.length}/>
            <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(200px,1fr))',gap:10 }}>
              {result.modules.map((mod, i) => (
                <motion.div key={mod.name} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                  transition={{delay:0.1+i*0.05,duration:0.35}}
                  style={{ padding:'14px 16px',borderRadius:14,
                    background:'rgba(139,92,246,0.06)',border:'1px solid rgba(139,92,246,0.18)',
                    display:'flex',alignItems:'flex-start',gap:12 }}>
                  <span style={{ fontSize:22,flexShrink:0,lineHeight:1.2 }}>{mod.icon}</span>
                  <div>
                    <p style={{ fontSize:13,fontWeight:700,color:'#c4b5fd',margin:'0 0 4px' }}>{mod.name}</p>
                    <p style={{ fontSize:11,color:'#64748b',margin:0,lineHeight:1.5 }}>{mod.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </Panel>
        )}

        {/* 3 — Backend Features */}
        <Panel delay={0.12}>
          <SectionHeader icon={ShieldCheck} title="Backend Feature Analysis" subtitle="Extracted from detected user flows and interactions" color="#6366f1" count={result.backendFeatures?.length}/>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))',gap:10 }}>
            {result.backendFeatures?.map((f,i) => <FeatureCard key={f.id||i} feature={f} index={i}/>)}
          </div>
        </Panel>

        {/* 4 — Confidence Scores */}
        {result.confidenceScores && Object.keys(result.confidenceScores).length > 0 && (
          <Panel delay={0.16}>
            <SectionHeader icon={TrendingUp} title="AI Confidence Scores" subtitle="How clearly each feature was detected in the video" color="#34d399"/>
            <ConfidenceScores scores={result.confidenceScores}/>
          </Panel>
        )}

        {/* 5 — Risk Analysis */}
        {result.risks?.length > 0 && (
          <Panel delay={0.2}>
            <SectionHeader icon={AlertTriangle} title="Risk & Gap Analysis" subtitle="Missing or unclear features that may affect development" color="#fbbf24" count={result.risks.length}/>
            <div style={{ display:'flex',flexDirection:'column',gap:10 }}>
              {result.risks.map((risk, i) => {
                const rs = RISK_STYLE[risk.severity] || RISK_STYLE.Low;
                return (
                  <motion.div key={i} initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                    transition={{delay:0.22+i*0.06,duration:0.35}}
                    style={{ display:'flex',alignItems:'flex-start',gap:14,padding:'14px 16px',
                      borderRadius:14,background:rs.bg,border:`1px solid ${rs.border}` }}>
                    <span style={{ fontSize:10,fontWeight:800,padding:'3px 8px',borderRadius:6,
                      background:`${rs.color}20`,color:rs.color,border:`1px solid ${rs.color}30`,
                      fontFamily:'JetBrains Mono,monospace',flexShrink:0,marginTop:2 }}>
                      {risk.severity}
                    </span>
                    <div>
                      <p style={{ fontSize:13,fontWeight:700,color:'#e2e8f0',margin:'0 0 4px' }}>{risk.issue}</p>
                      <p style={{ fontSize:12,color:'#64748b',margin:0,lineHeight:1.6 }}>{risk.detail}</p>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Panel>
        )}

        {/* 6 — Database Entities */}
        <Panel delay={0.24}>
          <SectionHeader icon={Database} title="Database Entities" subtitle="Inferred data models and fields" color="#06b6d4" count={result.entities?.length}/>
          <div style={{ display:'grid',gridTemplateColumns:'repeat(auto-fill,minmax(190px,1fr))',gap:10 }}>
            {result.entities?.map((entity, i) => {
              const s = ENTITY_COLORS[entity.color] || ENTITY_COLORS.primary;
              return (
                <motion.div key={entity.name} initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}}
                  transition={{delay:0.26+i*0.05,duration:0.35}}
                  style={{ borderRadius:12,padding:14,background:s.bg,border:`1px solid ${s.border}` }}>
                  <div style={{ display:'flex',alignItems:'center',gap:8,marginBottom:10 }}>
                    <div style={{ width:6,height:6,borderRadius:'50%',background:s.accent,flexShrink:0 }}/>
                    <span style={{ fontSize:13,fontWeight:700,fontFamily:'JetBrains Mono,monospace',color:s.accent }}>{entity.name}</span>
                  </div>
                  {entity.fields.map(field => (
                    <div key={field} style={{ display:'flex',alignItems:'center',gap:6,marginBottom:3 }}>
                      <span style={{ fontSize:11,color:'#334155' }}>—</span>
                      <span style={{ fontSize:11,fontFamily:'JetBrains Mono,monospace',color:'#64748b' }}>{field}</span>
                    </div>
                  ))}
                </motion.div>
              );
            })}
          </div>
        </Panel>

        {/* 7 — API Endpoints */}
        <Panel delay={0.28}>
          <SectionHeader icon={Globe} title="API Endpoints" subtitle="Suggested RESTful endpoints" color="#8b5cf6" count={result.endpoints?.length}/>
          <div style={{ display:'flex',flexDirection:'column',gap:4 }}>
            {result.endpoints?.map((ep, i) => {
              const ms = METHOD_COLOR[ep.method] || METHOD_COLOR.GET;
              return (
                <motion.div key={`${ep.method}-${ep.path}-${i}`}
                  initial={{opacity:0,x:-10}} animate={{opacity:1,x:0}}
                  transition={{delay:0.3+i*0.02,duration:0.3}}
                  style={{ display:'flex',alignItems:'center',gap:12,padding:'9px 14px',
                    borderRadius:10,border:'1px solid rgba(99,102,241,0.07)' }}
                  whileHover={{ background:'rgba(255,255,255,0.02)' }}>
                  <span style={{ fontSize:11,fontFamily:'JetBrains Mono,monospace',fontWeight:800,
                    width:54,textAlign:'center',flexShrink:0,padding:'2px 0',borderRadius:6,
                    background:ms.bg,color:ms.color,border:`1px solid ${ms.border}` }}>{ep.method}</span>
                  <span style={{ flex:1,fontSize:13,fontFamily:'JetBrains Mono,monospace',color:'#a5b4fc' }}>{ep.path}</span>
                  <span style={{ fontSize:11,color:'#334155' }}>{ep.description}</span>
                </motion.div>
              );
            })}
          </div>
        </Panel>

        {/* 8 — UML Mermaid Diagrams */}
        <Panel delay={0.33}>
          <SectionHeader icon={GitBranch} title="UML Diagrams" subtitle="Rendered Mermaid class & sequence diagrams" color="#a78bfa"/>
          <div style={{ display:'flex',flexDirection:'column',gap:12 }}>
            <MermaidDiagram code={result.umlDescription?.classDiagram} title="Class Diagram — Entity Relationships" color="#c4b5fd"/>
            <MermaidDiagram code={result.umlDescription?.sequenceDiagram} title="Sequence Diagram — Primary Flow" color="#67e8f9"/>
          </div>
        </Panel>

        {/* 9 — CLI Prompt */}
        <Panel delay={0.38}>
          <div style={{ display:'flex',alignItems:'flex-start',justifyContent:'space-between',gap:16,marginBottom:18 }}>
            <SectionHeader icon={Terminal} title="CLI Backend Generation Prompt" subtitle="Paste into Cursor, Claude, or GPT-4o" color="#34d399"/>
            <CopyBtn text={result.cliPrompt}/>
          </div>
          <div style={{ borderRadius:12,overflow:'hidden',border:'1px solid rgba(52,211,153,0.2)' }}>
            <div style={{ display:'flex',alignItems:'center',gap:6,padding:'9px 14px',
              background:'rgba(0,0,0,0.6)',borderBottom:'1px solid rgba(52,211,153,0.1)' }}>
              {['#f87171','#fbbf24','#34d399'].map(c=>(
                <div key={c} style={{ width:11,height:11,borderRadius:'50%',background:c }}/>
              ))}
              <span style={{ fontSize:11,fontFamily:'JetBrains Mono,monospace',color:'#334155',marginLeft:6 }}>
                ~/baclone/prompt.md
              </span>
            </div>
            <pre style={{ margin:0,padding:18,fontFamily:'JetBrains Mono,monospace',fontSize:12,
              lineHeight:1.7,color:'#86efac',background:'rgba(0,0,0,0.7)',
              maxHeight:380,overflowY:'auto',whiteSpace:'pre-wrap',wordBreak:'break-word' }}>
              {result.cliPrompt}
            </pre>
          </div>
        </Panel>
      </div>

      {/* ── Action Buttons ── */}
      <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{delay:0.5}}
        style={{ display:'flex',flexWrap:'wrap',justifyContent:'center',gap:12,marginTop:36 }}>

        <button onClick={onReset} style={{ display:'flex',alignItems:'center',gap:8,padding:'11px 22px',
          borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',
          background:'rgba(99,102,241,0.1)',border:'1px solid rgba(99,102,241,0.25)',color:'#a5b4fc',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(99,102,241,0.18)';e.currentTarget.style.boxShadow='0 0 20px rgba(99,102,241,0.2)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(99,102,241,0.1)';e.currentTarget.style.boxShadow='none';}}>
          <RotateCcw size={14}/> Analyze Another
        </button>

        <button onClick={() => downloadText(result.cliPrompt, 'baclone-prompt.md')}
          style={{ display:'flex',alignItems:'center',gap:8,padding:'11px 22px',
          borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',
          background:'rgba(52,211,153,0.1)',border:'1px solid rgba(52,211,153,0.25)',color:'#34d399',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(52,211,153,0.18)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(52,211,153,0.1)';}}>
          <Download size={14}/> Export Prompt
        </button>

        <button onClick={() => downloadText(buildMarkdown(result), 'baclone-report.md')}
          style={{ display:'flex',alignItems:'center',gap:8,padding:'11px 22px',
          borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',
          background:'rgba(6,182,212,0.08)',border:'1px solid rgba(6,182,212,0.22)',color:'#67e8f9',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(6,182,212,0.16)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(6,182,212,0.08)';}}>
          <FileText size={14}/> Markdown Report
        </button>

        <button onClick={() => { const {_mock,...c}=result; downloadText(JSON.stringify(c,null,2),'baclone-analysis.json','application/json'); }}
          style={{ display:'flex',alignItems:'center',gap:8,padding:'11px 22px',
          borderRadius:12,fontSize:14,fontWeight:600,cursor:'pointer',fontFamily:'Inter,sans-serif',
          background:'rgba(139,92,246,0.08)',border:'1px solid rgba(139,92,246,0.22)',color:'#c4b5fd',transition:'all 0.2s' }}
          onMouseEnter={e=>{e.currentTarget.style.background='rgba(139,92,246,0.16)';}}
          onMouseLeave={e=>{e.currentTarget.style.background='rgba(139,92,246,0.08)';}}>
          <FileJson size={14}/> Export JSON
        </button>
      </motion.div>
    </div>
  );
}
