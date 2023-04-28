import { APIGatewayAuthorizerResult, APIGatewayTokenAuthorizerEvent } from "aws-lambda";

export const basicAuthorizer = async (event:APIGatewayTokenAuthorizerEvent): Promise<APIGatewayAuthorizerResult> => {
  console.log('event', event);
  try {
    const  { authorizationToken, methodArn } = event
    const encodedCredentials = authorizationToken.replace('Basic ','');

    const buff = Buffer.from(encodedCredentials, 'base64');
    const plainCredentials = buff.toString('utf-8').split(':');
    const userName = plainCredentials[0];
    const password = plainCredentials[1];
    console.log('userName', userName);
    console.log('password', password);
    const effect = !process.env[userName] || process.env[userName] != password ? 'Deny' : 'Allow';
    console.log('effect', effect);

    return {
      principalId: authorizationToken,
      policyDocument: {
        Version: "2012-10-17",
        Statement: [
          {
            Action: "execute-api:Invoke",
            Effect: effect,
            Resource: [methodArn]
          }
        ]
      },
    }
  } catch (e) {
    console.log(e);
  }
};


