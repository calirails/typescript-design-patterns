import { ObservableDatabase } from "../database/engine";
import {
  AfterDelete,
  AfterSet,
  BeforeDelete,
  BeforeSet,
  createObserver,
  Listener,
} from "../database/engine/listener";
import { Indexable, StorableEntity } from "../database/entities";

/* Listener Type is a Generic; but is not a object per se. Instead it
 * is defined as a function declaration; a delegate in C/C#/C++ parlanace
 */
export class RedisObservableDatabase<T extends Indexable>
  implements ObservableDatabase<T>
{
  private dataStorage: Map<string, T> = new Map<string, T>();

  public set(value: T): T {
    const createdAt = new Date();
    const updatedAt = createdAt;

    const storable: StorableEntity = {
      ...value,
      createdAt,
      updatedAt,
    };

    // Dispatch before<T> and after<T> events to observers with subscribed listeners
    const beforeValue = this.get(value.id);
    this._beforeAddListeners.publish({
      existingValue: beforeValue,
      newValue: value,
    });

    this.dataStorage.set(value.id, storable as unknown as T);

    this._afterAddListeners.publish({
      existingValue: beforeValue,
      newValue: value,
      createdAt,
    });

    return storable as unknown as T;
  }

  public recordCount(): number {
    return this.dataStorage.size ?? 0;
  }

  public get(id: string): T | null {
    return this.dataStorage.get(id) ?? null;
  }

  public delete(id: string): void {
    // WARNING: race condition can occur between check and actual delete
    const target = this.dataStorage.get(id);
    if (target) {
      this._beforeDeleteListeners.publish({
        existingValue: target,
      });
    }

    const deleted = this.dataStorage.delete(id);
    if (target && deleted) {
      this._afterDeleteListeners.publish({
        existingValue: target,
        deletedAt: new Date(),
      });
    }
  }

  // The observable event hooks
  private _beforeAddListeners = createObserver<BeforeSet<T>>();
  private _afterAddListeners = createObserver<AfterSet<T>>();

  onBeforeSet(listener: Listener<BeforeSet<T>>): () => void {
    return this._beforeAddListeners.subscribe(listener);
  }
  onAfterSet(listener: Listener<AfterSet<T>>): () => void {
    return this._afterAddListeners.subscribe(listener);
  }

  private _beforeDeleteListeners = createObserver<BeforeDelete<T>>();
  private _afterDeleteListeners = createObserver<AfterDelete<T>>();

  onBeforeDelete(listener: Listener<BeforeDelete<T>>): () => void {
    return this._beforeDeleteListeners.subscribe(listener);
  }
  onAfterDelete(listener: Listener<AfterDelete<T>>): () => void {
    return this._afterDeleteListeners.subscribe(listener);
  }
}
