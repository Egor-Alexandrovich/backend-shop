const { DynamoDB } = require("@aws-sdk/client-dynamodb");
const { marshall } = require("@aws-sdk/util-dynamodb");
const dotenv = require("dotenv");
dotenv.config()

const PRODUCTS = [
	{
		description: "Short Product Description1",
		id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
		price: 24,
		title: "ProductOne",
	},
	{
		description: "Short Product Description7",
		id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
		price: 15,
		title: "ProductTitle",
	},
	{
		description: "Short Product Description2",
		id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
		price: 23,
		title: "Product",
	},
	{
		description: "Short Product Description4",
		id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
		price: 15,
		title: "ProductTest",
	},
	{
		description: "Short Product Descriptio1",
		id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
		price: 23,
		title: "Product2",
	},
	{
		description: "Short Product Description7",
		id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
		price: 15,
		title: "ProductName",
	},
];

const STOCKS = [
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80aa",
		count : 24,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80a1",
		count : 15,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73c48a80a3",
		count : 23,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9345-fc73348a80a1",
		count : 12,
	},
	{
		product_id: "7567ec4b-b10c-48c5-9445-fc73c48a80a2",
		count : 21,
	},
	{
		product_id: "7567ec4b-b10c-45c5-9345-fc73c48a80a1",
		count : 12,
	},
];


const client = new DynamoDB({ region: "us-east-1" });
console.log('Start');
const putItemTable = async (product, tableName) => {
	return client.putItem({
		TableName: tableName,
		Item: marshall(product), 
	});
}


const fillTable = async (products, tableName)=>{
	console.log('Start', tableName);
	const arrayPromise = products.map((product) => {
		putItemTable(product,tableName);
	});
	await Promise.all(arrayPromise);
	console.log('End', tableName)
}

fillTable(PRODUCTS, process.env.PRODUCT_TABLE_NAME);
fillTable(STOCKS, process.env.STOCKS_TABLE_NAME);