import { Message } from 'src/message/entities/message.entity';
import { Entity, OneToMany,ManyToOne, PrimaryGeneratedColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from 'src/user/entities/user.entity';
import { Ride } from 'src/ride/entities/ride.entity';

@Entity()
export class Chat {
  @PrimaryGeneratedColumn()
  id: number;

  @OneToMany(()=>Message,message=>message.chat)
  messages: Message[];

  @ManyToOne(() => User, { eager: true })
  driver: User;

  @ManyToOne(() => User, { eager: true })
  rider: User;
  
  @OneToOne(() => Ride, { eager: true })  
  @JoinColumn()
  ride: Ride;
}
