import {fileURLToPath} from 'node:url';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import {load} from 'cheerio';
import {createServer} from 'vite';
import {requestData} from '../src/data/apiTransport.js';
import {fetchGameJson, gameUrl} from '../src/data/gameApi.js';
import {parseClans,profileFromCells} from '../src/data/officialProfile.js';
import {validateEquipmentList,equipmentSignature,clanPositionFor,mapLimited} from '../src/data/characterImport.js';
import {compactBugReport,sendBugReport,queueBugReport,flushPendingReports,recordDiagnostic,createBugReport} from '../src/data/diagnostics.js';
import worker from '../../backend/worker.mjs';
const fixture = name => fs.readFile(new URL('../test-fixtures/official-20260928/'+name,import.meta.url),'utf8');
const realFetch = globalThis.fetch;
let tests=0;
async function test(name,fn){await fn();tests++;console.log('PASS '+name);}
try {
 await test('Official clans: all 31 records, separate clan values, reject malformed data',async()=>{
   const clans=parseClans(JSON.parse(await fixture('clans.json')));
   assert.equal(Object.keys(clans).length,31);assert.notEqual(clans['Уничтожители'],clans['Наблюдатели']);
   assert.throws(()=>parseClans({}),/пуст/);assert.throws(()=>parseClans({0:{clan_name:'X',clan_glory:''}}),/Формат/);
 });
 await test('Profiles: eight live HTML fixtures by labels, independent of pets and golems',async()=>{
   for(const name of ['LICHonTHEbeach','Thrandu1l','DestinyS','Djan','Ашалинда','Gedeon','Материя','Рейнджер']) {
     const $=load(await fixture(`profile-${name}.html`)),cells={};
     $('td').each((_,e)=>{const td=$(e);if(td.next('td').length)cells[td.text().replace(/\s+/g,' ').trim()]=td.next('td').text();});
     const {out}=profileFromCells(cells); assert.ok(out.level>0);assert.ok(Number.isInteger(out.power));
     if(name==='Thrandu1l'){assert.equal(out.power,15);assert.equal(out.dex,42);assert.equal(out.clan,'Нет');}
     if(name==='Djan'){assert.equal(out.intell,7);assert.equal(out.will,204);}
   }
   assert.throws(()=>profileFromCells({}),/основные/);
 });
 await test('All 11 slots required; explicit zero is valid; equipment changes detected',async()=>{
   const data=JSON.parse(await fixture('equipment-Thrandu1l.json'));
   validateEquipmentList(data);assert.equal(data.shield,'0');
   const bad={...data};delete bad.ring1;assert.throws(()=>validateEquipmentList(bad),/Кольцо слева/);
   assert.throws(()=>validateEquipmentList({}),/список/);
   assert.notEqual(equipmentSignature(data),equipmentSignature({...data,weapon:'123'}));
 });
 await test('Personal clan ranks differ for Lich, Materia, Ashalinda and DestinyS',async()=>{
   const members=JSON.parse(await fixture('clan-members.json'));
   assert.equal(clanPositionFor(members,'lichonthebeach'),47);
   assert.equal(clanPositionFor(members,'Материя'),1);assert.equal(clanPositionFor(members,'Ашалинда'),49);
   assert.equal(clanPositionFor(members,'DestinyS'),185);assert.equal(clanPositionFor({},'unknown'),null);
 });
 await test('Full-body timeout, invalid JSON, status and cancellation stay distinct',async()=>{
   globalThis.fetch=async()=>({ok:true,status:200,text:()=>new Promise(()=>{})});
   await assert.rejects(requestData('https://example.test',{timeoutMs:20}),e=>e.code==='TIMEOUT');
   globalThis.fetch=async()=>new Response('<html>',{status:200});
   await assert.rejects(requestData('https://example.test'),e=>e.code==='INVALID_JSON');
   globalThis.fetch=async()=>new Response('{}',{status:403});
   await assert.rejects(requestData('https://example.test'),e=>e.code==='HTTP'&&e.status===403);
   const ac=new AbortController();ac.abort();
   await assert.rejects(requestData('https://example.test',{signal:ac.signal}),e=>e.code==='CANCELLED');
 });
 await test('One direct failure falls back; no retry of rate limits or cancelled imports',async()=>{
   let calls=[];
   globalThis.fetch=async url=>{calls.push(url);if(calls.length===1)throw new TypeError('Failed to fetch');return new Response('{"ok":true}');};
   assert.deepEqual(await fetchGameJson(gameUrl('clans')),{ok:true});assert.equal(calls.length,2);
   assert.match(calls[1],/\/api\/game-json/);
   calls=[];globalThis.fetch=async url=>{calls.push(url);return new Response('{}',{status:429});};
   await assert.rejects(fetchGameJson(gameUrl('clans')),e=>e.status===429);assert.equal(calls.length,1);
   const ac=new AbortController();ac.abort();
   await assert.rejects(fetchGameJson(gameUrl('clans'),{signal:ac.signal}),e=>e.code==='CANCELLED');assert.equal(calls.length,1);
 });
 await test('Item concurrency limited to three',async()=>{
   let active=0,max=0;
   const result=await mapLimited([0,1,2,3,4,5],3,async n=>{active++;max=Math.max(max,active);await new Promise(r=>setTimeout(r,5));active--;return n*2;});
   assert.deepEqual(result,[0,2,4,6,8,10]);assert.equal(max,3);
 });
 await test('Backend accepts new methods; no arbitrary host; fresh character responses',async()=>{
   const seen=[];globalThis.fetch=async url=>{seen.push(String(url));return new Response('{}');};
   for(const query of ['request=clans','request=user_religionBonuses&user_name=DestinyS']){
     const r=await worker.fetch(new Request('https://bridge.test/api/game-json?'+query,{headers:{Origin:'https://emp1resin.github.io'}}),{});
     assert.equal(r.status,200);assert.equal(r.headers.get('access-control-allow-origin'),'https://emp1resin.github.io');
   }
   const denied=await worker.fetch(new Request('https://bridge.test/api/game-json?request=unknown&url=https://evil.test'),{});assert.equal(denied.status,400);
   const profile=await worker.fetch(new Request('https://bridge.test/api/profile-html?name=Djan'),{});
   assert.equal(profile.headers.get('cache-control'),'no-store');assert.ok(seen.every(url=>url.startsWith('https://chaosage.ru/')));
   globalThis.fetch=async()=>new Response('',{status:403});
   const upstream=await worker.fetch(new Request('https://bridge.test/api/profile-html?name=Thrandu1l'),{});
   assert.equal(upstream.status,502);assert.equal((await upstream.json()).upstreamStatus,403);
 });
 const storage=new Map();globalThis.localStorage={getItem:k=>storage.get(k)??null,setItem:(k,v)=>storage.set(k,v)};
 globalThis.window=new EventTarget();
 Object.defineProperty(globalThis,'navigator',{configurable:true,value:{onLine:true,userAgent:'test',language:'ru'}});
 globalThis.location={origin:'https://emp1resin.github.io',pathname:'/chaosinventory/'};
 await test('Cyrillic and long reports fit both byte and schema limits',async()=>{
   const build={clanPosition:47,clanGlory:45.5,thingOnPers:{},modifireThings:{}};
   for(let i=0;i<11;i++){build.thingOnPers[i]={name:'Кольцо'.repeat(20)};build.modifireThings[i]={parametrs:Object.fromEntries(Array.from({length:80},(_,n)=>['бонус'+n,100]))};}
   for(let i=0;i<35;i++)recordDiagnostic('request_failed',{message:'Ошибка'.repeat(35),path:'/api/game-json',code:'NETWORK'});
   const report=compactBugReport(createBugReport({nick:'ДИКИЙ_ТРОЛЛЬ',category:'import',build}));
   assert.ok(Buffer.byteLength(JSON.stringify(report))<=22500);assert.ok(JSON.stringify(report.build).length<=12000);
   assert.ok(report.events.every(x=>JSON.stringify(x).length<=600));assert.equal(report.build.values.clanPosition,47);
   const statements=[];const db={prepare:sql=>({bind:(...args)=>{statements.push({sql,args});return {};}}),batch:async()=>{}};
   const response=await worker.fetch(new Request('https://bridge.test/api/bug-report',{method:'POST',headers:{'Content-Type':'text/plain;charset=UTF-8',Origin:'https://emp1resin.github.io'},body:JSON.stringify(report)}),{DB:db});
   assert.equal(response.status,201);assert.equal((await response.json()).id,report.clientId);assert.ok(statements.length>1);
 });
 await test('Permanent report failure does not block next report; receipts require matching id',async()=>{
   const one=createBugReport({nick:'one',category:'other'}),two=createBugReport({nick:'two',category:'other'});
   queueBugReport(one);queueBugReport(two);const received=[];
   globalThis.fetch=async(url,init)=>{const body=JSON.parse(init.body);received.push(body.nick);return body.nick==='one'?new Response('{}',{status:400}):new Response(JSON.stringify({id:body.clientId}),{status:201});};
   await flushPendingReports();assert.deepEqual(received,['one','two']);assert.deepEqual(JSON.parse(storage.values().next().value),[]);
   globalThis.fetch=async()=>new Response('{"id":"wrong"}',{status:201});await assert.rejects(sendBugReport(two));
 });
 const server=await createServer({root:fileURLToPath(new URL('..',import.meta.url)),server:{middlewareMode:true},appType:'custom'});
 try {await test('Empty clan position is unknown; religion data resets on another character',async()=>{
   const {default:reducer}=await server.ssrLoadModule('/src/reducers/postReducer.jsx');
   const s=reducer(undefined,{type:'Смена Позиции в Клане',data:''});assert.equal(s.clanPosition,null);
   const manual=reducer(s,{type:'Получили бонусы религий',data:[{nameOfReligion:'test'}]});
   const changed=reducer(manual,{type:'Смена Религии',data:'Джа'});assert.deepEqual(changed.religionData,[]);
 });} finally{await server.close();}
 console.log(`OFFICIAL_IMPORT_TESTS ${tests} passed`);
}finally{globalThis.fetch=realFetch;}
