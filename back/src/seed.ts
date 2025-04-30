import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { AppUser } from './app-user/entities/app-user.entity';
import { Post } from './post/entities/post.entity';
import { Ride, RideState } from './ride/entities/ride.entity';
import { AppUserRide, Role } from './app-user-ride/entities/app-user-ride.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';
import { Comment } from './comment/entities/comment.entity';
async function bootstrap() {
  const app = await NestFactory.createApplicationContext(AppModule);

  const appUserRepository = app.get<Repository<AppUser>>(getRepositoryToken(AppUser));
  const postRepository = app.get<Repository<Post>>(getRepositoryToken(Post));
  const rideRepository = app.get<Repository<Ride>>(getRepositoryToken(Ride));
  const appUserRideRepository = app.get<Repository<AppUserRide>>(getRepositoryToken(AppUserRide));
  const commentRepository = app.get<Repository<Comment>>(getRepositoryToken(Comment));
  console.log('clearing the database...');
  await commentRepository.delete({});
await appUserRideRepository.delete({});
await rideRepository.delete({});
await postRepository.delete({});
await appUserRepository.delete({});



  console.log('Seeding database...');

  const users: AppUser[] = [];
  const rides: Ride[] = [];
  const posts: Post[] = [];

  for (let i = 0; i < 10; i++) {
    const user = appUserRepository.create({
      email: faker.internet.email(),
      password: 'hashed_password_here',
      name: faker.person.firstName(),
      lastName: faker.person.lastName(),
      dateOfBirth: faker.date.birthdate({ min: 20, max: 50, mode: 'age' }),
      phoneNumber: faker.phone.number(),
      imageUrl: faker.image.avatar(),
      rating: parseFloat((Math.random() * 2 + 3).toFixed(1)), // between 3.0 and 5.0
    });
    await appUserRepository.save(user);
    users.push(user);
  }

  for (let i = 0; i < 10; i++) {
    const ride = rideRepository.create({
      date: faker.date.soon({ days: 30 }),
      time: `${faker.number.int({ min: 6, max: 20 })}:00`,
      departure: faker.location.city(),
      arrival: faker.location.city(),
      price: parseFloat(faker.commerce.price({ min: 10, max: 50 })),
      nbPassengers: faker.number.int({ min: 1, max: 4 }),
      state: faker.helpers.arrayElement([RideState.NOT_STARTED, RideState.STARTED, RideState.CLOSED]),
    });
    await rideRepository.save(ride);
    rides.push(ride);
  }

  for (let i = 0; i < 10; i++) {
    const post = postRepository.create({
      destination: rides[i].arrival,
      departure: rides[i].departure,
      date: rides[i].date,
      time: rides[i].time,
      seatCount: rides[i].nbPassengers,
      frequency: 'Once',
      description: faker.lorem.sentence(),
      price: rides[i].price,
      contactInfo: users[i].email,
      postOwner: users[i],
      listRide: [rides[i]],
    });
    await postRepository.save(post);
    posts.push(post);
  }

  for (let i = 0; i < 10; i++) {
    const appUserRide = appUserRideRepository.create({
      role: faker.helpers.arrayElement([Role.DRIVER, Role.PASSENGER]),
      appUser: users[i],
      ride: rides[i],
    });
    await appUserRideRepository.save(appUserRide);
  }
  for (const post of posts) {
    const numberOfComments = faker.number.int({ min: 0, max: 3 });
  
    for (let i = 0; i < numberOfComments; i++) {
      const commenter = faker.helpers.arrayElement(users);
  
      const comment = commentRepository.create({
        text: faker.lorem.sentences({ min: 1, max: 2 }),
        date: faker.date.recent({ days: 10 }),
        post: post,
        commenter: commenter,
      });
  
      await commentRepository.save(comment);
    }
  }

  console.log('✅ Database seeding finished!');
  await app.close();
}

bootstrap();

