import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.getProductsById`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/products/{productId}',
      },
    },
  ],
};
