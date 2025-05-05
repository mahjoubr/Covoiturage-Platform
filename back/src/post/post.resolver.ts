import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/post-graphql.dto';
import { Ride, RideState } from 'src/ride/entities/ride.entity';
import { Int } from 'type-graphql';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Logger } from '@nestjs/common';

@Resolver(() => Post)
export class PostResolver {
  private readonly logger = new Logger('EventEmitter');
  constructor(private readonly postService: PostService,
    @InjectRepository(Post) private readonly postRepository :Repository<Post>
  ) {}

  @Query(() => [Post], { name: 'getPosts' })
  async getPosts(): Promise<Post[]> {
    const posts = await this.postService.findAll();
    return posts.map(post => ({
      ...post,
      date: post.date instanceof Date ? post.date : new Date(post.date),
      relations: ['listRide']
    }));
  }

  @Query(() => Post, { name: 'getPostById' })
  async getPostById(@Args('id') id: string): Promise<Post> {
    const post = await this.postService.findOne(+id);
    return {
      ...post,
      date: post.date instanceof Date ? post.date : new Date(post.date)
    };
  }
  @Mutation(() => Post)
async createPost(@Args('createPostInput') createPostInput: CreatePostInput): Promise<Post> {
  return this.postService.create(createPostInput);
}


@Query(() => Ride, { name: 'matchingRide', nullable: true })
async getMatchingRide(@Args('postId', { type: () => Int }) postId: number): Promise<Ride | null> {
  const post = await this.postRepository.findOne({
    where: { id: postId },
    relations: ['listRide'],
  });
  this.logger.log(post?.listRide);
  if (!post) return null;

  const matchingRide = post.listRide.find(
    ride =>
      ride.state==RideState.NOT_STARTED
  );
  

  return matchingRide ?? null;
}




@Mutation(() => Boolean)  // You can return a boolean or the deleted post if you prefer
  async deletePost(@Args('id') id: number): Promise<boolean> {
    try {
      await this.postService.remove(id);
      return true;  // Return true if the post is successfully deleted
    } catch (error) {
      console.error(error);
      return false; // Return false in case of any error
    }
  }


  @Mutation(() => Post)
  async updatePost(
    @Args('id') id: number,  // The ID of the post to update
    @Args('status') status: string,  // The updated data
  ): Promise<Post> {
    return this.postService.update(id, status);  // Call the update method in the service
  }

}