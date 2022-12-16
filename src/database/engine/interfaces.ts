import { Indexable } from "../models";

export interface Database<T extends Indexable> {
  set(value: T): T;
  get(id: string): T | null;
}
