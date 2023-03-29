import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const getProductsById = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  console.log('event', event)
  return {
    statusCode: 200,
    body: JSON.stringify(
      {
        message: "Go Serverless v3.0! getProductsById!",
        input: event,
      },
      null,
      2
    ),
  };
};