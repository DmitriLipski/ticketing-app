import mongoose from 'mongoose';
import chalk from 'chalk';

mongoose
	.connect(process.env.MONGODB_URL ?? 'mongodb://127.0.0.1:27017/auth', {
		useNewUrlParser: true,
		useCreateIndex: true,
		useFindAndModify: false,
		useUnifiedTopology: true,
	})
	.then(data =>
		console.log(
			`Connection ${chalk.green.bold(
				'successfully',
			)} established to database '${chalk.yellow.bold(
				data.connections[0].name,
			)}' on port ${chalk.blue.bold(data.connections[0].port)}`,
		),
	)
	.catch(error => {
		console.log(chalk.red.bold('Mongoose connection error:'));
		console.log(error);
	});
