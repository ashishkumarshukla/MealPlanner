import { defineConfig } from '@playwright/test';
export default defineConfig({
  testDir:'apps/web/e2e',
  use:{baseURL:'http://127.0.0.1:4173',channel:process.env.CI ? 'chromium' : 'chrome'},
  projects:[{name:'desktop',use:{viewport:{width:1280,height:800}}},{name:'mobile',use:{viewport:{width:390,height:844}}}],
  webServer:{command:'npm run dev -w @meals-planned/web -- --host 127.0.0.1 --port 4173 --strictPort',url:'http://127.0.0.1:4173'}
});
