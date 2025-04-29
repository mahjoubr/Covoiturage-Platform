// src/app-user/app-user.resolver.ts
import { Resolver, Mutation, Args, Int, Query, Context } from '@nestjs/graphql';
import { AppUser } from './entities/app-user.entity';
import { AppUserService } from './app-user.service';
import { UpdateAppUserInput } from 'src/graphql/inputs/update-app-user.input';
import { NotFoundException, UseGuards } from '@nestjs/common';
import { GqlAuthGuard } from '../auth/guards/auth.Guard';
import { CurrentUser } from 'src/auth/user.decorator';

@Resolver(() => AppUser)
export class AppUserResolver {
  constructor(private readonly appUserService: AppUserService) {}

  @UseGuards(GqlAuthGuard)
  @Mutation(() => AppUser)
  async updateAppUser(
    @CurrentUser() user: any,  
    @Args('updateAppUserInput') updateAppUserInput: UpdateAppUserInput,
  ): Promise<AppUser> {
    return this.appUserService.update(user.id, updateAppUserInput);
  }
  @UseGuards(GqlAuthGuard)
  @Query(() => AppUser, { name: 'getAppUserInfo' })
  async getAppUserInfo(@CurrentUser() user: any): Promise<AppUser | null> {
    const appUser= this.appUserService.findOne(user.id);
    if (!appUser) {
        throw new NotFoundException('User not found');
      }
    
      return appUser;
  }
}