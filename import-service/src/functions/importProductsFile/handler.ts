import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { S3Client, PutObjectCommand } from "@aws-sdk/client-s3";
import { REGION, BUCKET, PREFIX_UPLOADED, ERROR_MESSAGE_INVALID_PATH } from "../../const";
import { APIGatewayProxyEvent } from "aws-lambda";

export const importProductsFile = async (event: APIGatewayProxyEvent) => {
  try {
    const name = event.queryStringParameters.name;

    if (name) {
      const fullPath = `${PREFIX_UPLOADED}${name}`;
      const client = new S3Client({ region: REGION });

      const command = new PutObjectCommand({
        Bucket: BUCKET,
        Key: fullPath,
        ContentType: 'text/csv'
      });
      const url = await getSignedUrl(client, command, { expiresIn: 60 });

      return {
        statusCode: 200,
        body: JSON.stringify({
          url
        }, null, 2),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: ERROR_MESSAGE_INVALID_PATH
      },  null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error, null, 2),
    };
  }
};


