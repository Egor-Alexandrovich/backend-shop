// import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const getProductsList = async (event) => {
  return {
    statusCode: 200,
    body: {
      product: 'book',
      price: 123
    },
  }
};
