import { Entity, PrimaryGeneratedColumn, Column ,OneToMany} from 'typeorm';
import { AppUserRide } from 'src/app-user-ride/entities/app-user-ride.entity';
export enum RideState {
  NOT_STARTED = 'NotStarted',
  STARTED = 'Started',
  CLOSED = 'Closed',
}

@Entity()
export class Ride {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'date' })
  date: Date;

  @Column({ type: 'time' })
  time: string;

  @Column({ type: 'time' })
  departure: string;

  @Column({ type: 'time' })
  arrival: string;

  @Column('decimal')
  price: number;

  @Column()
  nbPassengers: number;

  @Column({
    type: 'enum',
    enum: RideState,
    default: RideState.NOT_STARTED,
  })
  state: RideState;

  @OneToMany(() => AppUserRide, appUserRide => appUserRide.ride)
  appUserRides: AppUserRide[];
}
