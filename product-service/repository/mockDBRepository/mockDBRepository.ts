import { IProductService, Product, Stocks } from '../types';

const PRODUCTS: Product[] = [
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

const STOCKS: Stocks[] = [
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

// class MockDB implements IProductService {
	class MockDB {
	private products: Product[];
	private stocks: Stocks[]
	constructor() {
		this.products = PRODUCTS;
		this.stocks = STOCKS;
	}
	async listAllProduct(): Promise<Product[]> {
		return Promise.resolve(this.products);
	}
	async getById(id: string): Promise<Product | boolean>{
		const resp = this.products.find((product) => product.id === id);
		return Promise.resolve(resp ? resp : false);
	}
	listAllStocks(){
		return Promise.resolve(this.stocks);
	}
	create(){
		return Promise.resolve()
	}
	delete(){
		return Promise.resolve()
	}
	update(){
		return Promise.resolve()
	}
	remove(){
		return Promise.resolve()
	}
}

export const mockDBRepository = new MockDB();