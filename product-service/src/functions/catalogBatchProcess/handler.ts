import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { REGION } from "../../const";
import { dynamoDBRepository as productRepository } from '../../../repository';

export const catalogBatchProcess = async (event: SQSEvent) => {
	try {
		const message = event.Records.map(({ body }) => JSON.parse(body));

		const productAndStocks = await Promise.all(message.map((body) => productRepository.createProduct(body)));

		await Promise.all(productAndStocks.map(({ product, stocks }) => productRepository.create(product, stocks)));

		const snsClient = new SNSClient({ region: REGION });

		const response = await Promise.all(message.map((body) =>
			snsClient.send(
				new PublishCommand({
					TopicArn: process.env.SNS_ARN,
					Message: JSON.stringify(body),
					Subject: "NEW Product for creating",
					MessageAttributes: {
						price: {
							DataType: 'Number',
							StringValue: body.price,
						}
					}
				})
			)
		));
		
		console.log('response from sns', response);

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
        message: "Something went wrong",
        errorMsg: error.message,
        errorStack: error.stack,
      }, null, 2),
    };
	}
};