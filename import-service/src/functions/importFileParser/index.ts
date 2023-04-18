import { handlerPath } from '@libs/handler-resolver';
import { BUCKET, PREFIX_UPLOADED } from 'src/const';

export default {
  handler: `${handlerPath(__dirname)}/handler.importFileParser`,
  events: [
    {
      s3: {
        bucket: BUCKET,
        event: 's3:ObjectCreated:*',
        rules: [
          {
            prefix: PREFIX_UPLOADED
          }
        ],
        existing: true,
      },
    },
  ],
};
