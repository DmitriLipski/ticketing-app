import { CustomError, SerializeErrorsReturnType } from './custom-error';
import { HttpStatusCode } from '../../../types';

export class UniqueConstraintError extends CustomError {
	statusCode = HttpStatusCode.CONFLICT;
	reason = 'Unique Constraint Error';

	constructor() {
		super('Unique Constraint Error');

		Object.setPrototypeOf(this, UniqueConstraintError.prototype);

		if (Error.captureStackTrace) {
			Error.captureStackTrace(this, UniqueConstraintError);
		}
	}

	serializeErrors(): SerializeErrorsReturnType {
		return [{ message: this.reason }];
	}
}
