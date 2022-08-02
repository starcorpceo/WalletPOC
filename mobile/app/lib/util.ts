// Will only work if properties are in exact same order!

export const deepCompare = (a: any, b: any): boolean => {
  const sortedA = Object.keys(a)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = a[key];

      return accumulator;
    }, {} as any);

  const sortedB = Object.keys(b)
    .sort()
    .reduce((accumulator, key) => {
      accumulator[key] = b[key];

      return accumulator;
    }, {} as any);

  return JSON.stringify(sortedA) === JSON.stringify(sortedB);
};
