import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class RequiredParameterError extends CustomError {
	statusCode = HttpStatusCode.BAD_REQUEST;
	reason = '';

	constructor(param: string) {
		super(`${param} can not be null or undefined.`);
		this.reason = `${param} can not be null or undefined.`;

		Object.setPrototypeOf(this, RequiredParameterError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, RequiredParameterError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
