import { Ride } from "src/ride/entities/ride.entity";
import { User } from "src/user/entities/user.entity";

export class CreateChatDto {
    driver: User;
    rider: User;
    ride: Ride;
}
