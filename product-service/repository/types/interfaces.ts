import { PutItemCommandOutput } from "@aws-sdk/client-dynamodb";
import * as Yup from "yup";

export const ProductSchema = Yup.object({
  id: Yup.string().required(),
  title: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().positive().required().defined(),
});

export const StocksSchema = Yup.object({
  product_id: Yup.string().required(),
  count: Yup.number().integer().min(0).required().defined(),
});

export const AvailableProductSchema = ProductSchema.shape({
  count: Yup.number().integer().min(0).required().defined(),
});

export const CreateProductSchema = Yup.object({
  title: Yup.string().required(),
  description: Yup.string().required(),
  price: Yup.number().positive().required().defined(),
	count: Yup.number().integer().min(0).required().defined(),
});

export type Product = Yup.InferType<typeof ProductSchema>;
export type Stocks = Yup.InferType<typeof StocksSchema>;
export type AvailableProduct = Yup.InferType<typeof AvailableProductSchema>;
export type CreateProduct = Yup.InferType<typeof CreateProductSchema>;

export type ArrayProduct = Product[]

export interface IProductService {
	listAllProduct():  Promise<Product[]>;
	listAllStocks():  Promise<Stocks[]>;
	getById(id: string): Promise<Product | boolean>;
	// createProduct(product: Product): Promise<PutItemCommandOutput>;
	// createStocks(stocks: Stocks): Promise<PutItemCommandOutput>;
	create(product: Product, stock: Stocks): Promise<any>;
	delete(): Promise<any>;
	update(): Promise<any>;
	remove(): Promise<any>;
}
