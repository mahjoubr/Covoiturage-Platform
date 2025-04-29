import { ChildEntity, Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Review } from 'src/review/entities/review.entity';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
import { Field, GraphQLISODateTime, ObjectType } from '@nestjs/graphql';
@ChildEntity()
@ObjectType()
export class AppUser extends User {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  lastName: string;

  @Field({ nullable: true })
  @Column({  nullable: true })
  dateOfBirth: string;

  @Column({ nullable: true })
  @Field(() => String, { nullable: true })
  phoneNumber: string;
  
  @Field()
  @Column()
  imageUrl: string;

  @OneToMany(()=>Post,post=>post.user)
  posts:Post[];

  @OneToMany(() => Review, review => review.reviewedUser)
  reviews: Review[];

  @Column({ type: 'float' })
  rating: number; 
  
  @OneToMany(() => AppUserRide, appUserRide => appUserRide.appUser)
  appUserRides: AppUserRide[];

}
