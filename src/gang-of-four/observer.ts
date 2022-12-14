import { Database } from "../database/engine";
import { Indexable, Person, StorableEntity } from "../database/models";

/* Listener Type is a Generic; but is not a object per se. Instead it
 * is defined as a function declaration; a delegate in C/C#/C++ parlanace
 */
export type Listener<EventType> = (ev: EventType) => void;

export interface BeforeSet<T> {
  existingValue: T | null;
  newValue: T;
}

export interface AfterSet<T> {
  existingValue: T | null;
  newValue: T;
  createdAt: Date;
}

/* this function returns an object with two members; i.e. two functions; namely
 * one to subscribe to events and one to publish an event that is observed by its
 * subscribed listeners. NOTE: that this function defines an inline type that could
 * instead be separated out to be reused in other contexts. For our case; it's isolated
 * to just this scope and is just "inlined."
 */
export function createObserver<EventType>(): {
  // NOTE: subscribe is function that receives a listener as its parameter
  // that in of itself returns a function that returns nothing (void)
  // which will be used to "unsubscribe" to terminate the subscription.
  subscribe: (listener: Listener<EventType>) => () => void;

  // NOTE: publish is a funciton that receives an event to publish
  publish: (event: EventType) => void;
} {
  let _listeners: Listener<EventType>[] = [];

  return {
    subscribe: (additionalListener: Listener<EventType>): (() => void) => {
      _listeners.push(additionalListener);
      // NOTE: this may appear odd; in that it conveniently returns a function that
      // can be used to unsubscribe at some point in the future to unsubscribe; i.e.
      // to terminate events from being delivered to the observer.
      return () => {
        _listeners = _listeners.filter(
          (existingListener) => existingListener !== additionalListener
        );
      };
    },
    publish: (event: EventType) => {
      // Simply iterate through each observer and dispatch the
      // event via the delegate; i.e. the listener function
      _listeners.forEach((listener) => listener(event));
    },
  };
}

export interface ObservableDatabase<T extends Indexable> extends Database<T> {
  set(value: T): T;
  get(id: string): T | null;

  // The observable event hooks
  onBeforeSet(Listener: Listener<BeforeSet<T>>): () => void;
  onAfterSet(Listener: Listener<AfterSet<T>>): () => void;
}

export function createSingletonObservableDatabase<T extends Indexable>() {
  class RedisObservableDatabase implements ObservableDatabase<T> {
    private dataStorage: Map<string, T> = new Map<string, T>();

    // Singleton implementation conceals public constructor so it cannot
    // be instantiated externally; and is relegated to this single instance
    // created internally and exposed via a public property
    private constructor() {}
    // The Singleton "instance"
    static instance: RedisObservableDatabase = new RedisObservableDatabase();

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

    public get(id: string): T | null {
      return this.dataStorage.get(id) ?? null;
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
  }

  // NOTE: this may be odd but this does allow a class; rather than a function
  //  or object to be created on the fly and returned via this factory function.

  return RedisObservableDatabase;
}

export const RedisSingletonInstance =
  createSingletonObservableDatabase<Person>();
