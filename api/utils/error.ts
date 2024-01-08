export class CustomError extends Error {
  statusCode: number;
  constructor(status: number, message: string) {
    super(message);
    this.statusCode = status;
  }
}

export const errorHandler = (status: number, message: string) => {
  return new CustomError(status, message);
};
