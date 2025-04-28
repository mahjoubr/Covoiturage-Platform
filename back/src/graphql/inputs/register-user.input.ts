import { InputType, Field } from '@nestjs/graphql';

@InputType()
export class RegisterInput {
  @Field()
  name: string;
  
  @Field()
  lastName: string;
  
  @Field()
  email: string;

  @Field()
  password: string;
}
