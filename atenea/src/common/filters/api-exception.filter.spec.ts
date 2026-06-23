import {
  ArgumentsHost,
  BadRequestException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ApiExceptionFilter } from './api-exception.filter';

describe('ApiExceptionFilter', () => {
  const request = { url: '/api/v1/resource' };
  let json: jest.Mock;
  let status: jest.Mock;
  let host: ArgumentsHost;

  beforeEach(() => {
    json = jest.fn();
    status = jest.fn().mockReturnValue({ json });
    host = {
      switchToHttp: () => ({
        getRequest: () => request,
        getResponse: () => ({ status }),
      }),
    } as unknown as ArgumentsHost;
  });

  it('preserves validation messages and normalizes the response error code', () => {
    const filter = new ApiExceptionFilter();
    const exception = new BadRequestException({
      message: ['email must be an email', 'password is too short'],
      error: 'Bad Request',
    });

    filter.catch(exception, host);

    expect(status).toHaveBeenCalledWith(400);
    expect(json).toHaveBeenCalledWith({
      error: {
        statusCode: 400,
        code: 'BAD_REQUEST',
        message: ['email must be an email', 'password is too short'],
        path: request.url,
        timestamp: expect.any(String),
      },
    });
  });

  it('treats health failures like any other HTTP exception', () => {
    const filter = new ApiExceptionFilter();
    const exception = new ServiceUnavailableException({
      status: 'error',
      details: { database: { status: 'down' } },
    });

    filter.catch(exception, host);

    expect(json).toHaveBeenCalledWith({
      error: {
        statusCode: 503,
        code: 'SERVICE_UNAVAILABLE',
        message: 'Service Unavailable Exception',
        path: request.url,
        timestamp: expect.any(String),
      },
    });
  });

  it('logs unhandled exceptions without exposing their details', () => {
    const logger = jest.spyOn(Logger.prototype, 'error').mockImplementation();
    const filter = new ApiExceptionFilter();
    const exception = new Error('database credentials leaked');

    filter.catch(exception, host);

    expect(logger).toHaveBeenCalledWith(exception.message, exception.stack);
    expect(json).toHaveBeenCalledWith({
      error: {
        statusCode: 500,
        code: 'INTERNAL_SERVER_ERROR',
        message: 'Internal server error',
        path: request.url,
        timestamp: expect.any(String),
      },
    });
    expect(JSON.stringify(json.mock.calls)).not.toContain(exception.message);

    logger.mockRestore();
  });
});
