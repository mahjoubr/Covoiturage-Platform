import { Resolver, Query, Args, Mutation } from '@nestjs/graphql';
import { Post } from './entities/post.entity';
import { PostService } from './post.service';
import { CreatePostInput } from './dto/post-graphql.dto';

@Resolver(() => Post)
export class PostResolver {
  constructor(private readonly postService: PostService) {}

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

}