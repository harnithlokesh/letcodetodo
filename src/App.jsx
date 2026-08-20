import { useEffect, useMemo, useState } from 'react';
import { ArrowRight, Check, ExternalLink, Menu, Moon, RotateCcw, Sparkles, Sun } from 'lucide-react';
import { TOPICS } from './data';
import Storm from './Storm';

const KEY = 'dsa-path-progress-v1';
const THEME_KEY = 'dsa-path-theme-v1';
const allIds = TOPICS.flatMap((topic, ti) => topic.questions.map((_, qi) => `${ti}-${qi}`));
function getStored(){ try { return JSON.parse(localStorage.getItem(KEY) || '{}'); } catch { return {}; } }
function getTheme(){ try { return localStorage.getItem(THEME_KEY) || 'dark'; } catch { return 'dark'; } }

export default function App(){
  const [progress, setProgress] = useState(getStored);
  const [theme, setTheme] = useState(getTheme);
  const [saved, setSaved] = useState(false);
  useEffect(() => { localStorage.setItem(KEY, JSON.stringify(progress)); setSaved(true); const id=setTimeout(()=>setSaved(false),1100); return ()=>clearTimeout(id); }, [progress]);
  useEffect(() => { document.documentElement.dataset.theme = theme; localStorage.setItem(THEME_KEY, theme); }, [theme]);
  const done = useMemo(()=>allIds.filter(id=>progress[id]).length,[progress]);
  const toggle = id => setProgress(current => ({...current, [id]: !current[id]}));
  const reset = () => { if(confirm('This clears every checked problem. Continue?')) setProgress({}); };
  return <><Storm/><main className="app-shell" id="home">
    <header className="site-header"><a className="brand" href="#home"><Sparkles size={18}/> <span>DSA</span>Path</a><nav><a href="#paths">Practice paths</a><a href="#about">Method</a></nav><div className="header-actions"><button className="theme-toggle" onClick={()=>setTheme(current=>current === 'dark' ? 'light' : 'dark')} aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`} title="Change theme">{theme === 'dark' ? <Sun size={15}/> : <Moon size={15}/>}</button><a href="#paths" className="menu-chip"><Menu size={15}/> <span>Explore</span></a></div></header>
    <section className="hero" id="about"><div className="hero-copy"><p className="eyebrow"><i/> Independent study system</p><h1>Build momentum.<br/><em>One problem at a time.</em></h1><p className="subhead">A focused practice path for the patterns that turn LeetCode work into lasting engineering instinct.</p><a href="#paths" className="primary-action">Open practice path <span><ArrowRight size={16}/></span></a></div>
      <section className="meter"><p className="eyebrow"><i/> Your progress</p><div className="meter-top"><span>QUESTS CLEARED</span><strong>{done}<i>/75</i></strong></div><div className="progress"><span style={{width:`${done/75*100}%`}}/></div><p className={saved?'saved show':'saved'}><Check size={13}/> Progress saved on this device</p></section></section>
    <section className="method"><div>01 <b>Start small</b></div><div>02 <b>Practice daily</b></div><div>03 <b>Build better</b></div><div className="method-arrow">→</div></section>
    <section className="paths-intro" id="paths"><p className="eyebrow"><i/> Study map</p><h2>A clearer route<br/>through the essentials.</h2><p>Each path has three foundations, one application problem, and one stretch challenge.</p></section>
    <div className="topic-grid">{TOPICS.map((topic,ti)=>{ const cleared=topic.questions.filter((_,qi)=>progress[`${ti}-${qi}`]).length; return <article className="topic-card" id={`topic-${ti}`} key={topic.name}>
      <div className="topic-head"><span className="topic-no">{String(ti+1).padStart(2,'0')}</span><h2>{topic.name}</h2><span className="topic-count">{cleared}/5</span></div><div className="rule"/>
      <ol>{topic.questions.map((q,qi)=>{const id=`${ti}-${qi}`, checked=!!progress[id];return <li className={checked?'complete':''} key={q.slug}><button onClick={()=>toggle(id)} aria-label={`Mark ${q.title} as ${checked?'incomplete':'done'}`}><span className="check">{checked&&<Check size={15}/>}</span></button><a href={`https://leetcode.com/problems/${q.slug}/`} target="_blank" rel="noreferrer">{q.title}<ExternalLink size={12}/></a><b className={q.difficulty.toLowerCase()}>{q.difficulty}</b></li>})}</ol>
    </article>})}</div>
    <section className="stats"><p className="eyebrow light"><i/> By the numbers</p><h2>Small, consistent work<br/>changes the outcome.</h2><div><strong>{done}</strong><span>problems solved</span><strong>{TOPICS.length}</strong><span>core patterns</span><strong>75</strong><span>chances to practice</span></div></section>
    <footer><span>PROGRESS IS SAVED LOCALLY ON THIS DEVICE</span><button onClick={reset}><RotateCcw size={14}/> Reset progress</button></footer>
  </main></>;
}
