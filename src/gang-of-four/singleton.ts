import { Database } from "../database/engine";
import { Indexable, Person, StorableEntity } from "../database/models";

/*
 * This demosntrates builds on the Factory and returns a singleton
 */
export function createSingletonDatabase<T extends Indexable>() {
  class RedisLiteDatabase implements Database<T> {
    private dataStorage: Map<string, T> = new Map<string, T>();

    // Singleton implementation conceals public constructor so it cannot
    // be instantiated externally; and is relegated to this single instance
    // created internally and exposed via a public property
    private constructor() {}
    // The Singleton "instance"
    static instance: RedisLiteDatabase = new RedisLiteDatabase();

    public set(value: T): T {
      const createdAt = new Date();
      const updatedAt = createdAt;

      const storable: StorableEntity = {
        ...value,
        createdAt,
        updatedAt,
      };
      this.dataStorage.set(value.id, storable as unknown as T);
      return storable as unknown as T;
    }

    public get(id: string): T | null {
      return this.dataStorage.get(id) ?? null;
    }
  }

  // NOTE: this may be odd but this does allow a class; rather than a function
  //  or object to be created on the fly and returned via this factory function.

  return RedisLiteDatabase;
}

export const RedisSingletonDatabaseInstance = createSingletonDatabase<Person>();
