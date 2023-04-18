import { handlerPath } from '@libs/handler-resolver';

export default {
  handler: `${handlerPath(__dirname)}/handler.importProductsFile`,
  events: [
    {
      httpApi: {
        method: 'get',
        path: '/import',
        // responses: {
        //   200: {
        //     bodyType: 'ArrayProduct'
        //   }
        // }
      },
    },
  ],
};
