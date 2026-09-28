// Run: node --experimental-vm-modules scripts/test-network-failures.mjs
// Uses the production modules unchanged; network failures are injected at fetch().
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { resolve, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import vm from 'node:vm';
import { load } from 'cheerio';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const rows=[];
const pause=ms=>new Promise(resolve=>setTimeout(resolve,ms));
class Parser {
  parseFromString(html) {
    const $=load(html);
    const wrap=el=>({ textContent:$(el).text(), tagName:el?.tagName?.toUpperCase(),
      get nextElementSibling(){ const next=$(el).next()[0]; return next?wrap(next):null; },
      querySelectorAll:selector=>$(el).find(selector).toArray().map(wrap) });
    return {querySelectorAll:selector=>$(selector).toArray().map(wrap)};
  }
}
async function harness(fetcher, timerScale=1) {
  const store=new Map(), timers=new Set();
  const context=vm.createContext({
    console, URL, Response, Request, Headers, AbortController, AbortSignal, Date, Math,
    TextEncoder, crypto, DOMParser:Parser,
    fetch:(...args)=>fetcher(...args),
    setTimeout:(fn,ms)=>{const t=setTimeout(fn,ms*timerScale);timers.add(t);return t;},
    clearTimeout:t=>{timers.delete(t);clearTimeout(t);},
    navigator:{onLine:true,userAgent:'QA',language:'ru-RU'},
    location:{origin:'https://emp1resin.github.io',pathname:'/chaosinventory/'},
    localStorage:{getItem:k=>store.get(k)||null,setItem:(k,v)=>store.set(k,v)},
    window:{dispatchEvent:()=>{},addEventListener:()=>{}}, CustomEvent:class {},
  });
  const modules=new Map();
  async function get(path) {
    if(modules.has(path))return modules.get(path);
    const module=new vm.SourceTextModule(await readFile(path,'utf8'), {
      context, identifier:path, initializeImportMeta:meta=>{meta.env={BASE_URL:'/chaosinventory/'};},
    });
    modules.set(path,module);
    await module.link((specifier,parent)=>get(resolve(dirname(parent.identifier),specifier+'.js')));
    return module;
  }
  async function imported(name){ const m=await get(resolve(root,'src/data',name+'.js'));if(m.status!=='evaluated')await m.evaluate();return m.namespace; }
  return {imported,store,context,dispose:()=>{for(const t of timers)clearTimeout(t);}};
}
const profileHtml='<table>'+Object.entries({'Раса:':'Лич(50)','Уровень:':'100','Профессия:':'Ведьмак(80)',
  'Клан:':'Уничтожители','Религия:':'Иллириана','Сила:':'29(5+24)','Телосложение:':'29(5+24)',
  'Ловкость:':'21(5+16)','Интеллект:':'450(7+443)','Выносливость:':'15(5+10)','Воля:':'400(204+196)'})
  .map(([k,v])=>`<tr><td>${k}</td><td>${v}</td></tr>`).join('')+'</table>';

async function scenario(name,run){await run();rows.push(name);console.log('CONFIRMED '+name);}
await scenario('HTTP 403 primary -> live bridge profile succeeds',async()=>{
  const h=await harness(async url=>new Response(String(url).includes('chaosage.space')?'Forbidden':profileHtml,
    {status:String(url).includes('chaosage.space')?403:200}));
  try {const api=await h.imported('officialProfile');const r=await api.fetchCharacterProfile('Djan');assert.equal(r.profile.out.will,204);}finally{h.dispose();}
});
await scenario('Both profile origins fail -> unknown nickname cannot load from finite cache',async()=>{
  const h=await harness(async url=>{if(String(url).includes('profile-cache'))return new Response('{"profiles":{}}');throw new TypeError('Failed to fetch');});
  try {const api=await h.imported('officialProfile');await assert.rejects(()=>api.fetchCharacterProfile('new-character'),/запасном каталоге/);}finally{h.dispose();}
});
await scenario('DEFECT: empty out object accepted as successful primary profile',async()=>{
  const h=await harness(async()=>new Response('{"out":{}}'));
  try {const api=await h.imported('officialProfile');const r=await api.fetchCharacterProfile('Djan');assert.equal(r.profile.out.level,undefined);}finally{h.dispose();}
});
await scenario('DEFECT: clan-rating request has no timeout',async()=>{
  let options;
  const h=await harness(async(url,o)=>{options=o;return new Promise(()=>{});});
  try {const api=await h.imported('officialProfile');const r=await Promise.race([api.fetchOfficialClanGlory(),pause(30).then(()=>'pending')]);assert.equal(r,'pending');assert.equal(options?.signal,undefined);}finally{h.dispose();}
});
await scenario('DEFECT: bridge timeout ends before response body is read',async()=>{
  let bridgeSignal;
  const h=await harness(async(url,o)=>{if(String(url).includes('chaosage.space'))throw new TypeError('Failed to fetch');bridgeSignal=o.signal;return {ok:true,status:200,text:()=>new Promise(()=>{})};},0.001);
  try {const api=await h.imported('officialProfile');const r=await Promise.race([api.fetchCharacterProfile('Djan'),pause(30).then(()=>'pending')]);assert.equal(r,'pending');assert.equal(bridgeSignal.aborted,false);}finally{h.dispose();}
});
await scenario('Equipment direct network failure -> bridge succeeds',async()=>{
  const h=await harness(async url=>{if(String(url).startsWith('https://chaosage.ru'))throw new TypeError('Failed to fetch');return new Response('{"helm":123}');});
  try {const api=await h.imported('gameApi');const r=await api.fetchGameJson('https://chaosage.ru/sAPI2.php?user_name=Djan&request=user_equipment_list');assert.equal(r.helm,123);}finally{h.dispose();}
});
await scenario('DEFECT: permanent 413 at queue head prevents later valid report delivery',async()=>{
  const calls=[];
  const h=await harness(async(url,o)=>{const r=JSON.parse(o.body);calls.push(r.clientId);return r.clientId==='oversize'?new Response('{"error":"Отчёт слишком большой"}',{status:413}):new Response('{"id":"valid"}',{status:201});});
  try {const api=await h.imported('diagnostics');api.queueBugReport({clientId:'oversize'});api.queueBugReport({clientId:'valid'});await api.flushPendingReports();assert.deepEqual(calls,['oversize']);}finally{h.dispose();}
});
await scenario('DEFECT: allowed diagnostic fields can exceed backend 24000-byte payload limit',async()=>{
  const h=await harness(async()=>new Response('{}'));
  try {const api=await h.imported('diagnostics');for(let i=0;i<35;i++)api.recordDiagnostic('failure',{message:'я'.repeat(240),detail:'я'.repeat(240)});const r=api.createBugReport({nick:'Djan',category:'import',lastError:'Failed to fetch'});assert.ok(Buffer.byteLength(JSON.stringify(r))>24000);assert.ok(r.events.every(e=>JSON.stringify(e).length<600));}finally{h.dispose();}
});
console.log('SCENARIOS '+rows.length+'; no live services contacted; confirmed defects are characterization tests, not fixed behavior.');

// Exercise the standalone diagnostic page without a browser or live services.
// This checks its decisions and submitted payload, not its visual rendering.
async function diagnosticPage({networkDown=false,invalidList=false,changeGear=false}={}) {
  const fields=new Map();
  const element=()=>({textContent:'',disabled:false,append(){},replaceChildren(){},addEventListener(){}});
  const get=id=>{if(!fields.has(id))fields.set(id,element());return fields.get(id);};
  get('nick').value='Любой_новый_ник';
  const slots=['arms','gloves','weapon','belt','boots','helm','amulet','shield','ring1','ring2','armor'];
  const items=Object.fromEntries(slots.map((slot,i)=>[slot,i+1]));
  const calls=[], reports=[];let listReads=0;
  const context=vm.createContext({console,URL,Response,AbortController,TextEncoder,performance,
    setTimeout,clearTimeout,crypto,DOMParser:Parser,
    navigator:{userAgent:'QA',language:'ru-RU',onLine:true},
    location:{origin:'https://emp1resin.github.io',pathname:'/chaosinventory/diagnostics/'},
    document:{getElementById:get,createElement:element},
    fetch:async(url,options={})=>{
      calls.push(String(url));const parsed=new URL(url);
      if(networkDown||parsed.hostname==='chaosage.space')throw new TypeError('Failed to fetch');
      if(parsed.pathname==='/api/bug-report'){
        if(options.body==='{"schema":0}')return new Response('{}',{status:options.headers['Content-Type']==='application/json'?400:415});
        reports.push(JSON.parse(options.body));return new Response('{"id":"test-receipt"}',{status:201});
      }
      if(parsed.pathname==='/api/profile-html')return new Response(profileHtml);
      if(parsed.searchParams.get('request')==='user_equipment_list'){
        listReads++;
        return new Response(JSON.stringify(invalidList?{}:{...items,...(changeGear&&listReads>1?{weapon:100}: {})}));
      }
      if(parsed.searchParams.get('request')==='equipment_info')return new Response(JSON.stringify({name:'Предмет '+parsed.searchParams.get('id'),breachRune:parsed.searchParams.get('id')==='3'?'900':'0'}));
      return new Response('{}');
    },
  });
  const html=await readFile(resolve(root,'../diagnostics/index.html'),'utf8');
  const script=html.split('<script type="module">')[1].split('</script>')[0];
  vm.runInContext(script+'\nglobalThis.runDiagnostic=run;',context);
  await context.runDiagnostic();
  return {fields,calls,reports};
}
await scenario('Draft diagnostic: arbitrary nickname, 11 current items, rune and report receipt',async()=>{
  const r=await diagnosticPage();
  assert.match(r.fields.get('summary').textContent,/11 надетых/);
  assert.equal(r.reports.length,1);
  assert.match(r.fields.get('sent').textContent,/test-receipt/);
  assert.equal(r.calls.filter(url=>new URL(url).searchParams.get('request')==='equipment_info').length,12);
  assert.ok(!r.calls.some(url=>url.includes('profile-cache')));
  assert.ok(Buffer.byteLength(JSON.stringify(r.reports[0]))<=24000);
  assert.ok(r.reports[0].events.length<=35);
  assert.ok(r.reports[0].events.every(event=>JSON.stringify(event).length<=600));
});
await scenario('Draft diagnostic: total network failure does not claim import or delivery',async()=>{
  const r=await diagnosticPage({networkDown:true});
  assert.match(r.fields.get('summary').textContent,/не устанавливается/);
  assert.match(r.fields.get('sent').textContent,/не отправлена/);
  assert.equal(r.reports.length,0);
});
await scenario('Draft diagnostic: malformed list is not interpreted as unequipped character',async()=>{
  const r=await diagnosticPage({invalidList:true});
  assert.match(r.fields.get('summary').textContent,/Список надетых вещей не получен/);
  assert.ok(!r.fields.get('summary').textContent.includes('0 надетых'));
});
await scenario('Draft diagnostic: equipment changed during import is detected',async()=>{
  const r=await diagnosticPage({changeGear:true});
  assert.match(r.fields.get('summary').textContent,/Экипировка изменилась/);
});
console.log('TOTAL '+rows.length+' scenarios, including 4 checks of the unpublished diagnostic page.');
