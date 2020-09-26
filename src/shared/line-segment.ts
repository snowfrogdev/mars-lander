import { square } from './utils';
import { Vector } from './vector';

export class LineSegment {
  public get pointA(): Vector {
    return this._pointA;
  }
  public get pointB(): Vector {
    return this._pointB;
  }
  public get vector(): Vector {
    return this._pointB.subtract(this._pointA);
  }

  constructor(private _pointA: Vector, private _pointB: Vector) {}
  /**
   * Checks to see if this `LineSegment` intersects another `LineSegment` using
   * a simplified version of the algorithm described at:
   * - https://stackoverflow.com/questions/563198/how-do-you-detect-where-two-line-segments-intersect
   * - https://www.codeproject.com/Tips/862988/Find-the-Intersection-Point-of-Two-Line-Segments
   *
   * The major difference is that this function considers collinear lines to not intersect.
   */
  intersects(segment: LineSegment): boolean {
    const qmp: Vector = segment.pointA.subtract(this.pointA);
    const r: Vector = this.vector;
    const s: Vector = segment.vector;
    const rxs: number = r.crossProduct2D(s);
    const qmpxr: number = qmp.crossProduct2D(r);

    const t: number = qmp.crossProduct2D(s) / rxs;
    const u: number = qmpxr / rxs;

    const linesAreCollinear: boolean = rxs === 0 && qmpxr === 0;
    const linesAreParallel: boolean = rxs === 0 && qmpxr !== 0;

    if (linesAreCollinear || linesAreParallel) {
      return false;
    }

    return rxs !== 0 && 0 <= t && t <= 1 && 0 <= u && u <= 1;
  }

  getIntersectionPointWith(segment: LineSegment): Vector {
    const qmp: Vector = segment.pointA.subtract(this.pointA);
    const r: Vector = this.vector;
    const s: Vector = segment.vector;
    const rxs: number = r.crossProduct2D(s);
    const t: number = qmp.crossProduct2D(s) / rxs;

    return this._pointA.add(r.multiply(t));
  }
  /**
   * Computes the shortest distance between the line segment and a point.
   * https://stackoverflow.com/questions/849211/shortest-distance-between-a-point-and-a-line-segment
   */
  getDistanceTo(point: Vector): number {
    return Math.sqrt(this._distToSegmentSquared(point));
  }

  private _distToSegmentSquared(p: Vector): number {
    const v = this.pointA;
    const w = this.pointB;

    const l2: number = this._dist2();
    if (l2 === 0) return new LineSegment(p, this.pointA)._dist2();

    let t: number = ((p.x - v.x) * (w.x - v.x) + (p.y - v.y) * (w.y - v.y)) / l2;

    t = Math.max(0, Math.min(1, t));
    return new LineSegment(p, new Vector(v.x + t * (w.x - v.x), v.y + t * (w.y - v.y)))._dist2();
  }

  private _dist2(): number {
    return square(this.pointA.x - this.pointB.x) + square(this.pointA.y - this.pointB.y);
  }
}
