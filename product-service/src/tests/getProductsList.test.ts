import { getProductsList }  from '../functions/getProductsList/handler';
import { PRODUCTS } from '../const/products';
import { eventJSON }from '../event/event-data';

describe('Unit test for getProductsList handler', function () {
	it('verify happy path 200', async () => {
			const result = await getProductsList(eventJSON);
			expect(result.statusCode).toEqual(200);
			expect(JSON.parse(result.body)).toEqual(PRODUCTS);
	});

});