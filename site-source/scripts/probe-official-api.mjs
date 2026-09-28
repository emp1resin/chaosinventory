import fs from 'node:fs/promises';
import { load } from 'cheerio';

// Public, read-only contract discovery. No legacy/private developer service.
const dir = process.env.PROBE_OUTPUT || 'official-api-observations';
await fs.mkdir(dir, {recursive:true});
const rows = [];
async function get(label, url) {
  const started = Date.now();
  try {
    const r = await fetch(url, {headers:{Origin:'https://emp1resin.github.io'}, signal:AbortSignal.timeout(18000)});
    const body = await r.text();
    await fs.writeFile(`${dir}/${label}.${body.trim().startsWith('<')?'html':'json'}`, body);
    let json; try { json = JSON.parse(body); } catch {}
    const row = {label, url, at:new Date().toISOString(), status:r.status, ms:Date.now()-started,
      cors:r.headers.get('access-control-allow-origin'), bytes:Buffer.byteLength(body),
      shape:json==null?typeof json:Array.isArray(json)?'array':typeof json,
      keys:json&&typeof json==='object'?Object.keys(json).slice(0,12):undefined,
      sample:json===undefined?undefined:JSON.stringify(json).slice(0,1600)};
    if(label.startsWith('profile-') && r.ok) {
      const $=load(body); const cells={};
      $('td').each((_,td)=>{const e=$(td), key=e.text().replace(/\s+/g,' ').trim();
        if(['Раса:','Уровень:','Профессия:','Клан:','Религия:','Сила:','Телосложение:','Ловкость:','Интеллект:','Выносливость:','Воля:'].includes(key)) cells[key]=e.next('td').text().trim();});
      row.cells=cells;
      row.layout={golem:/Голем/i.test(body),pet:/Питомец|pet|Животное/i.test(body),married:/Женат|Замужем|Супруг/i.test(body)};
    }
    rows.push(row); console.log('OFFICIAL_API '+JSON.stringify(row));
    return json;
  } catch(e) {const row={label,url,error:e.name,message:e.message,ms:Date.now()-started};rows.push(row);console.log('OFFICIAL_API '+JSON.stringify(row));}
}
const api = (request,nick) => `https://chaosage.ru/sAPI2.php?request=${request}${nick?'&user_name='+encodeURIComponent(nick):''}`;
await get('clans',api('clans'));
await get('religion-rating','https://chaosage.ru/rating.php?type=4');
for(const nick of ['Материя','LICHonTHEbeach','Thrandu1l','DestinyS']) await get('religion-'+encodeURIComponent(nick),api('user_religionBonuses',nick));
for(const nick of ['LICHonTHEbeach','Thrandu1l','DestinyS','Djan','Ашалинда','Gedeon','Материя','Рейнджер']) {
  await get('profile-'+encodeURIComponent(nick),'https://chaosage.ru/showInfo.php?avatar='+encodeURIComponent(nick));
  await get('equipment-'+encodeURIComponent(nick),api('user_equipment_list',nick));
}
await get('clan-members',api('clan_list_by_user_name','LICHonTHEbeach'));
await get('fraction',api('user_fraction','DestinyS'));
await fs.writeFile(`${dir}/summary.json`,JSON.stringify(rows,null,2));
if(rows.some(r=>r.error || r.status!==200)) process.exitCode=1;
