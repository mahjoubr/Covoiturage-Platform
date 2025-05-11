import { Resolver, Query, Args, Int, Info } from '@nestjs/graphql';
import { ReviewFormData, UserInfo, RideDetails, ReviewItem} from '../graphql/types/review-form-data.model'; 
import { AppUserService } from 'src/app-user/app-user.service';
import { RideService } from '../ride/ride.service';
import { CurrentUser } from 'src/auth/user.decorator';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { ReviewService } from './review.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.Guard';
import { Review } from './entities/review.entity';
import { PaginationResult } from 'src/services/paginationService';
import { PaginatedReviewsResponse } from 'src/graphql/types/PaginatedReviewsResponse';

@Resolver()
export class ReviewResolver {
  constructor(
    private userService: AppUserService,
    private rideService: RideService,
    private reviewService: ReviewService
  ) {}



  


 @Query(() => ReviewFormData)
  async reviewFormData(
    @Args('rideId', { type: () => Int }) rideId: number,
    @Args('reviewedUserId', { type: () => Int }) reviewedUserId: number
  ): Promise<ReviewFormData> {
    console.log('rideId:', rideId);
    console.log('reviewedUserId:', reviewedUserId);
    const user = (await this.userService.findByIds([reviewedUserId]))[0];
    console.log(user);
    const ride = (await this.rideService.findByIds([rideId]))[0];
    console.log(ride);
    if (!user || !ride) {
      throw new Error('User or ride not found');
    }
    return {
      reviewedUser: {
        id: user.id,
        imageUrl: user.imageUrl,
        name: user.name,
        
      },
      ride: {
        id: ride.id,
        departure: ride.departure,
        date: new Date(ride.date).toISOString().split('T')[0],
        arrival: ride.arrival,
        price: ride.price,
        time: ride.time,
      },
    };
  }

  @UseGuards(GqlAuthGuard)
  @Query(() => PaginatedReviewsResponse, { name: 'getMyReviews' })
  async getMyReviews(
    @CurrentUser() user: AppUser,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 6 }) limit: number
  ): Promise<PaginationResult<Review>> {
    return this.reviewService.findByReviewerId(user.id, page, limit);
  }
  
  @Query(() => PaginatedReviewsResponse, { name: 'getUserReviews' })
  getUserReviews(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('page', { type: () => Int, nullable: true, defaultValue: 1 }) page: number,
    @Args('limit', { type: () => Int, nullable: true, defaultValue: 6 }) limit: number
  ): Promise<PaginationResult<Review>> {
    return this.reviewService.findByReviewedUserId(userId, page, limit);
  }
}
