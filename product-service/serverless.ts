import type { AWS } from '@serverless/typescript';
import * as dotenv from 'dotenv';

import getProductsList from '@functions/getProductsList';
import getProductsById from '@functions/getProductsById';
import createProduct from '@functions/createProduct';

dotenv.config()

const serverlessConfiguration: AWS = {
  service: 'product-service',
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
              'dynamodb:Query',
              'dynamodb:Scan',
              'dynamodb:GetItem',
              'dynamodb:PutItem',
              'dynamodb:UpdateItem',
              'dynamodb:DeleteItem',
              "rds:*"
            ],
            Resource: [
              process.env.PRODUCT_TABLE_ARN,
              process.env.STOCKS_TABLE_ARN,
              process.env.RDS_DB_INSTANCE_ARN
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
    },
  },
  functions: { getProductsList, getProductsById, createProduct },
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
  resources:{
    Resources:
    {
      ProductDatabase: {
        Type: 'AWS::RDS::DBInstance',
        Properties: {
          AllocatedStorage: 5,
          DBInstanceClass: 'db.t3.micro',
          DBName: 'myapp',
          Engine: 'mysql',
          EngineVersion: '8.0.25',
          MasterUsername: process.env.RDS_DB_INSTANCE_MASTER_USER_NAME,
          MasterUserPassword: process.env.RDS_DB_INSTANCE_MASTER_USER_PASSWORD,
        }
      }
    }
  }
};

module.exports = serverlessConfiguration;
