import assert from 'node:assert/strict';
import test from 'node:test';
import { handler } from '../dist/index.js';

test('gateway health probe returns JSON', async () => {
  const result = await handler({ routeKey: 'GET /health' });
  assert.equal(result.statusCode, 200);
  assert.deepEqual(JSON.parse(result.body), { status: 'ok' });
});
test('unregistered routes are unavailable', async () => {
  assert.equal((await handler({ routeKey: 'POST /plans' })).statusCode, 404);
});

const preferences={items:['spinach','rice','moong dal','oil','cumin'],time:30,first:'spinach',equipment:'One hob',excluded:'',scope:'One meal',diet:'Vegetarian',slot:'Dinner',servings:2};
async function request(input) {
  return handler({routeKey:'POST /suggestions',body:JSON.stringify(input)});
}
test('guest endpoint matches aliases and respects exclusions',async()=>{
  const result=await request(preferences);
  assert.equal(result.statusCode,200);
  assert.equal(JSON.parse(result.body).matches[0].name,'Palak moong dal khichdi');
  assert.deepEqual(JSON.parse((await request({...preferences,excluded:'spinach'})).body).matches,[]);
});
test('rejects invalid guest scope',async()=>{
  assert.equal((await request({...preferences,scope:'This week'})).statusCode,400);
});

test('required amounts scale with portions while stock stays unknown',async()=>{
  const meal=JSON.parse((await request({...preferences,servings:4})).body).matches[0];
  assert.deepEqual(meal.required.find(i=>i.item==='palak'),{item:'palak',amount:200,unit:'g',stock:'quantity unknown'});
});

test('quantity-prefixed ingredients match the same recipe', async () => {
  const items = ['50g spinach', '1 cup rice', '1/2 cup moong dal', '1 tbsp oil', '½ tsp cumin'];
  const response = await request({...preferences, items});
  assert.equal(response.statusCode, 200);
  assert.equal(JSON.parse(response.body).matches[0].name, 'Palak moong dal khichdi');
});
