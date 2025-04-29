import { Resolver, Query, Args, Mutation, Int, GraphQLISODateTime } from '@nestjs/graphql';
import { Ride, RideState } from './entities/ride.entity';
import { RideService } from './ride.service';
import { CreateRideInput } from './dto/create-ride.input';
import { UpdateRideInput } from './dto/update-ride.input';
import { NotFoundException } from '@nestjs/common';

@Resolver(() => Ride)
export class RideResolver {
  constructor(private readonly rideService: RideService) {}

  @Query(() => [Ride], { name: 'getAllRides' })
  async findAll(): Promise<Ride[]> {
    const rides = await this.rideService.findAll();
    
    // Ensure date is properly formatted as Date object
    return rides.map(ride => ({
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    }));
  }

  @Query(() => Ride, { name: 'getRideById' })
  async findOne(@Args('id', { type: () => Int }) id: number): Promise<Ride> {
    const ride = await this.rideService.findOne(id);
    
    // Ensure date is properly formatted as Date object
    return {
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    };
  }

  @Mutation(() => Ride)
  async createRide(@Args('createRideInput') createRideInput: CreateRideInput): Promise<Ride> {
    // Ensure date is saved as a Date object
    if (createRideInput.date && typeof createRideInput.date === 'string') {
      createRideInput.date = new Date(createRideInput.date);
    }
    
    return this.rideService.create(createRideInput);
  }

  @Mutation(() => Ride)
  async updateRide(
    @Args('id', { type: () => Int }) id: number,
    @Args('updateRideInput') updateRideInput: UpdateRideInput
  ): Promise<Ride> {
    // Ensure date is saved as a Date object if provided
    if (updateRideInput.date && typeof updateRideInput.date === 'string') {
      updateRideInput.date = new Date(updateRideInput.date);
    }
    
    return this.rideService.update(id, updateRideInput);
  }

  @Mutation(() => Boolean)
  async removeRide(@Args('id', { type: () => Int }) id: number): Promise<boolean> {
    try {
      await this.rideService.remove(id);
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
    
    // Ensure dates are properly formatted
    return rides.map(ride => ({
      ...ride,
      date: ride.date instanceof Date ? ride.date : new Date(ride.date)
    }));
  }
}