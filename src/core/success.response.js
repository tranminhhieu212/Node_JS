'use strict';

const StatusCode = {
    OK: 200,
    CREATED: 201
}

const ReasonStutusCode = {
    OK: 'Success',
    CREATED: 'Created'
}

class SuccessResponse {
    constructor({message, statusCode = StatusCode.OK, reasonStutusCode = ReasonStutusCode.OK, metadata = {}}) {
        this.message = !message ? reasonStutusCode : message;
        this.metadata = metadata;
        this.status = statusCode
    }

    send(res, header = {}) {
        return res.status(this.status).json(this);
    }
}


class OK extends SuccessResponse {
    constructor({message, metadata = {}}) {
        super({message, metadata});
    }
}

class CREATED extends SuccessResponse {
    constructor({options = {}, message, metadata = {}, statusCode = StatusCode.CREATED, reasonStutusCode = ReasonStutusCode.CREATED}) {
        super({message, metadata, statusCode, reasonStutusCode });
        this.options = options
    }
}

module.exports = {
    SuccessResponse,
    OK,
    CREATED
}