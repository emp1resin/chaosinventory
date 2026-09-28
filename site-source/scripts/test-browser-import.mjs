import {fileURLToPath,pathToFileURL} from 'node:url';
import fs from 'node:fs/promises';
import path from 'node:path';
import assert from 'node:assert/strict';
import {preview} from 'vite';
const {chromium}=await import(pathToFileURL(process.env.PLAYWRIGHT_MODULE || '/opt/codex/runtimes/codex-primary-runtime/dependencies/node/node_modules/playwright/index.mjs'));
const root=fileURLToPath(new URL('..',import.meta.url));
const observations=path.join(root,'official-import-observations');
const summary=JSON.parse(await fs.readFile(path.join(observations,'summary.json'),'utf8'));
const server=await preview({root,preview:{host:'127.0.0.1',port:4177,strictPort:true}});
const browser=await chromium.launch({headless:true});
const page=await browser.newPage({viewport:{width:1440,height:1050}});
const errors=[],badRequests=[],reports=[];let directFailure=false,failedItem=false,delayedProfile='';
page.on('pageerror',e=>errors.push(e.message));
const url='http://127.0.0.1:4177/chaosinventory/';
await page.route('**/*',async route=>{
 const request=route.request(),u=new URL(request.url());
 if(u.origin==='http://127.0.0.1:4177')return route.continue();
 if(['chaosage.space','chaosage.app'].includes(u.hostname)){badRequests.push(request.url());return route.abort();}
 const cors={'Access-Control-Allow-Origin':'*'};
 if(request.resourceType()==='image')return route.fulfill({status:200,contentType:'image/gif',body:Buffer.from('R0lGODlhAQABAAD/ACwAAAAAAQABAAACADs=','base64')});
 if(u.pathname==='/health')return route.fulfill({json:{ok:true},headers:cors});
 if(u.pathname==='/api/bug-report'){
  const report=JSON.parse(request.postData());reports.push(report);
  assert.match(request.headers()['content-type'],/^text\/plain/);
  return route.fulfill({status:201,json:{id:report.clientId},headers:cors});
 }
 if(u.pathname==='/api/avatar-rating-html')return route.fulfill({body:'<html></html>',headers:cors});
 if(u.pathname==='/sAPI2.php'&&directFailure)return route.abort('failed');
 let file;
 if(u.pathname==='/api/profile-html'){
  const nick=u.searchParams.get('name');if(nick===delayedProfile)await new Promise(r=>setTimeout(r,600));
  file='profile-'+nick+'.html';
 }else if(u.pathname==='/sAPI2.php'||u.pathname==='/api/game-json'){
  if(failedItem&&u.searchParams.get('request')==='equipment_info')return route.fulfill({status:503,json:{error:'simulated upstream failure'},headers:cors});
  file=u.searchParams.get('request')+'-'+(u.searchParams.get('user_name')||u.searchParams.get('id')||'all')+'.json';
 }
 if(!file){badRequests.push(request.url());return route.abort();}
 try{return route.fulfill({status:200,body:await fs.readFile(path.join(observations,file)),headers:cors,contentType:file.endsWith('.html')?'text/plain':'application/json'});}
 catch {badRequests.push(file);return route.fulfill({status:404,body:'fixture missing',headers:cors});}
});
async function closeDrawer(){await page.keyboard.press('Escape');await page.locator('.MuiDrawer-paper:visible').waitFor({state:'hidden'});}
const saved=async()=>page.evaluate(()=>JSON.parse(localStorage.getItem('chaos-build-forge:saves:v1')||'[]'));
async function save(name){
 await page.getByRole('button',{name:/Сохранения \(/}).click();
 await page.getByLabel('Название билда').fill(name);
 await page.getByRole('button',{name:'Сохранить текущий',exact:true}).click();
 await closeDrawer();
 return (await saved()).find(x=>x.name===name).data;
}
async function load(nick){
 await page.locator('#react-autosuggest-popper').fill(nick);
 await page.getByRole('button',{name:'Загрузить',exact:true}).click();
 await page.locator('.MuiLinearProgress-root').waitFor({state:'hidden'});
 assert.equal(await page.locator('.toolbar-status .MuiTypography-colorError').count(),0,`${nick}: import error`);
 return save(nick);
}
try{
 await page.goto(url);
 for(const nick of ['DestinyS','LICHonTHEbeach','Djan','Ашалинда','Материя','Рейнджер','Gedeon','Thrandu1l']){
  const data=await load(nick),expected=summary.results.find(x=>x.nick===nick);
  assert.equal(data.importMeta.nick,nick);assert.equal(data.importMeta.equipped,expected.equipped);
  assert.equal(data.clanGlory,expected.glory);assert.equal(data.clanPosition,expected.position);
  assert.deepEqual(data.elixirs,[]);assert.equal(data.clansArtMask,0);
  if(nick==='Gedeon'){assert.equal(data.thingOnPers['Кольца Слева'].sourceId,927);assert.equal(data.thingOnPers['Кольца Справа'].sourceId,927);}
  console.log('UI_IMPORT_OK '+nick+' slots='+data.importMeta.equipped);
 }
 // Real UI save/compare must include newly added modifiers.
 await page.getByRole('checkbox',{name:/Великий эликсир атаки/}).check();
 const withElixir=await save('Thrand with elixir');assert.ok(withElixir.elixirs.includes('greatAttack'));
 await page.getByRole('button',{name:'Результаты',exact:true}).click();
 const resultText=await page.locator('.MuiDrawer-paper:visible').innerText();
 const attack=Number(resultText.match(/Атака:\s*(\d+)/)?.[1]);assert.ok(attack>600);
 await closeDrawer();
 await page.getByRole('button',{name:'Сравнение',exact:true}).click();
 const selects=page.locator('.compare-drawer [role="button"]');
 await selects.nth(0).click();await page.getByRole('option',{name:'Thrandu1l',exact:true}).click();
 await selects.nth(1).click();await page.getByRole('option',{name:'Thrand with elixir',exact:true}).click();
 await page.getByText('Выберите два сохранённых билда.').waitFor({state:'hidden'});
 const comparison=await page.locator('.compare-drawer').innerText();
 assert.ok(comparison.includes(String(attack)),'Comparison must retain elixir attack');
 await closeDrawer();
 console.log('UI_COMPARE_OK saves and elixir effect retained');
 // Simulated direct CORS/network failure must use the second JSON path.
 directFailure=true;const fallback=await load('DestinyS');assert.equal(fallback.importMeta.equipped,11);directFailure=false;
 // Item failure leaves the last complete avatar intact and produces one-click report.
 failedItem=true;
 await page.locator('#react-autosuggest-popper').fill('Djan');await page.getByRole('button',{name:'Загрузить',exact:true}).click();
 await page.locator('.MuiLinearProgress-root').waitFor({state:'hidden'});
 assert.match(await page.locator('.toolbar-status').innerText(),/Вещь в слоте/);
 await page.getByRole('button',{name:'Сообщить об ошибке',exact:true}).click();
 await page.getByText(/Отчёт сохранён/).waitFor();assert.equal(reports.at(-1).nick,'Djan');assert.equal(reports.at(-1).loadedNick,'DestinyS');
 failedItem=false;
 // A slower previous import must never overwrite a newer selection.
 delayedProfile='Djan';
 await page.getByRole('button',{name:'Загрузить',exact:true}).click();
 await page.locator('#react-autosuggest-popper').fill('Thrandu1l');await page.getByRole('button',{name:'Загрузить',exact:true}).click();
 await page.locator('.MuiLinearProgress-root').waitFor({state:'hidden'});
 await page.waitForTimeout(700);
 assert.equal((await save('after race')).importMeta.nick,'Thrandu1l');
 assert.deepEqual(errors,[]);assert.deepEqual(badRequests,[]);
 await page.screenshot({path:path.join(observations,'browser.png'),fullPage:true});
 await fs.writeFile(path.join(observations,'browser-summary.json'),JSON.stringify({imports:8,comparison:true,directFailureFallback:true,itemFailureReport:true,oldImportCancelled:true,errors,badRequests},null,2));
 console.log('UI_FAILURES_OK fallback, failed item report, cancelled old import');
}finally{await browser.close();await new Promise(resolve=>server.httpServer.close(resolve));}
