import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

@Catch()
export class HttpExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const request = ctx.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    let category;

    const errorResponse = {
      category,
      code:
        (exception instanceof HttpException && exception.getStatus()) ||
        'BAD_REQUEST', //status,
      message:
        (exception instanceof HttpException && exception.message) ||
        exception.toString() ||
        'Bad Request Exception',
      error: (exception instanceof HttpException &&
        exception.getResponse()) || {
        statusCode: status,
      },
    };

    response.status(status).json(errorResponse);
  }
}
