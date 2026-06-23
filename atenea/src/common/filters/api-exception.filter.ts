import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
  Logger,
} from '@nestjs/common';
import { Request, Response } from 'express';

interface ErrorPayload {
  statusCode: number;
  code: string;
  message: string | string[];
  path: string;
  timestamp: string;
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === 'object' && value !== null;

const extractMessage = (
  exception: HttpException,
  exceptionResponse: string | object,
): string | string[] => {
  let rawMessage: unknown;

  if (typeof exceptionResponse === 'string') {
    rawMessage = exceptionResponse;
  } else if (isRecord(exceptionResponse) && 'message' in exceptionResponse) {
    rawMessage = exceptionResponse.message;
  }

  if (typeof rawMessage === 'string') {
    return rawMessage;
  }

  if (
    Array.isArray(rawMessage) &&
    rawMessage.every((item): item is string => typeof item === 'string')
  ) {
    return rawMessage;
  }

  if (exception.message) {
    return exception.message;
  }

  return 'Request failed';
};

const extractCode = (
  status: number,
  exceptionResponse: string | object,
): string => {
  if (
    isRecord(exceptionResponse) &&
    typeof exceptionResponse.error === 'string'
  ) {
    const code = exceptionResponse.error
      .trim()
      .toUpperCase()
      .replace(/[^A-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '');

    if (code) {
      return code;
    }
  }

  const statusName = HttpStatus[status];
  if (typeof statusName === 'string') {
    return statusName;
  }

  return 'HTTP_ERROR';
};

@Catch()
export class ApiExceptionFilter implements ExceptionFilter {
  private readonly logger = new Logger(ApiExceptionFilter.name);

  catch(exception: unknown, host: ArgumentsHost): void {
    const context = host.switchToHttp();
    const response = context.getResponse<Response>();
    const request = context.getRequest<Request>();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let code = 'INTERNAL_SERVER_ERROR';
    let message: string | string[] = 'Internal server error';

    if (exception instanceof HttpException) {
      status = exception.getStatus();
      const exceptionResponse = exception.getResponse();
      message = extractMessage(exception, exceptionResponse);
      code = extractCode(status, exceptionResponse);
    } else if (exception instanceof Error) {
      this.logger.error(exception.message, exception.stack);
    } else {
      this.logger.error('Unhandled non-Error exception');
    }

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
