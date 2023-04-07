import * as AWS from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { IProductService, Product, Stocks, CreateProduct } from '../types';
import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";

const client = new AWS.DynamoDB({ region: "us-east-1" });

class DynamoDB implements IProductService {
	constructor() { }
	async listAllProduct(): Promise<Product[]> {
		const { Items } = await client.scan({ TableName: process.env.PRODUCT_TABLE_NAME })
		const resp = Items?.map((item) => unmarshall(item));
		return resp as Product[];
	}
	async listAllStocks(): Promise<Stocks[]> {
		const { Items } = await client.scan({ TableName: process.env.STOCKS_TABLE_NAME })
		const resp = Items?.map((item) => unmarshall(item));
		return resp as Stocks[];
	}
	async getById(id: string): Promise<Product | boolean> {
		const { Item } = await client.getItem({
			TableName: process.env.PRODUCT_TABLE_NAME,
			Key: marshall({ id })
		});
		const resp = (Item) ? unmarshall(Item) as Product : false;
		return resp;
	}

	async create(product: Product, stock: Stocks): Promise<any> {
		return client.transactWriteItems({
			TransactItems: [
				{Put: {TableName: process.env.PRODUCT_TABLE_NAME, Item: marshall(product)}},
				{Put: {TableName: process.env.STOCKS_TABLE_NAME, Item: marshall(stock)}}
			]
		})
	}
	
	// async createProduct(product: Product): Promise<PutItemCommandOutput> {
	// 	const params = {
	// 		TableName: process.env.PRODUCT_TABLE_NAME,
	// 		Item: marshall(product),
	// 	};

	// 	return await client.putItem(params);
	// }
	// async createStocks(stocks: Stocks): Promise<PutItemCommandOutput> {
	// 	const params = {
	// 		TableName: process.env.STOCKS_TABLE_NAME,
	// 		Item: marshall(stocks),
	// 	};

	// 	return await client.putItem(params);
	// }
	async delete() {
		return Promise.resolve()
	}
	async update() {
		return Promise.resolve()
	}
	async remove() {
		return Promise.resolve()
	}
}
export const dynamoDBRepository = new DynamoDB();