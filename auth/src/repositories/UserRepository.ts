import { Service } from 'typedi';
import { User, UserModelService } from '../models';

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
		const user = this.userModel.build(attr);
		await user.save();
		return Promise.resolve(user);
	}
}

export { UserRepository };
