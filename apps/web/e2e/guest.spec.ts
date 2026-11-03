import { test, expect } from '@playwright/test';
test('guest turns pantry ingredients into a dinner and can revise the request', async ({page})=>{
  await page.goto('/');
  await page.getByLabel('Enter vegetables, grains, dal, or spices').fill('spinach, moong dal, 1 cup rice, oil, cumin');
  await page.getByRole('button',{name:'Suggest meals from my ingredients'}).click();
  await page.getByRole('button',{name:'View recipe'}).click();
  await expect(page.getByRole('heading',{name:'Method'})).toBeVisible();
  await page.getByRole('button',{name:'Back to suggestions'}).click();
  await page.getByRole('button',{name:'Edit ingredients and preferences'}).click();
  await page.getByLabel('Time available').selectOption('20');
  await page.getByRole('button',{name:'Suggest meals from my ingredients'}).click();
  await expect(page.getByRole('heading',{name:'No sample meal fits yet'})).toBeVisible();
});

test('guest day and weekly prompt preserve kitchen choices',async({page})=>{
  await page.goto('/');
  await page.getByLabel('Enter vegetables, grains, dal, or spices').fill('palak, moong dal, rice, oil, cumin');
  await page.getByRole('button',{name:'Add',exact:true}).click();
  await page.getByRole('button',{name:'This week'}).click();
  await page.getByRole('button',{name:'Continue as guest'}).click();
  await page.reload();
  await page.getByRole('button',{name:'Today',exact:true}).click();
  await page.getByRole('button',{name:'Suggest meals from my ingredients'}).click();
  await expect(page.getByText('No second distinct sample fits your ingredients and preferences.')).toBeVisible();
  await page.getByRole('button',{name:'Edit ingredients and preferences'}).click();
  await page.getByLabel('Ingredients to exclude').fill('spinach');
  await page.getByRole('button',{name:'Suggest meals from my ingredients'}).click();
  await expect(page.getByText('The matching samples include an ingredient you excluded.')).toBeVisible();
});

test('posts guest preferences to the suggestions service', async ({page})=>{
  await page.goto('/');
  await page.getByLabel('Enter vegetables, grains, dal, or spices').fill('palak, moong dal, rice, oil, cumin');
  const pending=page.waitForResponse(r=>r.url().endsWith('/suggestions') && r.request().method()==='POST');
  await page.getByRole('button',{name:'Suggest meals from my ingredients'}).click();
  expect((await pending).status()).toBe(200);
  await expect(page.getByRole('heading',{name:'Palak moong dal khichdi'})).toBeVisible();
});

test('recipe shows single-serving amounts and stock uncertainty',async({page})=>{
  await page.goto('/');
  await expect(page.getByText(/Guest inputs stay in this tab/)).toBeVisible();
  await expect(page.getByRole('heading',{name:'Sample meal ideas'})).toBeVisible();
  await page.getByLabel('Enter vegetables, grains, dal, or spices').fill('palak, moong dal, rice, oil, jeera');
  await page.getByLabel('Servings').selectOption('1');
  await page.getByLabel('Time available').selectOption('45');
  await page.getByRole('button',{name:'Suggest meals from my ingredients'}).click();
  await expect(page.getByText(/1 serving · One hob/)).toBeVisible();
  await page.getByRole('button',{name:'View recipe'}).click();
  await expect(page.getByText(/1 serving · About 10 minutes active · 30 minutes total/)).toBeVisible();
  await expect(page.getByText(/Palak · 50 g/)).toContainText('quantity unknown');
});

test('arbitrary ingredient names stay removable', async ({page}) => {
  await page.goto('/');
  await page.getByLabel('Enter vegetables, grains, dal, or spices').fill('__proto__, constructor');
  await page.getByRole('button', {name:'Add', exact:true}).click();
  await page.reload();
  for (const item of ['__proto__', 'constructor']) {
    const chip = page.getByRole('button', {name:'Remove ' + item});
    await chip.click();
    await expect(chip).toHaveCount(0);
  }
});
