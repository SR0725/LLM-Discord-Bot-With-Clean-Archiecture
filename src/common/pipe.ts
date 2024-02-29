const pipe =
  // eslint-disable-next-line @typescript-eslint/ban-types
  (...fns: Function[]) =>
  (x: unknown) =>
    fns.reduce((v, f) => f(v), x);

export default pipe;
