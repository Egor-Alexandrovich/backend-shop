import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Product, PRODUCTS_URL } from "src/const";
import fetch from 'node-fetch';

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const response = await fetch(PRODUCTS_URL);
    const data: Product[]  = await response.json() as Product[];
    
    const id = event?.pathParameters?.productId
    const resp = data.filter((product: Product) => product.id === id);
    return {
      statusCode: 200,
      body: JSON.stringify(resp),
    };
  } catch (error) {
    return {
      statusCode: 200,
      body: JSON.stringify(error),
    };
  }
};


