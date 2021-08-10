import request from 'supertest';
import { app } from '../../../app';
import { signIn } from '../../../test/utils';

it('responds with details about the current user', async () => {
	const cookie = await signIn();

	const response = await request(app)
		.get('/api/users/current-user')
		.set('Cookie', cookie)
		.send()
		.expect(200);

	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	expect(response.body.currentUser.email).toEqual('test@test.com');
});

it('responds with 401 if not authenticated', async () => {
	await request(app).get('/api/users/current-user').send().expect(401);
});
