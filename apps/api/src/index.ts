import { suggest, valid } from '@meals-planned/planner';

type HttpEvent = { routeKey:string; body?:string; isBase64Encoded?:boolean };
function json(statusCode:number, body:unknown) {
  return {statusCode, headers:{'content-type':'application/json'}, body:JSON.stringify(body)};
}
export async function handler(event:HttpEvent) {
  if(event.routeKey==='GET /health') return json(200,{status:'ok'});
  if(event.routeKey!=='POST /suggestions') return json(404,{error:'Not found'});
  if((event.body?.length ?? 0)>32768) return json(413,{error:'Request too large'});
  let input:unknown;
  try {
    const body=event.body ?? '';
    input=JSON.parse(event.isBase64Encoded ? Buffer.from(body,'base64').toString('utf8') : body);
  } catch {return json(400,{error:'Invalid JSON'});}
  if(!valid(input)) return json(400,{error:'Invalid meal preferences'});
  return json(200,suggest(input));
}
