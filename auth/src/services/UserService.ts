import { Service } from 'typedi';
import { User } from '../models';
import { UserRepository } from '../repositories/UserRepository';
import { ValidationService } from './common/ValidationService';
import { InvalidPropertyError } from './common/errors';
import { ErrorService } from './common/ErrorService';

@Service()
class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly validationService: ValidationService,
		private readonly errorService: ErrorService,
	) {}
	async getAllUsers(): Promise<User[] | Error> {
		return await this.userRepository.getAllUsers();
	}

	async addUser(user: User): Promise<User> {
		const validUser = this.validateUser(user);

		return await this.userRepository.addUser(validUser);
	}

	validateUser(userData: User): User {
		const {
			name = this.errorService.requiredParam('name'),
			email = this.errorService.requiredParam('email'),
			password = this.errorService.requiredParam('password'),
		} = userData;

		this.validateUserEmail(email as string);
		this.validateUserPassword(password as string);

		return {
			name,
			email,
			password,
		} as User;
	}

	validateUserEmail(email: string): void {
		if (!this.validationService.isValidEmail(email)) {
			throw new InvalidPropertyError('Invalid contact email address.');
		}
	}

	validateUserPassword(name: string): void {
		if (name.length < 6) {
			throw new InvalidPropertyError(
				`A password must be at least 6 characters long.`,
			);
		}
	}
}

export { UserService };
