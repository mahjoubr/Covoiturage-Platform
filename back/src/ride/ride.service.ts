import { Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { GenericService } from '../services/genericService';
import { RideState } from './entities/ride.entity';
import { PaginationResult, PaginationService } from 'src/services/paginationService';
import { CreateRideInput } from './dto/create-ride.input';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
import { AppUserRideService } from 'src/app-user-ride/app-user-ride.service';
import { AppUserService } from 'src/app-user/app-user.service';
import { Post } from 'src/post/entities/post.entity';
import { AppUserWithRole } from 'src/graphql/types/AppUserWithRole';
import { Role } from 'src/app-user-ride/entities/app-user-ride.entity';
import { App } from 'supertest/types';
@Injectable()
export class RideService extends GenericService {
  constructor(@InjectRepository(Ride) private readonly rideRepo:Repository<Ride>,   
  private readonly paginationService: PaginationService,
  private userService: AppUserService,
  private appUserRideService: AppUserRideService,

){
    
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
      relations: ['appUserRides','post'],
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
async findPaginatedByDriver(
  driverId: number,
  page = 1,
  limit = 10,
): Promise<PaginationResult<Ride>> {
  const qb = this.rideRepo
    .createQueryBuilder('ride')
    .leftJoinAndSelect('ride.appUserRides', 'appUserRides')
    .leftJoinAndSelect('appUserRides.appUser', 'appUser')
    .leftJoin('ride.driver', 'driver')
    .where('driver.id = :driverId', { driverId });

  return this.paginationService.paginateQuery(qb, page, limit);
}

async findPaginatedByPassenger(
  passengerId: number,
  page = 1,
  limit = 10,
): Promise<PaginationResult<Ride>> {
  const qb = this.rideRepo
  .createQueryBuilder('ride')
  .leftJoinAndSelect('ride.driver', 'driver')
  .leftJoin('ride.appUserRides', 'appUserRide')
  .leftJoin('appUserRide.appUser', 'appUser')
  .where('appUser.id = :passengerId', { passengerId });


  return this.paginationService.paginateQuery(qb, page, limit);
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
// ride.service.ts
// ride.service.ts
// ride.service.ts
async addPassengerToRide(rideId: number, userId: number): Promise<AppUserRide> {
  const ride = await this.rideRepo.findOne({ where: { id: rideId } });
  if (!ride) throw new Error('Ride not found');

  const user = await this.userService.findById(userId);
  if (!user) throw new Error('User not found');

  return this.appUserRideService.addPassenger(user, ride);
}

async findByUserId(userId: number): Promise<Ride[]> {
  return this.rideRepo
    .createQueryBuilder('ride')
    .leftJoinAndSelect('ride.appUserRides', 'appUserRide')
    .leftJoinAndSelect('appUserRide.appUser', 'appUser')
    .leftJoinAndSelect('ride.driver', 'driver')
    .leftJoinAndSelect('ride.post', 'post')
    .leftJoinAndSelect('ride.joinRequests', 'joinRequests')
    .where('appUser.id = :userId', { userId }) // User is a passenger
    .orWhere('driver.id = :userId', { userId }) // User is a driver
    .getMany();
}

async getUsersForRide(rideId: number): Promise<AppUserWithRole[]> {
  const ride = await this.rideRepo.findOne({
    where: { id: rideId },
    relations: ['driver', 'appUserRides', 'appUserRides.appUser'],
  });

  if (!ride) {
    throw new Error('Ride not found');
  }

  const users: AppUserWithRole[] = [];

  // Add driver if exists
  if (ride.driver) {
    users.push(new AppUserWithRole(ride.driver, Role.DRIVER));
  }

  // Add passengers
  ride.appUserRides.forEach((appUserRide) => {
    if (appUserRide.role === Role.PASSENGER && appUserRide.appUser) {
      users.push(new AppUserWithRole(appUserRide.appUser, Role.PASSENGER));
    }
  });

  return users;
}
}
