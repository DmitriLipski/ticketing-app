import mongoose, { Schema } from 'mongoose';
// import { Password } from '../services';
import { Service } from 'typedi';

// An interface that describes the properties
// that are requried to create a new User
interface UserAttrs {
	name: string;
	email: string;
	password: string;
}

// An interface that describes the properties
// that a User Model has
export interface UserModelType extends mongoose.Model<UserDoc> {
	build(attrs: UserAttrs): UserDoc;
}

// An interface that describes the properties
// that a User Document has
export interface User {
	name: string;
	email: string;
	password: string;
}

export type UserDoc = User & mongoose.Document;

@Service()
export class UserModelService {
	userSchema: Schema;
	userModel;

	constructor() {
		this.userSchema = new mongoose.Schema({
			name: {
				type: String,
				required: true,
			},
			email: {
				type: String,
				required: true,
			},
			password: {
				type: String,
				required: true,
			},
		});

		this.userSchema.statics.build = (attrs: UserAttrs) => {
			return new this.userModel(attrs);
		};

		this.userModel = mongoose.model<UserDoc, UserModelType>(
			'User',
			this.userSchema,
		);
	}

	// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
	getUserModel() {
		return this.userModel;
	}
}
