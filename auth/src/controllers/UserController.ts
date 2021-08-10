import { Request, Response } from 'express';
import { Service } from 'typedi';
import jwt from 'jsonwebtoken';
import { ResponseService, UserService } from '../services';
import { User, UserDoc } from '../models';

import { HandleRequestResultType, HttpMethods, HttpStatusCode } from '../types';
import { UserView, UserViewType } from '../views';

type HttpRequestType<T> = {
	path: string;
	method: string;
	pathParams: Record<string, string | number>;
	queryParams: any;
	body?: T;
};

type ReturnCurrentUserType = {
	currentUser: UserViewType | null;
};

@Service()
class UserController {
	constructor(
		private readonly userService: UserService,
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

	async handleGetAllUsers(
		_req: Request,
		res: Response,
	): Promise<Response | boolean> {
		const validationError = this.validateGetRequest(_req, res);

		if (validationError) return Promise.resolve(validationError);

		return this.responseService.handleResponse<UserViewType[]>(
			_req,
			res,
			this.getAllUsers(),
		);
	}

	async handleSignUp(
		_req: Request,
		res: Response,
	): Promise<Response | boolean> {
		const httpRequest = this.adaptRequest(_req);
		const validationError = this.validatePostRequest(_req, res, httpRequest);

		if (validationError) return Promise.resolve(validationError);

		return this.responseService.handleResponse<UserViewType>(
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
		);
	}

	async handleSignIn(
		_req: Request,
		res: Response,
	): Promise<Response | boolean> {
		const httpRequest = this.adaptRequest(_req);
		const validationError = this.validatePostRequest(_req, res, httpRequest);

		if (validationError) return Promise.resolve(validationError);

		return this.responseService.handleResponse<UserViewType>(
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
		);
	}

	async handleGetCurrentUser(
		_req: Request,
		res: Response,
	): Promise<Response | boolean> {
		const validationError = this.validateGetRequest(_req, res);

		if (validationError) return Promise.resolve(validationError);

		return this.responseService.handleResponse<UserViewType>(
			_req,
			res,
			Promise.resolve(this.getCurrentUser(_req)),
		);
	}

	async handleSignOut(_req: Request, res: Response): Promise<Response> {
		const httpRequest = this.adaptRequest(_req);

		if (httpRequest.method !== HttpMethods.POST) {
			return this.responseService.handleResponse(
				_req,
				res,
				this.responseService.makeUnsupportedMethodError(httpRequest.method),
			);
		}

		return this.responseService.handleResponse<UserViewType[]>(
			_req,
			res,
			Promise.resolve(this.signOutUser(_req)),
		);
	}

	validateGetRequest(_req: Request, res: Response): boolean {
		const httpRequest = this.adaptRequest(_req);

		if (httpRequest.method !== HttpMethods.GET) {
			void this.responseService.handleResponse(
				_req,
				res,
				this.responseService.makeUnsupportedMethodError(httpRequest.method),
			);
			return true;
		}

		if (!_req.session?.jwt) {
			void this.responseService.handleResponse<UserViewType[]>(
				_req,
				res,
				this.responseService.makeAuthorizationError(),
			);
			return true;
		}

		return false;
	}

	validatePostRequest(
		_req: Request,
		res: Response,
		httpRequest: HttpRequestType<User>,
	): boolean {
		if (httpRequest.method !== HttpMethods.POST) {
			void this.responseService.handleResponse(
				_req,
				res,
				this.responseService.makeUnsupportedMethodError(httpRequest.method),
			);
			return true;
		}

		if (Object.keys(httpRequest.body || {}).length === 0) {
			void this.responseService.handleResponse(
				_req,
				res,
				this.responseService.makeEmptyBodyError(),
			);
			return true;
		}

		return false;
	}

	protected generateJWT(user: UserDoc): string {
		return jwt.sign(
			{
				id: user.id,
				email: user.email,
				name: user.name,
			},
			process.env.JWT_KEY!,
		);
	}

	protected verifyJWT(_req: Request): UserDoc {
		return jwt.verify(_req.session?.jwt, process.env.JWT_KEY!) as UserDoc;
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
		const { email, password } = httpRequest.body as User;

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
		const { name, email, password } = httpRequest.body as User;

		try {
			const user = { name, email, password };
			const result = await this.userService.addUser(user);

			return this.responseService.makeHttpOKResponse<UserViewType>(
				this.userViewService.getUserView(result),
				HttpStatusCode.CREATED,
			);
		} catch (error: unknown) {
			return this.responseService.makeHttpError(error);
		}
	}

	private getCurrentUser(
		_req: Request,
	): HandleRequestResultType<ReturnCurrentUserType | unknown> {
		try {
			const payload = this.verifyJWT(_req);
			return this.responseService.makeHttpOKResponse<ReturnCurrentUserType>({
				currentUser: this.userViewService.getUserView(payload),
			});
		} catch (err) {
			return this.responseService.makeHttpError(err);
		}
	}

	private signOutUser(
		_req: Request,
	): HandleRequestResultType<Record<string, unknown> | unknown> {
		_req.session = null;
		return this.responseService.makeHttpOKResponse<Record<string, unknown>>({});
	}
}

export { UserController };
