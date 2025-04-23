import { Injectable, NotFoundException } from '@nestjs/common';
import { GenericService } from 'src/services/genericService';
import { InjectRepository } from '@nestjs/typeorm';
import { AppUser } from './entities/app-user.entity';
import { Repository } from 'typeorm';
import { UpdateUserDto } from 'src/user/dto/update-user.dto';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class AppUserService extends GenericService {
  constructor(
    
    @InjectRepository(AppUser)
    private readonly appUserRepo: Repository<AppUser>,

  ) {
    super(appUserRepo);
  }
  async update(id: number, dto: UpdateUserDto): Promise<AppUser> {
    const user = await this.appUserRepo.findOne({ where: { id} });
    if (!user) throw new NotFoundException('AppUser not found');
    Object.assign(user, dto);
    return this.appUserRepo.save(user);
  }
  async findByEmail(email: string): Promise<User | null> {
    return this.appUserRepo.findOne({ where: { email } });
  }
  
}