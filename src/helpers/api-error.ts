const httpStatus = require('http-status');

/**
 * @extends Error
 */
class ExtendableError extends Error {
    status: any;
    errorCode: any;
    errors: any;
    isPublic: boolean;
    isOperational: boolean;
    originalStacks: any;

    constructor(
        message: string,
        status: any,
        isPublic: boolean,
        { errors = null, errorCode = null, stack = null } = {}
    ) {
        super(message);
        this.name = this.constructor.name;
        this.message = message;
        this.status = status;
        this.errorCode = errorCode || status;
        this.errors = errors || [];
        this.isPublic = isPublic;
        this.isOperational = true;

        if (stack) this.originalStacks = (stack as any).split('\n');

        Error.captureStackTrace(this, this.constructor);
    }
}

/**
 * Class representing an API error.
 * @extends ExtendableError
 */
class ApiError extends ExtendableError {
    /**
     * Creates an API error.
     * @param {string} message - Error message.
     * @param {number} status - HTTP status code of error.
     * @param {boolean} isPublic - Whether the message should be visible to user or not.
     * @param {string[]} errors - List of error list
     * @param {?string} errorCode - errorcode
     * @param stack
     */
    constructor(
        message: string,
        status = httpStatus.INTERNAL_SERVER_ERROR,
        isPublic = false,
        { errors = null, errorCode = null, stack = null } = {}
    ) {
        super(message, status, isPublic, { errors, errorCode, stack });
    }
}

export default ApiError;
