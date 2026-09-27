import assert from 'node:assert/strict';
import { createServer } from 'vite';

const server = await createServer({ server: { middlewareMode: true }, appType: 'custom' });
try {
  const { ItemsList } = await server.ssrLoadModule('/src/components/ItemsList.jsx');
  const previous = { name: 'Наручи стража Солнца', kindOfThing: 'Наручи', parametrs: {} };
  const imported = { name: 'Наручи знамений', kindOfThing: 'Наручи', parametrs: {} };
  const list = new ItemsList({ loadedPerson: 1, thingOnPers: { Наручи: previous } });
  list.state = { ...list.state, typeThing: 'Наручи', thingInFoxus: previous, seeItem: 'Модификация' };
  list.props = { loadedPerson: 2, thingOnPers: { Наручи: imported } };
  list.setState = change => { list.state = { ...list.state, ...change }; };
  list.componentDidUpdate({ loadedPerson: 1 });
  assert.equal(list.state.thingInFoxus, imported);

  const staff = { name: 'Посох Око Аканы', kindOfThing: 'Посохи', parametrs: {} };
  list.state = { ...list.state, weaponRight: true, typeThing: 'Мечи' };
  list.props = { loadedPerson: 3, thingOnPers: { 'Оружие Справа': staff } };
  list.componentDidUpdate({ loadedPerson: 2 });
  assert.equal(list.state.thingInFoxus, staff);
  assert.equal(list.state.typeThing, 'Посохи');
  console.log('Import updates selected item and catalog type: OK');
} finally {
  await server.close();
}
