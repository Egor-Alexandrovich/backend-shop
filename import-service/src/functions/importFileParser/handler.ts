import { S3Event } from "aws-lambda";
import { S3Client, CopyObjectCommand, GetObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { SQSClient, SendMessageCommand } from "@aws-sdk/client-sqs";
import { REGION, BUCKET, PREFIX_PARSED, PREFIX_UPLOADED } from "src/const";
import { Readable } from "node:stream";
import csv from 'csv-parser';

export const importFileParser = async (event: S3Event) => {
  const s3Client = new S3Client({ region: REGION });
  const sqsClient = new SQSClient({ region: REGION });

  const key = event.Records[0].s3.object.key

  const command = new GetObjectCommand({
    Bucket: BUCKET,
    Key: key
  });

  const stream = (await s3Client.send(command)).Body as Readable;

  stream.pipe(csv()).on('data', (data) => {
    sqsClient.send(
      new SendMessageCommand({
        QueueUrl: process.env.SQS_URL,
        MessageBody: JSON.stringify(data),
      })
    );
    console.log('Data send to Queue');
  }
  );
  await s3Client.send(new CopyObjectCommand(
    {
      Bucket: BUCKET,
      CopySource: `${BUCKET}/${key}`,
      Key: key.replace(PREFIX_UPLOADED, PREFIX_PARSED),
    }
  ));

  await s3Client.send(new DeleteObjectCommand(
    {
      Bucket: BUCKET,
      Key: key,
    }
  ));

  return {
    statusCode: 202
  };
};


