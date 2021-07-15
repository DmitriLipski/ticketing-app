import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class InvalidPropertyError extends CustomError {
	statusCode = HttpStatusCode.BAD_REQUEST;
	reason = '';

	constructor(msg: string) {
		super(msg);
		this.reason = msg;

		Object.setPrototypeOf(this, InvalidPropertyError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, InvalidPropertyError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
