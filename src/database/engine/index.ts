import { KeyValuePairDatabase } from "./key-value-pair-database";
import { Indexable } from "../entities";
import {
  Listener,
  BeforeSet,
  BeforeDelete,
  AfterSet,
  AfterDelete,
} from "./listener";

interface Database<T extends Indexable> {
  set(value: T): T;
  get(id: string): T | null;
}

interface ObservableDatabase<T extends Indexable> extends Database<T> {
  // The observable event hooks
  onBeforeSet(Listener: Listener<BeforeSet<T>>): () => void;
  onAfterSet(Listener: Listener<AfterSet<T>>): () => void;

  onBeforeDelete(Listener: Listener<BeforeDelete<T>>): () => void;
  onAfterDelete(Listener: Listener<AfterDelete<T>>): () => void;
}

export { Database, KeyValuePairDatabase, ObservableDatabase };
