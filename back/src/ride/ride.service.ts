import { Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { GenericService } from '../services/genericService';
import { RideState } from './entities/ride.entity';
import { CreateRideInput } from './dto/create-ride.input';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { Post } from 'src/post/entities/post.entity';
@Injectable()
export class RideService extends GenericService {
  constructor(@InjectRepository(Ride) private readonly rideRepo:Repository<Ride>){
    super(rideRepo);
  }
  async createRide(createRideInput: CreateRideInput, post: Post): Promise<Ride> {
    // Create a new ride and associate it with the post
    const ride = this.rideRepo.create({
      ...createRideInput,
      post, // Associate the ride with the post
    });

    // Save the ride in the database
    return await this.rideRepo.save(ride);
  }
  
  async findByState(state: RideState): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { state },
      relations: ['appUserRides'],
    });
  }

  async findByDateRange(startDate: Date, endDate: Date): Promise<Ride[]> {
    return this.rideRepo.find({
      where: {
        date: Between(startDate, endDate),
      },
      relations: ['appUserRides'],
    });
  }
  // ride.service.ts

async findByDriver(driverId: number): Promise<Ride[]> {
  return this.rideRepo.find({
    where: {
      post: {
        postOwner: {
          id: driverId,
        },
      },
    },
    relations: ['post', 'post.postOwner', 'appUserRides'],
  });
}

async findByPassenger(passengerId: number): Promise<Ride[]> {
  return this.rideRepo
    .createQueryBuilder('ride')
    .innerJoin('ride.appUserRides', 'appUserRide')
    .innerJoin('appUserRide.appUser', 'appUser')
    .where('appUser.id = :passengerId', { passengerId })
    .leftJoinAndSelect('ride.post', 'post')
    .leftJoinAndSelect('post.postOwner', 'driver')
    .leftJoinAndSelect('ride.appUserRides', 'allAppUserRides')
    .leftJoinAndSelect('allAppUserRides.appUser', 'eachPassenger')
    .getMany();
}

}
