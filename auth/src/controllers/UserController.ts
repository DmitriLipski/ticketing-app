import { Request, Response } from 'express';
import { randomBytes } from 'crypto';
import { Service } from 'typedi';

import { UserService, LoggerService, ResponseService } from '../services';
import { User } from '../models/User';

import {
	ErrorResponseMessages,
	HandleRequestResultType,
	HttpMethods,
	HttpStatusCode,
} from '../types';
import {
	InvalidPropertyError,
	MethodNotAllowedError,
} from '../services/common/errors';

type HttpRequestType<T> = {
	path: string;
	method: string;
	pathParams: Record<string, string | number>;
	queryParams: any;
	body?: T;
};

@Service()
class UserController {
	constructor(
		private readonly userService: UserService,
		private readonly logger: LoggerService,
		private readonly responseService: ResponseService,
	) {}

	protected adaptRequest(_req: Request): HttpRequestType<User> {
		return {
			path: _req.path,
			method: _req.method,
			pathParams: _req.params,
			queryParams: _req.query,
			body: _req.body,
		};
	}

	async handleGetUsersRequest(_req: Request, res: Response): Promise<Response> {
		const httpRequest = this.adaptRequest(_req);

		return httpRequest.method === HttpMethods.GET
			? this.handleResponse<User[]>(_req, res, this.getAllUsers())
			: this.handleResponse<User[]>(
					_req,
					res,
					this.makeUnsupportedMethodError(httpRequest.method),
			  );
	}

	async handleSignUpRequest(_req: Request, res: Response): Promise<Response> {
		const httpRequest = this.adaptRequest(_req);

		return httpRequest.method === HttpMethods.POST
			? this.handleResponse<User[]>(_req, res, this.addUser(httpRequest))
			: this.handleResponse<User[]>(
					_req,
					res,
					this.makeUnsupportedMethodError(httpRequest.method),
			  );
	}

	protected async handleResponse<T>(
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

	protected makeUnsupportedMethodError(
		method: string,
	): Promise<HandleRequestResultType> {
		return Promise.resolve(
			this.responseService.makeHttpError(
				new MethodNotAllowedError(`${method} method not allowed.`),
			),
		);
	}

	private async getAllUsers(): Promise<
		HandleRequestResultType<User[] | unknown>
	> {
		try {
			const result = (await this.userService.getAllUsers()) as User[];
			return this.responseService.makeHttpOKResponse<User[]>(result);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}

	private async addUser(
		httpRequest: HttpRequestType<User>,
	): Promise<HandleRequestResultType<User | unknown>> {
		if (!httpRequest.body) {
			return this.responseService.makeHttpError(
				new InvalidPropertyError('Bad request. No POST body.'),
			);
		}

		const { name, email, password } = httpRequest.body;

		const id = randomBytes(8).toString('hex');

		try {
			const user = { id, name, email, password };
			const result = await this.userService.addUser(user);

			return this.responseService.makeHttpOKResponse<User>(result);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}
}

export { UserController };
