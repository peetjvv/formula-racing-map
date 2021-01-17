import { Reducer, useReducer, useEffect, Dispatch, useRef } from 'react';
import { MyStorage, createStorage } from './storage';

const usePersistedReducer = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  localStorageKey: string,
  storage: MyStorage<S>,
  storageUpdateDebounceMillis: number = 500
): [state: S, dispatch: Dispatch<A>] => {
  const [state, dispatch] = useReducer(
    reducer,
    storage.getItem(localStorageKey, initialState)
  );

  const stateUpdateDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (
      !!stateUpdateDebounceTimerRef &&
      !!stateUpdateDebounceTimerRef.current
    ) {
      clearTimeout(stateUpdateDebounceTimerRef.current);
    }

    stateUpdateDebounceTimerRef.current = setTimeout(() => {
      storage.setItem(localStorageKey, state);
    }, storageUpdateDebounceMillis);
  }, [state]);

  return [state, dispatch];
};

const createPersistedReducer = <S, A>(
  localStorageKey: string,
  provider: Storage = globalThis.localStorage
): ((
  reducer: Reducer<S, A>,
  initialState: S
) => [state: S, dispatch: Dispatch<A>]) => {
  if (!!provider) {
    const storage = createStorage<S>(provider);
    return (reducer: Reducer<S, A>, initialState: S) =>
      usePersistedReducer<S, A>(
        reducer,
        initialState,
        localStorageKey,
        storage
      );
  }
  return (reducer: Reducer<S, A>, initialState: S) =>
    useReducer(reducer, initialState);
};

export default createPersistedReducer;
