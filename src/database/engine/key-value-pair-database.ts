import { Indexable, StorableEntity } from "../entities";
import { Database } from ".";

export class KeyValuePairDatabase<T extends Indexable> implements Database<T> {
  protected dataStorage: Record<string, T> = {};

  public set(value: T): T {
    const createdAt = new Date();
    const updatedAt = createdAt;

    const storable: StorableEntity = {
      ...value,
      createdAt,
      updatedAt,
    };
    this.dataStorage[value.id] = storable as unknown as T;
    return storable as unknown as T;
  }

  public get(id: string): T | null {
    return this.dataStorage[id] ?? null;
  }
}
