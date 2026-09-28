// Controlled comparison of the real calculator. Never modifies application source.
// Default: fresh public data. CLAN_AUDIT_CACHE: explicitly labelled historical replay.
import {createServer} from 'vite';
import {load} from 'cheerio';
import {readFile} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {fileURLToPath} from 'node:url';
import {dirname,resolve} from 'node:path';
import assert from 'node:assert/strict';
const root=process.env.CLAN_SOURCE_ROOT||resolve(dirname(fileURLToPath(import.meta.url)),'..');
const cache=process.env.CLAN_AUDIT_CACHE;
const names=['LICHonTHEbeach','destinys','mellstroy','Thrandu1l'];
const slots=['arms','gloves','weapon','belt','boots','helm','amulet','shield','ring1','ring2','armor'];
const cases={
  LICHonTHEbeach:{skills:[['Фехтовальщик',14,2],['Тиран',14,2],['Точность',14,2],['Владение мечами',14,2]],arts:[5,3,2,6],life:'3'},
  destinys:{skills:[['Тиран',12,1],['Двойное оружие',14,2],['Громила',14,2]],arts:[5,3,2,6]},
  mellstroy:{skills:[['Алхимический ингибитор',20,2],['Грузоподъемность',8,1],['Алхимический стабилизатор',9,1],['Алхимический активатор',5,0]]},
  Thrandu1l:{skills:[['Громила',14,0],['Регенерация',4,0],['Уворотливость',6,0],['Фехтовальщик',1,0],['Точность',2,0]]},
};
async function get(url,format='json') {
  let text;
  if(cache){text=await readFile(resolve(cache,createHash('sha256').update(url).digest('hex')+'.json'),'utf8');}
  else {const response=await fetch(url,{signal:AbortSignal.timeout(15000),cache:'no-store'});if(!response.ok)throw new Error(`${new URL(url).pathname}: HTTP ${response.status}`);text=await response.text();}
  return format==='json'?(text?JSON.parse(text):null):text;
}
const server=await createServer({root,server:{middlewareMode:true},appType:'custom',plugins:[{
  name:'isolated-clan-audit',enforce:'pre',transform(code,id){
    if(!id.endsWith('/src/components/Results.jsx'))return;
    const position='var positionKoeff = (100-this.props.clanPosition*1.5)/100';
    const damage='// Current character snapshots match the game without an extra clan-glory multiplier on damage.';
    assert.ok(code.includes(position)&&code.includes(damage),'Production formula markers changed: review audit');
    return code.replace(position,'var positionKoeff = (100-(this.props.clanPosition-(this.props.auditFaqPosition?1:0))*1.5)/100')
      .replace(damage,`this.clanAudit={positionKoeff,koeffClansGlory,beforeDamage:[minDamage,maxDamage],beforeAttack:atack,beforeHP:HP};
      if(this.props.auditRestoreDamage){minDamage*=1+koeffClansGlory;maxDamage*=1+koeffClansGlory;}`);
  },
}]});
try {
  const [{default:reducer},{Result},{default:catalog},profileApi,{resolveEquippedItems}]=await Promise.all([
    server.ssrLoadModule('/src/reducers/postReducer.jsx'),server.ssrLoadModule('/src/components/Results.jsx'),
    server.ssrLoadModule('/src/components/ItemsAll.jsx'),server.ssrLoadModule('/src/data/officialProfile.js'),
    server.ssrLoadModule('/src/data/resolveEquipment.js'),
  ]);
  let glories;
  if(cache)glories=(await get('https://chaosage.space/religionAndClansData')).clansArr;
  else {
    const html=await get('https://chaosage.ru/rating.php?type=2','text');const $=load(html);glories={};
    $('table[width="680"]').each((_,table)=>{const cells=$(table).find('td');if(cells.length!==7)return;const name=cells.eq(1).text().trim();const glory=Number(cells.eq(5).text().trim());if(name&&Number.isFinite(glory))glories[name]=glory;});
    assert.ok(Object.keys(glories).length,'Clan rating format changed');
  }
  const evaluate=(state,extra={})=>{const c=new Result({...structuredClone(state),level:state.levelChange,renderless:true,...extra});c.render();return {stats:c.comparisonResult,trace:c.clanAudit};};
  for(const name of names){
    const n=encodeURIComponent(name);
    let profile;
    if(cache)profile=await get(`https://chaosage.space/getAvatarsDataByName?name=${n}`);
    else {
      const html=await get(`https://chaosage.ru/showInfo.php?avatar=${n}`,'text'),$=load(html),cells={};
      $('td').each((_,td)=>{const label=$(td).text().replace(/\s+/g,' ').trim();if(['Раса:','Уровень:','Профессия:','Клан:','Религия:','Сила:','Телосложение:','Ловкость:','Интеллект:','Выносливость:','Воля:'].includes(label))cells[label]=$(td).next('td').text();});
      profile=profileApi.profileFromCells(cells);
    }
    const [equipment,fraction,members]=await Promise.all(['user_equipment_list','user_fraction','clan_list_by_user_name'].map(request=>get(`https://chaosage.ru/sAPI2.php?user_name=${n}&request=${request}`)));
    assert.ok(equipment&&slots.every(key=>Object.hasOwn(equipment,key)),`${name}: malformed equipment list`);
    const items=[];
    for(const slot of slots){
      const id=equipment[slot];if(!Number(id)){items.push(null);continue;}
      const item=await get(`https://chaosage.ru/sAPI2.php?id=${id}&request=equipment_info`);
      assert.ok(item?.name,`${name}/${slot}: item unavailable`);
      if(/^\d+$/.test(String(item.breachRune))&&Number(item.breachRune)>0){
        const rune=await get(`https://chaosage.ru/sAPI2.php?id=${item.breachRune}&request=equipment_info`);
        item.breachRuneApiId=String(item.breachRune);item.breachRuneImported=true;
        item.breachRune=rune.image?.match(/br_([a-z]+)\.png/i)?.[1]||rune.name?.replace(/^Руна\s+/i,'').trim().toLowerCase();
        item.breachRuneName=rune.name;item.breachRuneDescription=rune.desc;item.breachRuneImage=rune.image?`https://chaosage.ru/images/${rune.image}`:'';
      }
      items.push(item);
    }
    const found=resolveEquippedItems(profile.out.things,items,catalog);assert.deepEqual(found.missing,[],`${name}: unknown FAQ item`);profile.out.things=found.resolved;
    if(String(profile.out.clan).toLowerCase()==='нет')profile.out.clan='Нет';
    const index=Object.values(members||{}).findIndex(row=>String(row?.[1]).toLowerCase()===name.toLowerCase());
    const position=profile.out.clan==='Нет'?100:index<0?null:index+1;
    const glory=profile.out.clan==='Нет'?0:glories[profile.out.clan];assert.ok(Number.isFinite(glory),`${name}: glory unknown`);
    let state=reducer(undefined,{type:'Загрузка персонажа',data:profile,modifireInformation:items,dataGlory:glory,positionOnClan:position,fractionData:fraction?.fractionRLevel||0});
    const c=cases[name];
    for(const [skill,level,mastery] of c.skills){state=reducer(state,{type:`Изменить навык ${skill}`,data:level});state=reducer(state,{type:`Изменить мастерство навыка ${skill}`,data:mastery});}
    for(const [i,count] of (c.arts||[]).entries())state=reducer(state,{type:`Изменить ${['Меч вечного сияния','Сфера небесной энергии','Руна правителей','Маска огненного демона'][i]}`,data:count});
    if(c.life)state=reducer(state,{type:'Смена Блага Жизни',data:c.life});
    const original=evaluate(state);const rows=[];
    for(const p of [1,2,10,47,67,100]){
      const changed=reducer(state,{type:'Смена Позиции в Клане',data:String(p)});
      const current=evaluate(changed),faq=evaluate(changed,{auditFaqPosition:true}),restored=evaluate(changed,{auditFaqPosition:true,auditRestoreDamage:true});
      assert.deepEqual(current.stats.damage,original.stats.damage,`${name}: damage unexpectedly responds to rank`);
      rows.push({position:p,currentPercent:Number((current.trace.koeffClansGlory*100).toFixed(4)),faqPercent:Number((faq.trace.koeffClansGlory*100).toFixed(4)),damage:current.stats.damage,attack:current.stats.atack,defence:current.stats.defense,hp:current.stats.hp,experimentalDamage:restored.stats.damage});
    }
    if(glory>0)assert.ok(rows[0].attack>rows[3].attack&&rows[3].attack>rows[5].attack,`${name}: attack should respond to glory`);
    else assert.ok(rows.every(r=>r.attack===original.stats.atack),'No-clan control changed');
    const noGlory=evaluate({...state,clanGlory:0}),restoredNative=evaluate(state,{auditRestoreDamage:true});
    const emptyPosition=evaluate(reducer(state,{type:'Смена Позиции в Клане',data:''}));
    const artOff=evaluate({...state,clansArtMask:0});
    console.log('CLAN_AUDIT '+JSON.stringify({name,dataOrigin:cache?'historical cached API responses':'live official public sources',at:new Date().toISOString(),clan:state.clan,glory,nativePosition:position,equipped:items.filter(Boolean).length,skills:c.skills,arts:c.arts||[],native:{damage:original.stats.damage,attack:original.stats.atack,hp:original.stats.hp},withoutGlory:{damage:noGlory.stats.damage,attack:noGlory.stats.atack,hp:noGlory.stats.hp},emptyPositionPercent:emptyPosition.trace.koeffClansGlory*100,restoredNativeDamage:restoredNative.stats.damage,maskFlat:[Number((original.trace.beforeDamage[0]-artOff.trace.beforeDamage[0]).toFixed(3)),Number((original.trace.beforeDamage[1]-artOff.trace.beforeDamage[1]).toFixed(3))],rows}));
  }
  console.log('CLAN_AUDIT_DONE: 4 characters x 6 positions; current code and two isolated formula variants; no source/deployment changes.');
}finally{await server.close();}
