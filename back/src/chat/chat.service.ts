import { Injectable } from '@nestjs/common';
import { CreateChatDto } from './dto/create-chat.dto';
import { UpdateChatDto } from './dto/update-chat.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Chat } from './entities/chat.entity';
import { Repository } from 'typeorm';
import { Ride } from 'src/ride/entities/ride.entity';

@Injectable()
export class ChatService {
  constructor( @InjectRepository(Chat)
  private chatRepository: Repository<Chat>,

  @InjectRepository(User)
  private userRepository: Repository<User>,

  @InjectRepository(Ride)
  private rideRepository: Repository<Ride>,) {

  }

  async create(createChatDto: CreateChatDto) {
    if(!createChatDto.driverId || !createChatDto.riderId || !createChatDto.rideId) {
      throw new Error('Driver ID, Rider ID, and Ride ID are required.');
    }
    const ride=await this.rideRepository.findOne({ where: { id: createChatDto.rideId } });
    if (!ride) {
      throw new Error('Ride not found.');
    }
    const status = ride.state;
    if(status !=='Closed'){
      
      const driver = await this.userRepository.findOne({ where: { id: createChatDto.driverId } });
      const rider = await this.userRepository.findOne({ where: { id: createChatDto.riderId } });
      const chat = this.chatRepository.create({
        driver: driver,
        rider: rider,
        ride: ride
      } as Partial<Chat>);
            return await this.chatRepository.save(chat);
    }
    
  }

  findAll() {
    return `This action returns all chat`;
  }

  findOne(id: number) {
    return `This action returns a #${id} chat`;
  }

  update(id: number, updateChatDto: UpdateChatDto) {
    return `This action updates a #${id} chat`;
  }

  remove(id: number) {
    return `This action removes a #${id} chat`;
  }
}
