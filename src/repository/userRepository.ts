import { Repository } from "./Repository";
import { User } from "../models/userSchema";

export class UserRepository extends Repository<User> {
  tableName = "users";
}
