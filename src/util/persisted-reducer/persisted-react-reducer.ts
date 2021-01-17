import { Reducer, useEffect, useRef } from 'react';
import { MyStorage, createStorage } from './storage';

type PersistReducerConfig = {
  key: string;
  storageUpdateDebounce?: number;
};

const createPersistedReactReducer = <S, A>(
  key: string,
  storage: MyStorage<S>,
  storageUpdateDebounce: number,
  reducer: Reducer<S, A>
): Reducer<S, A> => (prevState, action) => {
  const updatedState = reducer(prevState, action);

  const stateUpdateDebounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  useEffect(() => {
    if (
      !!stateUpdateDebounceTimerRef &&
      !!stateUpdateDebounceTimerRef.current
    ) {
      clearTimeout(stateUpdateDebounceTimerRef.current);
    }

    stateUpdateDebounceTimerRef.current = setTimeout(() => {
      storage.setItem(key, updatedState);
    }, storageUpdateDebounce);
  }, [updatedState]);

  return updatedState;
};

export default <S, A>(
  config: PersistReducerConfig,
  fallbackInitialState: S,
  reducer: Reducer<S, A>
) => {
  const { key, storageUpdateDebounce = 500 } = config;

  const storage = createStorage<S>(globalThis.localStorage);

  const initialState = storage.getItem(key, fallbackInitialState);
  const persistedReactReducer = createPersistedReactReducer<S, A>(
    key,
    storage,
    storageUpdateDebounce,
    reducer
  );

  return {
    initialState,
    persistedReactReducer,
  };
};
