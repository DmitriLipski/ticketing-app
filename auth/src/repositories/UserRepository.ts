import { Service } from 'typedi';
import { User, UserModelService } from '../models';
import { BadRequestError } from '../services/common/errors';
import { UserView, UserViewType } from '../views';

@Service()
class UserRepository {
	userModel;

	constructor(
		private readonly userModelService: UserModelService,
		private readonly userView: UserView,
	) {
		this.userModel = this.userModelService.getUserModel();
	}

	async getAllUsers(): Promise<UserViewType[] | Error> {
		try {
			const users = await this.userModel.find();
			return users.map(user => this.userView.getUserView(user));
		} catch (error) {
			return new Error('Something went wrong');
		}
	}

	async addUser(attr: User): Promise<UserViewType> {
		const existingUser = await this.userModel.findOne({ email: attr.email });

		if (existingUser) {
			throw new BadRequestError('Email in use');
		}

		const user = this.userModel.build(attr);
		await user.save();
		return Promise.resolve(this.userView.getUserView(user));
	}
}

export { UserRepository };
