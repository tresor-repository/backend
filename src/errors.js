const httpErrorCode = 500;
const httpErrorMsg = {
    message: "Error Unkown"
}
class HttpError extends Error {
    constructor() {
        super();
        this.code = httpErrorCode;
        this.error = httpErrorMsg;
    }
}

export class ValidationError extends HttpError {
    constructor(arrays) {
        super();
        this.code = 422;
        this.error = arrays.map(it => {
            return {
                field: it.param,
                message: it.msg
            }
        })
    }
}

export class UnauthorizedError extends HttpError {
    constructor() {
        super();
        this.code = 401;
        this.error = {
            message: "Unauthorized Error"
        };
    }
}

export class NotFoundError extends HttpError {
    constructor() {
        super();
        this.code = 404,
            this.error = {
                message: "Not Found Error"
            }
    }
}

export function errorMiddleware(err, req, res, next) {
    console.log(err);
    res.status(
        (err.code && err.code < 599) ? err.code : httpErrorCode
    ).json(
        err.error ? err.error : httpErrorMsg
    );
}