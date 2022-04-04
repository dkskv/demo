interface INormalizable {
  /** todo: не знаю, как вывести возвращаемый тип по this */
  map(f: (a: number) => number): INormalizable;
}

export function normalize<T extends INormalizable>(obj: T, size: number) {
  return obj.map((a) => a / size) as T;
}

export function denormalize<T extends INormalizable>(obj: T, size: number) {
  return obj.map((a) => a * size) as T;
}