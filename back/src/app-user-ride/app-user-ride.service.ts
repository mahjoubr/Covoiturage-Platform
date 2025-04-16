import { Injectable } from '@nestjs/common';
import { CreateAppUserRideDto } from './dto/create-app-user-ride.dto';
import { UpdateAppUserRideDto } from './dto/update-app-user-ride.dto';

@Injectable()
export class AppUserRideService {
  create(createAppUserRideDto: CreateAppUserRideDto) {
    return 'This action adds a new appUserRide';
  }

  findAll() {
    return `This action returns all appUserRide`;
  }

  findOne(id: number) {
    return `This action returns a #${id} appUserRide`;
  }

  update(id: number, updateAppUserRideDto: UpdateAppUserRideDto) {
    return `This action updates a #${id} appUserRide`;
  }

  remove(id: number) {
    return `This action removes a #${id} appUserRide`;
  }
}
