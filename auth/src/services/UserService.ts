import { Service } from 'typedi';
import { User, UserDoc } from '../models';
import { UserRepository } from '../repositories/UserRepository';
import { ValidationService } from './common/ValidationService';
import { BadRequestError, InvalidPropertyError } from './common/errors';
import { Password } from './Password';

export type UserCredentialsType = Pick<User, 'email' | 'password'>;

@Service()
class UserService {
	constructor(
		private readonly userRepository: UserRepository,
		private readonly validationService: ValidationService,
		private readonly passwordService: Password,
	) {}
	async getAllUsers(): Promise<UserDoc[] | Error> {
		return await this.userRepository.getAllUsers();
	}

	async addUser(user: User): Promise<UserDoc> {
		const validUser = this.validateNewUser(user);

		const { password } = validUser;

		const hashedPassword = await this.passwordService.toHash(password);

		return await this.userRepository.addUser({
			...validUser,
			password: hashedPassword,
		});
	}

	async signInUser(credentials: UserCredentialsType): Promise<UserDoc> {
		const validateUserCredentials = this.validateUserCredentials(credentials);
		const user = await this.userRepository.getUser(validateUserCredentials);

		const passwordsMatch = await this.passwordService.compare(
			user.password,
			validateUserCredentials.password,
		);

		if (!passwordsMatch) {
			throw new BadRequestError('Invalid credentials');
		}

		return Promise.resolve(user);
	}

	validateUserCredentials(
		credentials: UserCredentialsType,
	): UserCredentialsType {
		const {
			email = this.validationService.requiredParam('email'),
			password = this.validationService.requiredParam('password'),
		} = credentials;

		this.validateUserEmail(email as string);

		return {
			email,
			password,
		} as UserCredentialsType;
	}

	validateNewUser(userData: User): User {
		const {
			name = this.validationService.requiredParam('name'),
			email = this.validationService.requiredParam('email'),
			password = this.validationService.requiredParam('password'),
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
