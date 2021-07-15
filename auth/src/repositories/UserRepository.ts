import { Service } from 'typedi';
import { User } from '../models/User';

@Service()
class UserRepository {
	private users: User[] = [
		{
			id: 'bfccd1b38422094d',
			name: 'Bob',
			email: 'bob@mail.com',
			password: '123456',
		},
		{
			id: 'bfccd1b38422094f',
			name: 'Rob',
			email: 'rob@mail.com',
			password: '123456',
		},
		{
			id: 'bfccd1b38422094k',
			name: 'Sam',
			email: 'sam@mail.com',
			password: '123456',
		},
	];

	async getAllUsers(): Promise<User[]> {
		return Promise.resolve(this.users);
	}

	async addUser(user: User): Promise<User> {
		this.users.push(user);
		return Promise.resolve(user);
	}
}

export { UserRepository };
