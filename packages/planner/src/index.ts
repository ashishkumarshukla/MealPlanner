function ingredient(item:string, perServing:number, unit:string) { return {item, perServing, unit}; }
export const samples = [
  {name:'Palak moong dal khichdi', ingredients:[ingredient('palak',50,'g'),ingredient('moong dal',30,'g'),ingredient('rice',40,'g'),ingredient('oil',1,'tsp'),ingredient('jeera',0.25,'tsp')], activeMinutes:10, minutes:30, note:'Moong dal adds protein, and the spinach cooks in the same pot as the rice.', steps:['Rinse the rice and split yellow moong dal. Wash and chop the spinach.', 'Warm oil in a pot and add jeera. Stir in rice, dal and water.', 'Simmer until the rice and dal are soft, adding water as needed. Fold in the spinach and cook until tender.']},
  {name:'Jeera aloo with rice', ingredients:[ingredient('potato',150,'g'),ingredient('rice',60,'g'),ingredient('oil',1,'tsp'),ingredient('jeera',0.5,'tsp')], activeMinutes:15, minutes:40, note:'Uses your potatoes and rice. This combination has no substantial protein source.', steps:['Rinse the rice, then simmer it in water until tender. Set aside, covered.', 'Dice potatoes. Heat oil and jeera in the pot, then add potatoes and a splash of water.', 'Cover and cook until tender, stirring occasionally. Serve with the rice.']},
].map(recipe=>({...recipe, items:recipe.ingredients.map(i=>i.item)}));
export const pantry = [...new Set(samples.flatMap(meal => meal.items))];
const names: Record<string,string> = {palak:'Palak', 'moong dal':'Moong dal',rice:'Rice',oil:'Oil',jeera:'Jeera',potato:'Potato'};
const aliases: Record<string,string> = {spinach:'palak',cumin:'jeera',aloo:'potato',potatoes:'potato'};
export function ingredientName(item: string): string {
  return Object.hasOwn(names, item) ? names[item] : item;
}

// Match an optional leading amount and kitchen unit, leaving the ingredient name.
const leadingQuantity = /^(?:\d+\s+\d+\/\d+|\d+\/\d+|\d+(?:\.\d+)?|[¼½¾])(?:\s*(?:cups?|teaspoons?|tablespoons?|tsps?|tbsps?|grams?|kilograms?|kg|g|ml|litres?)\.?\s+(?:of\s+)?|\s+)(?=\S)/i;

export function normalize(value: string): string {
  const key = value.trim().toLowerCase().replace(leadingQuantity, '');
  return Object.hasOwn(aliases, key) ? aliases[key] : key;
}

export type Request = {items:string[],time:number,equipment:string,first:string,excluded:string,diet:string,scope:string,slot:string,servings:number};
export function valid(value:unknown): value is Request {
  if (!value || typeof value !== 'object') return false;
  const v=value as Request;
  return Array.isArray(v.items) && v.items.length>0 && v.items.length<=100 &&
    v.items.every(i=>typeof i==='string' && i.trim().length>0 && i.length<=100) &&
    [20,30,45].includes(v.time) && ['One hob','No hob'].includes(v.equipment) &&
    typeof v.excluded==='string' && v.excluded.length<=500 && typeof v.first==='string' && v.first.length<=100 &&
    ['Vegetarian','Eggetarian'].includes(v.diet) && ['One meal','Today'].includes(v.scope) &&
    ['Lunch','Dinner'].includes(v.slot) && [1,2,4].includes(v.servings);
}
export function suggest({items,time,equipment,first,excluded,servings}:Request) {
  items=items.map(normalize);
  first=normalize(first);
  const blocked=excluded.split(',').map(normalize);
  const stocked=samples.filter(m=>m.items.every(i=>items.includes(i)));
  const allowed=stocked.filter(m=>!m.items.some(i=>blocked.includes(i)));
  const matches=allowed.filter(m=>equipment==='One hob' && m.minutes<=time)
    .sort((a,b)=>Number(b.items.includes(first))-Number(a.items.includes(first)));
  const reason=!stocked.length?'Try adding pantry ingredients from the quick-add options.':
    !allowed.length?'The matching samples include an ingredient you excluded.':
    equipment!=='One hob'?'Both sample recipes need a hob.':'The matching recipes need more cooking time.';

  return {matches:matches.map(meal=>({...meal, required:meal.ingredients.map(i=>({
    item:i.item, amount:i.perServing*servings, unit:i.unit, stock:'quantity unknown' as const
  }))})),reason:matches.length ? "" : reason};
}
