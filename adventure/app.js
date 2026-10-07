(() => {
  'use strict';
  const {scenes,sources,glossary}=window.ADVENTURE;
  const KEY='confederation-adventure-v1';
  const $=id=>document.getElementById(id);
  const roles={farmer:'Farmer / Revolutionary veteran',state:'Massachusetts state leader',congress:'Member of Confederation Congress'};
  const fresh=()=>({version:1,node:'C0',meters:{union:3,treasury:1,unrest:1},flags:{},awards:{},visited:['C0'],log:[],remediation:0,reflection:''});
  let state=fresh(),storageWorks=true,speaking=false;
  const awardLimits={articles:1,causes:2,sources:1,timeline:1,compare:2,causal:3};
  try {
    const raw=localStorage.getItem(KEY);
    if(raw){const saved=JSON.parse(raw);if(valid(saved))state=saved;}
  }catch{storageWorks=false;}
  function valid(s){
    return s && s.version===1 && Object.hasOwn(scenes,s.node) && s.meters && ['union','treasury','unrest'].every(k=>Number.isInteger(s.meters[k])&&s.meters[k]>=0&&s.meters[k]<=5)
      && s.flags && typeof s.flags==='object' && (!s.flags.role||Object.hasOwn(roles,s.flags.role)) && s.awards && typeof s.awards==='object'
      && Object.entries(s.awards).every(([k,v])=>Object.hasOwn(awardLimits,k)&&Number.isInteger(v)&&v>=0&&v<=awardLimits[k])
      && Array.isArray(s.visited)&&s.visited.every(n=>Object.hasOwn(scenes,n))&&Array.isArray(s.log)
      && s.log.every(l=>l&&typeof l.node==='string'&&typeof l.choice==='string')&&Number.isInteger(s.remediation)&&s.remediation>=0&&typeof s.reflection==='string';
  }
  const el=(tag,text,cls)=>{const n=document.createElement(tag);if(text!==undefined)n.textContent=text;if(cls)n.className=cls;return n;};
  const score=()=>Object.values(state.awards).reduce((a,b)=>a+b,0);
  const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(state));storageWorks=true;}catch{storageWorks=false;} $('save-status').textContent=storageWorks?'Saved on this browser · No account needed':'Browser storage unavailable · Progress lasts for this visit';};
  function stopSpeech(){if('speechSynthesis' in window)window.speechSynthesis.cancel();speaking=false;$('read-aloud').textContent='Read to me';$('speech-pause').hidden=true;}
  function go(choice){
    if(choice.wrong){state.remediation++;save();feedback(choice.wrong+' Try again. Your mastery score is not penalized.');return;}
    stopSpeech();
    state.log.push({node:state.node,choice:choice.label});
    Object.assign(state.flags,choice.flags||{});
    for(const [k,v] of Object.entries(choice.meters||{}))state.meters[k]=Math.max(0,Math.min(5,state.meters[k]+v));
    if(choice.award)state.awards[choice.award[0]]=Math.max(state.awards[choice.award[0]]||0,choice.award[1]);
    state.node=choice.target;
    if(scenes[state.node].kind==='correction')state.remediation++;
    if(!state.visited.includes(state.node))state.visited.push(state.node);
    save();render(true);
  }
  function feedback(text){$('feedback').textContent=text;$('feedback').hidden=false;$('feedback').focus();}
  function openPanel(title,content){$('drawer-title').textContent=title;$('drawer-body').replaceChildren(content);$('drawer').showModal();}
  function sourceCard(id){
    const s=sources[id],box=el('section',undefined,'source-card');
    box.append(el('h3',s.title),el('p',s.meta),el(s.paraphrase?'p':'blockquote',s.text));
    if(s.paraphrase)box.append(el('p','Plain-language paraphrase · Read the original for the full wording.'));
    if(s.context)box.append(el('p',s.context));
    const link=el('a','View source / original record ↗');link.href=s.url;link.target='_blank';link.rel='noopener noreferrer';box.append(link);return box;
  }
  function updateMeters(){
    $('meters').replaceChildren();
    for(const [key,label] of [['union','UNION'],['treasury','NATIONAL TREASURY'],['unrest','UNREST']]){
      const box=el('div',undefined,'meter'),labels=el('div',undefined,'meter-label'),track=el('div',undefined,'meter-track');
      labels.append(el('span',label),el('strong',state.meters[key]+' / 5'));
      for(let i=0;i<5;i++)track.append(el('span',undefined,i<state.meters[key]?'filled':''));
      track.setAttribute('aria-hidden','true');box.append(labels,track);$('meters').append(box);
    }
  }
  function render(focus=false){
    const s=scenes[state.node];
    const step=state.visited.filter(id=>scenes[id].kind!=='correction').length;
    $('progress').value=step;$('progress-text').textContent=step+' / 18';
    $('role-card').querySelector('strong').textContent=roles[state.flags.role]||'Not yet chosen';
    updateMeters();$('note-count').textContent=Object.keys(state.awards).length;
    $('date').textContent=s.date||'RETHINK · RETRY · CONTINUE';
    $('chapter').textContent=state.node.startsWith('H')?'THE ROAD TO PHILADELPHIA':roles[state.flags.role]?'YOUR PERSPECTIVE':'THE FIRST EXPERIMENT';
    const badges={documented:'DOCUMENTED',role:'ROLE-PLAY',check:'EVIDENCE CHECK',history:'HISTORY CHECK',correction:'PRODUCTIVE DEAD END',interpretation:'INTERPRETATION'};
    $('badge').textContent=badges[s.kind];$('badge').className='badge '+(s.kind==='history'?'history':s.kind==='correction'?'correction':'');
    $('scene-label').textContent=s.kind==='correction'?'NO PENALTY':'DISPATCH '+String(step).padStart(2,'0');
    $('scene-title').textContent=s.title;$('history-rule').hidden=s.kind!=='history';
    $('narrative').replaceChildren(el('p',s.body));
    $('callback').hidden=!s.callback;
    if(s.callback==='farmer')$('callback').textContent='Your path so far: '+({petition:'you chose peaceful petitioning.',court_block:'you helped stop a court.',withdraw:'you chose to go home.',armed:'you joined armed organizers.'}[state.flags.protest_strategy]||'you are weighing your next step.');
    if(s.callback==='state')$('callback').textContent='Your fiscal approach: '+state.flags.state_fiscal_policy+'. Your simulated strategy does not change the documented history.';
    $('source-area').replaceChildren();if(s.showSource)$('source-area').append(sourceCard(s.source));
    $('choices').replaceChildren();$('activity').replaceChildren();$('summary').replaceChildren();$('feedback').hidden=true;
    $('choice-prompt').textContent=s.prompt||(s.choices.length>1?(s.kind==='role'?'What will you do? · Choices are not grades':'Use the evidence. You may retry.'):'Continue your journey');
    $('choice-prompt').hidden=!s.choices.length;
    for(const [i,choice] of s.choices.entries()){
      const btn=el('button',undefined,'choice'+(s.choices.length===1?' primary':''));
      btn.append(el('span',s.choices.length===1?'→':String.fromCharCode(65+i),'choice-key'));
      const copy=el('span',choice.label);if(choice.detail)copy.append(el('small',choice.detail));btn.append(copy,el('span','→','arrow'));btn.addEventListener('click',()=>go(choice));
      if(s.activity==='sources'&&!(state.flags.saw_knox&&state.flags.saw_jefferson))btn.disabled=true;
      $('choices').append(btn);
    }
    $('scene-footnote').replaceChildren();
    if(s.source){const link=el('button','Evidence: '+sources[s.source].title);link.addEventListener('click',()=>openPanel('Source record',sourceCard(s.source)));$('scene-footnote').append(link);}
    else $('scene-footnote').textContent=s.kind==='role'?'Fictional character · Historically grounded conditions':'Your strategy changes the simulation, not documented events.';
    if(s.activity==='sources')renderSources();
    if(s.activity==='timeline')renderTimeline();
    if(s.activity==='compare')renderCompare();
    if(s.activity==='causal')renderCausal();
    if(s.activity==='summary')renderSummary();
    $('read-aloud').disabled=!('speechSynthesis' in window);if($('read-aloud').disabled)$('read-aloud').textContent='Speech unavailable';
    save();if(focus){$('scene-title').focus();$('story-card').scrollIntoView({block:'start',behavior:'instant'});}
  }
  function renderSources(){
    const row=el('div',undefined,'source-actions');
    for(const id of ['knox','jefferson']){
      const seen=state.flags['saw_'+id],b=el('button',(seen?'✓ ':'')+(id==='knox'?'Read Knox’s warning':'Read Jefferson’s reflection'));
      b.setAttribute('aria-pressed',String(!!seen));b.append(el('small',id==='knox'?'December 1786 · During the unrest':'November 1787 · After the Convention'));
      b.addEventListener('click',()=>{state.flags['saw_'+id]=true;save();render();openPanel('Source lens · '+(id==='knox'?'Knox':'Jefferson'),sourceCard(id));});row.append(b);
    }
    $('activity').append(row,el('p','Read both voices before answering. A source’s interpretation is not the same as a neutral historical fact.','privacy'));
  }
  function timeline(){const list=el('ol',undefined,'timeline');for(const [date,event] of [['March 1786','John Jay writes about support for a general convention.'],['September 1786','Annapolis delegates call for a broader convention.'],['January 25, 1787','Insurgents fail to take the Springfield arsenal.'],['May 1787','The Philadelphia Convention begins.']]){const li=el('li');li.append(el('strong',date),el('span',event));list.append(li);}return list;}
  function renderTimeline(){$('activity').append(timeline());}
  function selectField(form,id,label,options){
    const group=el('fieldset'),lab=el('label',label),select=el('select');lab.htmlFor=id;select.id=id;select.name=id;select.required=true;
    const empty=el('option','Choose an explanation…');empty.value='';select.append(empty);
    for(const [value,text] of options){const o=el('option',text);o.value=value;select.append(o);}group.append(lab,select);form.append(group);return select;
  }
  function renderCompare(){
    const form=el('form',undefined,'activity-card');form.append(el('p','Classify each arrangement. This compares powers and their structure, not “no government” with “government.”'));
    const options=[['articles','Articles: state-supplied national resources'],['constitution','Constitution: explicit Article I, Section 8 power']];
    const fields=[
      selectField(form,'power-tax','1. Congress can lay and collect national taxes.',options),
      selectField(form,'power-commerce','2. Congress can broadly regulate interstate and foreign commerce.',options),
      selectField(form,'power-army','3. Congress can raise armies and provide for calling forth militia to suppress insurrections under explicit Article I wording.',options),
      selectField(form,'power-states','4. State legislatures levy taxes to supply the common treasury.',options)
    ];
    form.append(el('p','Important: Congress under the Articles already had war-related powers. The Constitution’s army and militia clauses strengthen national capacity; they do not create every military power from nothing.'));
    const b=el('button','Check the comparison');b.type='submit';form.append(b);
    form.addEventListener('submit',e=>{e.preventDefault();const correct=['constitution','constitution','constitution','articles'];const n=fields.filter((f,i)=>f.value===correct[i]).length;state.flags.constitution_compare=n;
      if(n===4){go({label:'Compared the two systems',target:'H6',award:['compare',2]});}
      else{state.remediation++;save();feedback(n+' / 4 matched. Article I, Section 8 grants the first three powers explicitly. State-levied taxes supplying the national treasury describe the Articles. Revise and check again; no points are lost.');}
    });$('activity').append(form);
  }
  function renderCausal(){
    const form=el('form',undefined,'activity-card');
    const a=selectField(form,'cause-local','1. Immediate causes inside Massachusetts',[
      ['articles','Congress directly imposed Massachusetts’s taxes.'],['grievances','State taxes, debt, court costs, and economic hardship drove resistance.'],['britain','British orders created the rebellion.']]);
    const b=selectField(form,'cause-national','2. The national context',[
      ['none','Congress had no legal powers at all.'],['president','A national president could order payment.'],['capacity','Congress had powers but depended heavily on states for resources.']]);
    const c=selectField(form,'cause-reform','3. The political effect',[
      ['accelerator','The rebellion intensified reform efforts that were already underway.'],['sole','The rebellion alone created the idea of constitutional reform.'],['inevitable','The Constitution became an automatic, uncontested outcome.']]);
    const btn=el('button','Submit my historical explanation');btn.type='submit';form.append(btn);
    form.addEventListener('submit',e=>{e.preventDefault();const n=Number(a.value==='grievances')+Number(b.value==='capacity')+Number(c.value==='accelerator');state.flags.causal_mastery=n;go({label:'Built a '+n+'/3 causal chain',target:n===3?'H7':'D-H6',...(n===3?{award:['causal',3]}:{})});});$('activity').append(form);
  }
  function pathSummary(){
    if(state.flags.role==='farmer')return 'You ended with '+({petition:'nonviolent pressure',court_block:'court resistance',armed:'armed participation',withdraw:'withdrawal'}[state.flags.protest_strategy]||'your own strategy')+'. Your choice shaped your perspective, not the Springfield outcome.';
    if(state.flags.role==='state')return 'You favored '+state.flags.state_fiscal_policy+' and ended with a '+state.flags.state_response+' response. State authority and national capacity posed different problems.';
    return 'You favored '+(state.flags.congress_strategy||'national deliberation')+'. '+(state.flags.reform_support?'You supported a broader convention before the Springfield news. ':'Reform was already under discussion before the Springfield climax. ')+(state.flags.attempted_direct_tax?'Your direct-tax attempt exposed a legal limit.':'National responsibilities required dependable resources.');
  }
  function report(){return {title:'Can the New Country Survive?',perspective:roles[state.flags.role]||'Unchosen',mastery:score(),masteryMaximum:10,masteryChecks:state.awards,simulationIndicators:state.meters,simulationWarning:'Indicators are not historical statistics or grades.',pathSummary:pathSummary(),reflection:state.reflection,remediationCount:state.remediation,choices:state.log};}
  function renderSummary(){
    const box=$('summary');box.append(el('p',score()+' / 10','score'),el('p','Historical mastery · Retries welcomed · Role-play choices are not graded','privacy'),el('div',pathSummary(),'callback'));
    const grid=el('div',undefined,'summary-grid');
    for(const [label,key] of [['Articles revenue','articles'],['Causes and context','causes'],['Source perspectives','sources'],['Reform chronology','timeline'],['Constitution comparison','compare'],['Causal explanation','causal']]){const item=el('div');item.append(el('strong',label),el('span',(state.awards[key]||0)+' / '+awardLimits[key]));grid.append(item);}box.append(grid);
    const label=el('label','Exit reflection: What problem did the Constitution attempt to solve, and what new problem might stronger national power create?','reflection-label');label.htmlFor='reflection';
    const input=el('textarea');input.id='reflection';input.value=state.reflection;input.placeholder='Use one piece of evidence from your journey…';input.addEventListener('input',()=>{state.reflection=input.value;save();});box.append(label,input);
    const row=el('div',undefined,'summary-actions'),print=el('button','Print / save as PDF'),download=el('button','Download learning record'),again=el('button','Try another perspective');
    print.addEventListener('click',()=>window.print());download.addEventListener('click',()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(report(),null,2)],{type:'application/json'}));const a=el('a');a.href=url;a.download='confederation-learning-record.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);});again.addEventListener('click',()=>$('restart-dialog').showModal());row.append(print,download,again);box.append(row,el('p','Anonymous, local progress only. Nothing is submitted to a teacher or server. Share the printed summary or download if your teacher requests it.','privacy'));
  }
  $('drawer-close').addEventListener('click',()=>$('drawer').close());
  $('drawer').addEventListener('keydown',e=>{if(e.key==='Escape'){e.preventDefault();$('drawer').close();}});
  $('glossary-open').addEventListener('click',()=>{
    const box=el('div'),label=el('label','Find a term');label.htmlFor='glossary-search';const search=el('input',undefined,'glossary-search');search.id='glossary-search';search.type='search';
    const list=el('dl',undefined,'glossary-list');const fill=()=>{list.replaceChildren();for(const [term,definition] of Object.entries(glossary))if((term+' '+definition).toLowerCase().includes(search.value.toLowerCase()))list.append(el('dt',term),el('dd',definition));if(!list.children.length)list.append(el('dt','No matching terms.'));};search.addEventListener('input',fill);fill();box.append(label,search,list);openPanel('Field glossary',box);
  });
  $('notebook-open').addEventListener('click',()=>{
    const box=el('div');box.append(el('p','Your evidence notebook · Mastery '+score()+' / 10'));
    const cards=[['learned_sovereignty','State sovereignty','States retained powers not expressly delegated to Congress.'],['learned_requisition','The common treasury','Congress depended on state contributions. State legislatures levied the taxes.'],['not_powerless','Not powerless','Congress exercised war, diplomatic, and territorial powers.'],['timeline_mastery','Reform before Shays','Jay’s March 1786 letter and Annapolis preceded Springfield.']];
    for(const [flag,title,body] of cards)if(state.flags[flag])box.append(el('h3',title),el('p',body));
    if(!state.flags.learned_sovereignty)box.append(el('p','Evidence cards appear as you move through the story.'));
    if(state.flags.saw_knox)box.append(sourceCard('knox'));if(state.flags.saw_jefferson)box.append(sourceCard('jefferson'));
    box.append(el('h3','Reference timeline'),timeline(),el('h3','Your decisions'));
    const list=el('ol');for(const l of state.log)list.append(el('li',l.node+': '+l.choice));box.append(list);openPanel('Your notebook',box);
  });
  $('meter-help').addEventListener('click',()=>{const box=el('div');box.append(el('p','Simulation indicator: These meters help you see modeled consequences. Historians did not measure “Union” or “Unrest” on a five-point scale.'),el('p','Union represents cooperation; National Treasury represents dependable national resources; Unrest represents political and social pressure. All run from 0 to 5. None is your grade.'),el('p','Academic mastery comes from identifying powers, causes, evidence, chronology, and constitutional changes. Different strategies can all earn full mastery.'));openPanel('What the meters mean',box);});
  $('restart').addEventListener('click',()=>$('restart-dialog').showModal());$('restart-cancel').addEventListener('click',()=>$('restart-dialog').close());$('restart-confirm').addEventListener('click',()=>{stopSpeech();state=fresh();$('restart-dialog').close();save();render(true);});
  $('read-aloud').addEventListener('click',()=>{
    if(speaking){stopSpeech();return;}if(!('speechSynthesis' in window))return;
    const s=scenes[state.node],u=new SpeechSynthesisUtterance(s.title+'. '+s.body+(s.choices.length?' Choices: '+s.choices.map(c=>c.label).join('. '):''));u.lang='en-US';u.rate=.9;
    u.onend=u.onerror=stopSpeech;speaking=true;$('read-aloud').textContent='Stop reading';$('speech-pause').hidden=false;$('speech-pause').textContent='Pause reading';window.speechSynthesis.speak(u);
  });
  $('speech-pause').addEventListener('click',()=>{if(window.speechSynthesis.paused){window.speechSynthesis.resume();$('speech-pause').textContent='Pause reading';}else{window.speechSynthesis.pause();$('speech-pause').textContent='Resume reading';}});
  window.addEventListener('pagehide',stopSpeech);
  render();
})();
