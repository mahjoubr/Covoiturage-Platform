// seed.ts
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppUser } from './app-user/entities/app-user.entity';
import { Post } from './post/entities/post.entity';
import { Ride } from './ride/entities/ride.entity';
import { AppUserRide, Role } from './app-user-ride/entities/app-user-ride.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import {RideState} from './ride/entities/ride.entity';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const appUserRepository = app.get<Repository<AppUser>>(getRepositoryToken(AppUser));
  const postRepository = app.get<Repository<Post>>(getRepositoryToken(Post));
  const rideRepository = app.get<Repository<Ride>>(getRepositoryToken(Ride));
  const appUserRideRepository = app.get<Repository<AppUserRide>>(getRepositoryToken(AppUserRide));

  console.log('Seeding database...');

  // Create AppUser
  const appUser = appUserRepository.create({
    email: 'user@example.com',
    password: 'hashed_password_here', // Ideally hashed
    name: 'John',
    lastName: 'Doe',
    dateOfBirth: new Date('1990-01-01'),
    phoneNumber: '123456789',
    imageUrl: 'https://example.com/image.png',
    rating: 5.0,
  });

  await appUserRepository.save(appUser);

  // Create Ride
  const ride = rideRepository.create({
    date: new Date('2025-05-01'),
    time: '10:00',
    departure: 'City A',
    arrival: 'City B',
    price: 25.5,
    nbPassengers: 3,
    state: RideState.NOT_STARTED,
  });

  await rideRepository.save(ride);

  // Create Post
  const post = postRepository.create({
    destination: 'City B',
    departure: 'City A',
    date: new Date('2025-05-01'),
    time: '10:00',
    seatCount: 3,
    frequency: 'Once',
    description: 'Going from City A to City B',
    price: 25.5,
    contactInfo: 'user@example.com',
    postOwner: appUser,
    listRide: [ride],
  });

  await postRepository.save(post);

  // Create AppUserRide
  const appUserRide = appUserRideRepository.create({
    role: Role.DRIVER,
    appUser,
    ride,
  });

  await appUserRideRepository.save(appUserRide);

  console.log('✅ Database seeding finished!');

  await app.close();
}

bootstrap();
