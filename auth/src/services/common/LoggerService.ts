import { Service } from 'typedi';
import chalk from 'chalk';

@Service()
class LoggerService {
	logToConsole(errorMessage: string, errorPrefix = 'Error: '): void {
		console.log(
			`${chalk.red.bold(errorPrefix)} ${chalk.blue.bold(errorMessage)}`,
		);
	}
}

export { LoggerService };
