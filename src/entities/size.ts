export class Size {
  static nullish() {
    return new Size(0, 0);
  }

  constructor(private dx: number, private dy: number) {}

  get width() {
    return Math.abs(this.dx);
  }

  get height() {
    return Math.abs(this.dy);
  }
}
