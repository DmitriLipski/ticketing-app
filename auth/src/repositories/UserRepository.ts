import { Service } from 'typedi';
import { User, UserModelService } from '../models';
import { BadRequestError } from '../services/common/errors';

@Service()
class UserRepository {
	userModel;

	constructor(private readonly userModelService: UserModelService) {
		this.userModel = this.userModelService.getUserModel();
	}

	async getAllUsers(): Promise<User[] | Error> {
		try {
			return await this.userModel.find();
		} catch (error) {
			return new Error('Something went wrong');
		}
	}

	async addUser(attr: User): Promise<User> {
		const existingUser = await this.userModel.findOne({ email: attr.email });

		if (existingUser) {
			throw new BadRequestError('Email in use');
		}

		const user = this.userModel.build(attr);
		await user.save();
		return Promise.resolve(user);
	}
}

export { UserRepository };
