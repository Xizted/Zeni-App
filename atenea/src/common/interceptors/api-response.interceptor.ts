import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { Response } from 'express';
import { Observable, map } from 'rxjs';

export interface ApiResponse<T> {
  data: T;
}

@Injectable()
export class ApiResponseInterceptor<T> implements NestInterceptor<
  T,
  ApiResponse<T> | undefined
> {
  intercept(
    context: ExecutionContext,
    next: CallHandler<T>,
  ): Observable<ApiResponse<T> | undefined> {
    const response = context.switchToHttp().getResponse<Response>();
    return next
      .handle()
      .pipe(
        map((data) => (response.statusCode === 204 ? undefined : { data })),
      );
  }
}
