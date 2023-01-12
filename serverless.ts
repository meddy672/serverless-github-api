import type { AWS } from '@serverless/typescript';

import pullrequest from '@functions/pulls';

const serverlessConfiguration: AWS = {
  service: 'serverless-github-api',
  org: 'meddy672',
  frameworkVersion: '2',
  plugins: [
    'serverless-esbuild',
    'serverless-api-gateway-throttling',
    'serverless-iam-roles-per-function',
    'serverless-plugin-tracing'
  ],
  useDotenv: true,
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    tracing: {
      lambda: true,
      apiGateway: true,
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
      metrics: true
    },
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["xray:PutTraceSegments", "xray:PutTelemetryRecords"],
        Resource: "*"
      }
    ],
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: { pullrequest },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: true,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    apiGatewayThrottling: {  	
      maxRequestsPerSecond: 1000,
      maxConcurrentRequests: 500
    }
  },
};

module.exports = serverlessConfiguration;
