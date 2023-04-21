import { catalogBatchProcess }  from '../functions/catalogBatchProcess/handler';
// import { SQSEvent } from "aws-lambda";
import { SNSClient, PublishCommand } from "@aws-sdk/client-sns";
import { REGION } from "../const";
import { eventSQS }from '../event/event-sqs';
import { DynamoDBClient, TransactWriteItemsCommand } from "@aws-sdk/client-dynamodb";
import * as dotenv from 'dotenv';
dotenv.config()

jest.mock('@aws-sdk/client-sns');
jest.mock('@aws-sdk/client-dynamodb');

describe('Unit test for catalogBatchProcess handler', function () {
	it('verify happy path 200', async () => {
		const MOCK_EVENT = { 
			...eventSQS, 
			Records: eventSQS.Records.map((elem) => {
				return {
					...elem,
					body: JSON.stringify({
						description: "Short Product Description7",
						price: 15,
						title: "ProductName",
						count: 23,
					})
				}
			})
		}
		await catalogBatchProcess(MOCK_EVENT);
		expect(DynamoDBClient).toHaveBeenCalled();
		expect(TransactWriteItemsCommand).toHaveBeenCalledTimes(2);
		expect(SNSClient).toHaveBeenCalledWith({ region: REGION });
		expect(PublishCommand).toHaveBeenCalled();
		
	});

	it('verify validation error 400', async () => {
		const MOCK_EVENT = { 
			...eventSQS, 
			Records: eventSQS.Records.map((elem) => {
				return {
					...elem,
					body: JSON.stringify({
						description: "Short Product Description7",
						price: 15,
						title: "ProductName",
					})
				}
			})
		}
		const result = await catalogBatchProcess(MOCK_EVENT);
			expect(result.statusCode).toEqual(400);
	});

	it('verify server error 500', async () => {
		const result = await catalogBatchProcess({} as any);
		console.log('result,', result );
			expect(result.statusCode).toEqual(500);
	});

});