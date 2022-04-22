import { Point } from "./point";

export class LineSegment {
  constructor(private p1: Point, private p2: Point) {}

  /** Получить проекцию точки на эту прямую */
  projectPoint(p: Point) {
    // Координата p относительно p1  
    const p_ = p.subtract(this.p1);
    // Координата p2 относительно p1  
    const p2_ = this.p2.subtract(this.p1);

    const k = p_.dot(p2_) / p2_.dot(p2_);

    return this.p1.add(p2_.mulK(k));
  }
}
