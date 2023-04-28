import { handlerPath } from '@libs/handler-resolver';
import * as dotenv from 'dotenv';
dotenv.config();

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      http: {
        method: 'get',
        path: '/import',
        cors: true,
        authorizer: {
          type: 'token',
          arn: process.env.AUTHORIZATION_ARN,
          resultTtlInSeconds: 0,
        }
      },
    },
  ],
};
