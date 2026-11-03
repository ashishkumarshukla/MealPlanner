type HttpEvent = { routeKey: string };
export async function handler(event: HttpEvent) {
  const healthy = event.routeKey === 'GET /health';
  return {
    statusCode: healthy ? 200 : 404,
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify(healthy ? { status: 'ok' } : { error: 'Not found' }),
  };
}
