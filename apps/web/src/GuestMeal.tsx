import { useEffect, useState } from 'react';
import logo from '../../../docs/design/Meals-Planned-Logo.svg';
import './guest.css';

import {samples,pantry,ingredientName,normalize,suggest,valid} from '@meals-planned/planner';
const initial = {items:[] as string[],input:'',slot:'Dinner',time:30,servings:2,scope:'One meal',diet:'Vegetarian',excluded:'',equipment:'One hob',first:''};
function restore() {
  try {
    const data=JSON.parse(sessionStorage.getItem('guest-v1') || 'null');
    if (data && Array.isArray(data.items) && data.items.every((v:unknown)=>typeof v==='string') &&
        Object.entries(initial).every(([k,v])=>typeof data[k]===typeof v)) return data as typeof initial;
  } catch { /* Session storage is optional. */ }
  return initial;
}
export default function GuestMeal() {
  const [draft,setDraft]=useState(restore);
  const {items,input,slot,time,servings,scope,diet,excluded,equipment,first}=draft;
  function update<K extends keyof typeof initial>(key:K,value:typeof initial[K]) {
    setDraft(prev=>({...prev,[key]:value}));
  }
  useEffect(()=>{try {sessionStorage.setItem('guest-v1',JSON.stringify(draft));} catch { /* Keep in memory. */ }},[draft]);
  const [stage,setStage]=useState<'edit'|'results'|'detail'|'loading'>('edit');
  const [chosen,setChosen]=useState<ReturnType<typeof suggest>['matches'][number]>();
  const [detailSlot,setDetailSlot]=useState(slot);
  const [{matches,reason},setResult]=useState<ReturnType<typeof suggest>>({matches:[],reason:''});
  const [notice,setNotice]=useState('');
  async function generate() {
    const request={...draft,items:[...new Set([...items,...input.split(',').map(normalize).filter(Boolean)])]};
    if (!valid(request)) {setNotice('Check the ingredient names and meal preferences.');return;}
    setDraft({...request,input:''});
    setStage('loading');
    setNotice('');
    try {
      const response=await fetch('/suggestions',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({
        items:request.items,time,equipment,first,excluded,diet,scope,slot,servings
      }),signal:AbortSignal.timeout(8000)});
      if (response.status===400 || response.status===413) {
        setNotice('Please shorten the ingredient list and try again.');setStage('edit');return;
      }
      if (!response.ok) throw new Error('Service unavailable');
      setResult(await response.json());
    } catch {
      setResult(suggest(request));
      setNotice('Using the local sample catalogue while the suggestions service is unavailable.');
    }
    setStage('results');
  }
  function add(values:string[]) {
    setDraft(prev=>({...prev,items:[...new Set([...prev.items,...values.map(normalize).filter(Boolean)])]}));
  }
  return <div className="page">
    <header><img src={logo} alt="Meals Planned. Decide what to cook with what you have."/><span>Guest kitchen</span></header>
    <main className={stage==='edit'?'dashboard':undefined}><p className="eyebrow">QUICK MEAL · DESIGN PREVIEW</p>
    {notice && <p role="status">{notice}</p>}
    {stage==='loading' ? <p role="status">Finding meals…</p> : stage==='edit' ? <>
      <h1>What can I cook today?</h1><p>Start with what you have. We’ll suggest lunch or dinner for your table.</p>
      <div className="chips">{['One meal','Today','This week'].map(v=><button key={v} aria-pressed={v===scope} onClick={()=>update('scope',v)}>{v}</button>)}</div>
      {scope==='This week'?<section><h2>Plan your week</h2><p>Sign-in will be available for saved weekly plans. Your guest ingredients stay in this tab.</p><button onClick={()=>update('scope','One meal')}>Continue as guest</button></section>:<div className="columns"><div>
      <section><h2>Your ingredients</h2>
        <form onSubmit={e=>{e.preventDefault();add(input.split(','));update('input','');}}>
          <label htmlFor="ingredient">Enter vegetables, grains, dal, or spices</label>
          <div className="entry"><input id="ingredient" value={input} onChange={e=>update('input',e.target.value)} placeholder="e.g. palak, moong dal, rice"/><button>Add</button></div>
        </form>
        <p className="chips">{items.map(i=><button key={i} aria-label={'Remove '+i} onClick={()=>update('items',items.filter(x=>x!==i))}>{ingredientName(i)} ×</button>)}</p>
        <p>Quick add</p><div className="chips">{pantry.filter(i=>!items.includes(i)).map(i=><button key={i} onClick={()=>add([i])}>+ {ingredientName(i)}</button>)}</div>
      </section>
      <section><h2>At your table</h2><div className="settings">
        {scope==='One meal' && <label>Meal<select value={slot} onChange={e=>update('slot',e.target.value)}><option>Lunch</option><option>Dinner</option></select></label>}
        <label>Servings<select value={servings} onChange={e=>update('servings',Number(e.target.value))}>{[1,2,4].map(n=><option key={n}>{n}</option>)}</select></label>
        <label>Time available<select value={time} onChange={e=>update('time',Number(e.target.value))}>{[20,30,45].map(n=><option key={n} value={n}>{n} minutes</option>)}</select></label>
      <label>Diet<select value={diet} onChange={e=>update('diet',e.target.value)}><option>Vegetarian</option><option>Eggetarian</option></select></label>
      <label>Equipment<select value={equipment} onChange={e=>update('equipment',e.target.value)}><option>One hob</option><option>No hob</option></select></label>
      <label>Use first<select value={items.includes(first)?first:''} onChange={e=>update('first',e.target.value)}><option value="">No preference</option>{items.map(i=><option key={i} value={i}>{ingredientName(i)}</option>)}</select></label>
      </div><label>Ingredients to exclude<input value={excluded} onChange={e=>update('excluded',e.target.value)} placeholder="e.g. potato, palak"/></label><small>Matches the listed sample ingredients by name.</small></section>
      <button className="primary" disabled={!items.length&&!input.trim()} onClick={generate}>Suggest meals from my ingredients</button>
      <button className="clear" onClick={()=>setDraft(initial)}>Clear guest inputs</button><small className="retention">Guest inputs stay in this tab for this session. Clear them here whenever you like.</small></div>
      <aside aria-label="Sample meal ideas"><h2>Sample meal ideas</h2><p>Two examples from the preview catalogue.</p>{samples.map((meal,index)=><article key={meal.name}>
        <svg aria-hidden="true" viewBox="0 0 220 80"><ellipse cx="110" cy="63" rx="68" ry="7" fill="#d9d6bb"/><path d="M45 36h130q-12 39-65 39T45 36" fill={index?'#b67948':'#657958'}/><ellipse cx="110" cy="36" rx="65" ry="18" fill={index?'#e7ca87':'#c7cb89'}/>{[0,1,2,3,4,5].map(k=><ellipse key={k} cx={68+k*16} cy={37+(k%2)*4} rx="7" ry="3" fill={index?'#a37838':'#70834e'} transform={'rotate(-12 '+(68+k*16)+' 37)'}/>)}</svg>
        <h3>{meal.name}</h3><small>{meal.minutes} minutes total · One hob</small></article>)}</aside></div>}
    </> : stage==='results' ? <>
      <h1>{scope==='Today'?'Today':slot} suggestions</h1><p>{servings} {servings===1?'serving':'servings'} · {equipment} · Up to {time} minutes</p>
      {matches.length ? (scope==='Today'?['Lunch','Dinner']:[slot]).map((mealSlot,index)=><div key={mealSlot}>
      {scope==='Today' && <h2>{mealSlot}</h2>}
      {(scope==='Today'?matches.slice(index,index+1):matches).map(m=><section key={m.name}><small>{m.minutes} minutes · Vegetarian</small><h2>{m.name}</h2><p>{m.note}</p>{m.items.includes(first) && <p>Uses {ingredientName(first)}, which you marked to cook first.</p>}<button onClick={()=>{setDetailSlot(mealSlot);setChosen(m);setStage('detail');}}>View recipe</button></section>)}{scope==='Today' && index>=matches.length && <p>No second distinct sample fits your ingredients and preferences.</p>}</div>) :
      <section><h2>No sample meal fits yet</h2><p>{reason}</p></section>}
      <button onClick={()=>setStage('edit')}>Edit ingredients and preferences</button>
    </> : chosen && <>
      <h1>{chosen.name}</h1><p>{detailSlot} · {servings} {servings===1?'serving':'servings'} · About {chosen.activeMinutes} minutes active · {chosen.minutes} minutes total · One hob</p>
      <section><h2>Ingredients</h2><p>Matches use ingredient names. Check that you have the amounts below for your requested servings.</p><ul>{chosen.required.map(i=><li key={i.item}>{ingredientName(i.item)} · {i.amount} {i.unit} <small>({i.stock})</small></li>)}</ul><h2>Method</h2><ol>{chosen.steps.map(s=><li key={s}>{s}</li>)}</ol></section>
      <button onClick={()=>setStage('results')}>Back to suggestions</button>
    </>}
    <footer>Preview with two sample recipes. No sign-in required.</footer></main></div>
}
