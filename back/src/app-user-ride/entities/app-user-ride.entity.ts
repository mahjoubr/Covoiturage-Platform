import { Entity, PrimaryGeneratedColumn, Column,ManyToOne } from 'typeorm';
import { AppUser} from 'src/app-user/entities/app-user.entity';
import { Ride } from 'src/ride/entities/ride.entity';
export enum Role {
  DRIVER = 'driver',
  PASSENGER = 'passenger',
}

@Entity()
export class AppUserRide {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: Role,
  })
  role: Role;

  @ManyToOne(() => AppUser, appUser => appUser.appUserRides)
  appUser: AppUser;

  @ManyToOne(() => Ride, ride => ride.appUserRides)
  ride: Ride;

}
