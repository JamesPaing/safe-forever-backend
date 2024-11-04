const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ValidationError extends Error {
    status: number;
    httpCode: string;
    errors: any[];
    details: any[];

    constructor(details: any[] = [], { errors = null, httpCode = null } = {}) {
        const message = details[0] ? details[0].message : 'Validation error';
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = httpStatus.UNPROCESSABLE_ENTITY;
        this.httpCode = httpCode || String(httpStatus.UNPROCESSABLE_ENTITY);
        this.errors = errors || [];
        this.details = details;

        Error.captureStackTrace(this, this.constructor);
    }
}

export default ValidationError;
