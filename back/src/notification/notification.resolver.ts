// notification.resolver.ts
import { Resolver, Query, Mutation, Args, Int } from '@nestjs/graphql';
import { NotificationService } from './notification.service';
import { Notification, NotificationStatus } from './entities/notification.entity';
import { CreateNotificationInput } from './dto/create-notification.input';
import { UpdateNotificationInput } from './dto/update-notification.input';

@Resolver(() => Notification)
export class NotificationResolver {
  constructor(private readonly notificationService: NotificationService) {}

  @Mutation(() => Notification)
  createNotification(
    @Args('createNotificationInput') createNotificationInput: CreateNotificationInput
  ) {
    return this.notificationService.create(createNotificationInput);
  }

  @Query(() => [Notification], { name: 'notifications' })
  findAllNotifications() {
    return this.notificationService.findAll();
  }

  @Query(() => [Notification], { name: 'userNotifications' })
  findUserNotifications(
    @Args('userId', { type: () => Int }) userId: number,
    @Args('limit', { type: () => Int, nullable: true }) limit?: number,
  ) {
    return this.notificationService.findByUserId(userId, limit);
  }

  @Query(() => [Notification], { name: 'unreadNotifications' })
  findUnreadNotifications(
    @Args('userId', { type: () => Int }) userId: number
  ) {
    return this.notificationService.findUnreadByUserId(userId);
  }

  @Query(() => Int, { name: 'unreadNotificationCount' })
  getUnreadCount(
    @Args('userId', { type: () => Int }) userId: number
  ) {
    return this.notificationService.getUnreadCount(userId);
  }

  @Query(() => Notification, { name: 'notification' })
  findOneNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.findOne(id);
  }

  @Mutation(() => Notification)
  updateNotification(
    @Args('updateNotificationInput') updateNotificationInput: UpdateNotificationInput
  ) {
    return this.notificationService.update(
      updateNotificationInput.id, 
      updateNotificationInput
    );
  }

  @Mutation(() => Notification)
  markNotificationAsRead(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.markAsRead(id);
  }

  @Mutation(() => Boolean)
  async markAllNotificationsAsRead(
    @Args('userId', { type: () => Int }) userId: number
  ) {
    await this.notificationService.markAllAsRead(userId);
    return true;
  }

  @Mutation(() => Notification)
  removeNotification(@Args('id', { type: () => Int }) id: number) {
    return this.notificationService.remove(id);
  }
}