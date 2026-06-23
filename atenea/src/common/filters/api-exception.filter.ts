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
  details?: unknown;
  path: string;
  timestamp: string;
}

const isHealthCheckResult = (
  value: unknown,
): value is Record<string, unknown> => {
  if (typeof value !== 'object' || value === null) return false;
  const result = value as Record<string, unknown>;
  return (
    ['ok', 'error', 'shutting_down'].includes(String(result.status)) &&
    typeof result.details === 'object' &&
    result.details !== null
  );
};

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
    const rawMessage =
      details && 'message' in details
        ? details.message
        : status === 500
          ? 'Internal server error'
          : typeof exceptionResponse === 'string'
            ? exceptionResponse
            : 'Request failed';
    const healthCheckDetails = isHealthCheckResult(details)
      ? details
      : isHealthCheckResult(rawMessage)
        ? rawMessage
        : undefined;
    const message = healthCheckDetails
      ? 'Health check failed'
      : typeof rawMessage === 'string' || Array.isArray(rawMessage)
        ? (rawMessage as string | string[])
        : 'Request failed';
    const code =
      details && 'error' in details && typeof details.error === 'string'
        ? details.error.toUpperCase().replaceAll(' ', '_')
        : (HttpStatus[status] ?? 'HTTP_ERROR');

    const error: ErrorPayload = {
      statusCode: status,
      code,
      message,
      ...(healthCheckDetails ? { details: healthCheckDetails } : {}),
      path: request.url,
      timestamp: new Date().toISOString(),
    };

    response.status(status).json({ error });
  }
}
