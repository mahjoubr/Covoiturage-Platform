import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { seedAdmin } from './SeedAdmin';
import { AppUserService } from './app-user/app-user.service';
import * as dotenv from 'dotenv';
import { ValidationPipe } from '@nestjs/common';
import { AdminService } from './admin/admin.service';
import * as bodyParser from 'body-parser';
dotenv.config();

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use(bodyParser.json({ limit: '10mb' }));
  app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
  app.enableCors({
    origin: 'http://localhost:5173',
    credentials: true, 
  });
  const { graphqlUploadExpress } = require('graphql-upload');
  
  app.useGlobalPipes(new ValidationPipe());

  const adminService = app.get(AdminService);
  await seedAdmin(adminService);
  app.use(graphqlUploadExpress());
await app.listen(process.env.PORT ?? 3000, '127.0.0.1'); // or 'localhost'
}
bootstrap();
