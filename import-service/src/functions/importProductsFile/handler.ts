import * as AWS from "@aws-sdk/client-s3";
import { REGION, BUCKET, PREFIX_UPLOADED } from "src/const";

const client = new AWS.S3({ region: REGION });

export const importProductsFile = async (event) => {
  const resp = await client.listObjectsV2({
    Bucket:BUCKET,
    Prefix: PREFIX_UPLOADED,
  })
  console.log('EveTTTTTTTTTT', event);
  return {
    statusCode: 200,
    body: JSON.stringify(resp, null, 2),
  };
};


