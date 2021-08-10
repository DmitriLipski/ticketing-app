export type Identifier = string | number;

//Http
import { SerializeErrorsReturnType } from './services/common/errors';

export enum HttpStatusCode {
	OK = 200,
	CREATED = 201,
	BAD_REQUEST = 400,
	UNAUTHORIZED = 401,
	NOT_FOUND = 404,
	METHOD_NOT_ALLOWED = 405,
	CONFLICT = 409,
	INTERNAL_SERVER_ERROR = 500,
}

export enum ErrorResponseMessages {
	INTERNAL_SERVER_ERROR = 'Internal Server Error',
}

export enum HttpMethods {
	GET = 'GET',
	POST = 'POST',
	PUT = 'PUT',
	DELETE = 'DELETE',
	PATCH = 'PATCH',
}

export type HandleRequestResultType<T = unknown> = {
	headers?: Record<string, string>;
	statusCode: number;
	data?: T | Error;
	errorMessage?: SerializeErrorsReturnType;
};
