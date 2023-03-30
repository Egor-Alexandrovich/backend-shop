import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { PRODUCTS } from "src/const";

export const getProductsList = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(PRODUCTS),
  };
};


