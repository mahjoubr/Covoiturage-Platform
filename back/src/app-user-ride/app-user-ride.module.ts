import { Module } from '@nestjs/common';
import { AppUserRideService } from './app-user-ride.service';
import { AppUserRideController } from './app-user-ride.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppUserRide } from './entities/app-user-ride.entity';
import { SubscriptionModule } from 'src/subscription/subscription.module';
import { EventStreamModule } from 'src/SSE/sse.module';

@Module({
  controllers: [AppUserRideController],
  imports: [TypeOrmModule.forFeature([AppUserRide]),SubscriptionModule,EventStreamModule],
  providers: [AppUserRideService], 
  exports: [AppUserRideService]
})
export class AppUserRideModule {}
