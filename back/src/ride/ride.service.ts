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
@Injectable()
export class RideService extends GenericService {
  constructor(@InjectRepository(Ride) private readonly rideRepo:Repository<Ride>,   
  private readonly paginationService: PaginationService,
  private userRepository: AppUserService,
  private appUserRideRepo: AppUserRideService,

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

}
