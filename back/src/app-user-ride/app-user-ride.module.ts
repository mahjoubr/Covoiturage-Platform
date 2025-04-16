import { Module } from '@nestjs/common';
import { AppUserRideService } from './app-user-ride.service';
import { AppUserRideController } from './app-user-ride.controller';

@Module({
  controllers: [AppUserRideController],
  providers: [AppUserRideService],
})
export class AppUserRideModule {}
