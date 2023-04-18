import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
dotenv.config()

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger','serverless-esbuild','serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    profile: 'sandx',
    httpApi: {
      cors: true
    },  
    iam: {
      role: {
        statements: [
          {
            Effect: 'Allow',
            Action: [
              's3:ListBucket',
            ],
            Resource: [
              "arn:aws:s3:::bucket-import-service"
            ]
          },
          {
            Effect: 'Allow',
            Action: [
              's3:*',
            ],
            Resource: [
              process.env.S3_BUCKET_ARN_ARN,
            ]
          }
        ]
      }
    },
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      NODE_OPTIONS: '--enable-source-maps --stack-trace-limit=1000',
    },
  },
  functions: { importProductsFile, importFileParser },
  package: { individually: true },
  custom: {
    esbuild: {
      bundle: true,
      minify: false,
      sourcemap: true,
      exclude: ['aws-sdk'],
      target: 'node14',
      define: { 'require.resolve': undefined },
      platform: 'node',
      concurrency: 10,
    },
    autoswagger: {
      title: 'My Shop Api Swagger',
      apiType: 'httpApi',
      typefiles: ['./src/types/product.d.ts'],
      generateSwaggerOnDeploy: true,
      schemes: ['https'],
    }
  },
};

module.exports = serverlessConfiguration;
