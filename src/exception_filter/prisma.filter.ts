import {
  ExceptionFilter,
  Catch,
  ArgumentsHost,
  HttpStatus,
} from '@nestjs/common';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaClientKnownRequestError } from '@prisma/client/runtime/client';

@Catch(PrismaClientKnownRequestError)
export class PrismaExceptionFilter implements ExceptionFilter {
  constructor(private readonly httpAdapterHost: HttpAdapterHost) {}

  catch(exception: unknown, host: ArgumentsHost): void {
    const e = exception as {
      code?: string;
      meta?: {
        target?: string[];
        constraint?: { fields?: string[] };
        driverAdapterError?: {
          cause?: { constraint?: { fields?: string[] } };
        };
      };
    };

    const { httpAdapter } = this.httpAdapterHost;
    const ctx = host.switchToHttp();

    let status = HttpStatus.INTERNAL_SERVER_ERROR;
    let message = 'Internal server error';

    if (e.code === 'P2002') {
      const field =
        e.meta?.target?.[0] ||
        e.meta?.constraint?.fields?.[0] ||
        e.meta?.driverAdapterError?.cause?.constraint?.fields?.[0];

      const messages: Record<string, string> = {
        email: 'Это что за email такой? Он уже занят.',
      };

      const fieldName = field ?? 'unknown';

      status = HttpStatus.CONFLICT;
      message = messages[fieldName] || `Duplicate value for ${fieldName}`;
    }

    const responseBody = {
      statusCode: status,
      message,
      timestamp: new Date().toISOString(),
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      path: httpAdapter.getRequestUrl(ctx.getRequest()),
    };

    httpAdapter.reply(ctx.getResponse(), responseBody, status);
  }
}
