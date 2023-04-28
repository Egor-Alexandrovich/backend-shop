import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import importProductsFile from '@functions/importProductsFile';
import importFileParser from '@functions/importFileParser';
dotenv.config()

const serverlessConfiguration: AWS = {
  service: 'import-service',
  frameworkVersion: '3',
  plugins: ['serverless-esbuild', 'serverless-offline'],
  provider: {
    name: 'aws',
    runtime: 'nodejs14.x',
    region: 'us-east-1',
    profile: 'sandx',
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
          },
          {
            Effect: 'Allow',
            Action: [
              'sqs:*',
            ],
            Resource: [
              process.env.SQS_ARN,
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
      SQS_URL: process.env.SQS_URL,
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
  },
  resources: {
    Resources: {
      GatewayResponseAccessDenied: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: "ACCESS_DENIED",
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
          StatusCode: "403"
        }
      },
      GatewayResponseUnauthorized: {
        Type: "AWS::ApiGateway::GatewayResponse",
        Properties: {
          ResponseParameters: {
            "gatewayresponse.header.Access-Control-Allow-Origin": "'*'",
            "gatewayresponse.header.Access-Control-Allow-Headers": "'*'"
          },
          ResponseType: "UNAUTHORIZED",
          RestApiId: {
            Ref: "ApiGatewayRestApi"
          },
          StatusCode: "401"
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
