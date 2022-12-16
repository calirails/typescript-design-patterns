import { Indexable } from "../database/entities";
import { KeyValuePairDatabase } from "../database/engine";

/*
 * Allow external call to visit every object/node
 */
export class TraversableDatabase<
  T extends Indexable
> extends KeyValuePairDatabase<T> {
  // let each node be traverse
  public visit(visitor: (item: T) => void): void {
    Object.values(this.dataStorage).forEach(visitor);
  }
}
