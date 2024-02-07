import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
require('dotenv').config();


async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(5000);
  console.log('NestJS application started.');
}
bootstrap();      
    