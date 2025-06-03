class ApiError extends Error {
    constructor(
        statusCode,
        message = "something went wrong, please try again later.",
        errors = [],
        stack = ""

    ) {
        super(message);
        this.statusCode = statusCode;
        this.data = null;
        this.errors = errors;
        this.message = message;
        this.success = false;

        if (stack) {
            this.statck = statck;
        } else {
            Error.captureStackTrace(this, this.constructor);
        }

    }
}

export {ApiError}