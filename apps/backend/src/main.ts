import { NestFactory } from '@nestjs/core';
import { AppModule } from './app/app.module';
import { VercelRequest, VercelResponse } from '@vercel/node';

let cachedApp: any;

async function bootstrap() {
  const app = await NestFactory.create(AppModule); // no express passed
  app.setGlobalPrefix('api');
  await app.init();
  return app.getHttpAdapter().getInstance(); // get internal express instance
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (!cachedApp) {
    cachedApp = await bootstrap();
  }
  cachedApp(req, res);
}
