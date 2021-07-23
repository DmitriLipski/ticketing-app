import { Service } from 'typedi';
import { RequiredParameterError } from './errors';

@Service()
class ValidationService {
	isValidEmail(email: string): boolean {
		const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
		return valid.test(email);
	}

	requiredParam(param: string): void {
		throw new RequiredParameterError(param);
	}
}

export { ValidationService };
