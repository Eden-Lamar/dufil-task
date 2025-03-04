const jwt = require('jsonwebtoken');
const { generateToken } = require('../utils/helpFunction');
const { registerValidation, loginValidation } = require('../utils/validate');

// Set JWT_SECRET for tests
beforeAll(() => {
	process.env.JWT_SECRET = 'test_secret';
});

describe('Helper Functions', () => {
	describe('generateToken', () => {
		it('should generate a valid JWT token', () => {
			process.env.JWT_SECRET = 'test_secret'; // Set for testing
			const id = '123456789';
			const token = generateToken(id);
			const decoded = jwt.verify(token, 'test_secret');

			expect(decoded.id).toBe(id);
			expect(decoded).toHaveProperty('iat');
			expect(decoded).toHaveProperty('exp');
		});
	});

	describe('Validation Functions', () => {
		describe('registerValidation', () => {
			it('should pass with valid data', () => {
				const { error } = registerValidation({
					username: 'testuser',
					email: 'test@example.com',
					password: 'Test1234',
				});
				expect(error).toBeUndefined();
			});

			it('should fail with invalid password', () => {
				const { error } = registerValidation({
					username: 'testuser',
					email: 'test@example.com',
					password: 'test',
				});
				expect(error).toBeDefined();
			});
		});

		describe('loginValidation', () => {
			it('should pass with valid data', () => {
				const { error } = loginValidation({
					email: 'test@example.com',
					password: 'Test1234',
				});
				expect(error).toBeUndefined();
			});

			it('should fail with invalid email', () => {
				const { error } = loginValidation({
					email: 'invalid',
					password: 'Test1234',
				});
				expect(error).toBeDefined();
			});
		});
	});
});