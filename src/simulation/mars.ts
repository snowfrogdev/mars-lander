import { LineSegment } from '../shared/line-segment';
import { Vector } from '../shared/vector';

export class Mars {
  private _segments: LineSegment[] = [];
  private _landingSite!: LineSegment;
  private _bounds = [
    new LineSegment(new Vector(-1, -1), new Vector(-1, 3000)),
    new LineSegment(new Vector(-1, 3000), new Vector(7000, 3000)),
    new LineSegment(new Vector(7000, 3000), new Vector(7000, -1))
  ]

  constructor(surface: Vector[]) {
    for (let i = 1; i < surface.length; i++) {
      const segment = new LineSegment(surface[i - 1], surface[i]);
      this._segments.push(segment);

      if (segment.pointA.y === segment.pointB.y) {
        this._landingSite = segment;
      }
    }
  }

  hasCollisionWith(segment: LineSegment): boolean {
    return this._segments.some((surface) => surface.intersects(segment));
  }

  getCollisionPointWith(segment: LineSegment): Vector {
    const surfaceCollidedWith: LineSegment = this._segments.find((surface) => surface.intersects(segment))!;
    return surfaceCollidedWith.getIntersectionPointWith(segment);
  }

  isOnLandingSite(segment: LineSegment): boolean {
    return this._landingSite.intersects(segment);
  }

  isMovingOutOfBounds(segment: LineSegment): boolean {
    return this._bounds.some((bound) => bound.intersects(segment));
  }

  distanceFromLandingSite(point: Vector): number {
    return this._landingSite.getDistanceTo(point);
  }
}
