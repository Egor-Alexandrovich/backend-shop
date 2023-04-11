import { S3Event } from "aws-lambda";
import { S3Client, CopyObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { REGION, BUCKET, PREFIX_PARSED, PREFIX_UPLOADED } from "src/const";
import { Readable } from "node:stream";
import csv from 'csv-parser';



export const importFileParser = async (event: S3Event) => {
  const client = new S3Client({ region: REGION });
  const results = [];
  const key = event.Records[0].s3.object.key

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  });

  const stream = (await client.send(command)).Body as Readable;

  stream.pipe(csv()).on('data', (data) => {
    console.log('Chunk', data);
    results.push(data);
  }
  );
  await client.send(new CopyObjectCommand(
    {
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${key}`,
      Key: key.replace(PREFIX_UPLOADED, PREFIX_PARSED),
    }
  ));

  await client.send(new DeleteObjectCommand(
    {
      Bucket: BUCKET,
      Key: key,
    }
  ));

  return {
    statusCode: 202
  };
};


