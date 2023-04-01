import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { Product } from '../../types/product';
import { ERROR_MESSAGE, mockProducts } from "../../const";

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const response = await mockProducts;    
    const id = event.pathParameters.productId
    const resp = response.find((product: Product) => product.id === id);
    if(resp){
      return {
        statusCode: 200,
        body: JSON.stringify(resp),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: ERROR_MESSAGE
      }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error),
    };
  }
};


