import { HttpException, HttpStatus } from '@nestjs/common';

export class SomethingWentWrongException extends HttpException {
  constructor(message?: string) {
    super(
      message || 'Something went wrong, try later',
      HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}
