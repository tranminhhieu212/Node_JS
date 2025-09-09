'use strict'

const StatusCode = {
    FORBIDDEN: 403,
    NOT_FOUND: 404, 
    CONFLICT: 409,
    BAD_REQUEST: 400,
    SERVER_ERROR: 500,
    UNAUTHORIZATION: 401
}

const ReasonStutusCode = {
    FORBIDDEN: 'Forbidden',
    NOT_FOUND: 'Not Found', 
    CONFLICT: 'Conflict',
    BAD_REQUEST: 'Bad Request',
    SERVER_ERROR: 'Server Error',
    UNAUTHORIZATION: 'Unauthorized'
}

class ErrorResponse extends Error {
    constructor(message, status) {
        super(message);
        this.status = status
    }
}

class ConflictRequestErorr extends ErrorResponse {
    constructor(message = ReasonStutusCode.CONFLICT, status = StatusCode.CONFLICT) {
        super(message, status);
    }
}

class BadRequestErorr extends ErrorResponse {
    constructor(message =  ReasonStutusCode.BAD_REQUEST, status = StatusCode.BAD_REQUEST) {
        super(message, status);
    }
}

class ServerError extends ErrorResponse {
    constructor(message = ReasonStutusCode.SERVER_ERROR, status = StatusCode.SERVER_ERROR) {
        super(message, status);
    }
}

class AuthFailureError extends ErrorResponse {
    constructor(message = ReasonStutusCode.UNAUTHORIZATION, status = StatusCode.UNAUTHORIZATION) {
        super(message, status);
    }
}

class NotFoundError extends ErrorResponse {
    constructor(message = ReasonStutusCode.NOT_FOUND, status = StatusCode.NOT_FOUND) {
        super(message, status);
    }
}

class ForbiddenError extends ErrorResponse {
    constructor(message = ReasonStutusCode.FORBIDDEN, status = StatusCode.FORBIDDEN) {
        super(message, status);
    }
}

module.exports = {
    BadRequestErorr,
    ConflictRequestErorr,
    ServerError,
    AuthFailureError,
    NotFoundError,
    ForbiddenError
}