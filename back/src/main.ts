import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedAdmin } from './SeedAdmin';
import { AppUserService } from './app-user/app-user.service';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, 
  });

  app.useGlobalPipes(new ValidationPipe());

  const adminService = app.get(AdminService);
  await seedAdmin(adminService);

  await app.listen(process.env.PORT ?? 3000); // moved to the end
}
bootstrap();
