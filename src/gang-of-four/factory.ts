import { KeyValuePairDatabase } from "../database/engine";
import { Indexable } from "../database/models";

/*
 * This demosntrates the Factory Pattern that conceals
 * the internal of how to construct something. NOTE: it
 * can and probably should allow a parameter to determine
 * what kind of Database Engine is preferred and returns
 * the appopriate implementation.
 */
export function createDatabase<T extends Indexable>() {
  const PersonDatabase = new KeyValuePairDatabase<T>();
  return PersonDatabase;
}
