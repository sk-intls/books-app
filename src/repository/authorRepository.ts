import { Repository } from "./Repository";
import { Author } from "../models/authorSchema";

export class AuthorRepository extends Repository<Author> {
  tableName = "authors";

  async findByName(name: string): Promise<Author | undefined> {
    return this.qb.where("name", "ilike", name).first();
  }


  async findOrCreate(authorData: { name: string; birth_year?: number; death_year?: number }): Promise<Author> {
    const existingAuthor = await this.findByName(authorData.name);
    
    if (existingAuthor) {
      return existingAuthor;
    }
    
    return this.create(authorData);
  }
}