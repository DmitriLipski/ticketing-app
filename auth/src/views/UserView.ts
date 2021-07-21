import { Service } from 'typedi';
import { UserDoc } from '../models';
import { Identifier } from '../types';

export type UserViewType = {
	id: Identifier;
	name: string;
	email: string;
};

@Service()
class UserView {
	getUserView(user: UserDoc): UserViewType {
		return {
			id: user._id,
			name: user.name,
			email: user.email,
		};
	}
}

export { UserView };
