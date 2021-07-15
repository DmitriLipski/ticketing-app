import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class MethodNotAllowedError extends CustomError {
	statusCode = HttpStatusCode.METHOD_NOT_ALLOWED;
	reason = '';

	constructor(msg: string) {
		super(msg);
		this.reason = msg;

		Object.setPrototypeOf(this, MethodNotAllowedError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, MethodNotAllowedError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
