import { Injectable } from '@nestjs/common';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Repository } from 'typeorm';
import { Chat } from 'src/chat/entities/chat.entity';

@Injectable()
export class MessageService {
  constructor(
    @InjectRepository(Message) private messageRepository: Repository<Message>,
    @InjectRepository(Chat) private chatRepository: Repository<Chat>,
  ) {

  }
  create(createMessageDto: CreateMessageDto) {
    const message = this.messageRepository.create(createMessageDto);
    return this.messageRepository.save(message);
  }
  getChatMessages(chatId: number) {
    return this.chatRepository.findOne({ where: { id: chatId }, relations: ['messages', 'messages.sender'] }).then(chat => {
      if (!chat) {
        throw new Error('Chat not found');
      }
      return chat.messages;
    });
  }

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
