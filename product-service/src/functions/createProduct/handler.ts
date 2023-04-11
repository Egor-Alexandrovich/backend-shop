import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDBRepository as productRepository } from '../../../repository';
import { CreateProductSchema, Product } from '../../../repository/types';
import { v4 } from 'uuid';

export const createProduct = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('incoming requests', event);
  try {
    const id: string = v4();
    const body = JSON.parse(event.body);
    const createProduct = await CreateProductSchema.validate(body,{ strict: true });
    const { count, ...rest } = createProduct;
    const product: Product = { ...rest, id };
    const stocks = {
      product_id: id,
      count
    }
    await productRepository.create(product, stocks);

    return {
      statusCode: 200,
      body: JSON.stringify({
        message: "Successfully created post.",
        product: { ...createProduct, id }
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
      },  null, 2),
    };
  }
};