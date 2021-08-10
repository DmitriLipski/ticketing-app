import request from 'supertest';
import { app } from '../app';

export const signIn = async (): Promise<string[]> => {
	const email = 'test@test.com';
	const password = 'password';
	const name = 'Bob';

	const response = await request(app)
		.post('/api/users/sign-up')
		.send({
			name,
			email,
			password,
		})
		.expect(201);

	const cookie = response.get('Set-Cookie');

	return cookie;
};
