import { Resolver, Query, Args, Int, Info } from '@nestjs/graphql';
import { ReviewFormData, UserInfo, RideDetails, ReviewItem} from '../graphql/types/review-form-data.model'; 
import { AppUserService } from 'src/app-user/app-user.service';
import { RideService } from '../ride/ride.service';
import { CurrentUser } from 'src/auth/user.decorator';
import { User } from 'src/user/entities/user.entity';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { GraphQLResolveInfo } from 'graphql';
import graphqlFields from 'graphql-fields';
import { ReviewService } from './review.service';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.Guard';
import { Review } from './entities/review.entity';

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
  @Query(() => [Review], { name: 'getMyReviews' })
  async getMyReviews(@CurrentUser() user: AppUser): Promise<Review[]> {
    console.log('hi everyone its me again \n \n\n');
  
    return this.reviewService.findByReviewerId(user.id);
  }

  /*
  @UseGuards(GqlAuthGuard)
  @Query(() => [ReviewItem], { name: 'getMyReviews' })
  async getMyReviews(@CurrentUser() user: AppUser) {
    const reviews = await this.reviewService.findByReviewerId(user.id);

    const results= reviews.map((r) => ({
      id:        r.id,
      rating:    r.stars,
      comment:   r.comment,
      createdAt: r.date,

      ride: {
        id:        r.ride.id,
        departure: r.ride.departure,
        arrival:   r.ride.arrival,
        date:      r.ride.date,
        time:      r.ride.time,
        price:     Number(r.ride.price),
      },

      reviewedUser: {
        id:       r.reviewedUser.id,
        name:     r.reviewedUser.name,
        lastName: r.reviewedUser.lastName,
        imageUrl: r.reviewedUser.imageUrl,
        // omit phoneNumber / rating if you don't need them here
      },
    }));

    console.log('results:', results);
    return results;
  }
  */


  @Query(() => [Review], { name: 'getUserReviews' })
  getUserReviews(
    @Args('userId', { type: () => Int }) userId: number,
  ): Promise<Review[]> {
    console.log('userId:', userId);
    return this.reviewService.findByReviewedUserId(userId);
  }
}
