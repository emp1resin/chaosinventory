import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';

const base = 'https://chaosinventory-data.emp1res1n.chatgpt.site';
const origin = 'https://emp1resin.github.io';
const read = async (path, options = {}) => {
  const { headers = {}, ...requestOptions } = options;
  const response = await fetch(`${base}${path}`, {
    signal: AbortSignal.timeout(20000),
    ...requestOptions,
    headers: { Origin: origin, ...headers },
  });
  assert.equal(response.headers.get('access-control-allow-origin'), origin, `${path}: CORS`);
  return response;
};

const health = await read('/health');
assert.equal(health.status, 200);
assert.deepEqual((await health.json()).version, 'official-api-v1');

const profile = await read('/api/profile-html?name=Thrandu1l');
assert.equal(profile.status, 200);
const profileHtml = await profile.text();
assert.ok(profileHtml.includes('Раса:') && profileHtml.includes('Thrandu1l'), 'Official character page was not returned');

const rating = await read('/api/avatar-rating-html');
assert.equal(rating.status, 200);
assert.ok((await rating.text()).length > 1000, 'Character rating page is empty');

const clans = await read('/api/game-json?request=clans');
assert.equal(clans.status, 200);
const clanList = await clans.json();
assert.ok(Object.values(clanList).some(row => row?.clan_name === 'Уничтожители'));

const equipment = await read('/api/game-json?request=user_equipment_list&user_name=Thrandu1l');
assert.equal(equipment.status, 200);
const slots = await equipment.json();
assert.ok(/^\d+$/.test(String(slots.user_id)));
const itemId = [slots.weapon, slots.armor, slots.helm].find(id => Number(id) > 0);
assert.ok(itemId, 'No equipped control item');
const item = await read(`/api/game-json?request=equipment_info&id=${itemId}`);
assert.equal(item.status, 200);
assert.equal(String((await item.json()).id), String(itemId));

const religion = await read('/api/game-json?request=user_religionBonuses&user_name=Thrandu1l');
assert.equal(religion.status, 200);
await religion.json();

const denied = await fetch(`${base}/api/game-json?request=clans`, {
  headers: { Origin: 'https://untrusted.example' }, signal: AbortSignal.timeout(20000),
});
assert.equal(denied.status, 403);
assert.equal(denied.headers.get('access-control-allow-origin'), null);

const id = randomUUID();
const report = await read('/api/bug-report', {
  method: 'POST', headers: { 'Content-Type': 'text/plain' },
  body: JSON.stringify({ schema: 1, clientId: id, category: 'import', nick: 'Thrandu1l',
    note: '', events: [{type:'release_smoke'}], browser: {name:'GitHub Actions release smoke'} }),
});
assert.equal(report.status, 201, `Live report storage returned ${report.status}: ${await report.clone().text()}`);
assert.equal((await report.json()).id, id, 'Database receipt does not match test report');
console.log('LIVE_BACKEND_OK: official profile/items/clans/rating/religion, CORS and D1 report receipt');
