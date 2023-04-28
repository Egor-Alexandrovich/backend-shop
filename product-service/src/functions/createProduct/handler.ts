import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDBRepository as productRepository } from '../../../repository';

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('incoming requests', event);
  try {
    const body = JSON.parse(event.body);
    const { product, stocks } = await productRepository.createProduct(body);
    await productRepository.create(product, stocks);
    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully created post.",
        product: { ...product, count: stocks.count }
      }, null, 2),
    };

  } catch (error) {
    if (error.name && error.name === 'ValidationError') {
      return {
        statusCode: 400,
        body: JSON.stringify({
          message: error
        }, null, 2),
      };
    }
    return {
      statusCode: 500,
      body: JSON.stringify({
        message: "Failed to create post.",
        errorMsg: error.message,
        errorStack: error.stack,
      }, null, 2),
    };
  }
};