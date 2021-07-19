import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class BadRequestError extends CustomError {
	statusCode = HttpStatusCode.BAD_REQUEST;
	reason = '';

	constructor(message: string) {
		super(message);
		this.reason = message;

		Object.setPrototypeOf(this, BadRequestError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, BadRequestError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
