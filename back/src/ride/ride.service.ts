import { Injectable } from '@nestjs/common';
import { CreateRideDto } from './dto/create-ride.dto';
import { UpdateRideDto } from './dto/update-ride.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Between, Repository } from 'typeorm';
import { Ride } from './entities/ride.entity';
import { GenericService } from '../services/genericService';
import { RideState } from './entities/ride.entity';
import { PaginationResult, PaginationService } from 'src/services/paginationService';
import { AppUserRideService } from 'src/app-user-ride/app-user-ride.service';
import { AppUserService } from 'src/app-user/app-user.service';
import { Post } from 'src/post/entities/post.entity';
import { CreateRideInput } from './dto/create-ride.input';
import { EventStreamService, EventType } from 'src/SSE/sse-subscription.service';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
import { AppUserWithRole } from 'src/graphql/types/AppUserWithRole';
import { Role } from 'src/enums/role';
import { App } from 'supertest/types';
@Injectable()
export class RideService extends GenericService {
  constructor(@InjectRepository(Ride) private readonly rideRepo:Repository<Ride>,   
  private readonly paginationService: PaginationService,
  private userService: AppUserService,
  private appUserRideService: AppUserRideService,
  private readonly EventStreamService: EventStreamService,
  

){
    
    super(rideRepo);
  }
  async createRide(createRideInput: CreateRideInput, post: Post): Promise<Ride> {
    //create a new ride and associate it with the post+post owner
    const ride = this.rideRepo.create({
      ...createRideInput,
      post,
      driver:post.postOwner,
    });
    return await this.rideRepo.save(ride);
  }
  
  async findByState(state: RideState): Promise<Ride[]> {
    return this.rideRepo.find({
      where: { state },
      relations: ['appUserRides','post','post.postOwner'],
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

  async findByDriver(driverId: number): Promise<Ride[]> {
    return this.rideRepo
      .createQueryBuilder('ride')
      .leftJoinAndSelect('ride.post', 'post')
      .leftJoinAndSelect('post.postOwner', 'postOwner')
      .leftJoinAndSelect('ride.appUserRides', 'appUserRide')
      .leftJoinAndSelect('appUserRide.appUser', 'appUser')
      .where('postOwner.id = :driverId', { driverId })
      .getMany();
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
async addPassengerToRide(rideId: number, userId: number): Promise<AppUserRide> {
  const ride = await this.rideRepo.findOne({ where: { id: rideId } });
  if (!ride) throw new Error('Ride not found');

  const user = await this.userService.findById(userId);
  if (!user) throw new Error('User not found');
  this.EventStreamService.emitEvent({ recipientId: userId, type: EventType.JOIN_ACCEPT, targetId: ride.id, payload: { userId } });
  return this.appUserRideService.addPassenger(user, ride);
}

  async findCommonRides(userId1: number, userId2: number): Promise<Ride[]> {
    return this.rideRepo
        .createQueryBuilder('ride')
        .leftJoin('ride.appUserRides', 'aur1')
        .leftJoin('ride.appUserRides', 'aur2')
        .leftJoin('aur1.appUser', 'user1')
        .leftJoin('aur2.appUser', 'user2')
        .where(
            `(aur1.role = 'passenger' AND user1.id = :userId1) OR (ride.driverId = :userId1)`,
            { userId1 }
        )
        .andWhere(
            `(aur2.role = 'passenger' AND user2.id = :userId2) OR (ride.driverId = :userId2)`,
            { userId2 }
        )
        .getMany();
  }





  async countRidesPerMonth(): Promise<{ month: string; count: number }[]> {
    const result = await this.rideRepo
        .createQueryBuilder('ride')
        .select("DATE_FORMAT(ride.date, '%Y-%m')", 'month') // ensures month is a string like '2025-12'
        .addSelect('COUNT(*)', 'count')
        .groupBy('month')
        .orderBy('month', 'DESC')
        .limit(12)
        .getRawMany();

    return result.map(row => ({
      month: row.month,                  // Make sure 'month' is a string
      count: parseInt(row.count, 10),
    }));
  }


  async findRecent(limit: number): Promise<Ride[]> {
    return this.rideRepo.find({
      order: { date: 'DESC' },
      take: limit,
    });
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
    if (appUserRide.appUser) {
      users.push(new AppUserWithRole(appUserRide.appUser, Role.PASSENGER));
    }
  });

  return users;
}
}
