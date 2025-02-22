class NotFoundError extends Error {
  constructor(message = "Resource not found") {
    super(message);
    this.name = "NotFoundError";
  }
}

class InvalidStateTransitionError extends Error {
  constructor(message) {
    super(message);
    this.name = "InvalidStateTransitionError";
  }
}

export { NotFoundError, InvalidStateTransitionError };
