import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

declare global {
	// eslint-disable-next-line @typescript-eslint/no-namespace
	namespace NodeJS {
		interface Global {
			signin(): Promise<string[]>;
		}
	}
}

let mongo: any;
beforeAll(async () => {
	process.env.JWT_KEY = 'adffa';
	process.env.MODE = 'test';
	mongo = await MongoMemoryServer.create();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	const mongoUri = mongo.getUri();

	await mongoose.connect(mongoUri, {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});
});

beforeEach(async () => {
	const collections = await mongoose.connection.db.collections();

	for (const collection of collections) {
		await collection.deleteMany({});
	}
});

afterAll(async () => {
	// eslint-disable-next-line @typescript-eslint/no-unsafe-member-access
	await mongo.stop();
	await mongoose.connection.close();
});
