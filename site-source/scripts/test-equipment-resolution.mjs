import assert from 'node:assert/strict';
import {readFile} from 'node:fs/promises';
import {resolveEquippedItems} from '../src/data/resolveEquipment.js';

const source = await readFile(new URL('../src/components/ItemsAll.jsx', import.meta.url), 'utf8');
const catalog = JSON.parse(source.slice(source.indexOf('['), source.lastIndexOf('];') + 1));
const profile = {'Кольцо слева':'Кольцо магистра Тьма', 'Кольцо справа':'Кольцо магистра Тьма'};
const instances = Array.from({length:11}, () => ({}));
instances[8] = {name:'Кольцо магистра(мф)', original_id:'927', id:'1004985'};
instances[9] = {name:'Кольцо магистра(мф)', original_id:'927', id:'997574'};

const gedeon = resolveEquippedItems(profile, instances, catalog);
assert.deepEqual(gedeon.missing, []);
assert.equal(gedeon.resolved['Кольцо слева'].sourceId, 927);
assert.equal(gedeon.resolved['Кольцо справа'].sourceId, 927);
assert.equal(gedeon.resolved['Кольцо слева'].intellItem, 20);

instances[8] = {name:'Кольцо магистра(др)', original_id:'928'};
instances[9] = {name:'Кольцо магистра(др)', original_id:'929'};
const variants = resolveEquippedItems(profile, instances, catalog);
assert.equal(variants.resolved['Кольцо слева'].sourceId, 928);
assert.equal(variants.resolved['Кольцо слева'].willItem, 15);
assert.equal(variants.resolved['Кольцо справа'].sourceId, 929);
assert.equal(variants.resolved['Кольцо справа'].willItem, 7);
assert.equal(profile['Кольцо слева'], 'Кольцо магистра Тьма');

instances[8] = {name:'Неизвестное кольцо', original_id:'999999'};
const unknown = resolveEquippedItems(profile, instances, catalog);
assert.equal(unknown.resolved['Кольцо слева'], profile['Кольцо слева']);
assert.deepEqual(unknown.missing, [{slot:'Кольцо слева',name:'Неизвестное кольцо',originalId:'999999'}]);
console.log('Exact equipped variants, independent ring slots, and unknown ID: OK');
