type HttpCode = 200 | 300 | 400 | 401 | 403 | 500;

export class AppError extends Error {
    public name: string;
    public status: 'fail' | 'error';
    public httpCode: HttpCode;
    public isOperational?: boolean;

    constructor(
        message: string,
        httpCode: HttpCode,
        isOperational: boolean = true
    ) {
        super(message);

        Object.setPrototypeOf(this, new.target.prototype); // restore prototype chain

        this.status = httpCode.toString().startsWith('4') ? 'fail' : 'error';
        this.httpCode = httpCode;
        this.isOperational = isOperational;

        Error.captureStackTrace(this, this.constructor);
    }
}
