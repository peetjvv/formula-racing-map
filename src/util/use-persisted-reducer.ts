import { Reducer, useReducer, useEffect, Dispatch, useRef } from 'react';

type MyStorage<S> = {
  get: (key: string, initialState: S) => S;
  set: (key: string, value: S) => void;
};

const createStorage = <S>(provider: Storage): MyStorage<S> => ({
  get(key, initialState) {
    const json = provider.getItem(key);
    console.log(json, JSON.parse(json!));
    return !json
      ? typeof initialState === 'function'
        ? initialState()
        : initialState
      : JSON.parse(json);
  },
  set(key, value) {
    provider.setItem(key, JSON.stringify(value));
  },
});

const usePersistedReducer = <S, A>(
  reducer: Reducer<S, A>,
  initialState: S,
  key: string,
  storage: MyStorage<S>,
  storageUpdateDebounceMillis: number = 500
): [state: S, dispatch: Dispatch<A>] => {
  const [state, dispatch] = useReducer(reducer, storage.get(key, initialState));

  const stateUpdateDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (
      !!stateUpdateDebounceTimerRef &&
      !!stateUpdateDebounceTimerRef.current
    ) {
      clearTimeout(stateUpdateDebounceTimerRef.current);
    }

    stateUpdateDebounceTimerRef.current = setTimeout(() => {
      storage.set(key, state);
    }, storageUpdateDebounceMillis);
  }, [state]);

  return [state, dispatch];
};

const createPersistedReducer = <S, A>(
  key: string,
  provider: Storage = globalThis.localStorage
): ((
  reducer: Reducer<S, A>,
  initialState: S
) => [state: S, dispatch: Dispatch<A>]) => {
  if (!!provider) {
    const storage = createStorage<S>(provider);
    return (reducer: Reducer<S, A>, initialState: S) =>
      usePersistedReducer<S, A>(reducer, initialState, key, storage);
  }
  return (reducer: Reducer<S, A>, initialState: S) =>
    useReducer(reducer, initialState);
};

export default createPersistedReducer;
