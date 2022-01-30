import { nth } from "ramda";

export class CircularList<T> {
  constructor(private items: T[]) {}

  public nIndexesFrom(offset: number, from: T) {
    const i = this.items.indexOf(from);

    if (~i) {
      return nth((i + offset) % this.items.length, this.items)!;
    }

    throw new Error("The list does not contain the passed element");
  }
}
