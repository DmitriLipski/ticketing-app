import { Service } from 'typedi';

@Service()
class ValidationService {
	isValidEmail(email: string): boolean {
		const valid = new RegExp(/^[^@\s]+@[^@\s]+\.[^@\s]+$/);
		return valid.test(email);
	}
}

export { ValidationService };
