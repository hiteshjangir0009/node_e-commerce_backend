class API_error extends Error {
    constructor(
        statusCode,
        message = "something went worng",
        error = [],
        stack = ''
    ) {
        super(message)
        this.statusCode = statusCode
        this.data = null
        this.message = message
        this.success = false;
        this.error = error

        if (stack) {
            this.stack = stack
        } else {
            Error.captureStackTrace(this, this.constructor)
        }
    }
}

export { API_error }

