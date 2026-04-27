import {
  ArgumentsHost,
  Catch,
  ExceptionFilter,
  HttpException,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Catch()
export class AllExceptionsFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    console.log(exception);
    const { httpAdapter } = this.httpAdapterHost;

    const ctx = host.switchToHttp();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message: string | object = 'Internal server error';

    // Nest Http exceptions
    if (exception instanceof HttpException) {
      status = exception.getStatus();

      const response = exception.getResponse();

      message =
        typeof response === 'string'
          ? response
          : (response as any).message || response;
    }

    // Prisma errors
    else if (exception instanceof PrismaClientKnownRequestError) {
      if (exception.code === 'P2002') {
        const field = exception.meta?.target?.[0] || 'unknown';

        status = HttpStatus.CONFLICT;

        const messages: Record<string, string> = {
          email: 'Этот email уже занят',
        };

        message = messages[field] || `Duplicate value for ${field}`;
      }
    }

    // Native JS errors
    else if (exception instanceof Error) {
      message = exception.message;
    }

    // Логирование
    console.error(exception);

    httpAdapter.reply(
      ctx.getResponse(),
      {
        statusCode: status,
        message,
        timestamp: new Date().toISOString(),
        path: httpAdapter.getRequestUrl(ctx.getRequest()),
      },
      status,
    );
  }
}
