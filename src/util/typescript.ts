export const throwIfNotNever = (v: never) => {
  throw new Error(`Value ${v} is not of type never`);
};
