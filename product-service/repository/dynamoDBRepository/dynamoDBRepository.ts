import * as AWS from "@aws-sdk/client-dynamodb";
import { marshall, unmarshall } from "@aws-sdk/util-dynamodb";
import { IProductService, Product, Stocks, CreateProductSchema, CreateProduct } from '../types';
import { v4 } from 'uuid';


const client = new AWS.DynamoDB({ region: "us-east-1" });

class DynamoDB implements Partial<IProductService> {
	constructor() { }
	async createProduct(body: CreateProduct ): Promise<any> {
		const id: string = v4();
		console.log('body', body);
		const normalizedBody = CreateProductSchema.cast(body);
		console.log('normalizedBody', normalizedBody);
    const createProduct = await CreateProductSchema.validate(normalizedBody,{ strict: true });
    const { count, ...rest } = createProduct;
    const product: Product = { ...rest, id };
    const stocks = {
      product_id: id,
      count
    }
		return {
			product,
			stocks
		}
	}
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