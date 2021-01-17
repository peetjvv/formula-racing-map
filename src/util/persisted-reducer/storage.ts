export type MyStorage<S> = {
  getItem: (key: string, initialState: S) => S;
  setItem: (key: string, value: S) => void;
  removeItem: (key: string) => void;
  clear: () => void;
};

export const createStorage = <S>(provider: Storage): MyStorage<S> => ({
  getItem(key, initialState) {
    const json = provider.getItem(key);
    return !json
      ? typeof initialState === 'function'
        ? initialState()
        : initialState
      : JSON.parse(json);
  },
  setItem(key, value) {
    provider.setItem(key, JSON.stringify(value));
  },
  removeItem(key) {
    provider.removeItem(key);
  },
  clear() {
    provider.clear();
  },
});
