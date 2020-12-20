export class HttpBaseException extends Error {
  constructor(public readonly statusCode: number, public messages: any[]) {
    super();
  }
}
