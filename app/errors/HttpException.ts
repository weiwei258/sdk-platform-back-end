export class HttpException extends Error {
  status: number;
  code: number;
  constructor({ message, code }: { message: string; code: number }, status: number) {
    super(message);
    this.code = code;
    this.status = status;
  }
}
