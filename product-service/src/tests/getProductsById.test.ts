import { getProductsById }  from '../functions/getProductsById/handler';
import { eventJSON }from '../event/event-data';
import { PRODUCTS } from '../const/products';

describe('Unit test for getProductsById handler', function () {
	it('verify happy path 200', async () => {
			const MOCK_EVENT = { 
				...eventJSON, 
				pathParameters:{
					productId: PRODUCTS[0].id
				}
			}
			const result = await getProductsById(MOCK_EVENT);
			expect(result.statusCode).toEqual(200);
			expect(JSON.parse(result.body)).toEqual(PRODUCTS[0]);
	});


	it('verify not found path 404', async () => {
		const MOCK_EVENT = { 
			...eventJSON, 
			pathParameters:{
				productId: null
			}
		}
			const result = await getProductsById(MOCK_EVENT);
			expect(result.statusCode).toEqual(404);
	});
});