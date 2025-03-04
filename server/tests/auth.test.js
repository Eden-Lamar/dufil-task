const request = require('supertest');
const app = require('../server.js');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Mock the User model, connectDB, and app.listen
jest.mock('../models/User', () => ({
	findOne: jest.fn(),
	create: jest.fn(),
}));
jest.mock('../config/db', () => jest.fn());
app.listen = jest.fn(); // Prevent server from starting

const User = require('../models/User');

beforeAll(() => {
	process.env.JWT_SECRET = 'test_secret';
});

describe('Auth API', () => {
	beforeEach(() => {
		User.findOne.mockReset();
		User.create.mockReset();
	});

	describe('POST /api/v1/user/register', () => {
		it('should register a new user successfully', async () => {
			User.findOne.mockResolvedValue(null);
			User.create.mockResolvedValue({
				_id: '123',
				username: 'testuser',
				email: 'test@example.com',
				password: 'hashed',
				_doc: { username: 'testuser', email: 'test@example.com' },
			});
			jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashed');

			const res = await request(app)
				.post('/api/v1/user/register')
				.send({
					username: 'testuser',
					email: 'test@example.com',
					password: 'Test1234',
				});

			expect(res.status).toBe(201);
			expect(res.body.status).toBe('success');
			expect(res.body.data).toHaveProperty('username', 'testuser');
			expect(res.body.data).toHaveProperty('email', 'test@example.com');
		});

		it('should fail if user already exists', async () => {
			User.findOne.mockResolvedValue({ email: 'test@example.com' });

			const res = await request(app)
				.post('/api/v1/user/register')
				.send({
					username: 'testuser',
					email: 'test@example.com',
					password: 'Test1234',
				});

			expect(res.status).toBe(400);
			expect(res.body.message).toBe('User already exists');
		});
	});

	describe('POST /api/v1/user/login', () => {
		it('should login user successfully', async () => {
			User.findOne.mockResolvedValue({
				_id: '123',
				username: 'testuser',
				email: 'test@example.com',
				password: 'hashed',
			});
			jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
			jest.spyOn(jwt, 'sign').mockReturnValue('fake-token');

			const res = await request(app)
				.post('/api/v1/user/login')
				.send({
					email: 'test@example.com',
					password: 'Test1234',
				});

			expect(res.status).toBe(200);
			expect(res.body.status).toBe('success');
			expect(res.headers.authorization).toBe('Bearer fake-token');
		});

		it('should fail with wrong credentials', async () => {
			User.findOne.mockResolvedValue(null);

			const res = await request(app)
				.post('/api/v1/user/login')
				.send({
					email: 'test@example.com',
					password: 'WrongPass',
				});

			expect(res.status).toBe(401);
			expect(res.body.status).toBe('fail');
			expect(res.body.error).toBe("Account doesn't exist");
		});
	});
});