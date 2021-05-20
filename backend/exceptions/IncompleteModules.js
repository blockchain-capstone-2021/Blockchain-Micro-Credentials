//Custom Exception to be thrown when no attempts have been registered for modules of a unit and you try to submit the micro-credential.
class IncompleteModules extends Error {
    constructor(message) {
        super(message);

        // assign the error class name in your custom error (as a shortcut)
        this.name = this.constructor.name;

        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = IncompleteModules;