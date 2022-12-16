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

export interface BeforeDelete<T> {
  existingValue: T | null;
}

export interface AfterDelete<T> {
  existingValue: T;
  deletedAt: Date;
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
