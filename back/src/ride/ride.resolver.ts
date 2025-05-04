import { Resolver, Query, Args, Mutation, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Ride, RideState } from './entities/ride.entity';
import { RideService } from './ride.service';
import { CreateRideInput } from './dto/create-ride.input';
import { UpdateRideInput } from './dto/update-ride.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.Guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post } from 'src/post/entities/post.entity';
import { PostService } from 'src/post/post.service';
import { PaginationResult } from 'src/services/paginationService';
import { RidePaginationResult } from './dto/ride-pagination-result';

@Resolver(() => Ride)
export class RideResolver {
  constructor(private readonly rideService: RideService,private readonly postrepo :PostService) {}

  @Query(() => [Ride], { name: 'getAllRides' })
  async findAll(): Promise<Ride[]> {
    const rides = await this.rideService.findAll();
    return rides.map(ride => ({
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    }));
  }

  @Query(() => Ride, { name: 'getRideById' })
  async findOne(@Args('id', { type: () => String }) id: string): Promise<Ride> {
    const ride = await this.rideService.findOne(+id);
    return {
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    };
  }

  @Mutation(() => Ride)
  async createRide(
    @Args('createRideInput') createRideInput: CreateRideInput,
    @Args('postId') postId: number,  // Accept the postId as a parameter
  ): Promise<Ride> {
    if (createRideInput.date && typeof createRideInput.date === 'string') {
      createRideInput.date = new Date(createRideInput.date);
    }
    

  
  
    // Find the post by the provided postId
    const post = await this.postrepo.findOne(postId);
  
    if (!post) {
      throw new Error('Post not found');
    }
  
    // Create a new Ride and associate it with the found Post
    const ride = await this.rideService.createRide(createRideInput, post);
  
    return ride;
  }
  
  
  
  

  @Mutation(() => Ride)
  async updateRide(
    @Args('id', { type: () => String }) id: string,
    @Args('updateRideInput') updateRideInput: UpdateRideInput
  ): Promise<Ride> {
    if (updateRideInput.date && typeof updateRideInput.date === 'string') {
      updateRideInput.date = new Date(updateRideInput.date);
    }
    
    return this.rideService.update(+id, updateRideInput);
  }

  @Mutation(() => Boolean)
  async removeRide(@Args('id', { type: () => String }) id: String): Promise<boolean> {
    try {
      await this.rideService.remove(+id);
      return true;
    } catch (error) {
      if (error instanceof NotFoundException) {
        return false;
      }
      throw error;
    }
  }
  

  @Query(() => [Ride], { name: 'getRidesByState' })
  async findByState(@Args('state', { type: () => String }) state: RideState): Promise<Ride[]> {
    const rides = await this.rideService.findByState(state);

    return rides.map(ride => ({
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    }));
  }

  @Query(() => [Ride], { name: 'getRidesByDateRange' })
  async findByDateRange(
    @Args('startDate', { type: () => GraphQLISODateTime }) startDate: Date,
    @Args('endDate', { type: () => GraphQLISODateTime }) endDate: Date
  ): Promise<Ride[]> {
    const rides = await this.rideService.findByDateRange(startDate, endDate);

    return rides.map(ride => ({
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    }));
  }
  @Query(() => [Ride], { name: 'getRidesByDriver' })
@UseGuards(GqlAuthGuard)
async getRidesByDriver(@CurrentUser() user: AppUser): Promise<Ride[]> {
  const rides = await this.rideService.findByDriver(user.id);
  return rides.map(ride => ({
    ...ride,
    date: ride.date instanceof Date ? ride.date : new Date(ride.date)
  }));
}

@Query(() => RidePaginationResult, { name: 'getRidesPaginatedByDriver' })
@UseGuards(GqlAuthGuard)
async getRidesPaginatedByDriver(
  @CurrentUser() user: AppUser,
  @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
  @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
): Promise<PaginationResult<Ride>> {
  const result = await this.rideService.findPaginatedByDriver(user.id, page, limit);

  result.data = result.data.map(ride => ({
    ...ride,
    date: ride.date instanceof Date ? ride.date : new Date(ride.date),
  }));

  return result;
}

@Query(() => RidePaginationResult, { name: 'getRidesPaginatedByPassenger' })
@UseGuards(GqlAuthGuard)
async getRidesPaginatedByPassenger(
  @CurrentUser() user: AppUser,
  @Args('page', { type: () => Int, defaultValue: 1 }) page: number,
  @Args('limit', { type: () => Int, defaultValue: 10 }) limit: number,
): Promise<PaginationResult<Ride>> {
  const result = await this.rideService.findPaginatedByPassenger(user.id, page, limit);

  result.data = result.data.map(ride => ({
    ...ride,
    date: ride.date instanceof Date ? ride.date : new Date(ride.date),
  }));

  return result;
}



@Query(() => [Ride], { name: 'getRidesByPassenger' })
@UseGuards(GqlAuthGuard)
async getRidesByPassenger(@CurrentUser() user: AppUser): Promise<Ride[]> {
  const rides = await this.rideService.findByPassenger(user.id);
  return rides.map(ride => ({
    ...ride,
    date: ride.date instanceof Date ? ride.date : new Date(ride.date)
  }));
}
}