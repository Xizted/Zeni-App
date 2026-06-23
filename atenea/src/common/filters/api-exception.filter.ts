import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorPayload {
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();
    const status =
      exception instanceof HttpException
        ? exception.getStatus()
        : HttpStatus.INTERNAL_SERVER_ERROR;

    const exceptionResponse =
      exception instanceof HttpException ? exception.getResponse() : undefined;
    const details =
      typeof exceptionResponse === 'object' && exceptionResponse !== null
        ? exceptionResponse
        : undefined;
    const message =
      details && 'message' in details
        ? (details.message as string | string[])
        : status === 500
          ? 'Internal server error'
          : typeof exceptionResponse === 'string'
            ? exceptionResponse
            : 'Request failed';
    const code =
      details && 'error' in details && typeof details.error === 'string'
        ? details.error.toUpperCase().replaceAll(' ', '_')
        : (HttpStatus[status] ?? 'HTTP_ERROR');

    const error: ErrorPayload = {
      statusCode: status,
      code,
      message,
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json({ error });
  }
}
