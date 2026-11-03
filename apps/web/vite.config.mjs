import { defineConfig } from 'vite';
import { fileURLToPath } from 'node:url';

// Use the Lambda entry point for local development as well as browser tests.
export default defineConfig({
  plugins:[{
    name:'local-guest-api',
    async configureServer(server) {
      const { handler }=await import(fileURLToPath(new URL('../api/dist/index.js', import.meta.url)));
      server.middlewares.use('/suggestions',async (req,res)=>{
        let body='';
        for await (const chunk of req) {
          body+=chunk;
          if(body.length>32768) break;
        }
        const result=await handler({routeKey:req.method+' /suggestions',body});
        res.writeHead(result.statusCode,result.headers);
        res.end(result.body);
      });
    }
  }]
});
