import 'reflect-metadata';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap(): Promise<void> {
  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');
  // The Angular dev server proxies /api, but CORS also allows direct calls.
  app.enableCors({ origin: [/^http:\/\/localhost:\d+$/, /^http:\/\/127\.0\.0\.1:\d+$/] });
  const port = Number(process.env.PORT ?? 3000);
  await app.listen(port);
  console.log(`Atlas API ready on http://localhost:${port}/api`);
}

void bootstrap();
