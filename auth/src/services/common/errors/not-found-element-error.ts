import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class NotFoundElementError extends CustomError {
	statusCode = HttpStatusCode.NOT_FOUND;
	reason = '';

	constructor(elementId: number) {
		super(`Element with id: ${elementId} not found.`);
		this.reason = `Element with id: ${elementId} not found.`;

		Object.setPrototypeOf(this, NotFoundElementError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, NotFoundElementError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
