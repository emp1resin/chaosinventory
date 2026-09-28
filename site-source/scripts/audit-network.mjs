// Read-only public endpoint investigation. Invalid diagnostic POST cannot store a report.
const githubOrigin = 'https://emp1resin.github.io';
const siteOrigin = 'https://chaosinventory.emp1res1n.chatgpt.site';
const bridge = 'https://chaosinventory-data.emp1res1n.chatgpt.site';
const results = [];
const exposedHeaders = ['access-control-allow-origin', 'access-control-allow-methods',
  'access-control-allow-headers', 'vary', 'cache-control', 'age', 'cf-cache-status',
  'content-type', 'content-length', 'server', 'location'];

async function probe(label, url, {origin = githubOrigin, method = 'GET', headers = {}, body} = {}) {
  const start = Date.now();
  try {
    const response = await fetch(url, {
      method, headers: { ...(origin ? { Origin: origin } : {}), ...headers }, body,
      signal: AbortSignal.timeout(15000), redirect: 'follow',
    });
    const text = await response.text();
    const allowOrigin = response.headers.get('access-control-allow-origin');
    const row = {label, method, url, origin, status:response.status, ms:Date.now()-start,
      cors: !origin || allowOrigin === '*' || allowOrigin === origin,
      bytes:Buffer.byteLength(text),
      headers:Object.fromEntries(exposedHeaders.map(name=>[name,response.headers.get(name)]).filter(([,v])=>v!==null)),
      preview:response.ok ? undefined : text.replace(/<[^>]*>/g,' ').replace(/\s+/g,' ').slice(0,160)};
    results.push(row);
    console.log('AUDIT '+JSON.stringify(row));
  } catch(error) {
    const row={label,method,url,origin,ms:Date.now()-start,error:error.name,message:error.message,
      cause:error.cause?.code || error.cause?.message};
    results.push(row);console.log('AUDIT '+JSON.stringify(row));
  }
}

await probe('legacy-profile', 'https://chaosage.space/getAvatarsDataByName?name=Djan');
await probe('official-profile', 'https://chaosage.ru/showInfo.php?avatar=Djan');
await probe('equipment-list', 'https://chaosage.ru/sAPI2.php?user_name=Djan&request=user_equipment_list');
await probe('bridge-health', `${bridge}/health`);
await probe('bridge-profile-GH-1', `${bridge}/api/profile-html?name=Djan`);
await probe('bridge-profile-Site', `${bridge}/api/profile-html?name=Djan`, {origin:siteOrigin});
await probe('bridge-profile-GH-2', `${bridge}/api/profile-html?name=Djan`);
await probe('bridge-profile-Ashalinda', `${bridge}/api/profile-html?name=${encodeURIComponent('Ашалинда')}`);
await probe('clan-rating', `${bridge}/api/clan-rating-html`);
await probe('report-preflight', `${bridge}/api/bug-report`, {method:'OPTIONS', headers:{
  'Access-Control-Request-Method':'POST', 'Access-Control-Request-Headers':'content-type',
}});
await probe('report-small-validation', `${bridge}/api/bug-report`, {method:'POST',
  headers:{'Content-Type':'application/json'}, body:JSON.stringify({schema:0})});
await probe('report-large-validation', `${bridge}/api/bug-report`, {method:'POST',
  headers:{'Content-Type':'application/json'}, body:JSON.stringify({schema:0,padding:'x'.repeat(25000)})});
await probe('report-simple-validation', `${bridge}/api/bug-report`, {method:'POST',
  headers:{'Content-Type':'text/plain'}, body:JSON.stringify({schema:0})});
console.log('AUDIT_SUMMARY '+JSON.stringify({at:new Date().toISOString(),checks:results.length,
  note:'Server-side probes show HTTP/CORS configuration, not reachability from the affected player network.'}));
