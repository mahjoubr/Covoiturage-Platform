import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Chat } from 'src/chat/entities/chat.entity';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
    @InjectRepository(User) private userRepository: Repository<User>,
  ) {

  }
  async create(createMessageDto: CreateMessageDto) {
    if (!createMessageDto.chatId) {
      throw new Error('Chat ID is required.');
    }
  
    const chat = await this.chatRepository.findOne({ where: { id: createMessageDto.chatId },
      relations: ['messages'], });
    if (!chat) {
      throw new Error('Chat not found.');
    }
  
    const sender = await this.userRepository.findOne({ where: { id: createMessageDto.senderId } });
    if (!sender) {
      throw new Error('Sender not found.');
    }
  
    const message = this.messageRepository.create({
      text: createMessageDto.text,
      chat: chat,
      sender: sender,
    });
    chat.messages.push(message); 

     await this.chatRepository.save(chat);
    return this.messageRepository.save(message);
  }
  
  async getChatMessages(chatId: number) {
    const messages=await this.messageRepository
      .createQueryBuilder('message')
      .leftJoinAndSelect('message.sender', 'sender')
      .leftJoinAndSelect('message.chat', 'chat')
      .where('chat.id = :id', { id: chatId })
      .getMany();
      console.log('messages', messages);
      return messages;

    };
  

  findAll() {
    return this.messageRepository.find({ relations: ['sender', 'chat'] });
  }

  findOne(id: number) {
    return this.messageRepository.findOne({ where: { id }, relations: ['sender', 'chat'] });
  }

  update(id: number, updateMessageDto: UpdateMessageDto) {
    return this.messageRepository.update(id, updateMessageDto).then(() => {
      return this.messageRepository.findOne({ where: { id }, relations: ['sender', 'chat'] });
    });
  }

  remove(id: number) {
    return this.messageRepository.delete(id).then(() => {
      return { deleted: true };
    });
  }
}
