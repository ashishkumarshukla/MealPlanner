import { App, Stack } from 'aws-cdk-lib';
import { Code, Function as LambdaFunction, Runtime } from 'aws-cdk-lib/aws-lambda';
import { HttpApi, HttpMethod } from 'aws-cdk-lib/aws-apigatewayv2';
import { HttpLambdaIntegration } from 'aws-cdk-lib/aws-apigatewayv2-integrations';
import { fileURLToPath } from 'node:url';

const app = new App();
const stack = new Stack(app, 'MealsPlannedPilot');
const apiHandler = new LambdaFunction(stack, 'ApiHandler', {
  runtime: Runtime.NODEJS_22_X,
  handler: 'dist/index.handler',
  code: Code.fromAsset(fileURLToPath(new URL('../../apps/api/', import.meta.url)), {
    exclude: ['node_modules', 'test', 'src', 'tsconfig.json'],
  }),
});
const api = new HttpApi(stack, 'HttpApi');
api.addRoutes({
  path: '/health',
  methods: [HttpMethod.GET],
  integration: new HttpLambdaIntegration('Health', apiHandler),
});
app.synth();
