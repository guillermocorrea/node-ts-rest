import { HttpBaseException } from './http-base.exception';

export class BadRequestException extends HttpBaseException {
  constructor(messages: any[]) {
    super(400, messages);
  }
}
