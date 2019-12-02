



export default function (name, callback) {
  return class HooksError extends Error {
    constructor(message, info) {
      super(message);
      this.name = name;
      this.payload = info;
      Error.captureStackTrace(this, this.constructor);

      callback(this, info)
    }

  }
}