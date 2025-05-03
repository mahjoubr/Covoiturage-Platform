import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RideModule } from './ride/ride.module';
import { PostModule } from './post/post.module';
import { CommentModule } from './comment/comment.module';
import { MessageModule } from './message/message.module';
import { ChatModule } from './chat/chat.module';
import { UserModule } from './user/user.module';
import { AppUserModule } from './app-user/app-user.module';
import { AdminModule } from './admin/admin.module';
import { AppUserRideModule } from './app-user-ride/app-user-ride.module';
import { ReviewModule } from './review/review.module';
import { User } from './user/entities/user.entity';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule, TypeOrmModuleOptions } from '@nestjs/typeorm';
import { AuthModule } from './auth/auth.module';
import { GraphqlModule } from './graphql/graphql.module';
import { ScheduleModule } from '@nestjs/schedule';
import {EventStreamModule } from './SSE/sse.module';
import { SubscriptionModule } from './subscription/subscription.module';

@Module({
      
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
       
        return {
          type: 'mysql',
          host: configService.get('DB_HOST'),
          port:configService.get<number>('DB_PORT', 3306),
          username: configService.get('DB_USERNAME'),
          password: configService.get('DB_PASSWORD'),
          database: configService.get('DB_DATABASE'),
          entities: [__dirname + '/**/*.entity{.ts,.js}'],
          synchronize: configService.get('DB_SYNCHRONIZE') === 'true',
          logging: true,
          autoLoadEntities: true,
        };
      },
    }), AuthModule,
        GraphqlModule,
      RideModule, PostModule, CommentModule, MessageModule, ChatModule, ReviewModule, UserModule, AppUserModule, AdminModule, AppUserRideModule, ReviewModule,EventStreamModule,SubscriptionModule],
        controllers: [AppController],
        providers: [AppService],
})
export class AppModule {}