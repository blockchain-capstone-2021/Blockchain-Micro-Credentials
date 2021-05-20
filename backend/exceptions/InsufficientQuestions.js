//Custom Exception to be thrown when insufficient questions in the question bank exist for the module and you try to publish.
class InsufficientQuestions extends Error {
    constructor(message) {
        super(message);

        // assign the error class name in your custom error (as a shortcut)
        this.name = this.constructor.name;

        // capturing the stack trace keeps the reference to your error class
        Error.captureStackTrace(this, this.constructor);
    }
}

module.exports = InsufficientQuestions;