import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class UnauthorizedError extends CustomError {
	statusCode = HttpStatusCode.UNAUTHORIZED;
	reason = 'Unauthorized';

	constructor() {
		super('Unauthorized');

		Object.setPrototypeOf(this, UnauthorizedError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UnauthorizedError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
