import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { REGION } from "../../const";
import { dynamoDBRepository as productRepository } from '../../../repository';

export const catalogBatchProcess = async (event: SQSEvent) => {
	try {
		const message = event.Records.map(({ body }) => JSON.parse(body));
		console.log('message', message)
		const productAndStocks = await Promise.all(message.map((body) => productRepository.createProduct(body)));
		console.log('productAndStocks', productAndStocks)

		await Promise.all(productAndStocks.map(({ product, stocks }) => productRepository.create(product, stocks)));

		console.log('productAndStocks created')
		const  snsClient = new SNSClient({ region: REGION });

		const NOTIFICATION = message.map((product) => `Product ${product.title} was created`).join(' ')

		const input = { // PublishInput
			TopicArn: process.env.SNS_ARN,
			Message: NOTIFICATION,
			Subject: "NEW Product for creating",
		};
		const command = new PublishCommand(input);
		const response = await snsClient.send(command);
		console.log('response from sns',response);

		console.log('Message from queue', message);
	} catch (error) {
		console.log('Error catalogBatchProcess', error);
	}
};