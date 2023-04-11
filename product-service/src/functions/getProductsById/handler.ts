import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { dynamoDBRepository as productRepository }  from '../../../repository';
import { ERROR_MESSAGE } from '../../../repository/const';

export const getProductsById = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('incoming requests', event);
  try { 
    const id = event.pathParameters.productId
    const resp = await productRepository.getById(id);
    if(resp){
      return {
        statusCode: 200,
        body: JSON.stringify(resp, null, 2),
      };
    }
    return {
      statusCode: 404,
      body: JSON.stringify({
        message: ERROR_MESSAGE
      },  null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error,  null, 2),
    };
  }
};


