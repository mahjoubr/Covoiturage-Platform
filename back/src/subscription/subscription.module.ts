import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from 'src/post/entities/post.entity';
import { EventStreamModule } from 'src/SSE/sse.module';
import { SubscriptionService } from './subscription.service';
import { Subscription } from './entities/subscription.entity';


@Module({
  imports: [
    TypeOrmModule.forFeature([Post]),
    TypeOrmModule.forFeature([Subscription]),
    EventStreamModule,
  ],
  providers: [SubscriptionService],
  exports: [SubscriptionService],
})
export class SubscriptionModule {}