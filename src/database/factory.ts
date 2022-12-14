import { KeyValuePairDatabase } from "./engine";
import { Indexable } from "./entities";

export function createDatabase<T extends Indexable>() {
  const PersonDatabase = new KeyValuePairDatabase<T>();
  return PersonDatabase;
}
