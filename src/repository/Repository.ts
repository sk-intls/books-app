import { Knex } from "knex";
interface Writer<T> {
  create(item: Omit<T, "id">): Promise<T>;
  update(id: number, item: Partial<T>): Promise<boolean>;
  delete(id: number): Promise<boolean>;
}

interface Reader<T> {
  find(item: Partial<T>): Promise<T[]>;
  findOne(id: string | number): Promise<T>;
  findOneBy(criteria: Partial<T>): Promise<T | undefined>;
}

type BaseRepository<T> = Writer<T> & Reader<T>;

export abstract class Repository<T> implements BaseRepository<T> {
  protected abstract tableName: string;
  constructor(protected db: Knex) {}

  public get qb(): Knex.QueryBuilder {
    return this.db(this.tableName);
  }

  create(item: Omit<T, "id">): Promise<T> {
    return this.qb
      .insert(item)
      .returning("*")
      .then((rows) => rows[0]);
  }

  update(id: number, item: Partial<T>): Promise<boolean> {
    return this.qb
      .where({ id })
      .update(item)
      .then((r) => r > 0);
  }

  delete(id: number): Promise<boolean> {
    return this.qb
      .where({ id })
      .delete()
      .then((r) => r > 0);
  }

  find(item: Partial<T>): Promise<T[]> {
    return this.qb.where(item).select("*");
  }

  findOne(id: string | number): Promise<T> {
    return this.qb.where({ id }).first();
  }

  findOneBy(criteria: Partial<T>): Promise<T | undefined> {
    return this.qb.where(criteria).first();
  }

  findAll(): Promise<T[]> {
    return this.qb.select("*");
  }
}
