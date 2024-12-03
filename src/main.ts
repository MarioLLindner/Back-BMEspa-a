import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';



async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'FETCH'], 
    allowedHeaders: ['Content-Type', 'Authorization'], 
  });

  await app.listen(8080);
}
bootstrap();
