import { Service } from 'typedi';
import { User, UserDoc, UserModelService } from '../models';
import { BadRequestError } from '../services/common/errors';
import { UserCredentialsType } from '../services';

@Service()
class UserRepository {
	userModel;

	constructor(private readonly userModelService: UserModelService) {
		this.userModel = this.userModelService.getUserModel();
	}

	async getAllUsers(): Promise<UserDoc[] | Error> {
		try {
			return await this.userModel.find();
		} catch (error) {
			return new Error('Something went wrong');
		}
	}

	async addUser(attr: User): Promise<UserDoc> {
		const existingUser = await this.userModel.findOne({ email: attr.email });

		if (existingUser) {
			throw new BadRequestError('Email in use');
		}

		const user = this.userModel.build(attr);
		await user.save();
		return user;
	}

	async getUser(attr: UserCredentialsType): Promise<UserDoc> {
		const existingUser = await this.userModel.findOne({ email: attr.email });

		if (!existingUser) {
			throw new BadRequestError('Invalid credentials');
		}

		return existingUser;
	}
}

export { UserRepository };
