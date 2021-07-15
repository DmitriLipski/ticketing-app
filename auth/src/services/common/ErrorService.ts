import { Service } from 'typedi';
import { RequiredParameterError } from './errors';

@Service()
class ErrorService {
	requiredParam(param: string): void {
		throw new RequiredParameterError(param);
	}
}

export { ErrorService };
