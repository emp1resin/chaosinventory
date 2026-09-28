import {fileURLToPath} from 'node:url';
import {createServer} from 'vite';
import {load} from 'cheerio';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import worker from '../../backend/worker.mjs';

const names=['LICHonTHEbeach','Thrandu1l','DestinyS','Djan','Ашалинда','Gedeon','Материя','Рейнджер'];
const output=process.env.IMPORT_OUTPUT || 'official-import-observations';
await fs.mkdir(output,{recursive:true});
// Node integration uses the browser parser's td DOM surface over real HTML.
// The separate browser test checks native DOMParser and actual UI rendering.
class ParsedDocument {
 constructor(html){this.$=load(html);}
 querySelectorAll(selector){const $=this.$;const wrap=e=>({textContent:$(e).text(),tagName:e.tagName?.toUpperCase(),get nextElementSibling(){const n=$(e).next()[0];return n?wrap(n):null;}});return $(selector).toArray().map(wrap);}
}
globalThis.DOMParser=class {parseFromString(html){return new ParsedDocument(html);}};
const originalFetch=globalThis.fetch;
let active=0,maxActive=0;const requests=[];
globalThis.fetch=async (url,options={})=>{
 const target=new URL(url);
 if(target.hostname==='chaosinventory-data.emp1res1n.chatgpt.site') {
   // Exercise the proposed backend locally in CI; don't deploy it to production.
   return worker.fetch(new Request(url,options),{});
 }
 assert.equal(target.hostname,'chaosage.ru','No former developer service allowed');
 const started=Date.now();active++;maxActive=Math.max(maxActive,active);
 try {
   const response=await originalFetch(url,options);
   const text=await response.clone().text();
   const label=target.pathname==='/showInfo.php'?'profile-'+target.searchParams.get('avatar'):
     target.searchParams.get('request')+'-'+(target.searchParams.get('user_name')||target.searchParams.get('id')||'all');
   const file=label.replace(/[^\p{L}\p{N}_.-]/gu,'_')+(target.pathname.endsWith('.php')&&target.pathname!=='/sAPI2.php'?'.html':'.json');
   await fs.writeFile(path.join(output,file),text);
   requests.push({label,status:response.status,ms:Date.now()-started});
   return response;
 }finally{active--;}
};
const server=await createServer({root:fileURLToPath(new URL('..',import.meta.url)),server:{middlewareMode:true},appType:'custom'});
const results=[];
try{
 const [{importCharacter},{default:catalog},{default:reducer},{Result}]=await Promise.all([
   server.ssrLoadModule('/src/data/characterImport.js'),server.ssrLoadModule('/src/components/ItemsAll.jsx'),
   server.ssrLoadModule('/src/reducers/postReducer.jsx'),server.ssrLoadModule('/src/components/Results.jsx'),
 ]);
 let state;
 for(const nick of names){
   const action=await importCharacter(nick,catalog);
   state=reducer(state,action);
   assert.equal(state.clansArtMask,0);assert.deepEqual(state.elixirs,[]);assert.ok(Object.values(state.allSkills).every(x=>x===0));
   if(nick==='Thrandu1l')assert.equal(state.clanGlory,0);
   const result={nick,...action.importMeta,clan:state.clan,glory:state.clanGlory,position:state.clanPosition,
     slots:action.modifireInformation.map((item,i)=>({index:i,id:item?.id||null,originalId:item?.original_id||null,name:item?.name||null,runes:item?.runes||'',runeWord:item?.runeWord||'',breach:item?.breachRune||''}))};
   if(nick==='Thrandu1l'||nick==='DestinyS'){
     const skills=nick==='Thrandu1l'?[['Громила',14,0],['Регенерация',4,0],['Уворотливость',6,0],['Фехтовальщик',1,0],['Точность',2,0]]:[['Тиран',12,1],['Двойное оружие',14,2],['Громила',14,2]];
     for(const [skill,level,master]of skills){state=reducer(state,{type:`Изменить навык ${skill}`,data:level});state=reducer(state,{type:`Изменить мастерство навыка ${skill}`,data:master});}
     if(nick==='DestinyS') for(const [i,count]of [5,3,2,6].entries())state=reducer(state,{type:`Изменить ${['Меч вечного сияния','Сфера небесной энергии','Руна правителей','Маска огненного демона'][i]}`,data:count});
     const c=new Result({...structuredClone(state),level:state.levelChange,renderless:true});c.render();
     result.stats=c.comparisonResult;
     if(nick==='Thrandu1l'){assert.equal(result.stats.atack,1045);assert.deepEqual(result.stats.damage,[287,304]);assert.equal(result.stats.hp,1224);}
     if(nick==='DestinyS'){assert.equal(result.stats.atack,4333);assert.deepEqual(result.stats.damage,[3813,5601]);}
   }
   results.push(result);console.log('IMPORT_RESULT '+JSON.stringify(result));
 }
 await fs.writeFile(path.join(output,'summary.json'),JSON.stringify({at:new Date().toISOString(),maxConcurrentRequests:maxActive,results,requests},null,2));
 console.log('LIVE_IMPORT_OK '+names.length+' characters; proposed backend in CI, not production UI.');
}finally{globalThis.fetch=originalFetch;await server.close();}
