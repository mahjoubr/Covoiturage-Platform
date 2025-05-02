// src/review/review.resolver.ts
import { Resolver, Query } from '@nestjs/graphql';
import { Review } from './entities/review.entity';
import { ReviewService } from './review.service';
import { CurrentUser } from 'src/auth/user.decorator';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from 'src/auth/guards/auth.Guard';
import {  GraphQLInt } from 'graphql';

@Resolver(() => Review)
export class ReviewResolver {
  constructor(private readonly reviewService: ReviewService) {}

  @Query(() => [Review], { name: 'getAllReviews' })
  getAllReviews(): Promise<Review[]> {
    return this.reviewService.findAll();
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => [Review], { name: 'getMyReviews' })
  getMyReviews(@CurrentUser() user: AppUser): Promise<Review[]> {
    return this.reviewService.findByReviewedUserId(user.id);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => GraphQLInt, { name: 'getAverageRating' })
  getAverageRating(@CurrentUser() user: AppUser): Promise<number> {
    return this.reviewService.getAverageRating(user.id);
  }
}
