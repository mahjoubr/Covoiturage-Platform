import { InputType, Field, Int } from '@nestjs/graphql';

@InputType()
export class CreateChatInput {
  @Field(() => Int)
  driverId: number;

  @Field(() => Int)
  riderId: number;

  @Field(() => Int)
  rideId: number;
}
