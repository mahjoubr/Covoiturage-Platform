import { ChildEntity, Column, Entity, OneToMany } from 'typeorm';
import { User } from '../../user/entities/user.entity';
import { Post } from 'src/post/entities/post.entity';
import { Review } from 'src/review/entities/review.entity';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
import { Field, ObjectType } from '@nestjs/graphql';
@ChildEntity()
@ObjectType()
export class AppUser extends User {
  @Field()
  @Column()
  name: string;

  @Field()
  @Column()
  lastName: string;

  @Field()
  @Column({ type: 'date' })
  dateOfBirth: Date;

  @Column()
  @Field()
  phoneNumber: string;
  
  @Field()
  @Column()
  imageUrl: string;

  @OneToMany(()=>Post,post=>post.postOwner)
  posts:Post[];

  @OneToMany(() => Review, review => review.reviewedUser)
  reviews: Review[];

  @Column({ type: 'float' })
  rating: number; 
  
  @OneToMany(() => AppUserRide, appUserRide => appUserRide.appUser)
  appUserRides: AppUserRide[];

}
