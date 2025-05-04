import { Resolver, Mutation, Args, Query } from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { JoinRequest } from './entities/join-request.entity';
import { JoinRequestService } from './join-request.service';
import { AppUser } from 'src/app-user/entities/app-user.entity';
import { PostService } from 'src/post/post.service';
import { Ride } from 'src/ride/entities/ride.entity';
import { GqlAuthGuard } from 'src/auth/guards/auth.Guard';
import { CurrentUser } from 'src/auth/user.decorator';
import { Int } from '@nestjs/graphql';
@Resolver(() => JoinRequest)
export class JoinRequestResolver {
  constructor(
    private readonly joinRequestService: JoinRequestService,
    private readonly postService: PostService,
  ) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => JoinRequest)
  async createJoinRequest(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser() user: AppUser,
  ): Promise<JoinRequest> {
    const post = await this.postService.findOne(postId);
    if (!post) throw new Error('Post not found');

    const ride = post.listRide?.find(r => new Date(r.date).toDateString() === new Date(post.date).toDateString());

    if (!ride) throw new Error('Matching ride not found in post');

  return this.joinRequestService.create({
    user,
    ride,
  }, postId);
  }

  @UseGuards(GqlAuthGuard)
  @Mutation(() => Boolean)
  async deleteJoinRequest(
    @Args('postId', { type: () => Int }) postId: number,
    @CurrentUser() user: AppUser,
  ): Promise<boolean> {
    const post = await this.postService.findOne(postId);
    if (!post) throw new Error('Post not found');

    const ride = post.listRide?.find(r => new Date(r.date).toDateString() === new Date(post.date).toDateString());

    if (!ride) throw new Error('Matching ride not found in post');

    return this.joinRequestService.deleteByUserAndRide(user.id, ride.id,postId);
  }

  @Query(() => JoinRequest)
  async getJoinRequestById(@Args('id') id: number): Promise<JoinRequest> {
    return this.joinRequestService.findOne(id);
  }

  @Query(() => [JoinRequest])
  async getAllJoinRequests(): Promise<JoinRequest[]> {
    return this.joinRequestService.findAll();
  }

  @Query(() => [JoinRequest])
  async getJoinRequestsByRide(@Args('rideId') rideId: number): Promise<JoinRequest[]> {
    return this.joinRequestService.findByRideId(rideId);
  }
  @Query(() => [JoinRequest])
  async getJoinRequestsByRideUser(@Args('rideId', { type: () => Int }) rideId: number,
  @Args('userId', { type: () => Int }) userId: number,): Promise<JoinRequest[]> {
    return this.joinRequestService.findByRideUser(rideId,userId);
  }
}
