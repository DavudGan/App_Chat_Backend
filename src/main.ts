import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpAdapterHost } from '@nestjs/core';
import { PrismaExceptionFilter } from './prisma/prisma.filter';

console.log('DB:', process.env.DATABASE_URL);
async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const httpAdapterHost = app.get(HttpAdapterHost);
  app.useGlobalFilters(new PrismaExceptionFilter(httpAdapterHost));
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
console.log('DB:', process.env.DATABASE_URL);
