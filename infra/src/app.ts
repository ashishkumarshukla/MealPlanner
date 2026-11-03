import { App, Stack } from 'aws-cdk-lib';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { copyFileSync, mkdtempSync, rmSync, writeFileSync } from 'node:fs';
import { tmpdir } from 'node:os';
import { join } from 'node:path';

const app = new App();
const stack = new Stack(app, 'MealsPlannedPilot');
const asset = mkdtempSync(join(tmpdir(), 'meals-planned-api-'));
try {
  copyFileSync(new URL('../../apps/api/dist/index.js', import.meta.url), join(asset, 'index.js'));
  writeFileSync(join(asset, 'package.json'), JSON.stringify({ type: 'module' }));
  const apiHandler = new LambdaFunction(stack, 'ApiHandler', {
    runtime: Runtime.NODEJS_22_X,
    handler: 'index.handler',
    code: Code.fromAsset(asset),
  });
  const api = new HttpApi(stack, 'HttpApi');
  api.addRoutes({
    path: '/health',
    methods: [HttpMethod.GET],
    integration: new HttpLambdaIntegration('Health', apiHandler),
  });
  app.synth();
} finally {
  rmSync(asset, { recursive: true, force: true });
}
