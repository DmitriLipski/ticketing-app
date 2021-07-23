import { Service } from 'typedi';
import { Request, Response } from 'express';
import { LoggerService } from './LoggerService';
import {
	CustomError,
	InvalidPropertyError,
	MethodNotAllowedError,
	UnauthorizedError,
} from './errors';
import {
	ErrorResponseMessages,
	HandleRequestResultType,
	HttpStatusCode,
} from '../../types';

@Service()
class ResponseService {
	constructor(private readonly logger: LoggerService) {}

	async handleResponse<T = undefined>(
		_req: Request,
		res: Response,
		callback: Promise<HandleRequestResultType<T | unknown>>,
	): Promise<Response> {
		return callback
			.then(({ headers, statusCode, data, errorMessage }) => {
				return res
					.set(headers)
					.status(statusCode)
					.send(errorMessage ? errorMessage : data);
			})
			.catch((error: Error) => {
				this.logger.logToConsole(error.message);
				return res
					.status(HttpStatusCode.INTERNAL_SERVER_ERROR)
					.json([{ message: ErrorResponseMessages.INTERNAL_SERVER_ERROR }]);
			});
	}

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

	makeAuthorizationError(): Promise<HandleRequestResultType> {
		return Promise.resolve(this.makeHttpError(new UnauthorizedError()));
	}

	makeUnsupportedMethodError(method: string): Promise<HandleRequestResultType> {
		return Promise.resolve(
			this.makeHttpError(
				new MethodNotAllowedError(`${method} method not allowed.`),
			),
		);
	}

	makeEmptyBodyError(): Promise<HandleRequestResultType> {
		return Promise.resolve(
			this.makeHttpError(
				new InvalidPropertyError('Bad request. No POST body.'),
			),
		);
	}
}

export { ResponseService };
