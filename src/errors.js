const httpErrorCode = 500;
const httpErrorMsg = { message: "Error Unkown" }
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

export function errorMiddleware(err, req, res, next) {
    res.status(
        err.code ? err.code : httpErrorCode
    ).json(
        err.error ? err.error : httpErrorMsg
    );
}