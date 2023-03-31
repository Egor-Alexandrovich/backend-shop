import { APIGatewayProxyResult } from "aws-lambda";
import { PRODUCTS } from "../../const";

export const getProductsList = async (): Promise<APIGatewayProxyResult> => {
  return {
    statusCode: 200,
    body: JSON.stringify(PRODUCTS),
  };
};


