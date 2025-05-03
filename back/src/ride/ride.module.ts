import { forwardRef, Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { Ride } from './entities/ride.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideResolver } from './ride.resolver';
import { Post } from 'src/post/entities/post.entity';
import { PostModule } from 'src/post/post.module';
import { RideSchedulerService } from './ride-scheduler.service';
import { AppUserModule } from 'src/app-user/app-user.module';
import { EventStreamModule } from 'src/SSE/sse.module';
import { SubscriptionModule } from 'src/subscription/subscription.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ride,Post]),forwardRef(() => PostModule), AppUserModule,
  EventStreamModule,SubscriptionModule ],
  controllers: [RideController], 
  providers: [RideService,RideResolver,RideSchedulerService],
  exports: [RideService]
})
export class RideModule {}