import { Module } from '@nestjs/common';
import { RideService } from './ride.service';
import { RideController } from './ride.controller';
import { Ride } from './entities/ride.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RideResolver } from './ride.resolver';
import { Post } from 'src/post/entities/post.entity';
import { PostModule } from 'src/post/post.module';

@Module({
  imports: [TypeOrmModule.forFeature([Ride,Post]),PostModule],
  controllers: [RideController], 
  providers: [RideService,RideResolver],
  exports: [RideService]
})
export class RideModule {}