import 'reflect-metadata';
import http from 'http';
import chalk from 'chalk';
import app from './app';

const main = () => {
	if (!process.env.JWT_KEY) {
		throw new Error('JWT_KEY must be defined!');
	}

	const server = http.createServer(app);

	const port = process.env.PORT || 4001;

	server.listen(port, () => {
		console.log('');
		console.log(`${chalk.blue.bold('Version 0.0.1')}`);
		console.log('');
		console.log(
			`${chalk.yellow.bold('App')} is up ${chalk.green.bold(
				'successfully',
			)} on port ${chalk.blue.bold(port)}`,
		);
	});
};

main();
