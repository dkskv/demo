export interface IObservable<T> {
  subscribe(f: (a: T) => void): void;
}

export interface IEmitter<T> extends IObservable<T> {
  emit(a: T): void;
}

export class Emitter<T> implements IEmitter<T> {
  private fs: ((a: T) => void)[] = [];

  subscribe(f: (a: T) => void): void {
    this.fs.push(f);
  }

  emit(a: T) {
    this.fs.forEach((f) => f(a));
  }
}
