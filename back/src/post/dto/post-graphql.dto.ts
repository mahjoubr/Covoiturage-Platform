import { InputType, Field, Float, Int } from '@nestjs/graphql';

@InputType()
export class CreatePostInput {
  @Field()
  destination: string;

  @Field()
  departure: string;

  @Field()
  date: Date;

  @Field()
  time: string;

  @Field(() => Int)
  seatCount: number;

  @Field()
  frequency: string;

  @Field({ nullable: true })
  description?: string;

  @Field(() => Float, { nullable: true })
  price?: number;

  @Field({ nullable: true })
  contactInfo?: string;

  @Field(() => [String]) // maybe just ride IDs (or change if needed)
  listRide: string[];

  @Field()
  postOwnerId: string; // assuming you just pass the User ID
}
