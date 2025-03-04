const request = require('supertest');
const app = require('../server.js');
const jwt = require('jsonwebtoken');

// Mock the Item and User models, connectDB, and app.listen
jest.mock('../models/Item', () => ({
	create: jest.fn(),
	find: jest.fn(),
	countDocuments: jest.fn(),
}));
jest.mock('../models/User', () => ({
	findById: jest.fn(),
}));
jest.mock('../config/db', () => jest.fn());
app.listen = jest.fn(); // Prevent server from starting

const Item = require('../models/Item');
const User = require('../models/User');

beforeAll(() => {
	process.env.JWT_SECRET = 'test_secret';
});

describe('Item API', () => {
	let token;

	beforeEach(() => {
		Item.create.mockReset();
		Item.find.mockReset();
		Item.countDocuments.mockReset();
		User.findById.mockReset();

		const mockUser = { _id: '123', username: 'testuser' };
		jest.spyOn(jwt, 'verify').mockReturnValue({ id: '123' });
		User.findById.mockReturnValue({
			select: jest.fn().mockReturnValue(Promise.resolve(mockUser)),
		});
		token = 'fake-token';
	});

	describe('POST /api/v1/item', () => {
		it('should create item with valid token', async () => {
			const mockItem = {
				name: 'test item',
				description: 'test description',
				user: '123',
			};
			Item.create.mockResolvedValue(mockItem);

			const res = await request(app)
				.post('/api/v1/item')
				.set('Authorization', `Bearer ${token}`)
				.send({
					name: 'test item',
					description: 'test description',
				});

			expect(res.status).toBe(201);
			expect(res.body.status).toBe('success');
			expect(res.body.data).toEqual(mockItem);
		});

		it('should fail without token', async () => {
			const res = await request(app)
				.post('/api/v1/item')
				.send({
					name: 'test item',
					description: 'test description',
				});

			expect(res.status).toBe(401);
			expect(res.body.error).toBe('Unauthorized. No token provided.');
		});
	});

	describe('GET /api/v1/item', () => {
		it('should get items for authenticated user', async () => {
			const mockItems = [
				{ name: 'test item', description: 'test description', user: '123' },
			];
			Item.countDocuments.mockResolvedValue(1);
			Item.find.mockReturnValue({
				sort: jest.fn().mockReturnThis(),
				skip: jest.fn().mockReturnThis(),
				limit: jest.fn().mockResolvedValue(mockItems),
			});

			const res = await request(app)
				.get('/api/v1/item')
				.set('Authorization', `Bearer ${token}`);

			expect(res.status).toBe(200);
			expect(res.body.totalItems).toBe(1);
			expect(res.body.data).toEqual(mockItems);
			expect(res.body.results).toBe(1);
		});
	});
});