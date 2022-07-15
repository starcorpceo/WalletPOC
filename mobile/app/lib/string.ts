// Will only work if properties are in exact same order!

export const deepCompare = (a: any, b: any): boolean =>
  JSON.stringify(a) === JSON.stringify(b);
