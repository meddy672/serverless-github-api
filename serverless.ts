import type { AWS } from '@serverless/typescript';

import pullrequest from '@functions/pulls';

const serverlessConfiguration: AWS = {
  service: 'serverless-github-api',
  org: 'meddy672',
  frameworkVersion: '3',
  plugins: [
    'serverless-esbuild',
    'serverless-api-gateway-throttling',
    'serverless-iam-roles-per-function',
    'serverless-aws-documentation',
    'serverless-plugin-aws-alerts',
    'serverless-api-gateway-caching',
    'serverless-export-env'
  ],
  // useDotenv: true,
  provider: {
    name: 'aws',
    stage: '${opt:stage, "dev"}',
    logs: {
      restApi: true
    },
    runtime: 'nodejs14.x',
    tracing: {
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
      API_URL: {
        'Fn::Sub': 'https://${ApiGatewayRestApi}.execute-api.${AWS::Region}.amazonaws.com/${sls:stage}/github/pullrequest'
      }
    },
    lambdaHashingVersion: '20201221',
  },
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
    apiGatewayCaching: {
      enabled: true
    },
    apiGatewayThrottling: {  	
      maxRequestsPerSecond: 1000,
      maxConcurrentRequests: 500
    },
    exportEnv: {
      overwrite: true
    },
    outPuts: {
      RestaurantsTable: {
        Value: '!Ref RestaurantsTable'
      }
    },
    alerts: {
      stages: ['dev', 'production'],
      topics: {
        alarm: {
          topic: '${self:service}-${sls:stage}-alerts-alarm',
          notifications: [
            {
              protocol: 'email',
              endpoint: 'example@email.com'
            }
          ]
        }
      },
      alarms: ['functionErrors', 'functionThrottles']
    }
  },
};

module.exports = serverlessConfiguration;
