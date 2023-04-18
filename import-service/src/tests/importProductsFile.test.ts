import { importProductsFile }  from '../functions/importProductsFile/handler';
import { eventJSON }from '../event/event-data';
import { ERROR_MESSAGE_INVALID_PATH } from '../const';

describe('Unit test for importProductsFile handler', function () {
	it('verify happy path 200', async () => {
			const result = await importProductsFile(eventJSON);
			const url = JSON.parse(result.body).url;
			expect(result.statusCode).toBe(200);
			expect(typeof  url).toBe('string');
			expect(url).toMatch(/https:/);
	});


	it('verify not invalid path 400', async () => {
		const queryStringParametersMock = [ 
			{
				name: 'some-wrong-path'
			},
			{
				wrongQueryParameter: 'test.csv'
			}
		]
		
		queryStringParametersMock.forEach(async (queryStringParameters) => {
			const MOCK_EVENT = { 
				...eventJSON, 
				queryStringParameters
			}
			const result = await importProductsFile(MOCK_EVENT);
			expect(result.statusCode).toBe(400);
			expect(JSON.parse(result.body).message).toBe(ERROR_MESSAGE_INVALID_PATH);
		})

	});
});