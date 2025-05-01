import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { Ride } from './entities/ride.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideResolver } from './ride.resolver';
import { PaginationService } from 'src/services/paginationService';
import { AppUserRideService } from 'src/app-user-ride/app-user-ride.service';
import { AppUserService } from 'src/app-user/app-user.service';
import { AppUserModule } from 'src/app-user/app-user.module';
import { AppUserRideModule } from 'src/app-user-ride/app-user-ride.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ride]),
          AppUserModule,
          AppUserRideModule],
  controllers: [RideController], 
  providers: [RideService,RideResolver,PaginationService],
  exports: [RideService]
})
export class RideModule {}