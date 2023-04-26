import { APIGatewaySimpleAuthorizerResult, APIGatewayRequestAuthorizerEventV2 } from "aws-lambda";

export const basicAuthorizer = async (event:APIGatewayRequestAuthorizerEventV2): Promise<APIGatewaySimpleAuthorizerResult> => {
  const { headers } = event;
  const response = {
    isAuthorized: headers.Authorization === process.env.Egor_Alexandrovich
  }
  return response
};


