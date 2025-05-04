import { AppUserRide } from '../../app-user-ride/entities/app-user-ride.entity';
import { Entity, PrimaryGeneratedColumn, Column, OneToMany, ManyToOne, OneToOne, ManyToMany } from 'typeorm';
import { ObjectType, Field, GraphQLISODateTime } from '@nestjs/graphql'; // Import GraphQL decorators
import { Post } from '../../post/entities/post.entity';
import { JoinRequest } from 'src/join-request/entities/join-request.entity';

export enum RideState {
  NOT_STARTED = 'NotStarted',
  STARTED = 'Started',
  CLOSED = 'Closed',
}

@ObjectType() 
@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  @Field() 
  id: number;

  @Column({ type: 'date' })
  @Field(() =>  GraphQLISODateTime) 
  date: Date;

  @Column({ type: 'time' })
  @Field() 
  time: string;

  @Column()
  @Field()
  departure: string;

  @Column()
  @Field() 
  arrival: string;

  @Column('decimal')
  @Field() 
  price: number;

  @Column()
  @Field()
  nbPassengers: number;

  @Column({
    type: 'enum',
    enum: RideState,
    default: RideState.NOT_STARTED,
  })
  @Field() 
  state: RideState;

  @OneToMany(() => AppUserRide, (appUserRide) => appUserRide.ride)
  @Field(() => [AppUserRide]) 
  appUserRides: AppUserRide[];

  @ManyToOne(() => Post, post => post.listRide)
  @Field(()=>Post)
  post: Post;

  
  @Field(()=>[JoinRequest],{nullable:true})
  @OneToMany(()=>JoinRequest,joinRequest=>joinRequest.ride)
  joinRequests: JoinRequest[];
}
