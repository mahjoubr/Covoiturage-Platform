import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedAdmin } from './SeedAdmin';
import { AppUserService } from './app-user/app-user.service';
import * as dotenv from 'dotenv';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(process.env.PORT ?? 3000);
  app.enableCors({
    origin: 'http://localhost:3000', 
  });
  const appUserService = app.get(AppUserService);
  await seedAdmin(appUserService);
}
bootstrap();
