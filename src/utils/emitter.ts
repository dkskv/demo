import { without } from "ramda";

interface IDisposer {
  (): void;
}

export interface IObservable<T> {
  subscribe(f: (a: T) => void): IDisposer;
}

export interface IEmitter<T> extends IObservable<T> {
  emit(a: T): void;
}

export class Emitter<T> implements IEmitter<T> {
  private fs: ((a: T) => void)[] = [];

  subscribe(f: (a: T) => void) {
    this.fs.push(f);

    return () => {
      this.fs = without([f], this.fs);
    };
  }

  emit(a: T) {
    this.fs.forEach((f) => f(a));
  }
}
