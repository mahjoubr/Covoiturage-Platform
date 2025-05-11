import { ObjectType, Field, registerEnumType } from '@nestjs/graphql';
<<<<<<< HEAD
import { Role } from 'src/app-user-ride/entities/app-user-ride.entity';
=======
import { Role } from 'src/enums/role';
>>>>>>> aba125ec4f7b06f599aab8f67bdb04b3d87ec9a3
import { AppUser } from "src/app-user/entities/app-user.entity";



registerEnumType(Role, {
  name: "Role",
});

@ObjectType()
export class AppUserWithRole extends AppUser {
  @Field(() => Role)
  roleInRide: Role;

  constructor(user: Partial<AppUser>, role: Role) {
    super();
    Object.assign(this, user);
    this.roleInRide = role;
  }
}
