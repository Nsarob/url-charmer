export class ApplicationError extends Error {

    public status: number;

    /**
     * 
     * @param {string} message - The error message
     * @param {number} status - The HTTP status code
     */
    constructor(message: string, status: number = 500) {
    super(message);
      
    /**
     * The name of the error
       * @type {string}
       */
      this.name = this.constructor.name;
      /**
       * The error message
       * @type {string}
       */
      this.message = message || ('Something went wrong. Please try again');
      /**
       * The HTTP status code
       * @type {number}
       */
      this.status = status || 500;

      Error.captureStackTrace(this, this.constructor);
    }
  }
  
