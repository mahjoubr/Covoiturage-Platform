// notification.module.ts
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NotificationService } from './notification.service';
import { NotificationResolver } from './notification.resolver';
import { Notification } from './entities/notification.entity';
import { SseNotificationsController } from '../SSE/sse-notifications.controller';
import { SseSubscriptionService, EventStreamService } from '../SSE/sse-subscription.service';
import { SubscriptionModule } from '../subscription/subscription.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Notification]),
    SubscriptionModule, // Import your subscription module
  ],
  controllers: [SseNotificationsController],
  providers: [
    NotificationService,
    NotificationResolver,
    SseSubscriptionService,
    EventStreamService,
  ],
  exports: [
    NotificationService,
    SseSubscriptionService,
    EventStreamService,
  ],
})
export class NotificationModule {}