export type SerializeErrorsReturnType = Array<{
	message: string;
	field?: string;
}>;

export abstract class CustomError extends Error {
	abstract statusCode: number;

	protected constructor(msg: string) {
		super(msg);
		Object.setPrototypeOf(this, CustomError.prototype);
	}

	abstract serializeErrors(): SerializeErrorsReturnType;
}
