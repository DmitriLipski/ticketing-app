import { Service } from 'typedi';
import {
	ErrorResponseMessages,
	HandleRequestResultType,
	HttpStatusCode,
} from '../../types';
import { CustomError } from './errors';

@Service()
class ResponseService {
	makeHttpOKResponse<T>(data: T): HandleRequestResultType<T> {
		return {
			headers: {
				'Content-Type': 'application/json',
			},
			statusCode: HttpStatusCode.OK,
			data,
		};
	}

	makeHttpError(error: unknown): HandleRequestResultType {
		if (error instanceof CustomError) {
			return {
				statusCode: error.statusCode,
				errorMessage: error.serializeErrors(),
			};
		}

		return {
			statusCode: HttpStatusCode.INTERNAL_SERVER_ERROR,
			errorMessage: [{ message: ErrorResponseMessages.INTERNAL_SERVER_ERROR }],
		};
	}
}

export { ResponseService };
