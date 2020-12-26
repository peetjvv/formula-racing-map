export type Action<T extends string, ST extends string> = {
  type: T;
  subType: ST;
};

export type PayloadAction<T extends string, ST extends string, P> = Action<
  T,
  ST
> & { payload: P };
