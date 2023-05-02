import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { mockDBRepository as productRepository }  from '../../../repository/mockDBRepository';

export const getProductsList = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  console.log('incoming requests', event);
  try {
    const productList = await productRepository.listAllProduct();
    const stocksList = await productRepository.listAllStocks();
    const resp = productList.map((product) => {
      const stocks = stocksList.find((stock) => stock.product_id === product.id );
      return { ...product, count: stocks.count }
    })
    console.log('incoming requests resp', resp);
    if(resp) {
      return {
        statusCode: 200,
        body: JSON.stringify(resp, null, 2),
      };
    }
    return {
      statusCode: 400,
      body: JSON.stringify(resp,  null, 2),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify(error,  null, 2),
    };
  }
};


