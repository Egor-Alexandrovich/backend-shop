import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsList`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products',
        responses: {
          200: {
            bodyType: 'ArrayProduct'
          }
        },
        authorizer: {
          name: 'basicAuthorizer',
        }
      },
    },
  ],
};
