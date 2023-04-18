import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';
import catalogBatchProcess from '@functions/catalogBatchProcess';

dotenv.config()

const serverlessConfiguration: AWS = {
  service: 'product-service',
  frameworkVersion: '3',
  plugins: ['serverless-auto-swagger', 'serverless-esbuild', 'serverless-offline'],
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
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
            ],
            Resource: [
              process.env.PRODUCT_TABLE_ARN,
              process.env.STOCKS_TABLE_ARN,
            ]
          },
          {
            Effect: 'Allow',
            Action: [
              'sns:*',
            ],
            Resource: [
              { Ref: 'SNSTopic' }
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
      PRODUCT_TABLE_NAME: process.env.PRODUCT_TABLE_NAME,
      STOCKS_TABLE_NAME: process.env.STOCKS_TABLE_NAME,
      SQS_ARN: {
        "Fn::GetAtt" : [
          "SQSQueue", 
          "Arn"
        ]
      },
      SQS_URL: { Ref: 'SQSQueue' },
      SNS_ARN: { Ref: 'SNSTopic' }

    },
  },
  functions: { getProductsList, getProductsById, createProduct, catalogBatchProcess },
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
  resources: {
    Resources: {
      SQSQueue: {
        Type: 'AWS::SQS::Queue',
        Properties: {
          QueueName: process.env.QUEUE_NAME
        }
      },
      SNSTopic: {
        Type: 'AWS::SNS::Topic',
        Properties: {
          TopicName: process.env.TOPIC_NAME
        }
      },
      SNSSubscription: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.EMAIL_FIRST,
          Protocol: 'email',
          TopicArn: {
            Ref: "SNSTopic"
          },
          FilterPolicy: {
            "price": [{"numeric": ["<", 50]}]
          }
        }
      },
      SNSSubscriptionSecond: {
        Type: "AWS::SNS::Subscription",
        Properties: {
          Endpoint: process.env.EMAIL_SECOND,
          Protocol: 'email',
          TopicArn: {
            Ref: "SNSTopic"
          },
          FilterPolicy: {
            "price": [{"numeric": [">=", 50]}]
          }
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
