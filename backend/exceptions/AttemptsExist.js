//Custom Exception to be thrown when attempts have been registered for a module and you try to unpublish it
class AttemptsExist extends Error {
    constructor(message) {
        super(message);

        // assign the error class name in your custom error (as a shortcut)
        this.name = this.constructor.name;

        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = AttemptsExist;