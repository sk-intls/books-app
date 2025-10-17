import { Repository } from "./Repository";
import { User } from "../models/userSchema";

export class UserRepository extends Repository<User> {
  tableName = "users";

  // util to remove pass
  private sanitizeUser(user: User): Omit<User, 'password'> {
    const { password, ...sanitizedUser } = user;
    return sanitizedUser;
  }

  // hide password
  async findAllPublic(): Promise<Omit<User, 'password'>[]> {
    const users = await super.findAll();
    return users.map(user => this.sanitizeUser(user));
  }

  async findOnePublic(id: string | number): Promise<Omit<User, 'password'> | null> {
    const user = await super.findOne(id);
    return user ? this.sanitizeUser(user) : null;
  }

  // for when we need password
  async findOneWithPassword(id: string | number): Promise<User> {
    return super.findOne(id);
  }

  // for when we need password
  async findOneByWithPassword(criteria: Partial<User>): Promise<User | undefined> {
    return super.findOneBy(criteria);
  }
}
