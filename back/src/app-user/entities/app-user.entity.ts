import { ChildEntity, Column, Entity, OneToMany } from 'typeorm';
import { ObjectType, Field } from '@nestjs/graphql'; // Import GraphQL decorators
import { User } from '../../user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Review } from 'src/review/entities/review.entity';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
@ChildEntity()
@ObjectType() // Add @ObjectType() to mark this as a GraphQL type
export class AppUser extends User {
  @Field()
  @Column()
  @Field() // Expose this field in GraphQL
  name: string;

  @Field()
  @Column()
  @Field() // Expose this field in GraphQL
  lastName: string;

  @Field({ nullable: true })
  @Column({  nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phoneNumber: string;
  
  @Field()
  @Column()
  @Field() // Expose this field in GraphQL
  imageUrl: string;

  @OneToMany(() => Post, (post) => post.postOwner)
  @Field(() => [Post]) // Expose this field in GraphQL
  posts: Post[];

  @OneToMany(() => Review, (review) => review.reviewedUser)
  @Field(() => [Review]) // Expose this field in GraphQL
  reviews: Review[];

  @Column({ type: 'float' })
  @Field() // Expose this field in GraphQL
  rating: number;

  @OneToMany(() => AppUserRide, (appUserRide) => appUserRide.appUser)
  @Field(() => [AppUserRide]) // Expose this field in GraphQL
  appUserRides: AppUserRide[];
}
