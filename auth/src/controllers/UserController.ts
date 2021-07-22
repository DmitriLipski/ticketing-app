import { Request, Response } from 'express';
import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { UserService, LoggerService, ResponseService } from '../services';
import { User, UserDoc } from '../models';

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
import { UserView, UserViewType } from '../views';

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
		private readonly userViewService: UserView,
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
			? this.handleResponse<UserViewType[]>(_req, res, this.getAllUsers())
			: this.handleResponse<UserViewType[]>(
					_req,
					res,
					this.makeUnsupportedMethodError(httpRequest.method),
			  );
	}

	async handleSignUpRequest(_req: Request, res: Response): Promise<Response> {
		const httpRequest = this.adaptRequest(_req);

		return httpRequest.method === HttpMethods.POST
			? this.handleResponse<UserViewType>(
					_req,
					res,
					this.addUser(httpRequest).then(response => {
						if (response.data) {
							const user = response.data as UserDoc;
							const userJwt = this.generateJWT(user);

							_req.session = {
								jwt: userJwt,
							};
						}
						return response;
					}),
			  )
			: this.handleResponse<UserViewType>(
					_req,
					res,
					this.makeUnsupportedMethodError(httpRequest.method),
			  );
	}

	async handleSignInRequest(_req: Request, res: Response): Promise<Response> {
		const httpRequest = this.adaptRequest(_req);

		return httpRequest.method === HttpMethods.POST
			? this.handleResponse<UserViewType>(
					_req,
					res,
					this.signInUser(httpRequest).then(response => {
						if (response.data) {
							const user = response.data as UserDoc;
							const userJwt = this.generateJWT(user);

							_req.session = {
								jwt: userJwt,
							};
						}
						return response;
					}),
			  )
			: this.handleResponse<UserViewType>(
					_req,
					res,
					this.makeUnsupportedMethodError(httpRequest.method),
			  );
	}

	protected generateJWT(user: UserDoc): string {
		return jwt.sign(
			{
				id: user.id,
				email: user.email,
			},
			process.env.JWT_KEY!,
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
		HandleRequestResultType<UserViewType[] | unknown>
	> {
		try {
			const users = (await this.userService.getAllUsers()) as UserDoc[];
			return this.responseService.makeHttpOKResponse<UserViewType[]>(
				users.map(user => this.userViewService.getUserView(user)),
			);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}

	private async signInUser(
		httpRequest: HttpRequestType<User>,
	): Promise<HandleRequestResultType<UserViewType | unknown>> {
		//TODO:
		if (!httpRequest.body) {
			return this.responseService.makeHttpError(
				new InvalidPropertyError('Bad request. No POST body.'),
			);
		}

		const { email, password } = httpRequest.body;

		try {
			const credentials = { email, password };
			const result = await this.userService.signInUser(credentials);

			return this.responseService.makeHttpOKResponse<UserViewType>(
				this.userViewService.getUserView(result),
			);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}

	private async addUser(
		httpRequest: HttpRequestType<User>,
	): Promise<HandleRequestResultType<UserViewType | unknown>> {
		//TODO:
		if (!httpRequest.body) {
			return this.responseService.makeHttpError(
				new InvalidPropertyError('Bad request. No POST body.'),
			);
		}

		const { name, email, password } = httpRequest.body;

		try {
			const user = { name, email, password };
			const result = await this.userService.addUser(user);

			return this.responseService.makeHttpOKResponse<UserViewType>(
				this.userViewService.getUserView(result),
			);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}
}

export { UserController };
