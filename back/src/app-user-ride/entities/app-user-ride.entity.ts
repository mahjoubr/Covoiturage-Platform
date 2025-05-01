import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, Unique } from 'typeorm';
import { ObjectType, Field, registerEnumType } from '@nestjs/graphql'; // Import GraphQL decorators
import { AppUser } from '../../app-user/entities/app-user.entity';
import { Ride } from '../../ride/entities/ride.entity';

// Define the GraphQL enum
export enum Role {
  DRIVER = 'driver',
  PASSENGER = 'passenger',
}

// Register the Role enum for GraphQL
registerEnumType(Role, {
  name: 'Role', // The name of the enum in GraphQL
  description: 'The role of the user in the ride', // Optional description
});

@ObjectType() // Add @ObjectType() to expose this as a GraphQL type
@Entity()
@Unique(['appUser', 'ride'])
export class AppUserRide {
  @PrimaryGeneratedColumn()
  @Field() // Expose this field in GraphQL
  id: number;

  @Column({
    type: 'enum',
    enum: Role,
  })
  @Field(() => Role) // Expose the Role enum in GraphQL
  role: Role;

  @ManyToOne(() => AppUser, (appUser) => appUser.appUserRides)
  @Field(() => AppUser) // Expose the related AppUser in GraphQL
  appUser: AppUser;

  @ManyToOne(() => Ride, (ride) => ride.appUserRides)
  @Field(() => Ride) 
  ride: Ride;
}
